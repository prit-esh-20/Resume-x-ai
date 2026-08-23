/**
 * ShaderField — a zero-dependency WebGL1 gradient/aurora field.
 *
 * Vendored from the 21st.dev Shader Builder ("Aurora" recipe), which is itself
 * adapted from Paper Shaders under Apache-2.0.
 * Source: https://21st.dev/@jhoan.rhz/components/a-shader
 *
 * Kept as a faithful, reusable port — the full uniform surface is intact so any
 * recipe from the same builder family can be driven through it. ResumeX-specific
 * tuning lives in `AuroraField`, not here.
 *
 * Deliberate changes from the upstream component:
 *  - uniforms are a prop, so palettes can come from design tokens rather than
 *    the recipe's baked-in defaults
 *  - fbm is amplitude-normalised and drops 5 octaves to 3; the top two octaves
 *    only add high-frequency detail that the soft-blur pass destroys anyway
 *  - `pixelBudget` is a uniform-set field (upstream hard-codes 2 MP), because a
 *    soft gradient reads identically at a fraction of that
 *  - pointermove and scroll no longer force a layout read per event: bounds are
 *    cached and refreshed from a rAF-coalesced, passive scroll handler plus the
 *    ResizeObserver
 *  - shader compile/link status is checked, and a lost context hides the canvas
 *    so whatever sits underneath shows through instead of a black rectangle
 */
import { useEffect, useRef, useState } from 'react'

export type ShaderFieldUniforms = {
  /** Ramp stops as sRGB 0..1 triples. Pad to 8; only `colorCount` are read. */
  colors: [number, number, number][]
  colorCount: number
  scale: number
  intensity: number
  paramA: number
  warp: number
  detail: number
  contrast: number
  brightness: number
  saturation: number
  hue: number
  vignette: number
  /** Soft 5-tap blur. Costs 5x the field evaluation — 0 disables the taps. */
  blur: number
  grain: number
  seed: number
  rotate: number
  offsetX: number
  offsetY: number
  drift: number
  cursorEnabled: boolean
  /** 0 push · 1 pull · 2 swirl · 3 ripple · 4 glow */
  cursorEffect: number
  cursorStrength: number
  cursorRadius: number
  /** 1 = perceptual OKLab ramp mixing. Costly; sRGB is fine for tight ramps. */
  oklab: number
  /** 0 freezes time, so the loop draws one frame and stops. */
  timeScale: number
  /** Max drawing-buffer pixels. */
  pixelBudget: number
}

const VERT = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
// Seven packed vectors + eight colour vectors = 15 fragment uniform vectors,
// one below WebGL1's guaranteed minimum. Macros preserve the public u_* API.
uniform vec4 u_scene;      // resolution.xy, time, colour count
uniform vec4 u_shape;      // scale, intensity, paramA, warp
uniform vec4 u_surface;    // detail, contrast, brightness, saturation
uniform vec4 u_finish;     // hue, vignette, blur, grain
uniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle
uniform vec4 u_space;      // offset.xy, pointer.xy
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
// Keep hash inputs inside mediump's guaranteed ±2^14 range.
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

// Three octaves, amplitude-normalised. Normalising keeps fbm's range at ~0..1
// independent of octave count, so the shaping uniforms stay meaningful.
#define OCTAVES 3
#define FBM_NORM 0.875

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

// Even, un-structured white noise for film grain (Dave Hoskins hash12). The
// multiply hash above is fine for value noise but shows a faint axis-aligned
// mesh at integer fragment coords, which reads as a net over flat areas.
float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v / FBM_NORM;
}

// --- OKLab colour mixing (perceptual), gated by u_oklab -----------------------
vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  // max() guards the sRGB branch: out-of-gamut OKLab interpolations can send a
  // channel negative, and pow(negative, …) is NaN which mix()/step() would
  // then propagate. The linear branch clips such channels to 0 downstream.
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

// Mix through the recipe colours; x is clamped to 0..1. WebGL1 forbids
// dynamic uniform indexing in fragment shaders, hence the constant loop.
vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  float curtain = fbm(vec2(p.x * 2.0 + t * 0.15, p.y * 0.6 - t * 0.05) + u_seed);
  float band = fbm(vec2(p.x * 3.5 - t * 0.1, curtain * (2.0 + u_intensity * 3.0)));
  float glow = smoothstep(0.15, 0.85, band) * (1.0 - abs(p.y) * 0.7);
  return palette(clamp(glow, 0.0, 1.0));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  // Cursor modes 1–3 are local distortions. Push shifts the same screen-space
  // coordinates before field transforms, so Zoom/Rotate don't change its feel.
  if (u_cursorPresence > 0.001) {
    // u_mouse is normalized to -1..1 in canvas space. Convert it to the same
    // aspect-corrected screen space as p so effects stay under the cursor.
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  // Keep presets that read uv (rather than p) in the same warped space.
  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  // Field transform: rotate, pan, pointer push, slow drift.
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  // Organic domain warp.
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  // Shade, with an optional soft 5-tap blur.
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  // Post: contrast, saturation, hue, brightness, vignette, grain.
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`

const pendingContextReleases = new WeakMap<HTMLCanvasElement, number>()

type ShaderFieldProps = {
  /**
   * Must be referentially stable — a new object rebuilds the GL context. Define
   * uniform sets at module scope, or memoise them.
   */
  uniforms: ShaderFieldUniforms
  className?: string
}

export function ShaderField({ uniforms, className }: ShaderFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // A failed context or compile leaves nothing to composite, so drop the canvas
  // out of the layer stack entirely and let the CSS backdrop beneath stand in.
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const pendingRelease = pendingContextReleases.get(canvas)
    if (pendingRelease !== undefined) window.clearTimeout(pendingRelease)
    pendingContextReleases.delete(canvas)
    const gl = canvas.getContext('webgl', { antialias: false })
    if (!gl) {
      setFailed(true)
      return
    }

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }
      return shader
    }
    const program = gl.createProgram()
    const vertexShader = compile(gl.VERTEX_SHADER, VERT)
    const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!program || !vertexShader || !fragmentShader) {
      setFailed(true)
      return
    }
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      setFailed(true)
      return
    }
    gl.useProgram(program)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    const loc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uni = {
      colors: gl.getUniformLocation(program, 'u_colors'),
      scene: gl.getUniformLocation(program, 'u_scene'),
      shape: gl.getUniformLocation(program, 'u_shape'),
      surface: gl.getUniformLocation(program, 'u_surface'),
      finish: gl.getUniformLocation(program, 'u_finish'),
      transform: gl.getUniformLocation(program, 'u_transform'),
      space: gl.getUniformLocation(program, 'u_space'),
      cursor: gl.getUniformLocation(program, 'u_cursor'),
    }
    gl.uniform3fv(uni.colors, new Float32Array(uniforms.colors.flat()))
    gl.uniform4f(
      uni.shape,
      uniforms.scale,
      uniforms.intensity,
      uniforms.paramA,
      uniforms.warp,
    )
    gl.uniform4f(
      uni.surface,
      uniforms.detail,
      uniforms.contrast,
      uniforms.brightness,
      uniforms.saturation,
    )
    gl.uniform4f(
      uni.finish,
      uniforms.hue,
      uniforms.vignette,
      uniforms.blur,
      uniforms.grain,
    )
    gl.uniform4f(
      uni.transform,
      uniforms.seed,
      uniforms.rotate,
      uniforms.drift,
      uniforms.oklab,
    )
    gl.uniform4f(
      uni.cursor,
      0,
      uniforms.cursorEffect,
      uniforms.cursorStrength,
      uniforms.cursorRadius,
    )

    let targetX = 0
    let targetY = 0
    let targetPresence = 0
    let mouseX = 0
    let mouseY = 0
    let cursorPresence = 0
    let pointerKnown = false
    let pointerClientX = 0
    let pointerClientY = 0
    let bounds = canvas.getBoundingClientRect()
    let raf = 0
    let layoutRaf = 0
    let lastNow: number | null = null
    let visible = document.visibilityState === 'visible'
    let inView = true
    let disposed = false
    const start = performance.now()
    const timeAnimated = Math.abs(uniforms.timeScale) > 0.0001

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rawWidth = Math.max(1, Math.round(bounds.width * dpr))
      const rawHeight = Math.max(1, Math.round(bounds.height * dpr))
      const pixelScale = Math.min(
        1,
        Math.sqrt(uniforms.pixelBudget / Math.max(1, rawWidth * rawHeight)),
      )
      const width = Math.max(1, Math.round(rawWidth * pixelScale))
      const height = Math.max(1, Math.round(rawHeight * pixelScale))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    function requestRender() {
      if (!disposed && visible && inView && raf === 0) {
        raf = requestAnimationFrame(render)
      }
    }

    // Reads only cached bounds: pointermove must not force a layout.
    const updatePointerTarget = () => {
      if (!pointerKnown) return
      if (bounds.width === 0 || bounds.height === 0) return
      const inside =
        pointerClientX >= bounds.left &&
        pointerClientX <= bounds.right &&
        pointerClientY >= bounds.top &&
        pointerClientY <= bounds.bottom
      if (!inside) {
        targetPresence = 0
        requestRender()
        return
      }
      const nextX = ((pointerClientX - bounds.left) / bounds.width) * 2 - 1
      const nextY = -(((pointerClientY - bounds.top) / bounds.height) * 2 - 1)
      if (targetPresence === 0 && cursorPresence < 0.01) {
        mouseX = nextX
        mouseY = nextY
      }
      targetX = nextX
      targetY = nextY
      targetPresence = 1
      requestRender()
    }
    const onPointerMove = (event: PointerEvent) => {
      pointerKnown = true
      pointerClientX = event.clientX
      pointerClientY = event.clientY
      updatePointerTarget()
    }
    const onPointerLeave = () => {
      pointerKnown = false
      targetPresence = 0
      requestRender()
    }
    const updateLayout = () => {
      bounds = canvas.getBoundingClientRect()
      resizeCanvas()
      updatePointerTarget()
      requestRender()
    }
    // One layout read per frame at most, rather than one per scroll event.
    const scheduleLayout = () => {
      if (disposed || layoutRaf !== 0) return
      layoutRaf = requestAnimationFrame(() => {
        layoutRaf = 0
        updateLayout()
      })
    }
    window.addEventListener('resize', updateLayout)
    if (uniforms.cursorEnabled) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('pointercancel', onPointerLeave)
      window.addEventListener('scroll', scheduleLayout, {
        capture: true,
        passive: true,
      })
      window.addEventListener('blur', onPointerLeave)
      document.documentElement.addEventListener('pointerleave', onPointerLeave)
    }

    const onContextLost = (event: Event) => {
      // Without preventDefault the context can never be restored; either way we
      // stop drawing and hide, because a dead context composites as black.
      event.preventDefault()
      if (raf !== 0) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      setFailed(true)
    }
    canvas.addEventListener('webglcontextlost', onContextLost)

    const resizeObserver = new ResizeObserver(updateLayout)
    resizeObserver.observe(canvas)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true
      if (inView) requestRender()
      else if (raf !== 0) {
        cancelAnimationFrame(raf)
        raf = 0
        lastNow = null
      }
    })
    intersectionObserver.observe(canvas)
    const onVisibilityChange = () => {
      visible = document.visibilityState === 'visible'
      if (visible) requestRender()
      else if (raf !== 0) {
        cancelAnimationFrame(raf)
        raf = 0
        lastNow = null
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // An arrow rather than a hoisted declaration, so the `canvas`/`gl` null
    // checks above still narrow inside it.
    const render = (now: number) => {
      raf = 0
      if (disposed || !visible || !inView) return
      const dt = lastNow === null ? 0 : Math.min((now - lastNow) / 1000, 0.1)
      lastNow = now
      const follow = 1 - Math.exp(-12 * dt)
      mouseX += (targetX - mouseX) * follow
      mouseY += (targetY - mouseY) * follow
      cursorPresence += (targetPresence - cursorPresence) * follow
      resizeCanvas()
      const width = canvas.width
      const height = canvas.height
      gl.uniform4f(
        uni.scene,
        width,
        height,
        ((now - start) / 1000) * uniforms.timeScale,
        uniforms.colorCount,
      )
      gl.uniform4f(uni.space, uniforms.offsetX, uniforms.offsetY, mouseX, mouseY)
      gl.uniform4f(
        uni.cursor,
        uniforms.cursorEnabled ? cursorPresence : 0,
        uniforms.cursorEffect,
        uniforms.cursorStrength,
        uniforms.cursorRadius,
      )
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      const pointerSettling =
        Math.abs(targetX - mouseX) > 0.001 ||
        Math.abs(targetY - mouseY) > 0.001 ||
        Math.abs(targetPresence - cursorPresence) > 0.001
      // With timeScale 0 and a settled pointer this is the last frame drawn.
      if (timeAnimated || pointerSettling) requestRender()
      else lastNow = null
    }
    requestRender()
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      cancelAnimationFrame(layoutRaf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      window.removeEventListener('resize', updateLayout)
      if (uniforms.cursorEnabled) {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointercancel', onPointerLeave)
        window.removeEventListener('scroll', scheduleLayout, { capture: true })
        window.removeEventListener('blur', onPointerLeave)
        document.documentElement.removeEventListener(
          'pointerleave',
          onPointerLeave,
        )
      }
      gl.deleteBuffer(buf)
      gl.deleteProgram(program)
      const releaseTimer = window.setTimeout(() => {
        if (pendingContextReleases.get(canvas) !== releaseTimer) return
        pendingContextReleases.delete(canvas)
        gl.getExtension('WEBGL_lose_context')?.loseContext()
        canvas.width = 1
        canvas.height = 1
      }, 0)
      pendingContextReleases.set(canvas, releaseTimer)
    }
  }, [uniforms])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        visibility: failed ? 'hidden' : undefined,
      }}
    />
  )
}

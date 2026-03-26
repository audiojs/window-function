/**
 * Window functions for signal processing and spectral analysis.
 *
 * Per-sample: fn(i, N, ...params) → number, where i ∈ [0, N-1].
 * Full array: generate(fn, N, ...params) → Float64Array.
 * In-place:   apply(signal, fn, ...params) → signal.
 *
 * @module window-function
 */

let {cos, sin, abs, exp, sqrt, PI, cosh, acosh, acos, pow} = Math
let PI2 = 2 * PI

// ────── Rectangular family ──────

export function rectangular () { return 1 }

export function triangular (i, N) { return 1 - abs((2 * i - N + 1) / N) }

export function bartlett (i, N) { return 1 - abs((2 * i - N + 1) / (N - 1)) }

export function welch (i, N) { let x = (2 * i - N + 1) / (N - 1); return 1 - x * x }

export function connes (i, N) { let x = (2 * i - N + 1) / (N - 1); return (1 - x * x) * (1 - x * x) }

// ────── Cosine-sum: w(i) = Σ aₖ cos(2πki/(N-1)) ──────

function _cosineSum (i, N, a) {
	let f = PI2 * i / (N - 1), v = a[0]
	for (let k = 1; k < a.length; k++) v += (k % 2 ? -1 : 1) * a[k] * cos(k * f)
	return v
}

export function hann (i, N) { return 0.5 - 0.5 * cos(PI2 * i / (N - 1)) }
export function hamming (i, N) { return 0.54 - 0.46 * cos(PI2 * i / (N - 1)) }
export function cosine (i, N) { return sin(PI * i / (N - 1)) }

/** Power-of-sine (α=0: rectangular, α=1: cosine, α=2: hann). */
export function powerOfSine (i, N, alpha) {
	if (alpha == null) alpha = 2
	return pow(sin(PI * i / (N - 1)), alpha)
}
export function blackman (i, N) { return _cosineSum(i, N, [0.42, 0.5, 0.08]) }
export function exactBlackman (i, N) { return _cosineSum(i, N, [0.42659, 0.49656, 0.076849]) }
export function nuttall (i, N) { return _cosineSum(i, N, [0.355768, 0.487396, 0.144232, 0.012604]) }
export function blackmanNuttall (i, N) { return _cosineSum(i, N, [0.3635819, 0.4891775, 0.1365995, 0.0106411]) }
export function blackmanHarris (i, N) { return _cosineSum(i, N, [0.35875, 0.48829, 0.14128, 0.01168]) }
export function flatTop (i, N) { return _cosineSum(i, N, [1, 1.93, 1.29, 0.388, 0.028]) }

export function bartlettHann (i, N) {
	let x = i / (N - 1)
	return 0.62 - 0.48 * abs(x - 0.5) - 0.38 * cos(PI2 * x)
}

// ────── Parameterized ──────

export function kaiser (i, N, beta) {
	if (beta == null) beta = 8.6
	let x = (2 * i - N + 1) / (N - 1)
	return _i0(beta * sqrt(1 - x * x)) / _i0(beta)
}

export function gaussian (i, N, sigma) {
	if (sigma == null) sigma = 0.4
	let x = (2 * i - N + 1) / (sigma * (N - 1))
	return exp(-0.5 * x * x)
}

/** Generalized normal (p=2: Gaussian, p→∞: rectangular). */
export function generalizedNormal (i, N, sigma, p) {
	if (sigma == null) sigma = 0.4
	if (p == null) p = 2
	let x = abs((2 * i - N + 1) / (sigma * (N - 1)))
	return exp(-0.5 * pow(x, p))
}

export function tukey (i, N, alpha) {
	if (alpha == null) alpha = 0.5
	let half = 0.5 * alpha * (N - 1)
	if (half < 1e-12) return 1
	if (i <= half) return 0.5 * (1 + cos(PI * (i / half - 1)))
	if (i >= (N - 1) - half) return 0.5 * (1 + cos(PI * ((N - 1 - i) / half - 1)))
	return 1
}

export function planckTaper (i, N, epsilon) {
	if (epsilon == null) epsilon = 0.1
	let eN = epsilon * (N - 1)
	if (i <= 0 || i >= N - 1) return 0
	if (i < eN) return 1 / (1 + exp(eN / i - eN / (eN - i)))
	if (i > (N - 1) - eN) return 1 / (1 + exp(eN / (N - 1 - i) - eN / (eN - N + 1 + i)))
	return 1
}

// ────── Exponential family ──────

export function exponential (i, N, tau) {
	if (tau == null) tau = 1
	return exp(-abs(2 * i - N + 1) / (tau * (N - 1)))
}

export function hannPoisson (i, N, alpha) {
	if (alpha == null) alpha = 2
	return 0.5 * (1 - cos(PI2 * i / (N - 1))) * exp(-alpha * abs(2 * i - N + 1) / (N - 1))
}

export function cauchy (i, N, alpha) {
	if (alpha == null) alpha = 3
	let x = alpha * (2 * i - N + 1) / (N - 1)
	return 1 / (1 + x * x)
}

// ────── Sinc-based ──────

export function lanczos (i, N) {
	let x = 2 * i / (N - 1) - 1
	return x === 0 ? 1 : sin(PI * x) / (PI * x)
}

// ────── B-spline / polynomial ──────

export function parzen (i, N) {
	let a = abs((2 * i - N + 1) / (N - 1))
	if (a <= 0.5) return 1 - 6 * a * a * (1 - a)
	let b = 1 - a
	return 2 * b * b * b
}

export function bohman (i, N) {
	let a = abs((2 * i - N + 1) / (N - 1))
	if (a >= 1) return 0
	return (1 - a) * cos(PI * a) + sin(PI * a) / PI
}

/** Rife-Vincent class I (order=1: Hann, order=2: 4th power-of-sine, order=3+: minimum high-order sidelobes). */
export function rifeVincent (i, N, order) {
	if (order == null) order = 1
	// Class I coefficients scaled for unity average (Rife & Vincent 1970)
	let a
	if (order === 1) a = [1, 1]
	else if (order === 2) a = [1, 4 / 3, 1 / 3]
	else if (order === 3) a = [1, 1.5, 0.6, 0.1]
	else throw new RangeError('rifeVincent: order must be 1, 2, or 3')
	let f = PI2 * i / (N - 1), v = a[0]
	for (let k = 1; k < a.length; k++) v += (k % 2 ? -1 : 1) * a[k] * cos(k * f)
	// Scale to peak=1
	let peak = a.reduce((s, c) => s + c, 0)
	return v / peak
}

/** Approximate confined Gaussian (optimal RMS time-frequency, Starosielec 2014). */
export function confinedGaussian (i, N, sigmaT) {
	if (sigmaT == null) sigmaT = 0.1
	let L = N + 1, half = (N - 1) / 2
	function G (x) { let t = (x - half) / (2 * L * sigmaT); return exp(-t * t) }
	let gn = G(i), gh = G(-0.5)
	return gn - gh * (G(i + L) + G(i - L)) / (G(-0.5 + L) + G(-0.5 - L))
}

// ────── Array-computed (IDFT / eigenvalue) ──────
// These compute the full window array, cache last result per function.
// Same export shape as simple windows — plain `export function`.

/** Kaiser-Bessel derived (MDCT/AAC/Vorbis, Princen-Bradley). N must be even. */
export function kaiserBesselDerived (i, N, beta) {
	if (beta == null) beta = 8.6
	let c = kaiserBesselDerived
	if (c._N !== N || c._b !== beta) {
		let h = N / 2, k = new Float64Array(h + 1), s = 0
		for (let j = 0; j <= h; j++) { let x = (2 * j - h) / h; s += _i0(beta * sqrt(abs(1 - x * x))); k[j] = s }
		for (let j = 0; j <= h; j++) k[j] /= k[h]
		let w = new Float64Array(N)
		for (let j = 0; j < h; j++) w[j] = sqrt(k[j])
		for (let j = h; j < N; j++) w[j] = sqrt(k[N - 1 - j])
		c._w = w; c._N = N; c._b = beta
	}
	return c._w[i]
}

/** Dolph-Chebyshev (equiripple sidelobes at specified attenuation dB). */
export function dolphChebyshev (i, N, attenuation) {
	if (attenuation == null) attenuation = 100
	let c = dolphChebyshev
	if (c._N !== N || c._a !== attenuation) {
		let ord = N - 1, b = cosh(acosh(pow(10, attenuation / 20)) / ord)
		let W = new Float64Array(N)
		for (let k = 0; k < N; k++) {
			let x = b * cos(PI * k / N)
			let T = abs(x) <= 1 ? cos(ord * acos(x)) : cosh(ord * acosh(abs(x)))
			W[k] = (k % 2 ? -1 : 1) * T
		}
		let w = new Float64Array(N)
		for (let n = 0; n < N; n++) {
			let s = W[0]
			for (let k = 1; k < N; k++) s += 2 * W[k] * cos(PI2 * k * n / N)
			w[n] = s
		}
		c._w = _normalize(w); c._N = N; c._a = attenuation
	}
	return c._w[i]
}

/** Taylor (monotonically decreasing sidelobes, radar/SAR standard). */
export function taylor (i, N, nbar, sll) {
	if (nbar == null) nbar = 4
	if (sll == null) sll = 30
	let c = taylor
	if (c._N !== N || c._nb !== nbar || c._s !== sll) {
		let A = acosh(pow(10, sll / 20)) / PI
		let s2 = nbar * nbar / (A * A + (nbar - 0.5) * (nbar - 0.5))
		let Fm = new Float64Array(nbar - 1)
		for (let m = 1; m < nbar; m++) {
			let num = 1, den = 1
			for (let n = 1; n < nbar; n++) {
				num *= 1 - m * m * s2 / (A * A + (n - 0.5) * (n - 0.5))
				if (n !== m) den *= 1 - m * m / (n * n)
			}
			Fm[m - 1] = (m % 2 ? 1 : -1) * num / (2 * den)
		}
		let w = new Float64Array(N)
		for (let n = 0; n < N; n++) {
			let v = 1
			for (let m = 1; m < nbar; m++) v += 2 * Fm[m - 1] * cos(PI2 * m * (n - (N - 1) / 2) / N)
			w[n] = v
		}
		c._w = _normalize(w); c._N = N; c._nb = nbar; c._s = sll
	}
	return c._w[i]
}

/** DPSS / Slepian (optimal energy concentration). W = half-bandwidth [0, 0.5]. */
export function dpss (i, N, W) {
	if (W == null) W = 0.1
	let c = dpss
	if (c._N !== N || c._W !== W) {
		let v = new Float64Array(N), m = 0
		for (let j = 0; j < N; j++) { let x = (2 * j - N + 1) / (N - 1); v[j] = exp(-5 * x * x); m += v[j] * v[j] }
		m = sqrt(m)
		for (let j = 0; j < N; j++) v[j] /= m
		for (let iter = 0; iter < 50; iter++) {
			let u = new Float64Array(N)
			for (let j = 0; j < N; j++) {
				let s = 2 * W * v[j]
				for (let k = 0; k < N; k++) if (k !== j) s += sin(PI2 * W * (j - k)) / (PI * (j - k)) * v[k]
				u[j] = s
			}
			m = 0
			for (let j = 0; j < N; j++) m += u[j] * u[j]
			m = sqrt(m)
			for (let j = 0; j < N; j++) v[j] = u[j] / m
		}
		let maxIdx = 0
		for (let j = 1; j < N; j++) if (abs(v[j]) > abs(v[maxIdx])) maxIdx = j
		if (v[maxIdx] < 0) for (let j = 0; j < N; j++) v[j] = -v[j]
		c._w = _normalize(v); c._N = N; c._W = W
	}
	return c._w[i]
}

/** Ultraspherical / Gegenbauer (mu=0: Dolph-Chebyshev, mu=1: Saramaki). Streit 1984. */
export function ultraspherical (i, N, mu, xmu) {
	if (mu == null) mu = 1
	if (xmu == null) xmu = 1
	let c = ultraspherical
	if (c._N !== N || c._mu !== mu || c._xmu !== xmu) {
		let ord = N - 1, w = new Float64Array(N)
		for (let n = 0; n < N; n++) {
			let s = _gegen(ord, mu, xmu)
			for (let k = 1; k < N; k++) {
				let x = xmu * cos(PI * k / N)
				s += 2 * (k % 2 ? -1 : 1) * _gegen(ord, mu, x) * cos(PI2 * k * n / N)
			}
			w[n] = s
		}
		c._w = _normalize(w); c._N = N; c._mu = mu; c._xmu = xmu
	}
	return c._w[i]
}

// ────── Utilities ──────

/** Generate a full window as Float64Array. */
export function generate (fn, N, ...params) {
	let w = new Float64Array(N)
	for (let i = 0; i < N; i++) w[i] = fn(i, N, ...params)
	return w
}

/** Apply window to a signal in-place. */
export function apply (signal, fn, ...params) {
	for (let i = 0, N = signal.length; i < N; i++) signal[i] *= fn(i, N, ...params)
	return signal
}

/** Equivalent noise bandwidth in frequency bins. Lower = less noise leakage. Rectangular = 1.0, Hann ≈ 1.5. */
export function enbw (fn, N, ...params) {
	let s = 0, s2 = 0
	for (let i = 0; i < N; i++) { let v = fn(i, N, ...params); s += v; s2 += v * v }
	return N * s2 / (s * s)
}

/** Worst-case amplitude error in dB when a tone falls between DFT bins. Rectangular ≈ 3.92, flat-top ≈ 0. */
export function scallopLoss (fn, N, ...params) {
	let s = 0, re = 0, im = 0
	for (let i = 0; i < N; i++) { let v = fn(i, N, ...params); s += v; re += v * cos(PI * i / N); im -= v * sin(PI * i / N) }
	return s === 0 ? Infinity : -20 * Math.log10(sqrt(re * re + im * im) / abs(s))
}

/** COLA (Constant Overlap-Add) deviation. Returns max relative deviation from constant sum; 0 = perfect reconstruction. */
export function cola (fn, N, hop, ...params) {
	let win = generate(fn, N, ...params)
	let sums = new Float64Array(hop)
	for (let t = 0; t < hop; t++) for (let k = t; k < N; k += hop) sums[t] += win[k]
	let mean = 0
	for (let t = 0; t < hop; t++) mean += sums[t]
	mean /= hop
	if (mean === 0) return Infinity
	let maxDev = 0
	for (let t = 0; t < hop; t++) { let d = abs(sums[t] - mean) / mean; if (d > maxDev) maxDev = d }
	return maxDev
}

// ────── Private ──────

function _i0 (x) {
	let s = 1, t = 1
	for (let k = 1; k <= 25; k++) { t *= (x / (2 * k)) * (x / (2 * k)); s += t; if (t < 1e-15 * s) break }
	return s
}

/** Gegenbauer (ultraspherical) polynomial C_n^mu(x) via recurrence. */
function _gegen (n, mu, x) {
	if (n === 0) return 1
	if (n === 1) return 2 * mu * x
	let c0 = 1, c1 = 2 * mu * x
	for (let k = 2; k <= n; k++) {
		let c2 = (2 * x * (k + mu - 1) * c1 - (k + 2 * mu - 2) * c0) / k
		c0 = c1; c1 = c2
	}
	return c1
}

function _normalize (w) {
	let peak = 0
	for (let i = 0; i < w.length; i++) if (abs(w[i]) > peak) peak = abs(w[i])
	if (peak > 0) for (let i = 0; i < w.length; i++) w[i] /= peak
	return w
}

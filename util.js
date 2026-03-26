import { cos, sin, sqrt, abs, PI } from './_util.js'

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

/** Equivalent noise bandwidth in frequency bins. Rectangular = 1.0, Hann ≈ 1.5. */
export function enbw (fn, N, ...params) {
	let s = 0, s2 = 0
	for (let i = 0; i < N; i++) { let v = fn(i, N, ...params); s += v; s2 += v * v }
	return N * s2 / (s * s)
}

/** Worst-case amplitude error in dB when a tone falls between DFT bins. */
export function scallopLoss (fn, N, ...params) {
	let s = 0, re = 0, im = 0
	for (let i = 0; i < N; i++) { let v = fn(i, N, ...params); s += v; re += v * cos(PI * i / N); im -= v * sin(PI * i / N) }
	return s === 0 ? Infinity : -20 * Math.log10(sqrt(re * re + im * im) / abs(s))
}

/** COLA deviation. Returns max relative deviation from constant overlap-add sum; 0 = perfect. */
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

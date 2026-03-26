import { cos, sin, sqrt, abs, PI } from './_util.js'
export default function scallopLoss (fn, N, ...params) {
	let s = 0, re = 0, im = 0
	for (let i = 0; i < N; i++) { let v = fn(i, N, ...params); s += v; re += v * cos(PI * i / N); im -= v * sin(PI * i / N) }
	return s === 0 ? Infinity : -20 * Math.log10(sqrt(re * re + im * im) / abs(s))
}

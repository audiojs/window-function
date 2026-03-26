import { sin, exp, sqrt, abs, PI, PI2, normalize } from './util.js'
export default function dpss (i, N, W) {
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
		c._w = normalize(v); c._N = N; c._W = W
	}
	return c._w[i]
}

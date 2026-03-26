import { cos, abs, cosh, acosh, acos, pow, PI, PI2, normalize } from './_util.js'
export default function dolphChebyshev (i, N, attenuation) {
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
		c._w = normalize(w); c._N = N; c._a = attenuation
	}
	return c._w[i]
}

import { cos, PI, PI2, gegen, normalize } from './_util.js'
export function ultraspherical (i, N, mu, xmu) {
	if (mu == null) mu = 1
	if (xmu == null) xmu = 1
	let c = ultraspherical
	if (c._N !== N || c._mu !== mu || c._xmu !== xmu) {
		let ord = N - 1, w = new Float64Array(N)
		for (let n = 0; n < N; n++) {
			let s = gegen(ord, mu, xmu)
			for (let k = 1; k < N; k++) {
				let x = xmu * cos(PI * k / N)
				s += 2 * (k % 2 ? -1 : 1) * gegen(ord, mu, x) * cos(PI2 * k * n / N)
			}
			w[n] = s
		}
		c._w = normalize(w); c._N = N; c._mu = mu; c._xmu = xmu
	}
	return c._w[i]
}

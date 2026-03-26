import { sqrt, abs, i0 } from './_util.js'
export default function kaiserBesselDerived (i, N, beta) {
	if (beta == null) beta = 8.6
	let c = kaiserBesselDerived
	if (c._N !== N || c._b !== beta) {
		let h = N / 2, k = new Float64Array(h + 1), s = 0
		for (let j = 0; j <= h; j++) { let x = (2 * j - h) / h; s += i0(beta * sqrt(abs(1 - x * x))); k[j] = s }
		for (let j = 0; j <= h; j++) k[j] /= k[h]
		let w = new Float64Array(N)
		for (let j = 0; j < h; j++) w[j] = sqrt(k[j])
		for (let j = h; j < N; j++) w[j] = sqrt(k[N - 1 - j])
		c._w = w; c._N = N; c._b = beta
	}
	return c._w[i]
}

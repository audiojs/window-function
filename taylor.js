import { cos, acosh, pow, PI, PI2, normalize } from './_util.js'
export default function taylor (i, N, nbar, sll) {
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
		c._w = normalize(w); c._N = N; c._nb = nbar; c._s = sll
	}
	return c._w[i]
}

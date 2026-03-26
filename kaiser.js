import { sqrt, i0 } from './_util.js'
export default function kaiser (i, N, beta) {
	if (beta == null) beta = 8.6
	let x = (2 * i - N + 1) / (N - 1)
	return i0(beta * sqrt(1 - x * x)) / i0(beta)
}

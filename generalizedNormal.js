import { abs, exp, pow } from './_util.js'
export default function generalizedNormal (i, N, sigma, p) {
	if (sigma == null) sigma = 0.4
	if (p == null) p = 2
	let x = abs((2 * i - N + 1) / (sigma * (N - 1)))
	return exp(-0.5 * pow(x, p))
}

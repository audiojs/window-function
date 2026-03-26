import { exp } from './util.js'
export default function gaussian (i, N, sigma) {
	if (sigma == null) sigma = 0.4
	let x = (2 * i - N + 1) / (sigma * (N - 1))
	return exp(-0.5 * x * x)
}

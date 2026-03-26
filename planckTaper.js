import { exp } from './_util.js'
export function planckTaper (i, N, epsilon) {
	if (epsilon == null) epsilon = 0.1
	let eN = epsilon * (N - 1)
	if (i <= 0 || i >= N - 1) return 0
	if (i < eN) return 1 / (1 + exp(eN / i - eN / (eN - i)))
	if (i > (N - 1) - eN) return 1 / (1 + exp(eN / (N - 1 - i) - eN / (eN - N + 1 + i)))
	return 1
}

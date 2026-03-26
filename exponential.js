import { abs, exp } from './_util.js'
export function exponential (i, N, tau) {
	if (tau == null) tau = 1
	return exp(-abs(2 * i - N + 1) / (tau * (N - 1)))
}

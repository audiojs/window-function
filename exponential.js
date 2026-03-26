import { abs, exp } from './util.js'
export default function exponential (i, N, tau) {
	if (tau == null) tau = 1
	return exp(-abs(2 * i - N + 1) / (tau * (N - 1)))
}

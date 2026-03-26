import { cos, exp, abs, PI2 } from './_util.js'
export default function hannPoisson (i, N, alpha) {
	if (alpha == null) alpha = 2
	return 0.5 * (1 - cos(PI2 * i / (N - 1))) * exp(-alpha * abs(2 * i - N + 1) / (N - 1))
}

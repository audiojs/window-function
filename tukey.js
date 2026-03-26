import { cos, PI } from './_util.js'
export default function tukey (i, N, alpha) {
	if (alpha == null) alpha = 0.5
	let half = 0.5 * alpha * (N - 1)
	if (half < 1e-12) return 1
	if (i <= half) return 0.5 * (1 + cos(PI * (i / half - 1)))
	if (i >= (N - 1) - half) return 0.5 * (1 + cos(PI * ((N - 1 - i) / half - 1)))
	return 1
}

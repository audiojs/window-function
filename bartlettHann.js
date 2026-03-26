import { abs, cos, PI2 } from './_util.js'
export default function bartlettHann (i, N) {
	let x = i / (N - 1)
	return 0.62 - 0.48 * abs(x - 0.5) - 0.38 * cos(PI2 * x)
}

import { abs, cos, sin, PI } from './util.js'
export default function bohman (i, N) {
	let a = abs((2 * i - N + 1) / (N - 1))
	if (a >= 1) return 0
	return (1 - a) * cos(PI * a) + sin(PI * a) / PI
}
export { bohman }

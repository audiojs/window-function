import { sin, PI } from './_util.js'
export default function lanczos (i, N) {
	let x = 2 * i / (N - 1) - 1
	return x === 0 ? 1 : sin(PI * x) / (PI * x)
}

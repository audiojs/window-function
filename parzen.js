let { abs } = Math
export default function parzen (i, N) {
	let a = abs((2 * i - N + 1) / (N - 1))
	if (a <= 0.5) return 1 - 6 * a * a * (1 - a)
	let b = 1 - a
	return 2 * b * b * b
}

export function cauchy (i, N, alpha) {
	if (alpha == null) alpha = 3
	let x = alpha * (2 * i - N + 1) / (N - 1)
	return 1 / (1 + x * x)
}

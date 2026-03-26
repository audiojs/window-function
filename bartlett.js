let { abs } = Math
export function bartlett (i, N) { return 1 - abs((2 * i - N + 1) / (N - 1)) }

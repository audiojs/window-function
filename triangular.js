let { abs } = Math
export default function triangular (i, N) { return 1 - abs((2 * i - N + 1) / N) }

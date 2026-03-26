export function generate (fn, N, ...params) {
	let w = new Float64Array(N)
	for (let i = 0; i < N; i++) w[i] = fn(i, N, ...params)
	return w
}

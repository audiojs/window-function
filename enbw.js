export function enbw (fn, N, ...params) {
	let s = 0, s2 = 0
	for (let i = 0; i < N; i++) { let v = fn(i, N, ...params); s += v; s2 += v * v }
	return N * s2 / (s * s)
}

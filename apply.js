export function apply (signal, fn, ...params) {
	for (let i = 0, N = signal.length; i < N; i++) signal[i] *= fn(i, N, ...params)
	return signal
}

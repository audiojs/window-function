export let { cos, sin, abs, exp, sqrt, PI, cosh, acosh, acos, pow, log10 } = Math
export let PI2 = 2 * PI

export function cosineSum (i, N, a) {
	let f = PI2 * i / (N - 1), v = a[0]
	for (let k = 1; k < a.length; k++) v += (k % 2 ? -1 : 1) * a[k] * cos(k * f)
	return v
}

export function i0 (x) {
	let s = 1, t = 1
	for (let k = 1; k <= 25; k++) { t *= (x / (2 * k)) * (x / (2 * k)); s += t; if (t < 1e-15 * s) break }
	return s
}

export function gegen (n, mu, x) {
	if (n === 0) return 1
	if (n === 1) return 2 * mu * x
	let c0 = 1, c1 = 2 * mu * x
	for (let k = 2; k <= n; k++) {
		let c2 = (2 * x * (k + mu - 1) * c1 - (k + 2 * mu - 2) * c0) / k
		c0 = c1; c1 = c2
	}
	return c1
}

export function normalize (w) {
	let peak = 0
	for (let i = 0; i < w.length; i++) if (abs(w[i]) > peak) peak = abs(w[i])
	if (peak > 0) for (let i = 0; i < w.length; i++) w[i] /= peak
	return w
}

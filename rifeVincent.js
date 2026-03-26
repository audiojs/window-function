import { cos, PI2 } from './util.js'
export default function rifeVincent (i, N, order) {
	if (order == null) order = 1
	let a
	if (order === 1) a = [1, 1]
	else if (order === 2) a = [1, 4 / 3, 1 / 3]
	else if (order === 3) a = [1, 1.5, 0.6, 0.1]
	else throw new RangeError('rifeVincent: order must be 1, 2, or 3')
	let f = PI2 * i / (N - 1), v = a[0]
	for (let k = 1; k < a.length; k++) v += (k % 2 ? -1 : 1) * a[k] * cos(k * f)
	let peak = a.reduce((s, c) => s + c, 0)
	return v / peak
}

import { abs } from './_util.js'
import { generate } from './generate.js'
export function cola (fn, N, hop, ...params) {
	let win = generate(fn, N, ...params)
	let sums = new Float64Array(hop)
	for (let t = 0; t < hop; t++) for (let k = t; k < N; k += hop) sums[t] += win[k]
	let mean = 0
	for (let t = 0; t < hop; t++) mean += sums[t]
	mean /= hop
	if (mean === 0) return Infinity
	let maxDev = 0
	for (let t = 0; t < hop; t++) { let d = abs(sums[t] - mean) / mean; if (d > maxDev) maxDev = d }
	return maxDev
}

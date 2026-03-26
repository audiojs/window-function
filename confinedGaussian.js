import { exp } from './util.js'
export default function confinedGaussian (i, N, sigmaT) {
	if (sigmaT == null) sigmaT = 0.1
	let L = N + 1, half = (N - 1) / 2
	function G (x) { let t = (x - half) / (2 * L * sigmaT); return exp(-t * t) }
	let gn = G(i), gh = G(-0.5)
	return gn - gh * (G(i + L) + G(i - L)) / (G(-0.5 + L) + G(-0.5 - L))
}

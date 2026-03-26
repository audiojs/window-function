import { sin, PI, pow } from './_util.js'
export default function powerOfSine (i, N, alpha) {
	if (alpha == null) alpha = 2
	return pow(sin(PI * i / (N - 1)), alpha)
}

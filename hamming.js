import { cos, PI2 } from './_util.js'
export function hamming (i, N) { return 0.54 - 0.46 * cos(PI2 * i / (N - 1)) }

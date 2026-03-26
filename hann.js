import { cos, PI2 } from './_util.js'
export function hann (i, N) { return 0.5 - 0.5 * cos(PI2 * i / (N - 1)) }

import { cos, PI2 } from './util.js'
export default function hann (i, N) { return 0.5 - 0.5 * cos(PI2 * i / (N - 1)) }
export { hann }

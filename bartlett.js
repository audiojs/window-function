import { abs } from './util.js'
export default function bartlett (i, N) { return 1 - abs((2 * i - N + 1) / (N - 1)) }
export { bartlett }

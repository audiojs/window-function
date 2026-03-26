import { cosineSum } from './util.js'
export default function blackmanHarris (i, N) { return cosineSum(i, N, [0.35875, 0.48829, 0.14128, 0.01168]) }
export { blackmanHarris }

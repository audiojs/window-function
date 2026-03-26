import { cosineSum } from './_util.js'
export function blackman (i, N) { return cosineSum(i, N, [0.42, 0.5, 0.08]) }

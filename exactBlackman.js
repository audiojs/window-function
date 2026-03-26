import { cosineSum } from './util.js'
export default function exactBlackman (i, N) { return cosineSum(i, N, [0.42659, 0.49656, 0.076849]) }

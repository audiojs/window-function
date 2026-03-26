import { cosineSum } from './util.js'
export default function blackmanNuttall (i, N) { return cosineSum(i, N, [0.3635819, 0.4891775, 0.1365995, 0.0106411]) }
export { blackmanNuttall }

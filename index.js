/**
 * Window functions for signal processing and spectral analysis.
 *
 * Per-sample: fn(i, N, ...params) → number, where i ∈ [0, N-1].
 * Full array: generate(fn, N, ...params) → Float64Array.
 * In-place:   apply(signal, fn, ...params) → signal.
 *
 * @module window-function
 */

// Simple windows
export { rectangular } from './rectangular.js'
export { triangular } from './triangular.js'
export { bartlett } from './bartlett.js'
export { welch } from './welch.js'
export { connes } from './connes.js'
export { hann } from './hann.js'
export { hamming } from './hamming.js'
export { cosine } from './cosine.js'
export { blackman } from './blackman.js'
export { exactBlackman } from './exactBlackman.js'
export { nuttall } from './nuttall.js'
export { blackmanNuttall } from './blackmanNuttall.js'
export { blackmanHarris } from './blackmanHarris.js'
export { flatTop } from './flatTop.js'
export { bartlettHann } from './bartlettHann.js'
export { lanczos } from './lanczos.js'
export { parzen } from './parzen.js'
export { bohman } from './bohman.js'

// Parameterized windows
export { powerOfSine } from './powerOfSine.js'
export { kaiser } from './kaiser.js'
export { gaussian } from './gaussian.js'
export { generalizedNormal } from './generalizedNormal.js'
export { tukey } from './tukey.js'
export { planckTaper } from './planckTaper.js'
export { exponential } from './exponential.js'
export { hannPoisson } from './hannPoisson.js'
export { cauchy } from './cauchy.js'
export { rifeVincent } from './rifeVincent.js'
export { confinedGaussian } from './confinedGaussian.js'

// Array-computed windows
export { kaiserBesselDerived } from './kaiserBesselDerived.js'
export { dolphChebyshev } from './dolphChebyshev.js'
export { taylor } from './taylor.js'
export { dpss } from './dpss.js'
export { ultraspherical } from './ultraspherical.js'

// Utilities
export { generate } from './generate.js'
export { apply } from './apply.js'
export { enbw } from './enbw.js'
export { scallopLoss } from './scallopLoss.js'
export { cola } from './cola.js'

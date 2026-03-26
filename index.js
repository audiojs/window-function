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
export { default as rectangular } from './rectangular.js'
export { default as triangular } from './triangular.js'
export { default as bartlett } from './bartlett.js'
export { default as welch } from './welch.js'
export { default as connes } from './connes.js'
export { default as hann } from './hann.js'
export { default as hamming } from './hamming.js'
export { default as cosine } from './cosine.js'
export { default as blackman } from './blackman.js'
export { default as exactBlackman } from './exactBlackman.js'
export { default as nuttall } from './nuttall.js'
export { default as blackmanNuttall } from './blackmanNuttall.js'
export { default as blackmanHarris } from './blackmanHarris.js'
export { default as flatTop } from './flatTop.js'
export { default as bartlettHann } from './bartlettHann.js'
export { default as lanczos } from './lanczos.js'
export { default as parzen } from './parzen.js'
export { default as bohman } from './bohman.js'

// Parameterized windows
export { default as powerOfSine } from './powerOfSine.js'
export { default as kaiser } from './kaiser.js'
export { default as gaussian } from './gaussian.js'
export { default as generalizedNormal } from './generalizedNormal.js'
export { default as tukey } from './tukey.js'
export { default as planckTaper } from './planckTaper.js'
export { default as exponential } from './exponential.js'
export { default as hannPoisson } from './hannPoisson.js'
export { default as cauchy } from './cauchy.js'
export { default as rifeVincent } from './rifeVincent.js'
export { default as confinedGaussian } from './confinedGaussian.js'

// Array-computed windows
export { default as kaiserBesselDerived } from './kaiserBesselDerived.js'
export { default as dolphChebyshev } from './dolphChebyshev.js'
export { default as taylor } from './taylor.js'
export { default as dpss } from './dpss.js'
export { default as ultraspherical } from './ultraspherical.js'

// Utilities
export { generate, apply, enbw, scallopLoss, cola } from './util.js'

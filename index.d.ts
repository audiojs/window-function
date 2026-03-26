/** Window function: returns sample value at index `i` of window length `N`. */
export type WindowFunction = (i: number, N: number, ...params: number[]) => number;

// Simple windows — no parameters
export function rectangular(i: number, N: number): number;
export function triangular(i: number, N: number): number;
export function bartlett(i: number, N: number): number;
export function welch(i: number, N: number): number;
export function connes(i: number, N: number): number;
export function hann(i: number, N: number): number;
export function hamming(i: number, N: number): number;
export function cosine(i: number, N: number): number;
export function blackman(i: number, N: number): number;
export function exactBlackman(i: number, N: number): number;
export function nuttall(i: number, N: number): number;
export function blackmanNuttall(i: number, N: number): number;
export function blackmanHarris(i: number, N: number): number;
export function flatTop(i: number, N: number): number;
export function bartlettHann(i: number, N: number): number;
export function lanczos(i: number, N: number): number;
export function parzen(i: number, N: number): number;
export function bohman(i: number, N: number): number;

// Parameterized windows
export function powerOfSine(i: number, N: number, alpha?: number): number;
export function kaiser(i: number, N: number, beta?: number): number;
export function gaussian(i: number, N: number, sigma?: number): number;
export function generalizedNormal(i: number, N: number, sigma?: number, p?: number): number;
export function tukey(i: number, N: number, alpha?: number): number;
export function planckTaper(i: number, N: number, epsilon?: number): number;
export function exponential(i: number, N: number, tau?: number): number;
export function hannPoisson(i: number, N: number, alpha?: number): number;
export function cauchy(i: number, N: number, alpha?: number): number;
export function rifeVincent(i: number, N: number, order?: number): number;
export function confinedGaussian(i: number, N: number, sigmaT?: number): number;

// Array-computed windows (cached)
export function kaiserBesselDerived(i: number, N: number, beta?: number): number;
export function dolphChebyshev(i: number, N: number, attenuation?: number): number;
export function taylor(i: number, N: number, nbar?: number, sll?: number): number;
export function dpss(i: number, N: number, W?: number): number;
export function ultraspherical(i: number, N: number, mu?: number, xmu?: number): number;

// Utilities
/** Generate a full window as Float64Array. */
export function generate(fn: WindowFunction, N: number, ...params: number[]): Float64Array;
/** Apply window to a signal in-place, returns the same array. */
export function apply<T extends { length: number; [i: number]: number }>(signal: T, fn: WindowFunction, ...params: number[]): T;

// Metrics
/** Equivalent noise bandwidth in frequency bins. Rectangular = 1.0, Hann ≈ 1.5. */
export function enbw(fn: WindowFunction, N: number, ...params: number[]): number;
/** Worst-case amplitude error in dB when a tone falls between DFT bins. */
export function scallopLoss(fn: WindowFunction, N: number, ...params: number[]): number;
/** COLA deviation at given hop size. Returns 0 for perfect constant overlap-add. */
export function cola(fn: WindowFunction, N: number, hop: number, ...params: number[]): number;

// Subpath default imports: import hann from 'window-function/hann'
declare module 'window-function/rectangular' { export default function rectangular(i: number, N: number): number; }
declare module 'window-function/triangular' { export default function triangular(i: number, N: number): number; }
declare module 'window-function/bartlett' { export default function bartlett(i: number, N: number): number; }
declare module 'window-function/welch' { export default function welch(i: number, N: number): number; }
declare module 'window-function/connes' { export default function connes(i: number, N: number): number; }
declare module 'window-function/hann' { export default function hann(i: number, N: number): number; }
declare module 'window-function/hamming' { export default function hamming(i: number, N: number): number; }
declare module 'window-function/cosine' { export default function cosine(i: number, N: number): number; }
declare module 'window-function/blackman' { export default function blackman(i: number, N: number): number; }
declare module 'window-function/exactBlackman' { export default function exactBlackman(i: number, N: number): number; }
declare module 'window-function/nuttall' { export default function nuttall(i: number, N: number): number; }
declare module 'window-function/blackmanNuttall' { export default function blackmanNuttall(i: number, N: number): number; }
declare module 'window-function/blackmanHarris' { export default function blackmanHarris(i: number, N: number): number; }
declare module 'window-function/flatTop' { export default function flatTop(i: number, N: number): number; }
declare module 'window-function/bartlettHann' { export default function bartlettHann(i: number, N: number): number; }
declare module 'window-function/lanczos' { export default function lanczos(i: number, N: number): number; }
declare module 'window-function/parzen' { export default function parzen(i: number, N: number): number; }
declare module 'window-function/bohman' { export default function bohman(i: number, N: number): number; }
declare module 'window-function/powerOfSine' { export default function powerOfSine(i: number, N: number, alpha?: number): number; }
declare module 'window-function/kaiser' { export default function kaiser(i: number, N: number, beta?: number): number; }
declare module 'window-function/gaussian' { export default function gaussian(i: number, N: number, sigma?: number): number; }
declare module 'window-function/generalizedNormal' { export default function generalizedNormal(i: number, N: number, sigma?: number, p?: number): number; }
declare module 'window-function/tukey' { export default function tukey(i: number, N: number, alpha?: number): number; }
declare module 'window-function/planckTaper' { export default function planckTaper(i: number, N: number, epsilon?: number): number; }
declare module 'window-function/exponential' { export default function exponential(i: number, N: number, tau?: number): number; }
declare module 'window-function/hannPoisson' { export default function hannPoisson(i: number, N: number, alpha?: number): number; }
declare module 'window-function/cauchy' { export default function cauchy(i: number, N: number, alpha?: number): number; }
declare module 'window-function/rifeVincent' { export default function rifeVincent(i: number, N: number, order?: number): number; }
declare module 'window-function/confinedGaussian' { export default function confinedGaussian(i: number, N: number, sigmaT?: number): number; }
declare module 'window-function/kaiserBesselDerived' { export default function kaiserBesselDerived(i: number, N: number, beta?: number): number; }
declare module 'window-function/dolphChebyshev' { export default function dolphChebyshev(i: number, N: number, attenuation?: number): number; }
declare module 'window-function/taylor' { export default function taylor(i: number, N: number, nbar?: number, sll?: number): number; }
declare module 'window-function/dpss' { export default function dpss(i: number, N: number, W?: number): number; }
declare module 'window-function/ultraspherical' { export default function ultraspherical(i: number, N: number, mu?: number, xmu?: number): number; }

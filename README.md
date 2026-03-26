# window-function

Complete collection of window functions for signal processing and spectral analysis.

**34 window functions** · Zero dependencies · Pure ESM · Individual imports

```js
import { hann, kaiser, generate, apply } from 'window-function'
import { hann } from 'window-function/hann'

hann(50, 101)                   // → 1.0 (single sample)
generate(hann, 1024)            // → Float64Array(1024)
generate(kaiser, 1024, 8.6)    // → parameterized window
apply(signal, kaiser, 8.6)     // → signal, windowed in-place
```

## Which window should I pick?

Every window is a tradeoff between **frequency resolution** (narrow main lobe), **spectral leakage** (low sidelobes), and **amplitude accuracy** (flat main lobe top). No single window optimizes all three.

| I need to... | Use | Why |
|---|---|---|
| Just get started | `hann` | Good all-round, zero edges, 50% COLA |
| Design FIR filters | `kaiser` or `hamming` | Kaiser is tunable, Hamming is the classic |
| Measure amplitudes accurately | `flatTop` | < 0.01 dB scalloping loss |
| High dynamic range (>80 dB) | `blackmanHarris` | -92 dB equiripple sidelobes |
| Audio codec (MDCT) | `kaiserBesselDerived` or `cosine` | Princen-Bradley perfect reconstruction |
| Preserve center, taper edges | `tukey` | Adjustable flat-top fraction |
| Robust spectral estimation | `dpss` | Optimal for multitaper method |
| Radar / SAR | `taylor` | Monotonic sidelobes, radar standard |
| Antenna array design | `dolphChebyshev` or `ultraspherical` | Optimal equiripple or tunable taper |
| Tune resolution/leakage | `kaiser` or `gaussian` | Single-parameter adjustment |
| Modal / impact analysis | `exponential` | Controlled decay for underdamped systems |
| FTIR spectroscopy | `connes` | Smooth apodization for interferograms |
| Gravitational waves | `planckTaper` | C∞ smooth, no spectral artifacts |

## API

Every window: `fn(i, N, ...params) → number` — sample `i` of window length `N`.

| Function | Parameters | Returns |
|---|---|---|
| `generate(fn, N, ...params)` | window function, length, params | `Float64Array` |
| `apply(signal, fn, ...params)` | signal array, window function, params | `signal` (modified) |
| `enbw(fn, N, ...params)` | window function, length, params | Equivalent noise bandwidth (bins) |
| `scallopLoss(fn, N, ...params)` | window function, length, params | Worst-case amplitude error (dB) |
| `cola(fn, N, hop, ...params)` | window function, length, hop, params | COLA deviation (0 = perfect) |

```js
import { hann, enbw, scallopLoss, cola } from 'window-function'

enbw(hann, 1024)                // → 1.5 (noise bandwidth in bins)
scallopLoss(hann, 1024)         // → 1.42 dB (worst-case amplitude error)
cola(hann, 1024, 512)           // → 0 (perfect STFT reconstruction at 50% overlap)
```

## Reference

## Simple — no parameters

### `rectangular(i, N)`

$w(n) = 1$

<img src="docs/plots/rectangular.svg">

No windowing at all. Best frequency resolution, worst spectral leakage. Use for transient signals already zero at edges, or harmonic analysis with integer cycles.
**-13 dB** peak sidelobe · **-6 dB/oct** rolloff

<br>

### `triangular(i, N)`

$w(n) = 1 - \left|\frac{2n - N + 1}{N}\right|$

<img src="docs/plots/triangular.svg">

Linear taper, nonzero endpoints. Simple smoothing, 2nd-order B-spline.
**-27 dB** peak sidelobe · **-12 dB/oct** rolloff

<br>

### `bartlett(i, N)`

$w(n) = 1 - \left|\frac{2n - N + 1}{N - 1}\right|$

<img src="docs/plots/bartlett.svg">

Linear taper, zero endpoints. Bartlett's method PSD estimation. Bartlett 1950.
**-27 dB** peak sidelobe · **-12 dB/oct** rolloff

<br>

### `welch(i, N)`

$w(n) = 1 - \left(\frac{2n - N + 1}{N - 1}\right)^2$

<img src="docs/plots/welch.svg">

Parabolic taper. Welch's method PSD estimation. Welch 1967.
**-21 dB** peak sidelobe · **-12 dB/oct** rolloff

<br>

### `connes(i, N)`

$w(n) = \left[1 - \left(\frac{2n - N + 1}{N - 1}\right)^2\right]^2$

<img src="docs/plots/connes.svg">

Welch squared (4th power parabolic). FTIR spectroscopy, interferogram apodization. Connes 1961.
**-24 dB/oct** rolloff

<br>

### `hann(i, N)`

$w(n) = 0.5 - 0.5\cos\!\left(\frac{2\pi n}{N-1}\right)$

<img src="docs/plots/hann.svg">

Raised cosine, zero endpoints. The default general-purpose choice. STFT with 50% overlap (COLA). Also called "Hanning" (misnomer). Blackman & Tukey 1958.
**-32 dB** peak sidelobe · **-18 dB/oct** rolloff

<br>

### `hamming(i, N)`

$w(n) = 0.54 - 0.46\cos\!\left(\frac{2\pi n}{N-1}\right)$

<img src="docs/plots/hamming.svg">

Raised cosine, nonzero endpoints. Optimized for first sidelobe cancellation. FIR filter design, speech processing. Hamming 1977.
**-43 dB** peak sidelobe · **-6 dB/oct** rolloff

<br>

### `cosine(i, N)`

$w(n) = \sin\!\left(\frac{\pi n}{N-1}\right)$

<img src="docs/plots/cosine.svg">

Half-period sine. MDCT audio codecs: MP3, AAC, Vorbis. Princen & Bradley 1987.
**-23 dB** peak sidelobe · **-12 dB/oct** rolloff

<br>

### `blackman(i, N)`

$w(n) = 0.42 - 0.5\cos\!\left(\frac{2\pi n}{N-1}\right) + 0.08\cos\!\left(\frac{4\pi n}{N-1}\right)$

<img src="docs/plots/blackman.svg">

3-term cosine sum. Better leakage than Hann at the cost of wider main lobe. Blackman & Tukey 1958.
**-58 dB** peak sidelobe · **-18 dB/oct** rolloff

<br>

### `exactBlackman(i, N)`

$w(n) = 0.42659 - 0.49656\cos\!\left(\frac{2\pi n}{N-1}\right) + 0.076849\cos\!\left(\frac{4\pi n}{N-1}\right)$

<img src="docs/plots/exactBlackman.svg">

Blackman with exact zero placement at 3rd and 4th sidelobes. Harris 1978.
**-69 dB** peak sidelobe · **-6 dB/oct** rolloff

<br>

### `nuttall(i, N)`

$w(n) = 0.355768 - 0.487396\cos\!\left(\frac{2\pi n}{N\!-\!1}\right) + 0.144232\cos\!\left(\frac{4\pi n}{N\!-\!1}\right) - 0.012604\cos\!\left(\frac{6\pi n}{N\!-\!1}\right)$

<img src="docs/plots/nuttall.svg">

4-term cosine sum, continuous 1st derivative. High-dynamic-range analysis without edge discontinuity. Nuttall 1981.
**-93 dB** peak sidelobe · **-18 dB/oct** rolloff

<br>

### `blackmanNuttall(i, N)`

$w(n) = 0.3635819 - 0.4891775\cos\!\left(\frac{2\pi n}{N\!-\!1}\right) + 0.1365995\cos\!\left(\frac{4\pi n}{N\!-\!1}\right) - 0.0106411\cos\!\left(\frac{6\pi n}{N\!-\!1}\right)$

<img src="docs/plots/blackmanNuttall.svg">

4-term cosine sum, lowest sidelobes among 4-term windows. Nuttall 1981.
**-98 dB** peak sidelobe · **-6 dB/oct** rolloff

<br>

### `blackmanHarris(i, N)`

$w(n) = 0.35875 - 0.48829\cos\!\left(\frac{2\pi n}{N\!-\!1}\right) + 0.14128\cos\!\left(\frac{4\pi n}{N\!-\!1}\right) - 0.01168\cos\!\left(\frac{6\pi n}{N\!-\!1}\right)$

<img src="docs/plots/blackmanHarris.svg">

4-term minimum sidelobe. ADC testing, measurement instrumentation, >80 dB dynamic range. Harris 1978.
**-92 dB** peak sidelobe · **-6 dB/oct** rolloff

<br>

### `flatTop(i, N)`

$w(n) = 1 - 1.93\cos\!\left(\frac{2\pi n}{N\!-\!1}\right) + 1.29\cos\!\left(\frac{4\pi n}{N\!-\!1}\right) - 0.388\cos\!\left(\frac{6\pi n}{N\!-\!1}\right) + 0.028\cos\!\left(\frac{8\pi n}{N\!-\!1}\right)$

<img src="docs/plots/flatTop.svg">

5-term cosine sum with near-zero scalloping. Peak value ~4.64 (by design — optimized for amplitude accuracy, not energy). Amplitude calibration, transducer calibration (~0.01 dB accuracy). ISO 18431. Heinzel 2002.
**-93 dB** peak sidelobe · **-6 dB/oct** rolloff

<br>

### `bartlettHann(i, N)`

$w(n) = 0.62 - 0.48\left|\frac{n}{N\!-\!1} - 0.5\right| - 0.38\cos\!\left(\frac{2\pi n}{N-1}\right)$

<img src="docs/plots/bartlettHann.svg">

Bartlett-Hann hybrid. Balanced near/far sidelobe levels. Ha & Pearce 1989.
**-36 dB** peak sidelobe

<br>

### `lanczos(i, N)`

$w(n) = \text{sinc}\!\left(\frac{2n}{N-1} - 1\right)$

<img src="docs/plots/lanczos.svg">

Sinc main lobe. Image resampling, interpolation (FFmpeg, ImageMagick). Duchon 1979.
**-26 dB** peak sidelobe

<br>

### `parzen(i, N)`

$w(n) = 1 - 6a^2(1-a)$ for $|a| \le 0.5$, &ensp; $w(n) = 2(1-a)^3$ for $|a| > 0.5$, &ensp; where $a = |{(2n-N+1)}/{(N-1)}|$

<img src="docs/plots/parzen.svg">

4th-order B-spline. Always-positive spectrum. Kernel density estimation. Parzen 1961.
**-53 dB** peak sidelobe · **-24 dB/oct** rolloff

<br>

### `bohman(i, N)`

$w(n) = (1-|a|)\cos(\pi|a|) + \frac{\sin(\pi|a|)}{\pi} \quad a = \frac{2n-N+1}{N-1}$

<img src="docs/plots/bohman.svg">

Autocorrelation of cosine window. Fast sidelobe decay, spectral estimation.
**-46 dB** peak sidelobe · **-24 dB/oct** rolloff

<br>

## Parameterized — adjustable tradeoff

### `kaiser(i, N, beta)`

`beta`: shape — 0 → rectangular, 5.4 → Hamming, **8.6** (default) → Blackman.

$w(n) = \frac{I_0\!\left(\beta\sqrt{1 - \left(\frac{2n-N+1}{N-1}\right)^2}\right)}{I_0(\beta)}$

<img src="docs/plots/kaiser.svg">

Near-optimal DPSS approximation via Bessel I₀. The standard parameterized window for FIR filter design. Kaiser 1974.

<br>

### `gaussian(i, N, sigma)`

`sigma`: width, default **0.4**.

$w(n) = \exp\!\left[-\frac{1}{2}\left(\frac{2n-N+1}{\sigma(N-1)}\right)^2\right]$

<img src="docs/plots/gaussian.svg">

Gaussian bell, minimum time-bandwidth product. STFT/Gabor transform, frequency estimation via parabolic interpolation. Gabor 1946.

<br>

### `generalizedNormal(i, N, sigma, p)`

`sigma`: width (default **0.4**), `p`: shape — 2 = Gaussian, →∞ = rectangular.

$w(n) = \exp\!\left[-\frac{1}{2}\left|\frac{2n-N+1}{\sigma(N-1)}\right|^p\right]$

<img src="docs/plots/generalizedNormal.svg">

Continuous family between Gaussian and rectangular. Adjustable time-frequency tradeoff.

<br>

### `tukey(i, N, alpha)`

`alpha`: taper fraction — 0 → rectangular, **0.5** (default), 1 → Hann.

$w(n) = \tfrac{1}{2}[1+\cos(\pi(n/(\alpha(N\!-\!1)/2)-1))]$ in the tapered edges, $w(n) = 1$ in the flat center.

<img src="docs/plots/tukey.svg">

Flat center with cosine-tapered edges. Preserves signal amplitude while tapering. Vibration analysis, LIGO.

<br>

### `planckTaper(i, N, epsilon)`

`epsilon`: taper fraction, default **0.1**.

<img src="docs/plots/planckTaper.svg">

C∞-smooth bump function (infinitely differentiable). Gravitational wave analysis (LIGO/Virgo). McKechan 2010.

<br>

### `powerOfSine(i, N, alpha)`

`alpha`: exponent — 0 → rectangular, 1 → cosine, **2** (default) → Hann.

$w(n) = \sin^\alpha\!\left(\frac{\pi n}{N-1}\right)$

<img src="docs/plots/powerOfSine.svg">

sin^α family. Codec design, parameterized spectral analysis.

<br>

### `exponential(i, N, tau)`

`tau`: time constant, default **1**.

$w(n) = \exp\!\left(\frac{-|2n-N+1|}{\tau(N-1)}\right)$

<img src="docs/plots/exponential.svg">

Exponential decay from center. Modal analysis, impact testing (compensates underdamped responses). Harris 1978.

<br>

### `hannPoisson(i, N, alpha)`

`alpha`: decay — default **2**. At α ≥ 2, the transform has no sidelobes.

$w(n) = \frac{1}{2}\left(1-\cos\frac{2\pi n}{N\!-\!1}\right)\exp\!\left(\frac{-\alpha|2n\!-\!N\!+\!1|}{N-1}\right)$

<img src="docs/plots/hannPoisson.svg">

Hann × exponential product. Unique no-sidelobe property enables frequency estimators using convex optimization.

<br>

### `cauchy(i, N, alpha)`

`alpha`: width, default **3**.

$w(n) = \frac{1}{1+\left(\frac{\alpha(2n-N+1)}{N-1}\right)^2}$

<img src="docs/plots/cauchy.svg">

Lorentzian 1/(1+x²) shape. Matches spectral line shapes in spectroscopy. Harris 1978.

<br>

### `rifeVincent(i, N, order)`

`order`: **1** (default) = Hann, 2, 3. Throws for other values.

$w(n) = \frac{1}{Z}\sum_{k=0}^{K}(-1)^k a_k\cos\frac{2\pi kn}{N-1}$

<img src="docs/plots/rifeVincent.svg">

Class I cosine-sum optimized for sidelobe fall-off. Power grid harmonic analysis, interpolated DFT. Rife & Vincent 1970.

<br>

### `confinedGaussian(i, N, sigmaT)`

`sigmaT`: temporal width, default **0.1**.

<img src="docs/plots/confinedGaussian.svg">

Approximate confined Gaussian — optimal RMS time-frequency bandwidth. Time-frequency analysis, audio coding (MP3/AAC). Starosielec 2014.

<br>

## Array-computed — cached

These compute the full window on first call and cache the result. Recomputed when N or parameters change.

### `dolphChebyshev(i, N, dB)`

`dB`: sidelobe attenuation, default **100**.

$W(k) = (-1)^k T_{N-1}\!\left(\beta\cos\frac{\pi k}{N}\right),\quad w = \text{IDFT}(W)$

<img src="docs/plots/dolphChebyshev.svg">

Optimal: narrowest main lobe for a given equiripple sidelobe level. Antenna array design, radar beam patterns. Dolph 1946.

<br>

### `taylor(i, N, nbar, sll)`

`nbar`: number of constant-level sidelobes (default **4**), `sll`: sidelobe level in dB (default **30**).

$w(n) = 1 + 2\sum_{m=1}^{\bar{n}-1} F_m \cos\frac{2\pi m(n-(N\!-\!1)/2)}{N}$

<img src="docs/plots/taylor.svg">

Dolph-Chebyshev variant with monotonically decreasing sidelobes. The radar community standard for SAR image formation. Taylor 1955.

<br>

### `kaiserBesselDerived(i, N, beta)`

`beta`: shape, default **8.6**. N must be even.

$w(n) = \sqrt{\frac{\sum_{j=0}^{n} K(j)}{\sum_{j=0}^{N/2} K(j)}} \quad K(j) = I_0\!\left(\beta\sqrt{1-\left(\frac{2j-N/2}{N/2}\right)^2}\right)$

<img src="docs/plots/kaiserBesselDerived.svg">

Satisfies the Princen-Bradley condition for perfect MDCT reconstruction. AAC, Vorbis, Opus audio codecs (long blocks). Princen & Bradley 1987.

<br>

### `dpss(i, N, W)`

`W`: half-bandwidth [0, 0.5], default **0.1**.

$\mathbf{T}\mathbf{v} = \lambda\mathbf{v} \quad T_{jk} = \frac{\sin 2\pi W(j-k)}{\pi(j-k)}$

<img src="docs/plots/dpss.svg">

Dominant eigenvector of the sinc Toeplitz matrix — provably optimal energy concentration in a frequency band. Also called Slepian window. Thomson multitaper spectral estimation, neuroscience (EEG/MEG), climate science. Slepian 1978.

<br>

### `ultraspherical(i, N, mu, xmu)`

`mu`: 0 → Dolph-Chebyshev, **1** (default) → Saramaki. `xmu`: sidelobe control (default **1**).

$W(k) = C_n^\mu\!\left(x_\mu\cos\frac{\pi k}{N}\right),\quad w = \text{IDFT}(W)$

<img src="docs/plots/ultraspherical.svg">

Gegenbauer polynomial window. Independent control of sidelobe level and taper rate. Advanced antenna design, beamforming. Streit 1984.

<br>

## Quantitative metrics

Three functions to verify and compare windows numerically:

- **ENBW** (Equivalent Noise Bandwidth) — frequency bins of noise power leaking through. Rectangular = 1.0, Hann = 1.5, Blackman-Harris = 2.0. Lower = less noise.
- **Scallop loss** — worst-case amplitude error between DFT bins. Rectangular = 3.92 dB, Hann = 1.42 dB, flat-top ≈ 0 dB.
- **COLA** (Constant Overlap-Add) — 0 = perfect STFT reconstruction at the given hop size.

## Migrating from v2

v3 is a complete rewrite: CJS → ESM, 18 → 34 windows, subpath imports preserved.

```diff
- const hann = require('window-function/hann')
- const apply = require('window-function/apply')
+ import { hann } from 'window-function/hann'
+ import { apply } from 'window-function/apply'
```

The per-sample API (`fn(i, N, ...params) → number`) is unchanged.

## References

| Year | Reference | Windows |
|---|---|---|
| 1946 | Dolph, *Proc. IRE* 34 | Dolph-Chebyshev |
| 1946 | Gabor, *J. IEE* 93 | Gaussian |
| 1950 | Bartlett, *Biometrika* 37 | Bartlett |
| 1955 | Taylor, *IRE Trans. Antennas Propag.* AP-4 | Taylor |
| 1958 | Blackman & Tukey, *The Measurement of Power Spectra* | Hann, Blackman |
| 1961 | Connes, *Revue d'Optique* 40 | Connes |
| 1961 | Parzen, *Technometrics* 3 | Parzen |
| 1967 | Welch, *IEEE Trans. Audio Electroacoustics* AU-15 | Welch |
| 1970 | Rife & Vincent, *IEEE Trans. Instrumentation* | Rife-Vincent |
| 1974 | Kaiser, *IEEE Int. Symp. Circuits and Systems* | Kaiser |
| 1977 | Hamming, *Digital Filters* | Hamming |
| 1978 | Harris, *Proc. IEEE* 66 — **the comprehensive survey** | Blackman-Harris, survey of all |
| 1978 | Slepian, *Bell System Technical Journal* 57 | DPSS |
| 1979 | Duchon, *J. Applied Meteorology* 18 | Lanczos |
| 1981 | Nuttall, *IEEE Trans. ASSP* 29 | Nuttall, Blackman-Nuttall |
| 1984 | Streit, *IEEE Trans. ASSP* 32 | Ultraspherical |
| 1987 | Princen, Johnson & Bradley, *ICASSP* | KBD, Cosine |
| 1989 | Ha & Pearce, *IEEE* | Bartlett-Hann |
| 2002 | Heinzel, Rudiger & Schilling (ISO 18431) | Flat-top |
| 2010 | McKechan, Robinson & Sathyaprakash, *Class. Quantum Grav.* | Planck-taper |
| 2014 | Starosielec & Hagemeier, *Signal Processing* | Confined Gaussian |

## License

MIT · <a href="https://github.com/krishnized/license/">ॐ</a>

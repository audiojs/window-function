# Changelog

## 3.0.0

Breaking: ESM-only. `require()` no longer works.

- **34 window functions** (was 18): added connes, powerOfSine, generalizedNormal, planckTaper, exponential, hannPoisson, cauchy, rifeVincent, confinedGaussian, kaiserBesselDerived, dolphChebyshev, taylor, dpss, ultraspherical, parzen, bohman
- **Quantitative metrics**: `enbw`, `scallopLoss`, `cola`
- **Individual files**: `import hann from 'window-function/hann'`
- **Default + named exports**: both `import hann from` and `import { hann } from` work
- **TypeScript declarations** included
- **Scientific SVG plots** for all windows (time domain + frequency response)
- Consolidated to ESM (`"type": "module"`)
- Single `util.js` for shared helpers and utilities
- Zero dependencies (fourier-transform is devDependency for plot generation only)

### Migration

```diff
- const hann = require('window-function/hann')
+ import hann from 'window-function/hann'
```

The per-sample API `fn(i, N, ...params) → number` is unchanged.

## 2.1.0

- Added `apply` and `generate` helpers

## 2.0.2

- 18 window functions: rectangular, triangular, bartlett, welch, hann, hamming, cosine, blackman, exactBlackman, nuttall, blackmanNuttall, blackmanHarris, flatTop, bartlettHann, lanczos, gaussian, tukey

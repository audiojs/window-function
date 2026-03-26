import { test } from 'node:test'
import assert from 'node:assert'
import * as w from './index.js'

let N = 101, eps = 1e-10

function near (a, b, tol) { return Math.abs(a - b) < (tol || eps) }

let simple = [
	'rectangular', 'triangular', 'bartlett', 'welch', 'connes',
	'hann', 'hamming', 'cosine', 'blackman', 'exactBlackman',
	'nuttall', 'blackmanNuttall', 'blackmanHarris', 'flatTop', 'bartlettHann',
	'lanczos', 'parzen', 'bohman'
]

// ────── Finite values ──────

test('simple windows — finite at multiple positions', () => {
	for (let name of simple)
		for (let i of [0, 1, Math.floor(N / 2), N - 2, N - 1])
			assert.ok(isFinite(w[name](i, N)), `${name}(${i}, ${N})`)
})

test('parameterized windows — finite', () => {
	let cases = [
		['kaiser', 8], ['gaussian', 0.4], ['tukey', 0.5], ['planckTaper', 0.1],
		['exponential', 1], ['hannPoisson', 2], ['cauchy', 3],
		['powerOfSine', 2], ['rifeVincent', 2], ['confinedGaussian', 0.1]
	]
	for (let [name, ...p] of cases)
		for (let i of [0, 1, Math.floor(N / 2), N - 2, N - 1])
			assert.ok(isFinite(w[name](i, N, ...p)), `${name}(${i})`)
})

test('array-based windows — finite', () => {
	assert.ok(isFinite(w.kaiserBesselDerived(50, 100, 8)))
	assert.ok(isFinite(w.dolphChebyshev(50, N, 80)))
	assert.ok(isFinite(w.taylor(50, N, 4, 30)))
	assert.ok(isFinite(w.dpss(50, N, 0.1)))
	assert.ok(isFinite(w.ultraspherical(10, 31, 0.01, 1.5)))
})

// ────── Edge cases ──────

test('N=1', () => {
	assert.strictEqual(w.rectangular(0, 1), 1)
	assert.ok(isFinite(w.triangular(0, 1)))
})

test('N=2 — minimal', () => {
	assert.strictEqual(w.rectangular(0, 2), 1)
	assert.ok(near(w.hann(0, 2), 0))
	assert.ok(near(w.hann(1, 2), 0))
	assert.ok(w.hamming(0, 2) > 0.05, 'hamming nonzero at endpoints')
})

test('boundary i=0 and i=N-1', () => {
	assert.ok(near(w.hann(0, N), 0), 'hann start')
	assert.ok(near(w.hann(N - 1, N), 0), 'hann end')
	assert.ok(w.hamming(0, N) > 0.05, 'hamming nonzero start')
	assert.ok(near(w.bartlett(0, N), 0), 'bartlett start')
	assert.ok(near(w.bartlett(N - 1, N), 0), 'bartlett end')
})

// ────── Shape tests ──────

test('hann — zero endpoints, unit center', () => {
	assert.ok(near(w.hann(0, 5), 0))
	assert.ok(near(w.hann(2, 5), 1))
	assert.ok(near(w.hann(4, 5), 0))
})

test('kaiser — unit center, near-zero edges', () => {
	assert.ok(near(w.kaiser(50, N, 8), 1))
	assert.ok(w.kaiser(0, N, 8) < 0.1)
})

test('rectangular — constant 1', () => {
	for (let i = 0; i < 10; i++) assert.strictEqual(w.rectangular(i, 10), 1)
})

test('connes = welch\u00b2', () => {
	for (let i of [0, 25, 50, 75, 100]) {
		let v = w.welch(i, N)
		assert.ok(near(w.connes(i, N), v * v), `i=${i}`)
	}
})

test('exponential — unit center, decays', () => {
	assert.ok(near(w.exponential(50, N, 1), 1))
	assert.ok(w.exponential(0, N, 1) < 0.5)
})

test('flatTop — center exceeds 1.0 (by design)', () => {
	let center = w.flatTop(50, N)
	assert.ok(center > 4 && center < 5, `flatTop center = ${center}`)
})

test('dolphChebyshev — symmetric, unit center', () => {
	assert.ok(near(w.dolphChebyshev(50, N, 80), 1, 1e-8))
	assert.ok(near(w.dolphChebyshev(10, N, 80), w.dolphChebyshev(90, N, 80), 1e-8))
})

test('taylor — symmetric, normalized to 1', () => {
	let win = w.generate(w.taylor, N, 4, 30)
	let peak = Math.max(...win)
	assert.ok(near(peak, 1, 1e-8), 'normalized peak = 1')
	assert.ok(near(w.taylor(10, N, 4, 30), w.taylor(90, N, 4, 30), 1e-8), 'symmetric')
})

test('dpss — symmetric, unit peak, bell-shaped', () => {
	assert.ok(near(w.dpss(50, N, 0.1), 1, 1e-6), 'center \u2248 1')
	assert.ok(w.dpss(0, N, 0.1) < 0.5, 'edge < center')
	assert.ok(near(w.dpss(10, N, 0.1), w.dpss(90, N, 0.1), 1e-8), 'symmetric')
})

test('kaiserBesselDerived — symmetric', () => {
	let M = 100
	assert.ok(near(w.kaiserBesselDerived(25, M, 8), w.kaiserBesselDerived(74, M, 8), 1e-8))
	assert.ok(isFinite(w.kaiserBesselDerived(0, M, 8)))
})

// ────── Relationships ──────

test('powerOfSine — generalizes cosine and hann', () => {
	assert.ok(near(w.powerOfSine(25, N, 1), w.cosine(25, N)), 'alpha=1 \u2248 cosine')
	assert.ok(near(w.powerOfSine(25, N, 2), w.hann(25, N)), 'alpha=2 \u2248 hann')
})

test('generalizedNormal — p=2 equals gaussian', () => {
	for (let i of [0, 25, 50, 75, 100])
		assert.ok(near(w.generalizedNormal(i, N, 0.4, 2), w.gaussian(i, N, 0.4)), `i=${i}`)
})

test('rifeVincent — order 1 matches hann', () => {
	for (let i of [0, 25, 50, 75, 100])
		assert.ok(near(w.rifeVincent(i, N, 1), w.hann(i, N)), `i=${i}`)
})

test('rifeVincent — throws for unsupported order', () => {
	assert.throws(() => w.rifeVincent(50, N, 0), /order/)
	assert.throws(() => w.rifeVincent(50, N, 4), /order/)
	assert.throws(() => w.rifeVincent(50, N, -1), /order/)
})

test('confinedGaussian — bell-shaped', () => {
	let center = w.confinedGaussian(50, N, 0.1)
	let edge = w.confinedGaussian(0, N, 0.1)
	assert.ok(isFinite(center) && center > edge)
})

test('ultraspherical — symmetric', () => {
	let left = w.ultraspherical(10, 31, 0.01, 1.5)
	let right = w.ultraspherical(20, 31, 0.01, 1.5)
	assert.ok(isFinite(left) && near(left, right, 1e-8))
})

// ────── Symmetry ──────

test('symmetry — simple windows', () => {
	let all = [
		'hann', 'hamming', 'blackman', 'exactBlackman', 'nuttall', 'blackmanNuttall',
		'blackmanHarris', 'bartlett', 'bartlettHann', 'welch', 'connes',
		'cosine', 'lanczos', 'parzen', 'bohman', 'triangular', 'flatTop'
	]
	for (let name of all) {
		assert.ok(near(w[name](10, N), w[name](90, N)), `${name} inner`)
		assert.ok(near(w[name](0, N), w[name](N - 1, N), 1e-8), `${name} endpoints`)
	}
})

test('symmetry — parameterized windows', () => {
	let cases = [['kaiser'], ['gaussian'], ['tukey'], ['exponential'], ['cauchy'], ['hannPoisson']]
	for (let [name] of cases)
		assert.ok(near(w[name](10, N), w[name](90, N)), name)
})

// ────── Utilities ──────

test('generate — basic', () => {
	let win = w.generate(w.hamming, 100)
	assert.ok(win instanceof Float64Array)
	assert.strictEqual(win.length, 100)
})

test('generate — parameterized', () => {
	let win = w.generate(w.kaiser, 100, 8)
	assert.ok(win instanceof Float64Array)
	assert.ok(near(win[50], w.kaiser(50, 100, 8)))
})

test('apply — returns same array, modifies in-place', () => {
	let sig = new Float64Array(5).fill(1)
	let ret = w.apply(sig, w.hann)
	assert.strictEqual(ret, sig)
	assert.ok(sig[0] < 0.01)
	assert.ok(sig[2] > 0.99)
})

test('apply — parameterized', () => {
	let sig = new Float64Array(100).fill(1)
	w.apply(sig, w.kaiser, 8)
	assert.ok(near(sig[50], w.kaiser(50, 100, 8)))
})

// ────── Metrics ──────

test('enbw — rectangular = 1.0', () => {
	assert.ok(near(w.enbw(w.rectangular, 1024), 1.0, 0.001))
})

test('enbw — hann \u2248 1.5', () => {
	let e = w.enbw(w.hann, 1024)
	assert.ok(near(e, 1.5, 0.01), `got ${e}`)
})

test('enbw — blackmanHarris > hann', () => {
	assert.ok(w.enbw(w.blackmanHarris, 1024) > w.enbw(w.hann, 1024))
})

test('scallopLoss — rectangular \u2248 3.92 dB', () => {
	let s = w.scallopLoss(w.rectangular, 4096)
	assert.ok(near(s, 3.92, 0.1), `got ${s}`)
})

test('scallopLoss — flatTop \u2248 0 dB', () => {
	assert.ok(w.scallopLoss(w.flatTop, 4096) < 0.1)
})

test('scallopLoss — hann < rectangular', () => {
	assert.ok(w.scallopLoss(w.hann, 1024) < w.scallopLoss(w.rectangular, 1024))
})

test('cola — hann 50% overlap \u2248 perfect', () => {
	// Odd N for exact COLA with symmetric convention
	assert.ok(w.cola(w.hann, 1025, 512) < 1e-10)
})

test('cola — rectangular hop=N = perfect', () => {
	assert.ok(w.cola(w.rectangular, 100, 100) < 1e-10)
})

test('cola — non-COLA detection', () => {
	// Blackman at 50% overlap is not COLA
	assert.ok(w.cola(w.blackman, 1024, 512) > 0.01)
})

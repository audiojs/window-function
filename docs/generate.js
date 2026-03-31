/**
 * Generate scientific SVG plots (time domain + frequency response) for all windows.
 * Run: node docs/generate.js
 */
import * as w from '../index.js'
import fft from 'fourier-transform'
import { writeFileSync, mkdirSync } from 'node:fs'

let N = 256, NFFT = 4096

// Layout — viewBox only, no fixed width/height, scales to container
let W = 800, H = 230
let L = { x: 42, y: 8, w: 335, h: 174 }    // left panel (time)
let R = { x: 450, y: 8, w: 335, h: 174 }    // right panel (freq)

// Palette
let CLR = '#4a90d9', GRID = '#e5e7eb', AXIS = '#d1d5db', TXT = '#6b7280'

let wins = [
	'rectangular', 'triangular', 'bartlett', 'welch', 'connes',
	'hann', 'hamming', 'cosine', 'blackman', 'exactBlackman',
	'nuttall', 'blackmanNuttall', 'blackmanHarris', 'flatTop',
	'bartlettHann', 'lanczos', 'parzen', 'bohman',
	'kaiser', 'gaussian', 'generalizedNormal', 'tukey', 'planckTaper',
	'powerOfSine', 'exponential', 'hannPoisson', 'cauchy',
	'rifeVincent', 'confinedGaussian',
	'kaiserBesselDerived', 'dolphChebyshev', 'taylor', 'dpss', 'ultraspherical'
]

mkdirSync('docs/plots', { recursive: true })

for (let name of wins) {
	let samples = w.generate(w[name], N)

	// Compute FFT magnitude in dB
	let padded = new Float64Array(NFFT)
	for (let i = 0; i < N; i++) padded[i] = samples[i]
	let mag = fft(padded)
	let peak = 0
	for (let i = 0; i < mag.length; i++) if (mag[i] > peak) peak = mag[i]
	let db = new Float64Array(mag.length)
	for (let i = 0; i < mag.length; i++) db[i] = 20 * Math.log10(Math.max(mag[i] / peak, 1e-15))

	// Time-domain y-range (handle windows that go negative like flatTop, dolphChebyshev)
	let tMax = 0, tMin = 0
	for (let i = 0; i < N; i++) { if (samples[i] > tMax) tMax = samples[i]; if (samples[i] < tMin) tMin = samples[i] }
	let yTop = tMax <= 1.1 ? 1 : Math.ceil(tMax)
	let yBot = tMin >= -0.01 ? 0 : Math.floor(tMin * 2) / 2 // round down to nearest 0.5
	let yTicks = tMax <= 1.1 && tMin >= -0.01 ? [0, 0.5, 1] : []
	if (!yTicks.length) for (let y = yBot; y <= yTop; y += yTop > 2 ? 1 : 0.5) yTicks.push(Math.round(y * 10) / 10)

	let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" style="font-family:system-ui,-apple-system,sans-serif">\n`

	svg += panel(L, samples, 0, 1, yBot, yTop, [0, 0.5, 1], yTicks, true)
	svg += panel(R, db, 0, 0.5, -120, 0, [0, 0.1, 0.2, 0.3, 0.4, 0.5], [0, -40, -80, -120], false)

	// Axis labels
	svg += `  <text x="${L.x + L.w / 2}" y="${L.y + L.h + 32}" text-anchor="middle" font-size="11" fill="${TXT}">n / N</text>\n`
	svg += `  <text x="${R.x + R.w / 2}" y="${R.y + R.h + 32}" text-anchor="middle" font-size="11" fill="${TXT}">Normalized frequency (\u00d7 F\u209b)</text>\n`

	svg += `</svg>\n`
	writeFileSync(`docs/plots/${name}.svg`, svg)
}

console.log(`${wins.length} SVGs → docs/plots/`)

// ── Panel renderer ──

function panel (p, data, xMin, xMax, yMin, yMax, xTicks, yTicks, fill) {
	let xR = xMax - xMin, yR = yMax - yMin
	let sx = v => p.x + ((v - xMin) / xR) * p.w
	let sy = v => p.y + p.h - ((Math.max(yMin, Math.min(yMax, v)) - yMin) / yR) * p.h
	let s = ''

	// Grid — horizontal
	for (let yt of yTicks) {
		let y = sy(yt).toFixed(1)
		s += `  <line x1="${p.x}" y1="${y}" x2="${p.x + p.w}" y2="${y}" stroke="${GRID}" stroke-width="0.7"/>\n`
		s += `  <text x="${p.x - 5}" y="${(+y + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="${TXT}">${yt}</text>\n`
	}

	// Grid — vertical
	for (let xt of xTicks) {
		let x = sx(xt).toFixed(1)
		s += `  <line x1="${x}" y1="${p.y}" x2="${x}" y2="${p.y + p.h}" stroke="${GRID}" stroke-width="0.7"/>\n`
		s += `  <text x="${x}" y="${p.y + p.h + 16}" text-anchor="middle" font-size="10" fill="${TXT}">${xt}</text>\n`
	}

	// L-shaped axes
	s += `  <line x1="${p.x}" y1="${p.y}" x2="${p.x}" y2="${p.y + p.h}" stroke="${AXIS}" stroke-width="1"/>\n`
	s += `  <line x1="${p.x}" y1="${p.y + p.h}" x2="${p.x + p.w}" y2="${p.y + p.h}" stroke="${AXIS}" stroke-width="1"/>\n`

	// Polyline
	let pts = ''
	let n = data.length
	for (let i = 0; i < n; i++) {
		let xv = xMin + (i / (n - 1)) * xR
		pts += ` ${sx(xv).toFixed(1)},${sy(data[i]).toFixed(1)}`
	}

	// Area fill (time domain only)
	if (fill) {
		let base = sy(0).toFixed(1)
		s += `  <path d="M${sx(xMin).toFixed(1)},${base}${pts} L${sx(xMax).toFixed(1)},${base} Z" fill="${CLR}" fill-opacity="0.06"/>\n`
	}

	s += `  <polyline points="${pts.trim()}" fill="none" stroke="${CLR}" stroke-width="1.5" stroke-linejoin="round"/>\n`
	return s
}

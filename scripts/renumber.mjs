// One-shot script to renumber Eyebrow section labels and PageNum n props
// after reordering the deck. Uses two-phase placeholder replacement to avoid
// collisions when swapping numbers (e.g., 4↔5).
import { promises as fs } from 'node:fs';
import path from 'node:path';

const file = path.resolve('slides/claritx-pitch-v5/index.tsx');
let s = await fs.readFile(file, 'utf8');

// New order (slide variable → new position 1-indexed):
// 1 Cover, 2 Underperformance, 3 Pain, 4 Finfluencer, 5 Competitive,
// 6 WhyNow, 7 Market, 8 AdvisorTam, 9 AdvisorComparison, 10 MagnifiComp,
// 11 AIMoat, 12 VisionFuture, 13 ProductVerdict, 14 Portfolio,
// 15 RiskPersonality, 16 FlywheelSlide, 17 Monetization,
// 18 Pricing, 19 Funds, 20 Roadmap, 21 Team, 22 Philosophy,
// 23 Ask, 24 Closing

// old → new (only the slides whose position changed)
const sectionMap = {
  '04': '05', // Competitive 4→5
  '05': '04', // Finfluencer 5→4
  '06': '11', // AIMoat 6→11
  '07': '13', // ProductVerdict 7→13
  '08': '14', // Portfolio 8→14
  '09': '15', // RiskPersonality 9→15
  '10': '16', // FlywheelSlide 10→16
  '11': '17', // Monetization 11→17
  '12': '06', // WhyNow 12→6
  '13': '07', // Market 13→7
  '14': '08', // AdvisorTam 14→8
  '15': '09', // AdvisorComparison 15→9
  '16': '12', // VisionFuture 16→12
  '17': '10', // MagnifiComp 17→10
};

// Numeric form (without zero-pad) for PageNum n={X}
const pageNumMap = Object.fromEntries(
  Object.entries(sectionMap).map(([a, b]) => [String(parseInt(a, 10)), String(parseInt(b, 10))])
);

// Phase 1: tag all current values with TMP placeholder
for (const old of Object.keys(sectionMap)) {
  s = s.replaceAll(`"${old} / 24"`, `"TMP${old} / 24"`);
}
for (const old of Object.keys(pageNumMap)) {
  // Use word-boundary-style guard: PageNum n={X} where X is exact
  s = s.replaceAll(`PageNum n={${old}}`, `PageNum n={TMP${old}}`);
}

// Phase 2: replace placeholders with NEW values
for (const [old, neu] of Object.entries(sectionMap)) {
  s = s.replaceAll(`"TMP${old} / 24"`, `"${neu} / 24"`);
}
for (const [old, neu] of Object.entries(pageNumMap)) {
  s = s.replaceAll(`PageNum n={TMP${old}}`, `PageNum n={${neu}}`);
}

await fs.writeFile(file, s);
console.log('✓ Renumbered Eyebrow sections + PageNum props');

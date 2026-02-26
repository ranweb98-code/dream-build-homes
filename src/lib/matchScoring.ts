import { Property } from '@/types/property';
import { MatchPreferences, ScoredProperty } from '@/types/match';

function bedroomCount(label: string): number {
  if (label === 'Studio') return 0;
  if (label === '4+ Bedrooms') return 4;
  return parseInt(label) || 0;
}

function bathCount(label: string): number {
  if (label === '2+') return 2;
  return parseFloat(label) || 1;
}

export function scoreProperties(
  properties: Property[],
  prefs: MatchPreferences
): ScoredProperty[] {
  const [minBudget, maxBudget] = prefs.budget;
  const targetBeds = bedroomCount(prefs.bedrooms);
  const targetBaths = bathCount(prefs.bathrooms);

  const scored = properties
    .filter((p) => p.status === 'for_sale')
    .map((property) => {
      let score = 0;
      const reasons: string[] = [];

      // Budget fit (0-35 points)
      if (property.price >= minBudget && property.price <= maxBudget) {
        score += 35;
        reasons.push('Within your budget range');
      } else if (property.price < minBudget) {
        score += 25;
        reasons.push('Under budget — more room for upgrades');
      } else if (property.price <= maxBudget * 1.15) {
        score += 15;
        reasons.push('Slightly above budget but worth considering');
      }

      // Bedroom match (0-20 points)
      const bedDiff = Math.abs(property.rooms - targetBeds);
      if (bedDiff === 0) {
        score += 20;
        reasons.push(`Exact ${prefs.bedrooms} match`);
      } else if (bedDiff === 1) {
        score += 12;
      }

      // Bathroom match (0-15 points)
      const bathDiff = Math.abs(property.baths - targetBaths);
      if (bathDiff === 0) {
        score += 15;
        reasons.push('Perfect bathroom count');
      } else if (bathDiff <= 0.5) {
        score += 10;
      }

      // Size scoring based on style (0-15 points)
      if (prefs.style === 'Compact & Affordable' || prefs.style === 'Tiny Home Style') {
        if (property.size <= 1000) { score += 15; reasons.push('Compact footprint you prefer'); }
        else if (property.size <= 1400) score += 8;
      } else if (prefs.style === 'Modern Luxury' || prefs.style === 'High-End Designer') {
        if (property.size >= 1800) { score += 15; reasons.push('Spacious luxury layout'); }
        else if (property.size >= 1400) score += 8;
      } else {
        if (property.size >= 1000 && property.size <= 2000) { score += 12; reasons.push('Great size for your needs'); }
      }

      // Priority bonuses (0-15 points)
      if (prefs.priorities.includes('Lowest Price') && property.price <= minBudget + (maxBudget - minBudget) * 0.3) {
        score += 8; reasons.push('Among the most affordable options');
      }
      if (prefs.priorities.includes('Largest Space') && property.size >= 1600) {
        score += 8; reasons.push('Extra spacious living area');
      }
      if (prefs.priorities.includes('Best Value') && property.price > 0 && property.size > 0) {
        const pricePerSqft = property.price / property.size;
        if (pricePerSqft < 80) { score += 8; reasons.push('Excellent price per square foot'); }
      }

      // Cap at 100
      score = Math.min(score, 100);

      // Financing estimates (30-year, 7% rate)
      const rate = 0.07 / 12;
      const n = 360;
      const downPayment = Math.round(property.price * 0.1);
      const loan = property.price - downPayment;
      const monthlyPayment = loan > 0
        ? Math.round((loan * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1))
        : 0;

      return { property, score, reasons, monthlyPayment, downPayment };
    })
    .sort((a, b) => b.score - a.score);

  return scored;
}

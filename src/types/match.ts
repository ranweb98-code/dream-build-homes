export interface MatchPreferences {
  budget: [number, number];
  use: string;
  bedrooms: string;
  bathrooms: string;
  climate: string;
  style: string;
  priorities: string[];
}

export interface ScoredProperty {
  property: import('./property').Property;
  score: number;
  reasons: string[];
  monthlyPayment: number;
  downPayment: number;
}

export const BUDGET_OPTIONS = [
  { label: 'Under $50K', range: [20000, 50000] as [number, number] },
  { label: '$50K–$100K', range: [50000, 100000] as [number, number] },
  { label: '$100K–$150K', range: [100000, 150000] as [number, number] },
  { label: '$150K–$250K', range: [150000, 250000] as [number, number] },
  { label: '$250K+', range: [250000, 500000] as [number, number] },
];

export const USE_OPTIONS = [
  'Primary Residence',
  'Vacation Home',
  'Rental Investment',
  'Guest House / Backyard Unit',
  'Retirement Living',
];

export const BEDROOM_OPTIONS = ['Studio', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4+ Bedrooms'];
export const BATHROOM_OPTIONS = ['1', '1.5', '2', '2+'];

export const CLIMATE_OPTIONS = [
  'Warm Climate (FL, TX, AZ)',
  'Moderate Climate',
  'Cold / Snow Areas',
  'Coastal',
  'Rural Land',
  'Mobile Home Park',
];

export const STYLE_OPTIONS = [
  'Modern Luxury',
  'Family Friendly',
  'Compact & Affordable',
  'Eco-Friendly',
  'Tiny Home Style',
  'High-End Designer',
];

export const PRIORITY_OPTIONS = [
  'Lowest Price',
  'Best Value',
  'Largest Space',
  'Energy Efficiency',
  'Fast Delivery',
  'Premium Materials',
  'Smart Home Features',
];

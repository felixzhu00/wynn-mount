import { StatName, MaterialType } from '../types';

export const STAT_NAMES: StatName[] = [
  'speed',
  'acceleration',
  'altitude',
  'energy',
  'handling',
  'toughness',
  'boost',
  'training',
];

export const MATERIAL_LEVELS: number[] = [
  1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 105, 110, 115
];

export const MATERIAL_TYPES = [
  'ingot', 'gem', 'wood', 'paper', 'string', 'grains', 'oil', 'meat'
] as const;

export type MaterialCategory = 'ore' | 'log' | 'crop' | 'fish';

// Maps a specific MaterialType to its category pair
export const getCategoryForType = (type: MaterialType): MaterialCategory => {
  switch (type) {
    case 'ingot':
    case 'gem':
      return 'ore';
    case 'wood':
    case 'paper':
      return 'log';
    case 'string':
    case 'grains':
      return 'crop';
    case 'oil':
    case 'meat':
      return 'fish';
  }
};

// Define the prefixes for each level and category pair
export const MATERIAL_PREFIXES: Record<number, Record<MaterialCategory, string>> = {
  1:   { ore: 'Copper',      log: 'Oak',     crop: 'Wheat',  fish: 'Gudgeon' },
  10:  { ore: 'Granite',     log: 'Birch',   crop: 'Barley', fish: 'Trout' },
  20:  { ore: 'Gold',        log: 'Willow',  crop: 'Oat',    fish: 'Salmon' },
  30:  { ore: 'Sandstone',   log: 'Acacia',  crop: 'Malt',   fish: 'Carp' },
  40:  { ore: 'Iron',        log: 'Spruce',  crop: 'Hops',   fish: 'Icefish' },
  50:  { ore: 'Silver',      log: 'Jungle',  crop: 'Rye',    fish: 'Piranha' },
  60:  { ore: 'Cobalt',      log: 'Dark',    crop: 'Millet', fish: 'Koi' },
  70:  { ore: 'Kanderstone', log: 'Light',   crop: 'Decay',  fish: 'Gylia' },
  80:  { ore: 'Diamond',     log: 'Pine',    crop: 'Rice',   fish: 'Bass' },
  90:  { ore: 'Molten',      log: 'Avo',     crop: 'Sorghum',fish: 'Molten' },
  100: { ore: 'Voidstone',   log: 'Sky',     crop: 'Hemp',   fish: 'Starfish' },
  105: { ore: 'Dernic',      log: 'Dernic',  crop: 'Dernic', fish: 'Dernic' },
  110: { ore: 'Titanium',    log: 'Maple',   crop: 'Jute',   fish: 'Sturgeon' },
  115: { ore: 'Cinnabar',    log: 'Redwood', crop: 'Heather',fish: 'Mahseer' }
};

export const getMaterialName = (level: number, type: MaterialType): string => {
  const category = getCategoryForType(type);
  const prefix = MATERIAL_PREFIXES[level]?.[category] || `Lvl ${level}`;
  // Capitalize the material type for the suffix
  const suffix = type.charAt(0).toUpperCase() + type.slice(1);
  return `${prefix} ${suffix}`;
};

export const VALID_STATS_PER_MATERIAL: Record<MaterialType, StatName[]> = {
  ingot: ['toughness', 'energy'],
  gem: ['training', 'speed', 'energy'],
  wood: ['acceleration', 'toughness', 'speed'],
  paper: ['altitude', 'boost'],
  string: ['boost', 'handling', 'acceleration'],
  grains: ['speed', 'altitude'],
  oil: ['handling', 'training', 'altitude'],
  meat: ['energy', 'acceleration']
};

export const STAT_COLORS: Record<StatName, { text: string; bg: string }> = {
  speed: { text: 'text-yellow-500', bg: 'bg-yellow-950/20' },
  acceleration: { text: 'text-cyan-400', bg: 'bg-cyan-950/20' },
  altitude: { text: 'text-neutral-400', bg: 'bg-neutral-900/40' },
  energy: { text: 'text-green-500', bg: 'bg-green-950/20' },
  handling: { text: 'text-red-500', bg: 'bg-red-950/20' },
  toughness: { text: 'text-neutral-500', bg: 'bg-neutral-950/60' },
  boost: { text: 'text-pink-500', bg: 'bg-pink-950/20' },
  training: { text: 'text-orange-500', bg: 'bg-orange-950/20' },
};

export const ICON_SIZE = 32;
export const GRID_SIZE = 16;

export const MATERIAL_ICON_MAP: Record<MaterialType, Record<number, { row: number; col: number }>> = {
    ingot: {
    1: { row: 0, col: 13 }, 10: { row: 1, col: 0 }, 20: { row: 1, col: 3 }, 30: { row: 1, col: 6 }, 40: { row: 1, col: 9 },
    50: { row: 1, col: 12 }, 60: { row: 1, col: 15 }, 70: { row: 2, col: 2 }, 80: { row: 2, col: 5 }, 90: { row: 2, col: 8 },
    100: { row: 2, col: 11 }, 105: { row: 2, col: 14 }, 110: { row: 3, col: 1 }, 115: { row: 3, col: 4 }
  },
  gem: {
    1: { row: 0, col: 14 }, 10: { row: 1, col: 1 }, 20: { row: 1, col: 4 }, 30: { row: 1, col: 7 }, 40: { row: 1, col: 10 },
    50: { row: 1, col: 13 }, 60: { row: 2, col: 0 }, 70: { row: 2, col: 3 }, 80: { row: 2, col: 6 }, 90: { row: 2, col: 9 },
    100: { row: 2, col: 12 }, 105: { row: 2, col: 15 }, 110: { row: 3, col: 2 }, 115: { row: 3, col: 5 }
  },
  wood: {
    1: { row: 3, col: 13 }, 10: { row: 4, col: 0 }, 20: { row: 4, col: 3 }, 30: { row: 4, col: 6 }, 40: { row: 4, col: 9 },
    50: { row: 4, col: 12 }, 60: { row: 4, col: 15 }, 70: { row: 5, col: 2 }, 80: { row: 5, col: 5 }, 90: { row: 5, col: 8 },
    100: { row: 5, col: 11 }, 105: { row: 5, col: 14 }, 110: { row: 6, col: 1 }, 115: { row: 6, col: 4 }
  },
  paper: {
    1: { row: 3, col: 14 }, 10: { row: 4, col: 1 }, 20: { row: 4, col: 4 }, 30: { row: 4, col: 7 }, 40: { row: 4, col: 10 },
    50: { row: 4, col: 13 }, 60: { row: 5, col: 0 }, 70: { row: 5, col: 3 }, 80: { row: 5, col: 6 }, 90: { row: 5, col: 9 },
    100: { row: 5, col: 12 }, 105: { row: 5, col: 15 }, 110: { row: 6, col: 2 }, 115: { row: 6, col: 5 }
  },
  string: {
    1: { row: 6, col: 13 }, 10: { row: 7, col: 0 }, 20: { row: 7, col: 3 }, 30: { row: 7, col: 6 }, 40: { row: 7, col: 9 },
    50: { row: 7, col: 12 }, 60: { row: 7, col: 15 }, 70: { row: 8, col: 2 }, 80: { row: 8, col: 5 }, 90: { row: 8, col: 8 },
    100: { row: 8, col: 11 }, 105: { row: 8, col: 14 }, 110: { row: 9, col: 1 }, 115: { row: 9, col: 4 }
  },
  grains: {
    1: { row: 6, col: 14 }, 10: { row: 7, col: 1 }, 20: { row: 7, col: 4 }, 30: { row: 7, col: 7 }, 40: { row: 7, col: 10 },
    50: { row: 7, col: 13 }, 60: { row: 8, col: 0 }, 70: { row: 8, col: 3 }, 80: { row: 8, col: 6 }, 90: { row: 8, col: 9 },
    100: { row: 8, col: 12 }, 105: { row: 8, col: 15 }, 110: { row: 9, col: 2 }, 115: { row: 9, col: 5 }
  },
  oil: {
    1: { row: 9, col: 13 }, 10: { row: 10, col: 0 }, 20: { row: 10, col: 3 }, 30: { row: 10, col: 6 }, 40: { row: 10, col: 9 },
    50: { row: 10, col: 12 }, 60: { row: 10, col: 15 }, 70: { row: 11, col: 2 }, 80: { row: 11, col: 5 }, 90: { row: 11, col: 8 },
    100: { row: 11, col: 11 }, 105: { row: 11, col: 14 }, 110: { row: 12, col: 1 }, 115: { row: 12, col: 4 }
  },
  meat: {
    1: { row: 9, col: 14 }, 10: { row: 10, col: 1 }, 20: { row: 10, col: 4 }, 30: { row: 10, col: 7 }, 40: { row: 10, col: 10 },
    50: { row: 10, col: 13 }, 60: { row: 11, col: 0 }, 70: { row: 11, col: 3 }, 80: { row: 11, col: 6 }, 90: { row: 11, col: 9 },
    100: { row: 11, col: 12 }, 105: { row: 11, col: 15 }, 110: { row: 12, col: 2 }, 115: { row: 12, col: 5 }
  }
};

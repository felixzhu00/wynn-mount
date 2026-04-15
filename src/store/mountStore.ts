import { atom } from 'jotai';
import { MountStat, StatName, SavedMount, SolverResult } from '../types';
import { STAT_NAMES } from '../lib/constants';

// Initialize default stats
const initialStats = STAT_NAMES.reduce((acc, stat) => {
  acc[stat] = { name: stat, limitLevel: 20, maxLevel: 30 };
  return acc;
}, {} as Record<StatName, MountStat>);

export const isAppReadyAtom = atom<boolean>(false);
export const mountsListAtom = atom<SavedMount[]>([]);
export const activeMountIdAtom = atom<number | null>(null);

export const currentLevelAtom = atom<number>(1);
export const mountStatsAtom = atom<Record<StatName, MountStat>>(initialStats);

// Solver State
export const isCalculatingAtom = atom<boolean>(false);
export const solverResultAtom = atom<SolverResult | null>(null);

// Bulk Modal State
export const isBulkModalOpenAtom = atom<boolean>(false);
export const bulkModalTabAtom = atom<'import' | 'export'>('import');


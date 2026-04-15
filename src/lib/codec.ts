import { MountStat, StatName, SavedMount } from '../types';
import { STAT_NAMES } from './constants';

/**
 * Encodes the current level and 8 stat targets into a compact, URL-safe Base64 string.
 * Format: [currentLevel, limitLevel1, maxLevel1, limitLevel2, maxLevel2, ...]
 */
export function encodeMountData(currentLevel: number, stats: Record<StatName, MountStat>): string {
  const data = [currentLevel];
  
  STAT_NAMES.forEach(stat => {
    data.push(stats[stat].limitLevel);
    data.push(stats[stat].maxLevel);
  });

  const joined = data.join('.');
  return btoa(joined);
}

/**
 * Decodes a Base64 string back into currentLevel and a stats object.
 */
export function decodeMountData(encoded: string): { currentLevel: number; stats: Record<StatName, MountStat> } | null {
  try {
    const decodedStr = atob(encoded);
    const parts = decodedStr.split('.').map(Number);
    
    if (parts.length !== 1 + STAT_NAMES.length * 2 || parts.some(isNaN)) {
      return null;
    }

    const currentLevel = parts[0];
    const stats = {} as Record<StatName, MountStat>;
    
    STAT_NAMES.forEach((stat, index) => {
      stats[stat] = {
        name: stat,
        limitLevel: parts[1 + index * 2],
        maxLevel: parts[2 + index * 2]
      };
    });

    return { currentLevel, stats };
  } catch {
    return null;
  }
}

/**
 * Encodes an array of mounts into a single bulk string.
 * Format: name|lvl.l1.m1...;name|lvl.l1.m1...
 */
export function encodeAllMounts(mounts: SavedMount[]): string {
  const mountStrings = mounts.map(m => {
    const data = [m.currentLevel];
    STAT_NAMES.forEach(stat => {
      data.push(m.stats[stat].limitLevel);
      data.push(m.stats[stat].maxLevel);
    });
    return `${m.name}|${data.join('.')}`;
  });
  return btoa(mountStrings.join(';'));
}

/**
 * Decodes a bulk string back into an array of SavedMount objects.
 */
export function decodeAllMounts(encoded: string): SavedMount[] | null {
  try {
    const decodedStr = atob(encoded);
    const mountParts = decodedStr.split(';');
    const results: SavedMount[] = [];

    for (const part of mountParts) {
      const [name, dataStr] = part.split('|');
      if (!name || !dataStr) return null;

      const parts = dataStr.split('.').map(Number);
      if (parts.length !== 1 + STAT_NAMES.length * 2 || parts.some(isNaN)) {
        return null;
      }

      const currentLevel = parts[0];
      const stats = {} as Record<StatName, MountStat>;
      STAT_NAMES.forEach((stat, index) => {
        stats[stat] = {
          name: stat,
          limitLevel: parts[1 + index * 2],
          maxLevel: parts[2 + index * 2]
        };
      });

      results.push({ name, currentLevel, stats });
    }

    return results;
  } catch {
    return null;
  }
}

/**
 * Validates if an object is an array of SavedMount objects.
 */
export function validateMountJson(json: unknown): SavedMount[] | null {
  if (!Array.isArray(json)) return null;
  
  const results: SavedMount[] = [];
  for (const m of json) {
    if (!m || typeof m !== 'object') return null;
    const mount = m as Record<string, unknown>;
    
    if (typeof mount.name !== 'string' || typeof mount.currentLevel !== 'number' || !mount.stats || typeof mount.stats !== 'object' || mount.stats === null) {
      return null;
    }
    
    const stats = mount.stats as Record<string, Record<string, unknown>>;
    
    // Check if all STAT_NAMES exist in m.stats
    for (const stat of STAT_NAMES) {
      const s = stats[stat];
      if (!s || typeof s !== 'object' || typeof s.limitLevel !== 'number' || typeof s.maxLevel !== 'number') {
        return null;
      }
    }
    
    results.push({
      name: mount.name,
      currentLevel: mount.currentLevel,
      stats: mount.stats as Record<StatName, MountStat>
    });
  }
  
  return results;
}

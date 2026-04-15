import { atom } from 'jotai';
import { MaterialData, MaterialPreset } from '../types';
import defaultMaterials from '../data/materials.json';

export const isMatrixReadyAtom = atom<boolean>(false);
export const presetsListAtom = atom<MaterialPreset[]>([]);
export const activePresetIdAtom = atom<number | null>(null);

export const activeMatrixDataAtom = atom<MaterialData>(defaultMaterials as unknown as MaterialData);
export const activeLevelTabAtom = atom<number>(1);

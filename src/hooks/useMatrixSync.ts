import { useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  isMatrixReadyAtom,
  presetsListAtom,
  activePresetIdAtom,
  activeMatrixDataAtom
} from '../store/matrixStore';
import { getAllPresets, createNewPreset, updatePreset } from '../db';
import { MaterialPreset, MaterialData } from '../types';
import defaultMaterials from '../data/materials.json';

export function useMatrixSync() {
  const [isMatrixReady, setIsMatrixReady] = useAtom(isMatrixReadyAtom);
  const [presetsList, setPresetsList] = useAtom(presetsListAtom);
  const [activePresetId, setActivePresetId] = useAtom(activePresetIdAtom);
  const [matrixData, setMatrixData] = useAtom(activeMatrixDataAtom);

  // Initialize DB data on mount
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const presets = await getAllPresets();
      if (!mounted) return;

      let active: MaterialPreset;

      if (presets.length === 0) {
        // Create the initial preset using the bundled JSON
        active = await createNewPreset('Custom Default', defaultMaterials as unknown as MaterialData);
        setPresetsList([active]);
      } else {
        setPresetsList(presets);
        // Default to the first preset for now
        active = presets[0];
      }

      setActivePresetId(active.id!);
      setMatrixData(active.data);
      setIsMatrixReady(true);
    };

    init();
    return () => { mounted = false; };
  }, [setIsMatrixReady, setPresetsList, setActivePresetId, setMatrixData]);

  // Sync to DB when matrix data changes (auto-save)
  useEffect(() => {
    if (!isMatrixReady || !activePresetId) return;

    const timer = setTimeout(() => {
      updatePreset(activePresetId, {
        data: matrixData,
      }).then(() => {
        // Also update the preset in the list
        setPresetsList((prev) => 
          prev.map(p => p.id === activePresetId ? { ...p, data: matrixData } : p)
        );
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [matrixData, activePresetId, isMatrixReady, setPresetsList]);

  return {
    isMatrixReady,
    presetsList,
    activePresetId,
    matrixData,
    setMatrixData
  };
}

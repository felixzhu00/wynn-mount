import React, { useRef, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { isCalculatingAtom, solverResultAtom } from '../store/mountStore';
import { STAT_NAMES, STAT_COLORS } from '../lib/constants';
import { StatName, SolverResult, SavedMount, MountStat } from '../types';
import { useMatrixSync } from '../hooks/useMatrixSync';
import { useMountSync } from '../hooks/useMountSync';
import { SolverPayload } from '../solver.worker';
import { Trash2, Zap, Play, Settings, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { EditableText } from './EditableText';
import { MountForm } from './MountForm';

export function BentoMountManager() {
  const { mountsList, activeMountId, switchMount, removeMount, renameMount, updateAnyMount, addMount } = useMountSync();
  const [isCalculating, setIsCalculating] = useAtom(isCalculatingAtom);
  const [, setSolverResult] = useAtom(solverResultAtom);

  const { matrixData } = useMatrixSync();
  const workerRef = useRef<Worker | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(mountsList.length / pageSize);

  // Edit modal state
  const [editingMount, setEditingMount] = useState<SavedMount | null>(null);

  // Reset to page 1 if list shrinks and current page is empty
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [mountsList.length, totalPages, currentPage]);

  const paginatedMounts = mountsList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleStatChange = (mount: SavedMount, statName: StatName, field: 'limitLevel' | 'maxLevel', value: string) => {
    const val = parseInt(value, 10);
    const updatedStats = {
      ...mount.stats,
      [statName]: {
        ...mount.stats[statName],
        [field]: !isNaN(val) ? val : 0,
      },
    };
    updateAnyMount(mount.id!, { stats: updatedStats });
  };

  const handleLevelChange = (mount: SavedMount, value: string) => {
    const val = parseInt(value, 10);
    updateAnyMount(mount.id!, { currentLevel: !isNaN(val) ? val : 0 });
  };

  const runCalculation = (mount: SavedMount) => {
    if (isCalculating) return;

    // Ensure we switch to this mount if it's not active
    if (activeMountId !== mount.id) {
      switchMount(mount.id!);
    }

    setIsCalculating(true);
    setSolverResult(null);

    workerRef.current?.terminate();
    workerRef.current = new Worker(new URL('../solver.worker.ts', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (e: MessageEvent<SolverResult>) => {
      setSolverResult(e.data);
      setIsCalculating(false);
      workerRef.current?.terminate();
      workerRef.current = null;
    };

    workerRef.current.onerror = (err) => {
      console.error("Worker error:", err);
      setIsCalculating(false);
      workerRef.current?.terminate();
      workerRef.current = null;
    };

    const payload: SolverPayload = {
      currentLevel: mount.currentLevel,
      stats: mount.stats,
      matrixData
    };

    workerRef.current.postMessage(payload);
  };

  return (
    <div className="w-full bg-black border border-neutral-800 rounded-lg overflow-hidden flex flex-col shadow-2xl">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-white rounded-full"></div>
          <h2 className="text-lg font-bold tracking-tight uppercase">Mount Configuration</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium border-r border-neutral-800 pr-4">
            <Zap size={14} />
            <span>Active: <span className="text-white font-bold">{mountsList.find(m => m.id === activeMountId)?.name}</span></span>
          </div>
          <button 
            onClick={addMount}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-[10px] font-bold uppercase rounded hover:bg-neutral-200 transition-colors"
          >
            <Plus size={12} strokeWidth={3} /> Add Mount
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-neutral-900 text-[10px] uppercase font-bold text-neutral-500 tracking-wider border-b border-neutral-800">
              <th className="p-3 border-r border-neutral-800 w-40">Name</th>
              <th className="p-3 border-r border-neutral-800 w-24">Highest Lvl</th>
              <th className="p-3 border-r border-neutral-800 w-16 text-center">Type</th>
              {STAT_NAMES.map(stat => (
                <th key={stat} className={`p-3 border-r border-neutral-800 text-center capitalize w-20 ${STAT_COLORS[stat].text} ${STAT_COLORS[stat].bg}`}>
                  {stat}
                </th>
              ))}
              <th className="p-3 text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {paginatedMounts.map((mount) => {
              const isActive = activeMountId === mount.id;

              return (
                <React.Fragment key={mount.id}>
                  {/* First Row: Limit Levels */}
                  <tr className={`group transition-colors ${isActive ? 'bg-white/5' : 'hover:bg-neutral-900/40'}`}>
                    <td rowSpan={2} className="p-3 border-r border-neutral-800 align-top">
                      <div className="flex flex-col gap-1">
                        <EditableText 
                          value={mount.name} 
                          onSave={(newName) => renameMount(mount.id!, newName)} 
                          className="font-bold text-white text-sm"
                        />
                        {isActive && (
                          <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Currently Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td rowSpan={2} className="p-3 border-r border-neutral-800 align-top">
                      <input
                        type="number"
                        min="1"
                        value={mount.currentLevel || ''}
                        onChange={(e) => handleLevelChange(mount, e.target.value)}
                        className="w-full bg-black/40 border border-neutral-800 text-white text-sm px-2 py-1 rounded focus:outline-none focus:border-white transition-colors font-mono font-bold"
                      />
                    </td>
                    <td className="p-1 px-2 border-r border-neutral-800 text-[9px] font-bold text-neutral-600 uppercase text-center bg-neutral-900/10">Limit</td>
                    {STAT_NAMES.map(stat => (
                      <td key={stat} className={`p-2 border-r border-neutral-800 text-center ${STAT_COLORS[stat].bg}`}>
                        <input
                          type="number"
                          value={mount.stats[stat].limitLevel}
                          onChange={(e) => handleStatChange(mount, stat, 'limitLevel', e.target.value)}
                          className={`w-full bg-transparent text-center focus:outline-none font-mono font-bold text-xs ${STAT_COLORS[stat].text}`}
                        />
                      </td>
                    ))}
                    <td rowSpan={2} className="p-3 align-middle">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => runCalculation(mount)}
                          disabled={isCalculating}
                          className={`flex items-center justify-center gap-2 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                            isActive 
                              ? 'bg-white text-black hover:bg-neutral-200' 
                              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white border border-neutral-700'
                          }`}
                        >
                          <Play size={12} fill={isActive ? "black" : "none"} />
                          Solve
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => !isActive && switchMount(mount.id!)}
                            disabled={isActive}
                            className={`flex-1 text-[9px] font-bold uppercase tracking-tight transition-colors py-1 rounded border ${
                              isActive
                                ? 'opacity-0 cursor-default border-transparent'
                                : 'text-neutral-500 hover:text-white bg-neutral-900/40 border-neutral-800'
                            }`}
                          >
                            Set Active
                          </button>
                          <button
                            onClick={() => setEditingMount(mount)}
                            className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                            title="Mount Settings"
                          >
                            <Settings size={14} />
                          </button>
                          {mountsList.length > 1 && (
                            <button
                              onClick={() => removeMount(mount.id!)}
                              className="p-1.5 text-neutral-700 hover:text-red-500 hover:bg-red-950/20 rounded transition-colors"
                              title="Delete Mount"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Second Row: Max Levels */}
                  <tr className={`transition-colors ${isActive ? 'bg-white/5' : 'hover:bg-neutral-900/40 border-b border-neutral-800/50'}`}>
                    <td className="p-1 px-2 border-r border-neutral-800 text-[9px] font-bold text-neutral-600 uppercase text-center bg-neutral-900/10">Max</td>
                    {STAT_NAMES.map(stat => (
                      <td key={stat} className={`p-2 border-r border-neutral-800 text-center ${STAT_COLORS[stat].bg}`}>
                        <input
                          type="number"
                          value={mount.stats[stat].maxLevel}
                          onChange={(e) => handleStatChange(mount, stat, 'maxLevel', e.target.value)}
                          className={`w-full bg-transparent text-center focus:outline-none font-mono font-bold text-xs ${STAT_COLORS[stat].text}`}
                        />
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })}

            {/* Empty rows to maintain fixed height */}
            {Array.from({ length: pageSize - paginatedMounts.length }).map((_, i) => (
              <React.Fragment key={`empty-${i}`}>
                <tr className="invisible pointer-events-none border-b border-transparent">
                  <td rowSpan={2} className="p-3 border-r border-transparent">
                    <div className="h-10"></div>
                  </td>
                  <td rowSpan={2} className="p-3 border-r border-transparent">
                    <div className="h-8"></div>
                  </td>
                  <td className="p-1 px-2 border-r border-transparent"><div className="h-6"></div></td>
                  {STAT_NAMES.map(stat => (
                    <td key={`empty-limit-${stat}-${i}`} className="p-2 border-r border-transparent"></td>
                  ))}
                  <td rowSpan={2} className="p-3">
                    <div className="h-[60px]"></div>
                  </td>
                </tr>
                <tr className="invisible pointer-events-none border-b border-transparent">
                  <td className="p-1 px-2 border-r border-transparent"><div className="h-6"></div></td>
                  {STAT_NAMES.map(stat => (
                    <td key={`empty-max-${stat}-${i}`} className="p-2 border-r border-transparent"></td>
                  ))}
                </tr>
              </React.Fragment>
            ))}

            {/* Pagination / Last Row Settings Row */}
            <tr className="bg-neutral-900/40">
              <td colSpan={13} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1 text-neutral-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2">
                        Page {currentPage} <span className="text-neutral-600">/</span> {totalPages || 1}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-1 text-neutral-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-tighter">
                      Showing {paginatedMounts.length} of {mountsList.length} mounts
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        const activeMount = mountsList.find(m => m.id === activeMountId);
                        if (activeMount) setEditingMount(activeMount);
                      }}
                      className="flex items-center gap-2 px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[10px] font-bold uppercase rounded border border-neutral-700 transition-all group"
                    >
                      <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" />
                      Active Mount Settings
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingMount && (
        <MountForm 
          mount={editingMount} 
          onClose={() => setEditingMount(null)}
          onSave={updateAnyMount}
        />
      )}
    </div>
  );
}


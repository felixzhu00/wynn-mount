import React from 'react';
import { useAtom } from 'jotai';
import { useMountSync } from '../hooks/useMountSync';
import { isBulkModalOpenAtom } from '../store/mountStore';
import { EditableText } from './EditableText';

export function Sidebar() {
  const { mountsList, activeMountId, switchMount, addMount, removeMount, renameMount, isAppReady } = useMountSync();
  const [, setIsBulkModalOpen] = useAtom(isBulkModalOpenAtom);

  if (!isAppReady) {
    return (
      <div className="w-64 h-full border-r border-neutral-800 bg-black flex flex-col p-4">
        <div className="animate-pulse bg-neutral-900 h-8 w-3/4 rounded mb-4"></div>
        <div className="animate-pulse bg-neutral-900 h-6 w-full rounded mb-2"></div>
        <div className="animate-pulse bg-neutral-900 h-6 w-full rounded mb-2"></div>
      </div>
    );
  }

  return (
    <div className="w-64 h-full border-r border-neutral-800 bg-black flex flex-col">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-tight text-white uppercase">Mounts</h2>
      </div>
      
      <div className="p-4 border-b border-neutral-800">
        <button
          type="button"
          onClick={addMount}
          className="w-full px-4 py-2 bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          + New Mount
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {mountsList.map((mount) => (
          <div
            key={mount.id}
            className={`group flex items-center justify-between px-3 py-2 cursor-pointer text-sm transition-colors border ${
              activeMountId === mount.id
                ? 'bg-neutral-900 text-white border-neutral-700'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border-transparent'
            }`}
            onClick={() => switchMount(mount.id!)}
          >
            <EditableText 
              value={mount.name} 
              onSave={(newName) => renameMount(mount.id!, newName)} 
            />
            {mountsList.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeMount(mount.id!);
                }}
                className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 focus:outline-none"
                aria-label="Delete mount"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-neutral-800">
        <button
          type="button"
          onClick={() => setIsBulkModalOpen(true)}
          className="w-full px-4 py-2 bg-white text-black text-sm font-bold uppercase hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          Export / Import Mounts
        </button>
      </div>
    </div>
  );
}

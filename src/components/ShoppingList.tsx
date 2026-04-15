import React from 'react';
import { useAtomValue } from 'jotai';
import { isCalculatingAtom, solverResultAtom } from '../store/mountStore';
import { getMaterialName } from '../lib/constants';
import { Icon } from './Icon';

export function ShoppingList() {
  const isCalculating = useAtomValue(isCalculatingAtom);
  const result = useAtomValue(solverResultAtom);

  if (isCalculating) {
    return (
      <div className="w-full p-6 bg-black border border-neutral-800 rounded-md flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-neutral-800 border-t-white rounded-full animate-spin"></div>
        <p className="text-neutral-400 text-sm">Calculating optimal materials...</p>
      </div>
    );
  }

  if (!result) return null;

  if (!result.feasible) {
    return (
      <div className="w-full p-6 bg-red-950/20 border border-red-900 rounded-md">
        <p className="text-red-400 font-medium">Calculation Failed</p>
        <p className="text-red-300 text-sm mt-2">
          It is impossible to reach the target stats with the current materials.
          Try increasing your Current Level or lowering the target Max Level.
        </p>
      </div>
    );
  }

  if (result.materials?.length === 0) {
    return (
      <div className="w-full p-6 bg-green-950/20 border border-green-900 rounded-md">
        <p className="text-green-400 font-medium">Target Reached!</p>
        <p className="text-green-300 text-sm mt-2">
          Your mount's Limit Level already meets or exceeds the target Max Level for all stats. No materials needed.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-black border border-neutral-800 rounded-md space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-white">Material List</h2>
        <div className="text-sm font-medium text-neutral-400">
          Total Materials: <span className="text-white ml-1">{result.totalMaterials}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-neutral-500 uppercase border-b border-neutral-800">
            <tr>
              <th className="py-3 px-4 font-medium">Material</th>
              <th className="py-3 px-4 font-medium">Type</th>
              <th className="py-3 px-4 font-medium text-right">Quantity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {result.materials?.map((mat, i) => (
              <tr key={i} className="hover:bg-neutral-900/50 transition-colors">
                <td className="py-2 px-4">
                  <div className="flex items-center gap-3">
                    <Icon type={mat.type} level={mat.level} scale={1} className="rounded" />
                    <span className="text-white font-medium">
                      {getMaterialName(mat.level, mat.type)}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-4 text-neutral-400 capitalize">
                  {mat.type} (Lvl {mat.level})
                </td>
                <td className="py-2 px-4 text-right text-white font-mono">
                  {mat.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

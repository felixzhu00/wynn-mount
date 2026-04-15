import solver, { Model } from 'javascript-lp-solver';
import { MaterialData, MaterialType, MountStat, StatName, SolverResult, SolverMaterialItem } from './types';

// The input payload to the worker
export interface SolverPayload {
  currentLevel: number;
  stats: Record<StatName, MountStat>;
  matrixData: MaterialData;
}

self.onmessage = (e: MessageEvent<SolverPayload>) => {
  const { currentLevel, stats, matrixData } = e.data;

  const model: Model = {
    optimize: 'totalMaterials',
    opType: 'min',
    constraints: {},
    variables: {},
    ints: {}
  };

  const statNames = Object.keys(stats) as StatName[];
  const requiredStats = new Set<StatName>();

  // 1. Setup Constraints
  statNames.forEach((stat) => {
    const diff = stats[stat].maxLevel - stats[stat].limitLevel;
    if (diff > 0) {
      model.constraints[stat] = { min: diff };
      requiredStats.add(stat);
    }
  });

  // If no stats required, immediate return
  if (requiredStats.size === 0) {
    const result: SolverResult = { feasible: true, totalMaterials: 0, materials: [] };
    self.postMessage(result);
    return;
  }

  // 2. Setup Variables
  const availableLevels = Object.keys(matrixData).map(Number).filter(l => !isNaN(l) && l <= currentLevel);
  const materialTypes: MaterialType[] = ['ingot', 'gem', 'wood', 'paper', 'string', 'grains', 'oil', 'meat'];

  availableLevels.forEach((level) => {
    const levelStr = level.toString();
    materialTypes.forEach((type) => {
      const yields = matrixData[levelStr]?.[type];
      if (!yields) return;

      // Check if this material provides ANY of the required stats
      let isUseful = false;
      const varData: Record<string, number> = { totalMaterials: 1 };
      
      statNames.forEach((stat) => {
        const val = yields[stat] || 0;
        if (val > 0) {
          varData[stat] = val;
          if (requiredStats.has(stat)) {
            isUseful = true;
          }
        }
      });

      if (isUseful) {
        const varName = `${level}_${type}`;
        model.variables[varName] = varData;
        model.ints![varName] = 1;
      }
    });
  });

  // 3. Run Solver
  const solution = solver.Solve(model);

  // 4. Parse Output
  if (!solution.feasible) {
    const result: SolverResult = { feasible: false };
    self.postMessage(result);
    return;
  }

  const materials: SolverMaterialItem[] = [];
  let totalMaterials = 0;

  Object.keys(solution).forEach((key) => {
    // Ignore internal solver keys
    if (key === 'feasible' || key === 'result' || key === 'bounded' || key === 'isIntegral') {
      return;
    }
    
    const qty = solution[key];
    if (typeof qty === 'number' && qty > 0) {
      const [lvlStr, typeStr] = key.split('_');
      materials.push({
        level: parseInt(lvlStr, 10),
        type: typeStr as MaterialType,
        quantity: qty
      });
      totalMaterials += qty;
    }
  });

  const result: SolverResult = {
    feasible: true,
    totalMaterials: Math.round(totalMaterials),
    materials
  };

  self.postMessage(result);
};

declare module 'javascript-lp-solver' {
  export interface Model {
    optimize: string;
    opType: 'max' | 'min';
    constraints: {
      [key: string]: {
        max?: number;
        min?: number;
        equal?: number;
      };
    };
    variables: {
      [key: string]: {
        [key: string]: number;
      };
    };
    ints?: {
      [key: string]: number;
    };
    binaries?: {
      [key: string]: number;
    };
  }

  export interface Solution {
    feasible: boolean;
    result: number;
    bounded: boolean;
    isIntegral?: boolean;
    [key: string]: number | boolean | undefined;
  }

  export function Solve(model: Model): Solution;
  
  const solver: {
    Solve: typeof Solve;
  };
  
  export default solver;
}

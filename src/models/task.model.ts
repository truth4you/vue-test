import { CurrencyValue } from './money.model'

export interface TaskFilter {
  keywords?: Array<string>;
  minBudget?: number;
  maxBudget?: number;
  platforms?: Array<string>;
}

export interface TaskInfo {
  id: string;
  title: string;
  description: string;
  budget: CurrencyValue;
  proposalCount: number;
  platforms: Array<string>;
}

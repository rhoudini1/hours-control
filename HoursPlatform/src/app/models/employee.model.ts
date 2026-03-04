import { Squad } from './squad.model';

export interface Employee {
  id: number;
  name: string;
  estimatedHours: number;
  squad: Squad;
}

export interface SquadReportResponse {
  name: string;
  description: string;
  hours: number;
  createdAt: string;
}

export interface SquadDetailsResponse {
  reports: SquadReportResponse[];
  totalHours: number;
  averageHours: number;
}

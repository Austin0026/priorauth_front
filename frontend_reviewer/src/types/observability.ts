export interface SystemMetrics {
  totalCasesProcessed: number;
  autoApprovalRate: number; // e.g. 76.4%
  rfiRate: number; // e.g. 14.2%
  denialRate: number; // e.g. 4.8%
  manualReviewRate: number; // e.g. 4.6%
  avgTurnaroundHours: number; // e.g. 4.2 hours
  slaComplianceRate: number; // e.g. 99.1%
  aiExtractionAvgLatencyMs: number; // e.g. 1840 ms
  deterministicRuleLatencyMs: number; // e.g. 42 ms
  dailyThroughput: { date: string; approved: number; pended: number; rfi: number; denied: number }[];
  topCptDistribution: { cpt: string; name: string; volume: number; passRate: number }[];
  reviewerOverrideStats: {
    totalOverrides: number;
    concurredCount: number;
    overriddenToApprove: number;
    overriddenToDeny: number;
  };
}

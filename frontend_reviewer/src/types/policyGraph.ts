export interface PolicyGraphNode {
  id: string;
  label: string;
  type: 'CPT' | 'LCD' | 'ARTICLE' | 'CRITERIA' | 'EVIDENCE' | 'OUTCOME';
  description?: string;
  status?: string;
  category?: string;
  data?: Record<string, any>;
}

export interface PolicyGraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'requires' | 'satisfies' | 'maps_to' | 'triggers';
}

export interface PolicyKnowledgeGraph {
  nodes: PolicyGraphNode[];
  edges: PolicyGraphEdge[];
  updatedAt: string;
  activeLcdCount: number;
  activeArticlesCount: number;
}

export interface CMSPolicySyncStats {
  lcds: number;
  articles: number;
  document_versions: number;
  policy_chunks: number;
  chunks_with_embeddings: number;
  last_sync_timestamp?: string;
  recent_versions: {
    document_id: string;
    document_type: string;
    version: number;
    status: string;
    created_at: string;
  }[];
}

export interface SyncJobStatus {
  job_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  message: string;
  started_at?: string;
  completed_at?: string;
  result?: Record<string, any>;
}

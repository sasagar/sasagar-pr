export type PRStatus = "open" | "merged" | "closed";

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  url: string;
  state: PRStatus;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  closedAt: string | null;
  repository: {
    name: string;
    owner: string;
    url: string;
  };
  additions: number;
  deletions: number;
  changedFiles: number;
  comments: number;
  isDraft: boolean;
}

export interface Organization {
  name: string;
  avatarUrl: string;
  prCount: number;
}

export interface PRData {
  prs: PullRequest[];
  orgs: Organization[];
  lastUpdated: string;
  totalCount: number;
}

export type FilterStatus = "all" | "open" | "merged" | "closed";

export interface FilterState {
  status: FilterStatus;
  search: string;
  org: string;
  page: number;
}

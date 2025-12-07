export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface ComponentFilters extends PaginationParams {
  search?: string;
  category?: string;
  tier?: string;
  type?: string;
  sortBy?: "newest" | "popular" | "downloads";
}

export interface LeaderboardParams {
  period: "weekly" | "monthly" | "yearly" | "all-time";
  limit?: number;
}

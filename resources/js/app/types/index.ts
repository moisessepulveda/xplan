import type { User, Planning } from './models';

// Re-export all model types
export * from './models';

// Inertia page props
export interface PageProps {
  auth: {
    user: User | null;
  };
  planning: Planning | null;
  plannings: Planning[];
  flash: {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
  };
  ziggy: {
    url: string;
    port: number | null;
    defaults: Record<string, unknown>;
    routes: Record<string, unknown>;
    location: string;
  };
}

// Pagination
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface PlanningForm {
  name: string;
  description?: string;
  currency: string;
  icon: string;
  color: string;
  month_start_day: number;
}

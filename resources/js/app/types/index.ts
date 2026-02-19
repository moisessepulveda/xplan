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
  unreadNotificationsCount: number;
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
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
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

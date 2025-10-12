// Shared types between frontend and backend

export type ContentType = 'audio' | 'image' | 'video' | 'gif' | 'url' | 'pdf' | 'book' | 'text';

export interface ContentMetadata {
  processingTime?: number; // in milliseconds
  confidence?: number; // 0-1
  wordCount?: number;
  language?: string;
  fileSize?: number; // in bytes
  originalFileName?: string;
}

export interface Content {
  _id: string;
  userId: string;
  title: string;
  originalContent: string;
  summary: string;
  contentType: ContentType;
  metadata: ContentMetadata;
  tags: string[];
  isFavorite: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  tokens: number;
  adEligible: boolean;
  verified: boolean;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface ContentQueryOptions {
  limit?: number;
  offset?: number;
  contentType?: ContentType;
  isFavorite?: boolean;
}

// Navigation types for React Navigation
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  Profile: undefined;
  Content: { contentId: string };
  CreateContent: undefined;
  Settings: undefined;
  History: undefined;
  Favorites: undefined;
};

// Tab navigation types
export type TabParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
  FavoritesTab: undefined;
  ProfileTab: undefined;
};

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateContentForm {
  title: string;
  originalContent: string;
  contentType: ContentType;
  tags: string[];
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  contents?: T[];
  favorites?: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Component Props types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export interface ContentCardProps {
  content: Content;
  onPress: () => void;
  onToggleFavorite: () => void;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: {
      fontSize: number;
      fontWeight: string;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
    };
    body: {
      fontSize: number;
      fontWeight: string;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
    };
  };
}

// Storage types
export interface StorageKeys {
  AUTH_TOKEN: string;
  USER_DATA: string;
  THEME_PREFERENCE: string;
  ONBOARDING_COMPLETED: string;
}

// Hook types
export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupForm) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface UseContentReturn {
  contents: Content[];
  favorites: Content[];
  isLoading: boolean;
  error: string | null;
  fetchContents: (options?: ContentQueryOptions) => Promise<void>;
  fetchFavorites: (options?: ContentQueryOptions) => Promise<void>;
  toggleFavorite: (contentId: string) => Promise<void>;
  deleteContent: (contentId: string) => Promise<void>;
  createContent: (data: CreateContentForm) => Promise<void>;
}

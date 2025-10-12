import { Request } from "express";
import { IUser } from "../models/User";

// Extend Express Request to include user
export interface AuthenticatedRequest extends Omit<Request, 'file'> {
  user?: JwtPayload;
  file?: UploadedFile;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// JWT Payload
export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// File upload types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination?: string;
  filename?: string;
  path?: string;
  size: number;
  buffer: Buffer;
  stream: any;
}

// Summary generation types
export interface SummaryOptions {
  maxLength?: number;
  language?: string;
  style?: 'concise' | 'detailed' | 'bullet-points';
}

export interface ProcessingResult {
  success: boolean;
  text?: string;
  summary?: string;
  metadata?: {
    processingTime: number;
    confidence?: number;
    wordCount?: number;
    language?: string;
  };
  error?: string;
}

// Email types
export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Cache types
export interface CacheOptions {
  ttl?: number; // time to live in seconds
  key: string;
}

// Environment variables
export interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  EMAIL_HOST?: string;
  EMAIL_PORT?: string;
  EMAIL_USER?: string;
  EMAIL_PASS?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  FACEBOOK_APP_ID?: string;
  FACEBOOK_APP_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
}

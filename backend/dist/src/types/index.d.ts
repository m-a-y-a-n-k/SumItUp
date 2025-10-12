import { Request } from "express";
export interface AuthenticatedRequest extends Omit<Request, 'file'> {
    user?: JwtPayload;
    file?: UploadedFile;
}
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
export interface JwtPayload {
    id: string;
    iat?: number;
    exp?: number;
}
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
export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}
export interface CacheOptions {
    ttl?: number;
    key: string;
}
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
//# sourceMappingURL=index.d.ts.map
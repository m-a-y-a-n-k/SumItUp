import mongoose, { Document, Model } from "mongoose";
import { ContentType } from "./Content";
export type SummaryLength = 'short' | 'medium' | 'long';
export type SummaryStyle = 'bullet-points' | 'paragraph' | 'keywords' | 'abstract';
export type ProcessingQuality = 'fast' | 'balanced' | 'high';
export type Privacy = 'private' | 'public';
export type Theme = 'light' | 'dark' | 'auto';
export interface IUserPreferences extends Document {
    userId: mongoose.Types.ObjectId;
    defaultSummaryLength: SummaryLength;
    summaryStyle: SummaryStyle;
    preferredLanguage: string;
    processingQuality: ProcessingQuality;
    autoSaveContent: boolean;
    defaultPrivacy: Privacy;
    emailNotifications: boolean;
    processingNotifications: boolean;
    weeklyDigest: boolean;
    theme: Theme;
    itemsPerPage: number;
    favoriteContentTypes: ContentType[];
    interests: string[];
    createdAt: Date;
    updatedAt: Date;
    updatePreferences(updates: Partial<IUserPreferences>): Promise<IUserPreferences>;
}
export interface IUserPreferencesModel extends Model<IUserPreferences> {
    findByUserId(userId: mongoose.Types.ObjectId): Promise<IUserPreferences | null>;
    createDefault(userId: mongoose.Types.ObjectId): Promise<IUserPreferences>;
}
declare const _default: IUserPreferencesModel;
export default _default;
//# sourceMappingURL=UserPreferences.d.ts.map
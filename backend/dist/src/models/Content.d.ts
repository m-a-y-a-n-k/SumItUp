import mongoose, { Document, Model } from "mongoose";
export type ContentType = 'audio' | 'image' | 'video' | 'gif' | 'url' | 'pdf' | 'book' | 'text';
export interface IContentMetadata {
    processingTime?: number;
    confidence?: number;
    wordCount?: number;
    language?: string;
    fileSize?: number;
    originalFileName?: string;
}
export interface IContent extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    originalContent: string;
    summary: string;
    contentType: ContentType;
    metadata: IContentMetadata;
    tags: string[];
    isFavorite: boolean;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    toggleFavorite(): Promise<IContent>;
    addTags(newTags: string[]): Promise<IContent>;
    removeTags(tagsToRemove: string[]): Promise<IContent>;
}
export interface IContentQueryOptions {
    limit?: number;
    offset?: number;
    contentType?: ContentType;
    isFavorite?: boolean;
}
export interface IContentModel extends Model<IContent> {
    findByUserId(userId: mongoose.Types.ObjectId, options?: IContentQueryOptions): Promise<IContent[]>;
    searchByTags(userId: mongoose.Types.ObjectId, tags: string[]): Promise<IContent[]>;
}
declare const _default: IContentModel;
export default _default;
//# sourceMappingURL=Content.d.ts.map
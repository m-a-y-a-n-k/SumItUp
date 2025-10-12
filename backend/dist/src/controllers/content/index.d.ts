import { Response } from "express";
import { ContentType } from "../../models/Content";
import { AuthenticatedRequest } from "../../types";
interface SaveContentRequest extends AuthenticatedRequest {
    body: {
        title: string;
        originalContent: string;
        summary: string;
        contentType: ContentType;
        metadata?: any;
        tags?: string[];
    };
}
interface GetHistoryRequest extends AuthenticatedRequest {
    query: {
        limit?: string;
        offset?: string;
        contentType?: ContentType;
        isFavorite?: string;
    };
}
interface ContentParams extends Record<string, string> {
    contentId: string;
}
interface TagsRequest extends AuthenticatedRequest {
    body: {
        tags: string[];
    };
    params: ContentParams;
}
interface SearchRequest extends AuthenticatedRequest {
    query: {
        tags?: string | string[];
    };
}
declare const contentController: {
    saveContent(req: SaveContentRequest, res: Response): Promise<Response>;
    getHistory(req: GetHistoryRequest, res: Response): Promise<Response>;
    getContent(req: AuthenticatedRequest & {
        params: ContentParams;
    }, res: Response): Promise<Response>;
    toggleFavorite(req: AuthenticatedRequest & {
        params: ContentParams;
    }, res: Response): Promise<Response>;
    getFavorites(req: GetHistoryRequest, res: Response): Promise<Response>;
    addTags(req: TagsRequest, res: Response): Promise<Response>;
    removeTags(req: TagsRequest, res: Response): Promise<Response>;
    deleteContent(req: AuthenticatedRequest & {
        params: ContentParams;
    }, res: Response): Promise<Response>;
    searchByTags(req: SearchRequest, res: Response): Promise<Response>;
};
export default contentController;
//# sourceMappingURL=index.d.ts.map
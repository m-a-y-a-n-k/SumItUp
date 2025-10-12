import { Request, Response } from "express";
import { AuthenticatedRequest, UploadedFile } from "../../types";
interface UploadRequest extends AuthenticatedRequest {
    file?: UploadedFile;
}
interface FileParams extends Record<string, string> {
    fileId: string;
}
interface ListFilesRequest extends Request {
    query: {
        limit?: string;
        offset?: string;
    };
}
declare const fileController: {
    uploadFile(req: UploadRequest, res: Response): Promise<Response>;
    downloadFile(req: Request & {
        params: FileParams;
    }, res: Response): Promise<Response | void>;
    deleteFile(req: Request & {
        params: FileParams;
    }, res: Response): Promise<Response>;
    listFiles(req: ListFilesRequest, res: Response): Promise<Response>;
};
export default fileController;
//# sourceMappingURL=index.d.ts.map
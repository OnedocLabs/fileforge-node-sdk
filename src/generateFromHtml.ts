import { Fileforge } from "index";
import { FileforgeClient, ResponseObject } from "./wrapper/FileforgeClient";
import mime from "mime-types";

export interface Asset {
    path: string;
    content: string;
}
export interface PathBuffer {
    path: string;
    content: Buffer;
}

export type AssetOrPathBuffer = Asset | PathBuffer;

export interface DocumentInput {
    html: string;
    fileName?: string;
    test?: boolean;
    host?: boolean;
    expiresAt?: Date;
    files?: AssetOrPathBuffer[];
}

export async function generateFromHtml(client: FileforgeClient, document: DocumentInput): Promise<ResponseObject> {
    const files: AssetOrPathBuffer[] = document.files ?? [];
    files.push({ path: "/index.html", content: document.html });

    const test: boolean = document.test ?? true;
    const save: boolean = document.host ?? false;

    const optionsToUpload: Fileforge.GenerateRequestOptions = {
        test: test,
        host: save,
        expiresAt: document.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000),
        fileName: document.fileName ?? "document",
    };

    const htmlBlob = new Blob([document.html], { type: "text/html" });
    const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });

    let filesToUpload = [htmlFile];

    files.forEach((asset) => {
        if (asset.content) {
            const assetType = mime.lookup(asset.path) || "application/octet-stream";

            const fileBlob = new Blob([asset.content], { type: assetType });
            const file = new File([fileBlob], asset.path, { type: assetType });
            filesToUpload.push(file);
        }
    });

    return await client.generate(filesToUpload, {
        options: optionsToUpload,
    });
}

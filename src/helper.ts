import * as environments from "./environments";
import * as core from "./core";
import urlJoin from "url-join";
import * as errors from "./errors/index";
import * as fs from "fs";
import * as FileForge from "./api/index";
import * as stream from "stream";
import { default as FormData } from "form-data";
import * as serializers from "./serialization/index";
import mime from "mime-types";
import { FileForgeClient } from "Client";
import { File } from "formdata-node";

export interface Asset {
    path: string;
    content: string;
  }
  export interface PathBuffer {
    path: string;
    content: Buffer;
  }
  
type AssetOrPathBuffer = Asset | PathBuffer;
  

export interface DocumentInput {
    html: string;
    fileName?: string;
    test?: boolean;
    host?: boolean;
    expiresAt?: Date;
    files?: AssetOrPathBuffer[];
  }

 /**
     * Generates a PDF document from web assets.
     * @throws {@link FileForge.BadRequestError}
     * @throws {@link FileForge.UnauthorizedError}
     * @throws {@link FileForge.InternalServerError}
     * @throws {@link FileForge.BadGatewayError}
     */
    
export async function generate_from_html(
    client: FileForgeClient,
    document: DocumentInput
):Promise<any>{
    const files: AssetOrPathBuffer[] = document.files ?? [];
    files.push({ path: "/index.html", content: document.html });

    const test: boolean = document.test ?? true;
    const save: boolean = document.host ?? false;

    const filesToUpload = [];

    const optionsToUpload:FileForge.GenerateRequestOptions = { 
        test: test,
        host: save,
        expiresAt: document.expiresAt,
        fileName: document.fileName ?? "document" }

    const htmlBlob = new Blob([document.html],{ type: "text/html" })
    const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
    filesToUpload.push(htmlFile);

    files.forEach((asset) => {
      if (asset.content) {

        const assetType = mime.lookup(asset.path) || "application/octet-stream";

        const fileBlob = new Blob([asset.content],{ type: assetType })
        const file = new File([fileBlob], asset.path, { type: assetType });
        filesToUpload.push(file);

      }
    });

    const pdf = await client.generate(
        filesToUpload,
        {
            options: optionsToUpload
        }
    )

    const chunks: any[] = [];
    
    for await (let chunk of pdf) {
        chunks.push(chunk);
    }
                
    const buffer: Buffer = Buffer.concat(chunks);


    if (pdf) {
      if (!save) {

        return {
          file: await buffer.toString(),
          link: null,
          error: null,
          info: {},
        };
      } else {
        return { file: null, link: JSON.parse(buffer.toString()).url, error: null, info: {} };
      }
    } 
}
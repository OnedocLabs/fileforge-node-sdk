import { FileforgeClient as FernClient } from "../Client";
import * as fs from "fs";
import * as Fileforge from "../api/index";
import * as core from "../core";
import stream, { Stream } from "stream";

export interface ResponseURL {
    url: string;
}

export interface ResponseStream {
    file: stream.Readable;
}

export type ResponseObject = ResponseStream | ResponseURL;

export class FileforgeClient {
    private client: FernClient;

    constructor(options: FernClient.Options) {
        this.client = new FernClient(options);
    }

    /**
     * Generates a PDF document from web assets.
     * @throws {@link Fileforge.BadRequestError}
     * @throws {@link Fileforge.UnauthorizedError}
     * @throws {@link Fileforge.InternalServerError}
     * @throws {@link Fileforge.BadGatewayError}
     */
    public async generate(
        files: File[] | fs.ReadStream[],
        request: Fileforge.GenerateRequest,
        requestOptions?: FernClient.RequestOptions
    ): Promise<ResponseObject> {
        const generated = await this.client.generate(files, request, requestOptions);
        // read all contents
        const chunks: any[] = [];
        for await (let chunk of generated) {
            chunks.push(chunk);
        }
        const value = Buffer.concat(chunks);
        // try json parse
        try {
            return JSON.parse(value.toString()) as ResponseObject;
        } catch {}
        // return file
        const { Readable } = await import("node:stream");
        return { file: Readable.from(chunks) };
    }

    /**
     * @throws {@link Fileforge.BadRequestError}
     * @throws {@link Fileforge.UnauthorizedError}
     * @throws {@link Fileforge.InternalServerError}
     */
    public async merge(
        files: File[] | fs.ReadStream[],
        request: Fileforge.MergeRequest,
        requestOptions?: FernClient.RequestOptions
    ): Promise<ResponseObject> {
        const merged = await this.client.merge(files, request, requestOptions);
        // read all contents
        const chunks: any[] = [];
        for await (let chunk of merged) {
            chunks.push(chunk);
        }
        const value = Buffer.concat(chunks);
        // try json parse
        try {
            return JSON.parse(value.toString()) as ResponseObject;
        } catch {}
        // return file
        const { Readable } = await import("node:stream");
        return { file: Readable.from(chunks) };
    }
}

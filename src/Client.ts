/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "./environments";
import * as core from "./core";
import * as fs from "fs";
import * as FileForge from "./api/index";
import * as stream from "stream";
import urlJoin from "url-join";
import * as errors from "./errors/index";
import * as serializers from "./serialization/index";

export declare namespace FileForgeClient {
    interface Options {
        environment?: core.Supplier<environments.FileForgeEnvironment | string>;
        apiKey: core.Supplier<string>;
    }

    interface RequestOptions {
        timeoutInSeconds?: number;
        maxRetries?: number;
    }
}

export class FileForgeClient {
    constructor(protected readonly _options: FileForgeClient.Options) {}

    /**
     * Generates a PDF document from web assets.
     * @throws {@link FileForge.BadRequestError}
     * @throws {@link FileForge.UnauthorizedError}
     * @throws {@link FileForge.InternalServerError}
     * @throws {@link FileForge.BadGatewayError}
     */
    public async generate(
        files: File[] | fs.ReadStream[],
        request: FileForge.GenerateRequest,
        requestOptions?: FileForgeClient.RequestOptions
    ): Promise<Buffer>{
        const _request = core.newFormData();
        const options = await serializers.GenerateRequestOptions.jsonOrThrow(request.options, {
            unrecognizedObjectKeys: "passthrough",
            allowUnrecognizedUnionMembers: false,
            allowUnrecognizedEnumValues: false,
            breadcrumbsPrefix: [""],
        });
        await _request.append("options", new Blob([JSON.stringify(options)], { type: "application/json" }));
        for (const _file of files) {
            await _request.append("files", _file);
        }
        const _response = await core.fetcher<stream.Readable>({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.FileForgeEnvironment.Default,
                "pdf/generate/"
            ),
            method: "POST",
            headers: {
                "X-API-Key": await core.Supplier.get(this._options.apiKey),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "fileforge",
                "X-Fern-SDK-Version": "0.0.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await _request.getHeaders()),
            },
            body: await _request.getBody(),
            responseType: "streaming",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
                const chunks: any[] = [];
    
                for await (let chunk of _response.body) {
                    chunks.push(chunk);
                }
                
                const buffer: Buffer = Buffer.concat(chunks);
    
                return buffer;
        }

        if (_response.error.reason === "status-code") {
            throw new errors.FileForgeError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
            });
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.FileForgeError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.FileForgeTimeoutError();
            case "unknown":
                throw new errors.FileForgeError({
                    message: _response.error.errorMessage,
                });
        }
    }
}

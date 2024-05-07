/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "./environments";
import * as core from "./core";
import * as fs from "fs";
import * as FileForge from "./api/index";
import { default as FormData } from "form-data";
import urlJoin from "url-join";
import * as errors from "./errors/index";

export declare namespace FileForgeClient {
    interface Options {
        environment?: core.Supplier<environments.FileForgeEnvironment | string>;
        username: core.Supplier<string>;
        password: core.Supplier<string>;
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
     * @param {File[] | fs.ReadStream[]} files
     * @param {FileForge.GenerateRequest} request
     * @param {FileForgeClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await fileForge.generate([fs.createReadStream("/path/to/your/file")], {
     *         options: {}
     *     })
     */
    public async generate(
        files: File[] | fs.ReadStream[],
        request: FileForge.GenerateRequest,
        requestOptions?: FileForgeClient.RequestOptions
    ): Promise<void> {
        const _request = new FormData();
        _request.append("options", JSON.stringify(request.options));
        for (const _file of files) {
            _request.append("files", _file);
        }

        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.FileForgeEnvironment.Default,
                "pdf/generate/"
            ),
            method: "POST",
            headers: {
                Authorization: await this._getAuthorizationHeader(),
                "X-API-Key": await core.Supplier.get(this._options.apiKey),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "fileforge",
                "X-Fern-SDK-Version": "0.0.0",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "multipart/form-data; boundary=" + _request.getBoundary(),
            body: _request,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return;
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

    protected async _getAuthorizationHeader(): Promise<string | undefined> {
        return core.BasicAuth.toAuthorizationHeader({
            username: await core.Supplier.get(this._options.username),
            password: await core.Supplier.get(this._options.password),
        });
    }
}

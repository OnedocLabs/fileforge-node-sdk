/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as fs from "fs";
import * as FileForge from "../../../index";
import * as stream from "stream";
import { default as FormData } from "form-data";
import urlJoin from "url-join";
import * as errors from "../../../../errors/index";
import * as serializers from "../../../../serialization/index";

export declare namespace Pdf {
    interface Options {
        environment?: core.Supplier<environments.FileForgeEnvironment | string>;
        username?: core.Supplier<string | undefined>;
        password?: core.Supplier<string | undefined>;
        apiKey: core.Supplier<string>;
    }

    interface RequestOptions {
        timeoutInSeconds?: number;
        maxRetries?: number;
    }
}

export class Pdf {
    constructor(protected readonly _options: Pdf.Options) {}

    /**
     * Converts a Microsoft Word document (.DOCX or .DOC) file to a PDF document.
     *
     * This service uses a LibreOffice headless server to perform the conversion, and may not support all features of the original document.
     *
     * **Known discrepancies**
     *
     * - Some fonts may not be available in the server, and may be substituted by a closest match.
     * - Some complex formatting may not be preserved, such as background graphics.
     *
     * **Variables**
     *
     * Variable replacement is supported with various methods:
     *
     * - Templated litterals: `{{name}}`
     * - Word variables, as listed in the document metadata: `{DOCVARIABLE "name"}`
     *
     * To enable variable replacement as Word variables for your account, please contact the FileForge support.
     * @throws {@link FileForge.BadRequestError}
     * @throws {@link FileForge.UnauthorizedError}
     * @throws {@link FileForge.InternalServerError}
     */
    public async convertDocx(
        file: File | fs.ReadStream,
        request: FileForge.PdfConvertDocxRequest,
        requestOptions?: Pdf.RequestOptions
    ): Promise<stream.Readable> {
        const _request = new FormData();
        _request.append("options", JSON.stringify(request.options));
        _request.append("file", file);
        const _response = await core.fetcher<stream.Readable>({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.FileForgeEnvironment.Default,
                "pdf/docx/"
            ),
            method: "POST",
            headers: {
                Authorization: await this._getAuthorizationHeader(),
                "X-API-Key": await core.Supplier.get(this._options.apiKey),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "fileforge",
                "X-Fern-SDK-Version": "0.0.3",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "multipart/form-data; boundary=" + _request.getBoundary(),
            body: _request,
            responseType: "streaming",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body;
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 400:
                    throw new FileForge.BadRequestError(
                        await serializers.ErrorSchema.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        })
                    );
                case 401:
                    throw new FileForge.UnauthorizedError(
                        await serializers.ErrorSchema.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        })
                    );
                case 500:
                    throw new FileForge.InternalServerError(_response.error.body);
                default:
                    throw new errors.FileForgeError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
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

    /**
     * Generates a PDF document from web assets.
     * @throws {@link FileForge.BadRequestError}
     * @throws {@link FileForge.UnauthorizedError}
     * @throws {@link FileForge.InternalServerError}
     * @throws {@link FileForge.BadGatewayError}
     */
    public async generate(
        files: File[] | fs.ReadStream[],
        request: FileForge.PdfGenerateRequest,
        requestOptions?: Pdf.RequestOptions
    ): Promise<stream.Readable> {
        const _request = new FormData();
        _request.append("options", JSON.stringify(request.options));
        for (const _file of files) {
            _request.append("files", _file);
        }

        const _response = await core.fetcher<stream.Readable>({
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
                "X-Fern-SDK-Version": "0.0.3",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "multipart/form-data; boundary=" + _request.getBoundary(),
            body: _request,
            responseType: "streaming",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body;
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 400:
                    throw new FileForge.BadRequestError(
                        await serializers.ErrorSchema.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        })
                    );
                case 401:
                    throw new FileForge.UnauthorizedError(
                        await serializers.ErrorSchema.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        })
                    );
                case 500:
                    throw new FileForge.InternalServerError(_response.error.body);
                case 502:
                    throw new FileForge.BadGatewayError(
                        await serializers.ErrorSchema.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        })
                    );
                default:
                    throw new errors.FileForgeError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
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

    /**
     * @throws {@link FileForge.BadRequestError}
     * @throws {@link FileForge.UnauthorizedError}
     * @throws {@link FileForge.InternalServerError}
     */
    public async merge(
        files: File[] | fs.ReadStream[],
        request: FileForge.PdfMergeRequest,
        requestOptions?: Pdf.RequestOptions
    ): Promise<stream.Readable> {
        const _request = new FormData();
        _request.append("options", JSON.stringify(request.options));
        for (const _file of files) {
            _request.append("files", _file);
        }

        const _response = await core.fetcher<stream.Readable>({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.FileForgeEnvironment.Default,
                "pdf/merge/"
            ),
            method: "POST",
            headers: {
                Authorization: await this._getAuthorizationHeader(),
                "X-API-Key": await core.Supplier.get(this._options.apiKey),
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "fileforge",
                "X-Fern-SDK-Version": "0.0.3",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "multipart/form-data; boundary=" + _request.getBoundary(),
            body: _request,
            responseType: "streaming",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body;
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 400:
                    throw new FileForge.BadRequestError(
                        await serializers.ErrorSchema.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        })
                    );
                case 401:
                    throw new FileForge.UnauthorizedError(
                        await serializers.ErrorSchema.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        })
                    );
                case 500:
                    throw new FileForge.InternalServerError(_response.error.body);
                default:
                    throw new errors.FileForgeError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
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
        const username = await core.Supplier.get(this._options.username);
        const password = await core.Supplier.get(this._options.password);
        if (username != null && password != null) {
            return core.BasicAuth.toAuthorizationHeader({
                username: username,
                password: password,
            });
        }

        return undefined;
    }
}

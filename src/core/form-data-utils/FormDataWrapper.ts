import { RUNTIME } from "../runtime";

interface CrossPlatformFormData {
    append(key: string, value: any, options?: { contentType?: string }): void;
}

class FormDataRequestBody {
    private fd: any;
    private encoder: any;

    constructor(fd: any) {
        this.fd = fd;
    }

    async setup(): Promise<void> {
        if (this.encoder == null && RUNTIME.type === "node") {
            this.encoder = new (await import("form-data-encoder")).FormDataEncoder(this.fd);
        }
    }

    /**
     * @returns the multipart form data request
     */
    public async getBody(): Promise<any> {
        if (RUNTIME.type !== "node") {
            return this.fd;
        } else {
            if (this.encoder == null) {
                await this.setup();
            }
            return (await import("node:stream")).Readable.from(this.encoder);
        }
    }

    /**
     * @returns headers that need to be added to the multipart form data request
     */
    public async getHeaders(): Promise<Record<string, string>> {
        if (RUNTIME.type !== "node") {
            return {};
        } else {
            if (this.encoder == null) {
                await this.setup();
            }
            return {
                "Content-Length": this.encoder.length,
            };
        }
    }
}

export declare namespace FormDataWrapper {
    interface AppendOptions {
        contentType?: string;
    }
}

/**
 * FormDataWrapper is a utility to make form data
 * requests across both Browser and Node.js runtimes.
 */
export class FormDataWrapper {
    private fd: CrossPlatformFormData | undefined;

    public async append(name: string, value: any, opts: FormDataWrapper.AppendOptions = {}): Promise<void> {
        if (this.fd == null) {
            if (RUNTIME.type === "node") {
                const fdNode = new (await import("formdata-node")).FormData();
                this.fd = new FormDataNodeWrapper(fdNode);
            } else {
                this.fd = new (await import("form-data")).default();
            }
        }
        this.fd.append(name, value, opts);
    }

    public getRequest(): FormDataRequestBody {
        return new FormDataRequestBody(this.fd);
    }
}


interface FormDataNode {
    append(name: string, value: unknown, fileName?: string): void;
}

class FormDataNodeWrapper implements CrossPlatformFormData {

    private fd: FormDataNode;

    public constructor(fd: FormDataNode) {
        this.fd = fd;
    }
    
    append(key: string, value: any, options: { contentType?: string | undefined; } = {}): void {
        if (options.contentType == null) {
            this.fd.append(key, value);
        } else {
            this.fd.append(key, new Blob([value], { type: options.contentType}))
        }
    }

}

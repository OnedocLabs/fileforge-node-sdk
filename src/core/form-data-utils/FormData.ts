import { RUNTIME } from "../runtime";

export function newFormData(): FormData {
    if (RUNTIME.type === "node") {
        return new NodeFormData();
    } else {
        return new WebFormData();
    }
}

export declare namespace FormData {
    interface AppendOptions {
        contentType?: string;
    }
}

export abstract class FormData {
    public abstract append(key: string, value: any, options?: { contentType?: string }): Promise<void>;

    /**
     * @returns the multipart form data request
     */
    public abstract getBody(): Promise<any>;

    /**
     * @returns headers that need to be added to the multipart form data request
     */
    public abstract getHeaders(): Promise<Record<string, string>>;
}

class NodeFormData implements FormData {
    private encoder: any | undefined;
    private fd: any | undefined;

    public async initialize(): Promise<void> {
        this.fd = new (await import("formdata-node")).FormData();
        this.encoder = new (await import("form-data-encoder")).FormDataEncoder(this.fd);
    }

    public async append(
        key: string,
        value: any,
        options?: { contentType?: string | undefined } | undefined
    ): Promise<void> {
        if (this.fd == null) {
            await this.initialize();
        }
        if (options?.contentType == null) {
            this.fd.append(key, value);
        } else {
            this.fd.append(key, new Blob([value], { type: options.contentType }));
        }
    }
    
    public async getBody(): Promise<any> {
        if (this.encoder == null) {
            await this.initialize();
        }
        return (await import("node:stream")).Readable.from(this.encoder);
    }

    public async getHeaders(): Promise<Record<string, string>> {
        if (this.encoder == null) {
            await this.initialize();
        }
        return {
            "Content-Length": this.encoder.length,
        };
    }
}

class WebFormData implements FormData {
    private fd: any;

    public async initialize(): Promise<void> {
        this.fd = new (await import("form-data")).default();
    }

    public async append(
        key: string,
        value: any,
        options?: { contentType?: string | undefined } | undefined
    ): Promise<void> {
        if (this.fd == null) {
            await this.initialize();
        }
        this.fd.append(key, value, { contentType: options?.contentType });
    }

    public async getBody(): Promise<any> {
        return this.fd;
    }

    public async getHeaders(): Promise<Record<string, string>> {
        return {};
    }
}

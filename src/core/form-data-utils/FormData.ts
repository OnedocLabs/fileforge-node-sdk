import { RUNTIME } from "../runtime";

export function newFormData(): CrossRuntimeFormData {
    if (RUNTIME.type === "node") {
        return new NodeFormData();
    } else {
        return new WebFormData();
    }
}

export declare namespace CrossRuntimeFormData {
    interface AppendOptions {
        contentType?: string;
    }
}

export abstract class CrossRuntimeFormData {
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

class NodeFormData implements CrossRuntimeFormData {
    private fd: any | undefined;

    public constructor() {
        this.fd = new FormData();
    }

    public async append(
        key: string,
        value: any,
        options?: { contentType?: string | undefined } | undefined
    ): Promise<void> {
        if (options?.contentType != null) {
            this.fd.append(key, new Blob([value], { type: options?.contentType }));
        } else {
            this.fd.append(key, value);
        }
    }

    public async getBody(): Promise<any> {
        return this.fd;
    }

    public async getHeaders(): Promise<Record<string, string>> {
        return {};
    }
}

class WebFormData implements CrossRuntimeFormData {
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

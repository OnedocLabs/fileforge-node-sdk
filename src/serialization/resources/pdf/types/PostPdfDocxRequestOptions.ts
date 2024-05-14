/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as FileForge from "../../../../api/index";
import * as core from "../../../../core";

export const PostPdfDocxRequestOptions: core.serialization.ObjectSchema<
    serializers.PostPdfDocxRequestOptions.Raw,
    FileForge.PostPdfDocxRequestOptions
> = core.serialization.object({
    templateLiterals: core.serialization.record(core.serialization.string(), core.serialization.string()).optional(),
});

export declare namespace PostPdfDocxRequestOptions {
    interface Raw {
        templateLiterals?: Record<string, string> | null;
    }
}

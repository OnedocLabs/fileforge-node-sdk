import stream from "stream";
import * as core from "../src/core";
import { FileForgeClient } from "../src";
import fs from "fs";
import { writeFile } from "fs/promises";

const HTML = `<!DOCTYPE html>
<html>
  <head>
    <title>My First Web Page</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
`;

/**
 * This is a custom test file, if you wish to add more tests
 * to your SDK.
 * Be sure to mark this file in `.fernignore`.
 *
 * If you include example requests/responses in your fern definition,
 * you will have tests automatically generated for you.
 */
describe("test", () => {
    it("should generate a PDF", async () => {
        const blob = new Blob([HTML], {
            type: "text/html",
        });
        const htmlFile = new File([blob], "index.html", { type: "text/html" });

        const ff = new FileForgeClient({
            apiKey: "480039ed-ccf0-48be-9103-6875d0559012"
        });
        const pdf = await ff.generate(
            [htmlFile], 
            {
                options: {}
            }
        );

        const chunks: any[] = []
        for await (let chunk of pdf) {
            chunks.push(chunk)
        }
        await writeFile("output.pdf", Buffer.concat(chunks));
    }, 10_000_000);
});

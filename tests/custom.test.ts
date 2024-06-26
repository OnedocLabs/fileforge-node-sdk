import { FileforgeClient, generateFromHtml, ResponseStream, ResponseURL } from "../src";
import * as fs from "fs";
import * as errors from "../src/errors";

const FILEFORGE_API_KEY = process.env.FILEFORGE_API_KEY!;

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

const CSS = `body{
    background-color: lightblue;
}
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
    it.skip("should generate a PDF", async () => {
        const htmlBlob = new Blob([HTML], {
            type: "text/html",
        });
        const cssBlob = new Blob([CSS], {
            type: "text/css",
        });
        const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
        const cssFile = new File([cssBlob], "style.css", { type: "text/css" });

        const ff = new FileforgeClient({
            apiKey: FILEFORGE_API_KEY,
        });

        const pdf = (await ff.generate([htmlFile, cssFile], {
            options: {},
        })) as ResponseStream;

        // Write the PDF stream to a file
        const writeStream = fs.createWriteStream("output.pdf");
        pdf.file.pipe(writeStream);
    }, 10_000_000);

    it.skip("should generate a PDF link", async () => {
        const htmlBlob = new Blob([HTML], {
            type: "text/html",
        });
        const cssBlob = new Blob([CSS], {
            type: "text/css",
        });
        const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
        const cssFile = new File([cssBlob], "style.css", { type: "text/css" });

        const ff = new FileforgeClient({
            apiKey: process.env.FILEFORGE_API_KEY ?? "",
        });

        const pdf = (await ff.generate([htmlFile, cssFile], {
            options: {
                host: true,
            },
        })) as ResponseURL;

        expect(pdf.url).not.toBeNull();
    }, 10_000_000);

    it.skip("should fail because of invalid api key", async () => {
        const htmlBlob = new Blob([HTML], {
            type: "text/html",
        });
        const cssBlob = new Blob([CSS], {
            type: "text/css",
        });
        const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
        const cssFile = new File([cssBlob], "style.css", { type: "text/css" });

        const ff = new FileforgeClient({
            apiKey: "blabla_invalid_key",
        });
        try {
            const pdf = await ff.generate([htmlFile, cssFile], {
                options: {
                    host: true,
                },
            });
        } catch (e) {
            expect(e).not.toBeNull();
            if (e instanceof errors.FileforgeError) {
                expect(e.statusCode).toBe(401);
            }
        }
    }, 10_000_000);

    it.skip("should generate a PDF buffer from helper", async () => {
        const htmlBlob = new Blob([HTML], {
            type: "text/html",
        });
        const cssBlob = new Blob([CSS], {
            type: "text/css",
        });
        const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
        const cssFile = new File([cssBlob], "style.css", { type: "text/css" });

        const ff = new FileforgeClient({
            apiKey: FILEFORGE_API_KEY,
        });

        const pdf = (await generateFromHtml(ff, {
            html: HTML,
            fileName: "test",
            host: false,
            test: false,
        })) as ResponseStream;
        // Write the PDF stream to a file
        const writeStream = fs.createWriteStream("output_helper.pdf");
        pdf.file.pipe(writeStream);
    }, 10_000_000);

    it.skip("should generate a PDF url from helper", async () => {
        const htmlBlob = new Blob([HTML], {
            type: "text/html",
        });
        const cssBlob = new Blob([CSS], {
            type: "text/css",
        });
        const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
        const cssFile = new File([cssBlob], "style.css", { type: "text/css" });

        const ff = new FileforgeClient({
            apiKey: FILEFORGE_API_KEY,
        });

        const pdf = (await generateFromHtml(ff, {
            html: HTML,
            fileName: "test",
            host: true,
        })) as ResponseURL;

        expect(pdf.url).not.toBeNull();
    }, 10_000_000);

    it.skip("should merge two PDFs", async () => {
        const PDF1 = await fs.promises.readFile("./output.pdf");
        const PDF2 = await fs.promises.readFile("./output_helper.pdf");

        const pdfBlob1 = new Blob([PDF1], {
            type: "application/pdf",
        });
        const pdfBlob2 = new Blob([PDF2], {
            type: "application/pdf",
        });
        const file1 = new File([pdfBlob1], "pdf1.pdf", { type: "application/pdf" });
        const file2 = new File([pdfBlob2], "pdf2.pdf", { type: "application/pdf" });

        const ff = new FileforgeClient({
            apiKey: FILEFORGE_API_KEY,
        });

        const pdf = (await ff.merge([file1, file2], {
            options: {},
        })) as ResponseStream;

        // Write the PDF stream to a file
        const writeStream = fs.createWriteStream("output_merged.pdf");
        pdf.file.pipe(writeStream);
    }, 10_000_000);

    it("should generate from html snippet", async () => {
        try {
            const client = new FileforgeClient({
                apiKey: FILEFORGE_API_KEY,
            });
            const documentInput = {
                html: HTML,
                fileName: "example",
                test: false,
                host: false,
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
                files: [{ path: "/style.css", content: CSS }],
            };

            const response = (await generateFromHtml(client, documentInput)) as ResponseStream;

            // Write the PDF stream to a file
            const writeStream = fs.createWriteStream("outputSnippet.pdf");
            response.file.pipe(writeStream);
            console.log("PDF generated successfully.");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    }, 10_000_000);
});

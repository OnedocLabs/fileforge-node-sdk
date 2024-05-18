import stream from "stream";
import { FileForgeClient } from "../src";
import fs from "fs";

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
        const apiKeySupplier = async () => "ebec0c4c-214f-4796-afd2-b5c9b12281b6"; // Replace with your actual API key supplier
        const environmentSupplier = async () => "https://api.fileforge.com"; // Replace with your actual environment endpoint

        const client = new FileForgeClient({
            apiKey: apiKeySupplier,
            environment: environmentSupplier,
        });

        // Write HTML content to a file
        const htmlContent = "<h1>Hello World!</h1>";
        const blob = new Blob([htmlContent], { type: "text/html" });
        const file = new File([blob], "index.html", { type: "text/html" });

        const request = {
            options: {
                fileName: "test.pdf",
                test: false,
                host: false,
            },
        };

        const pdfStream: stream.Readable = await client.generate([file], request);
        console.log(pdfStream);
        const pdfFilePath = "output.pdf";
        const writeStream = fs.createWriteStream(pdfFilePath);

        pdfStream.pipe(writeStream);

        return new Promise((resolve, reject) => {
            writeStream.on("finish", () => {
                console.log("PDF generated and saved to", pdfFilePath);
                resolve(true);
            });

            writeStream.on("error", (error) => {
                console.error("Error generating PDF:", error);
                reject(error);
            });
        });
    });
});

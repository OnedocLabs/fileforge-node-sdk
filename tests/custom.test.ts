import stream from "stream";
import * as core from "../src/core";
import { FileForgeClient } from "../src";
import { generate_from_html } from "../src/Helper";
import * as error from "../src/errors/index";
import fs from "fs";
import { writeFile } from "fs/promises";

const FILEFORGE_API_KEY = process.env.FILEFORGE_API_KEY!;

const HTML = `<!DOCTYPE html>
<html>
  <head>
    <title>My First Web Page</title>
    <link href="style.css" rel="stylesheet" />
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
`;

const CSS =`body{
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
    it("should generate a PDF buffer", async () => {
        const htmlBlob = new Blob([HTML], {
            type: "text/html",
        });
        const cssBlob = new Blob([CSS], {
            type: "text/css",
        });
        const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
        const cssFile = new File([cssBlob], "style.css", { type: "text/css" });

        const ff = new FileForgeClient({
            apiKey: FILEFORGE_API_KEY
        });

        const pdf = await ff.generate(
            [htmlFile, cssFile], 
            {
                options: {}
            }
        );       
        

        await writeFile("output.pdf", pdf.file);
    }, 10_000_000);


    it("should generate a PDF link", async () => {
        const htmlBlob = new Blob([HTML], {
            type: "text/html",
        });
        const cssBlob = new Blob([CSS], {
            type: "text/css",
        });
        const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
        const cssFile = new File([cssBlob], "style.css", { type: "text/css" });

        const ff = new FileForgeClient({
            apiKey: FILEFORGE_API_KEY
        });

        const pdf = await ff.generate(
            [htmlFile, cssFile], 
            {
                options: {
                    host: true,
                }
            }
        );


        expect(pdf.url).not.toBeNull();

    }, 10_000_000);

    it("should fail because of invalid api key", async () => {
        const htmlBlob = new Blob([HTML], {
            type: "text/html",
        });
        const cssBlob = new Blob([CSS], {
            type: "text/css",
        });
        const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
        const cssFile = new File([cssBlob], "style.css", { type: "text/css" });

        const ff = new FileForgeClient({
            apiKey: "blabla_invalid_key"
        });
        try {
            const pdf = await ff.generate(
                [htmlFile, cssFile], 
                {
                    options: {
                        host: true,
                    }
                }
            );
     
        }catch(e){
                expect(e).not.toBeNull();
                if (e instanceof error.FileForgeError) {
                    expect(e.statusCode).toBe(401);
                } 
        }

    }, 10_000_000);


    it("should generate a PDF buffer from helper", async () => {
        const htmlBlob = new Blob([HTML], {
            type: "text/html",
        });
        const cssBlob = new Blob([CSS], {
            type: "text/css",
        });
        const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
        const cssFile = new File([cssBlob], "style.css", { type: "text/css" });

        const ff = new FileForgeClient({
            apiKey: FILEFORGE_API_KEY
        });

        const pdf = await generate_from_html(
            ff,
            {
                html:HTML,
                fileName:"test",
                host:false,
                test:false
            }
            
        );       
        
        await writeFile("output_helper.pdf", pdf.file!);
    }, 10_000_000);

    it("should generate a PDF url from helper", async () => {
        const htmlBlob = new Blob([HTML], {
            type: "text/html",
        });
        const cssBlob = new Blob([CSS], {
            type: "text/css",
        });
        const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
        const cssFile = new File([cssBlob], "style.css", { type: "text/css" });

        const ff = new FileForgeClient({
            apiKey: FILEFORGE_API_KEY
        });

        const pdf = await generate_from_html(
            ff,
            {
                html:HTML,
                fileName:"test",
                host:true,
            }
            
        );       
        
        expect(pdf.url).not.toBeNull();
}, 10_000_000);

    it("should merge two PDFs", async () => {
        const PDF1 = await fs.promises.readFile("./output.pdf");
        const PDF2 = await fs.promises.readFile("./output_helper.pdf");

        const pdfBlob1= new Blob([PDF1], {
            type: "application/pdf",
        });
        const pdfBlob2 = new Blob([PDF2], {
            type: "application/pdf",
        });
        const file1 = new File([pdfBlob1], "pdf1.pdf", { type: "application/pdf" });
        const file2 = new File([pdfBlob2], "pdf2.pdf", { type: "application/pdf" });

        const ff = new FileForgeClient({
            apiKey: FILEFORGE_API_KEY
        });

        const pdf = await ff.merge(
            [file1, file2],
            {   
                options: {},
            }            
        );       

        await writeFile("output_merged.pdf", pdf.file);
        expect(pdf.file).not.toBeNull();
}, 10_000_000);

});

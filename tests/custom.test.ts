import { FileforgeClient } from "../src";
import { generate_from_html, ResponseStream, ResponseURL } from "../src/helper";
import * as error from "../src/errors/index";
import fs from "fs";

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

const HTML_W_IMAGE = `<!DOCTYPE html>
<html>
    <head>
        <title>My First Web Page</title>
        <link href="style.css" rel="stylesheet" />
    </head>
    <body>
        <h1>Hello World!</h1>
        <img src="logo-black.svg" alt="FileForge logo" />
    </body>
</html>
`;

const SVG_LOGO = `<svg width="179" height="46" viewBox="0 0 179 46" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 6.93506H19.0099V16.1581H9.78689V19.4892H22.341V6.93506H32.13V39.0651H0V6.93506ZM13.1059 39.0631V29.84H22.329V26.509H9.77488V39.0631H13.1059Z" fill="black"/>
<path d="M47.5743 36V21.3286H42.5875V18.1847H47.5743V14.282C47.5743 13.1979 47.8996 12.3306 48.55 11.6801C49.2005 11.0297 50.0678 10.7044 51.1519 10.7044H55.4882V13.8483H52.3444C51.6457 13.8483 51.2964 14.2097 51.2964 14.9324V18.1847H59.2826V21.3286H51.2964V36H47.5743ZM59.2826 36V18.1847H63.0046V36H59.2826ZM61.1617 15.872C60.4389 15.872 59.8246 15.6431 59.3187 15.1854C58.8369 14.7035 58.596 14.0892 58.596 13.3424C58.596 12.5715 58.8369 11.9572 59.3187 11.4994C59.8246 11.0417 60.4389 10.8128 61.1617 10.8128C61.8844 10.8128 62.4867 11.0417 62.9685 11.4994C63.4744 11.9572 63.7274 12.5715 63.7274 13.3424C63.7274 14.0892 63.4744 14.7035 62.9685 15.1854C62.4867 15.6431 61.8844 15.872 61.1617 15.872ZM66.6894 36V10.7044H70.4115V36H66.6894ZM82.2953 36.5059C80.4885 36.5059 78.9105 36.1325 77.5614 35.3857C76.2123 34.6148 75.1523 33.5427 74.3814 32.1695C73.6346 30.7722 73.2612 29.1582 73.2612 27.3272V26.8936C73.2612 25.0386 73.6346 23.4245 74.3814 22.0513C75.1283 20.654 76.1642 19.582 77.4892 18.8352C78.8383 18.0642 80.3921 17.6788 82.1508 17.6788C83.8612 17.6788 85.3549 18.0642 86.6317 18.8352C87.9326 19.582 88.9444 20.6299 89.6672 21.979C90.3899 23.3281 90.7513 24.9061 90.7513 26.7129V28.1222H77.0555C77.1037 29.6882 77.6217 30.9409 78.6094 31.8804C79.6212 32.7959 80.874 33.2536 82.3676 33.2536C83.7649 33.2536 84.8128 32.9404 85.5115 32.3141C86.2342 31.6877 86.7883 30.965 87.1738 30.1459L90.2454 31.7359C89.9081 32.4104 89.4142 33.1211 88.7638 33.8679C88.1374 34.6148 87.3063 35.2411 86.2703 35.747C85.2344 36.253 83.9094 36.5059 82.2953 36.5059ZM77.0917 25.2675H86.9569C86.8606 23.9184 86.3788 22.8704 85.5115 22.1236C84.6442 21.3527 83.5119 20.9672 82.1146 20.9672C80.7174 20.9672 79.573 21.3527 78.6817 22.1236C77.8144 22.8704 77.2844 23.9184 77.0917 25.2675ZM95.9705 36V21.3286H90.9836V18.1847H95.9705V14.282C95.9705 13.1979 96.2957 12.3306 96.9461 11.6801C97.5966 11.0297 98.4639 10.7044 99.548 10.7044H104.137V13.8483H100.74C100.042 13.8483 99.6925 14.2097 99.6925 14.9324V18.1847H104.824V21.3286H99.6925V36H95.9705ZM114.434 36.5059C112.652 36.5059 111.062 36.1445 109.664 35.4218C108.291 34.675 107.207 33.615 106.412 32.2418C105.617 30.8686 105.219 29.2425 105.219 27.3634V26.8213C105.219 24.9422 105.617 23.3281 106.412 21.979C107.207 20.6058 108.291 19.5458 109.664 18.799C111.062 18.0522 112.652 17.6788 114.434 17.6788C116.217 17.6788 117.807 18.0522 119.204 18.799C120.602 19.5458 121.698 20.6058 122.493 21.979C123.288 23.3281 123.685 24.9422 123.685 26.8213V27.3634C123.685 29.2425 123.288 30.8686 122.493 32.2418C121.698 33.615 120.602 34.675 119.204 35.4218C117.807 36.1445 116.217 36.5059 114.434 36.5059ZM114.434 33.1814C116.072 33.1814 117.397 32.6634 118.409 31.6275C119.445 30.5675 119.963 29.11 119.963 27.255V26.9297C119.963 25.0747 119.457 23.6293 118.445 22.5934C117.434 21.5333 116.097 21.0033 114.434 21.0033C112.82 21.0033 111.495 21.5333 110.459 22.5934C109.447 23.6293 108.941 25.0747 108.941 26.9297V27.255C108.941 29.11 109.447 30.5675 110.459 31.6275C111.495 32.6634 112.82 33.1814 114.434 33.1814ZM126.512 36V18.1847H130.162V20.2806H130.74C131.029 19.5338 131.487 18.9917 132.113 18.6545C132.764 18.2931 133.559 18.1124 134.498 18.1124H136.631V21.4731H134.354C133.149 21.4731 132.162 21.8104 131.391 22.4849C130.62 23.1354 130.234 24.1472 130.234 25.5204V36H126.512ZM137.178 27.1827V26.6406C137.178 24.7615 137.551 23.1595 138.298 21.8345C139.069 20.5095 140.081 19.4856 141.333 18.7629C142.586 18.0401 143.959 17.6788 145.453 17.6788C147.187 17.6788 148.512 18.004 149.428 18.6545C150.367 19.3049 151.054 20.0036 151.488 20.7504H152.066V18.1847H155.68V39.6498C155.68 40.7339 155.354 41.6012 154.704 42.2516C154.078 42.9021 153.21 43.2273 152.102 43.2273H140.105V39.975H150.946C151.644 39.975 151.994 39.6137 151.994 38.8909V33.2175H151.415C151.15 33.6511 150.777 34.0968 150.295 34.5545C149.813 35.0123 149.175 35.3857 148.38 35.6748C147.609 35.9639 146.633 36.1084 145.453 36.1084C143.959 36.1084 142.574 35.7591 141.297 35.0605C140.044 34.3377 139.045 33.3139 138.298 31.9888C137.551 30.6397 137.178 29.0377 137.178 27.1827ZM146.465 32.8561C148.079 32.8561 149.404 32.3502 150.44 31.3384C151.5 30.3025 152.03 28.8811 152.03 27.0743V26.7491C152.03 24.894 151.512 23.4727 150.476 22.4849C149.44 21.4731 148.103 20.9672 146.465 20.9672C144.875 20.9672 143.55 21.4731 142.49 22.4849C141.454 23.4727 140.936 24.894 140.936 26.7491V27.0743C140.936 28.8811 141.454 30.3025 142.49 31.3384C143.55 32.3502 144.875 32.8561 146.465 32.8561ZM167.52 36.5059C165.713 36.5059 164.135 36.1325 162.786 35.3857C161.437 34.6148 160.377 33.5427 159.606 32.1695C158.859 30.7722 158.486 29.1582 158.486 27.3272V26.8936C158.486 25.0386 158.859 23.4245 159.606 22.0513C160.353 20.654 161.388 19.582 162.713 18.8352C164.063 18.0642 165.616 17.6788 167.375 17.6788C169.086 17.6788 170.579 18.0642 171.856 18.8352C173.157 19.582 174.169 20.6299 174.891 21.979C175.614 23.3281 175.976 24.9061 175.976 26.7129V28.1222H162.28C162.328 29.6882 162.846 30.9409 163.834 31.8804C164.846 32.7959 166.098 33.2536 167.592 33.2536C168.989 33.2536 170.037 32.9404 170.736 32.3141C171.459 31.6877 172.013 30.965 172.398 30.1459L175.47 31.7359C175.132 32.4104 174.639 33.1211 173.988 33.8679C173.362 34.6148 172.531 35.2411 171.495 35.747C170.459 36.253 169.134 36.5059 167.52 36.5059ZM162.316 25.2675H172.181C172.085 23.9184 171.603 22.8704 170.736 22.1236C169.869 21.3527 168.736 20.9672 167.339 20.9672C165.942 20.9672 164.797 21.3527 163.906 22.1236C163.039 22.8704 162.509 23.9184 162.316 25.2675Z" fill="black"/>
</svg>
`

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

        const ff = new FileforgeClient({
            apiKey: FILEFORGE_API_KEY
        });

        const pdf = await ff.generate(
            [htmlFile, cssFile], 
            {
                options: {}
            }
        ) as ResponseStream;    
        
        // Write the PDF stream to a file
        const writeStream = fs.createWriteStream('output.pdf');
        pdf.file.pipe(writeStream);
        
    }, 10_000_000);

    it("should generate a PDF buffer with image", async () => {

        const htmlBlob = new Blob([HTML_W_IMAGE], {
            type: "text/html",
        });
        const cssBlob = new Blob([CSS], {
            type: "text/css",
        });
        const svgBlob = new Blob([SVG_LOGO], {
            type: "image/svg+xml",
        });

        const htmlFile = new File([htmlBlob], "index.html", { type: "text/html" });
        const cssFile = new File([cssBlob], "style.css", { type: "text/css" });
        const svgFile = new File([svgBlob], "logo-black.svg", { type: "image/svg+xml" });

        const ff = new FileForgeClient({
            apiKey: FILEFORGE_API_KEY
        });

        const pdf = await ff.generate(
            [htmlFile, cssFile, svgFile], 
            {
                options: {}
            }
        ) as ResponseStream;    
        
        // Write the PDF stream to a file
        const writeStream = fs.createWriteStream('output_svg.pdf');
        pdf.file.pipe(writeStream);
        
    }, 10_000_000);

    it("should generate a PDF buffer with image using helper", async () => {

        const ff = new FileForgeClient({
            apiKey: FILEFORGE_API_KEY
        });

        const documentInput = {
            html: HTML_W_IMAGE,
            fileName: 'example',
            test: false,
            host: false,
            files: [
                { path: 'style.css', content: CSS },
                { path: 'logo-black.svg', content: SVG_LOGO }
            ],
        };

        const pdf = await generate_from_html(
            ff, 
            documentInput
        ) as ResponseStream; 
        
        // Write the PDF stream to a file
        const writeStream = fs.createWriteStream('output_svg_helper.pdf');
        pdf.file.pipe(writeStream);
        
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

        const ff = new FileforgeClient({
            apiKey: FILEFORGE_API_KEY
        });

        const pdf = await ff.generate(
            [htmlFile, cssFile], 
            {
                options: {
                    host: true,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                }
            }
        ) as ResponseURL;

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

        const ff = new FileforgeClient({
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
                if (e instanceof error.FileforgeError) {
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

        const ff = new FileforgeClient({
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
            
        ) as ResponseStream;   
        // Write the PDF stream to a file
        const writeStream = fs.createWriteStream('output_helper.pdf');
        pdf.file.pipe(writeStream);

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

        const ff = new FileforgeClient({
            apiKey: FILEFORGE_API_KEY
        });

        const pdf = await generate_from_html(
            ff,
            {
                html:HTML,
                fileName:"test",
                host:true,
            }
            
        ) as ResponseURL;       
        
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

        const ff = new FileforgeClient({
            apiKey: FILEFORGE_API_KEY
        });

        const pdf = await ff.merge(
            [file1, file2],
            {   
                options: {},
            }            
        ) as ResponseStream;   
        
        // Write the PDF stream to a file
        const writeStream = fs.createWriteStream('output_merged.pdf');
        pdf.file.pipe(writeStream);

}, 10_000_000);

it("should generate from html snippet", async () => {
    try {

        const client = new FileforgeClient({
            apiKey: FILEFORGE_API_KEY
        });
        const documentInput = {
            html: HTML,
            fileName: 'example',
            test: false,
            host: false,
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
            files: [
                { path: '/style.css', content: CSS },
            ],
        };
    
        const response = await generate_from_html(client, documentInput) as ResponseStream;
        
        // Write the PDF stream to a file
        const writeStream = fs.createWriteStream('outputSnippet.pdf');
        response.file.pipe(writeStream);
        console.log('PDF generated successfully.');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }

}, 10_000_000);

});

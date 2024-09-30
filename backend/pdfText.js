import axios from 'axios';
import {PdfReader} from 'pdfreader';

async function readPDF(firebaseUrl) {
    try {
        // Fetch the PDF file from Firebase Storage
        const response = await axios.get(firebaseUrl, {
            responseType: 'arraybuffer'  // Ensure response is treated as binary data
        });

        // Parse the PDF content
        const buffer = Buffer.from(response.data);  // Convert arraybuffer to Buffer
        const allText = await parsePDF(buffer);    // Parse PDF and get all text

        return allText;
    } catch (error) {
        throw new Error(`Failed to read PDF: ${error.message}`);
    }
}

function parsePDF(buffer) {
    return new Promise((resolve, reject) => {
        const allText = [];  // Array to store all extracted text
        new PdfReader().parseBuffer(buffer, (err, item) => {
            if (err) {
                reject(err);  // Reject the promise if there's an error
            } else if (!item) {
                resolve(allText.join('\n'));  // Resolve with all text joined by newline on EOF
            } else if (item.text) {
                allText.push(item.text);  // Append text to the array
            }
        });
    });
}

// Example usage
const firebaseUrl = 'https://firebasestorage.googleapis.com/v0/b/student-sync-nie.appspot.com/o/navaneethjainsl%2FIDS.pdf?alt=media&token=9264d4a0-d41b-4bd5-8942-2e4f841dd947';
readPDF(firebaseUrl)
    .then(text => console.log('Extracted Text:', text))
    .catch(error => console.error('Error:', error));

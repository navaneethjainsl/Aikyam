import dotenv from 'dotenv/config';
import https from 'https';

const apiKey = process.env.API_KEY_OPENAI; // Replace with your actual API key
const url = 'studentsync-nie.openai.azure.com'
const path = '/openai/deployments/studentSync2/chat/completions?api-version=2024-02-15-preview';

const data = JSON.stringify({
    messages: [{ role: "system", content: "You are an AI assistant that helps students of NIE college in their studies." }, { role: "user", content: "What is the difference between java and c++" }],
    max_tokens: 800,
    temperature: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    top_p: 0.95,
    stop: null,

});

const options = {
    hostname: url,
    path: path,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey // Use Bearer token for API key
    }
};

let responseString = "Hii";
function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
        let responseData = [];

        res.on('data', (chunk) => {
            responseData.push(chunk);
        });

        res.on('end', () => {
            // Combine the buffer chunks and convert to a string
            const buffer = Buffer.concat(responseData);
            const responseString = buffer.toString('utf-8');
            resolve(responseString); // Resolve with the string
        });
        });

        req.on('error', (error) => {
            reject(error); // Reject with the error
        });

        req.write(data);
        req.end();
    });
}


async function get(){
    let responsePromise = await makeRequest(options, data);
    responsePromise = JSON.parse(responsePromise)
    console.log(responsePromise);
    console.log(responsePromise);

}

get();


// async function gotilla(){
//     const req = https.request(options, (res) => {
//         //   console.log(`statusCode: ${res.statusCode}`);
//         //   console.log('Headers:');
//         //   console.log(res.headers);
//         let responseData = [];
    
//         res.on('data', (d) => {
//             responseData.push(d);
//             // process.stdout.write(d);
//             // result = d;
//         });
    
//         res.on('end', () => {
//             // Combine the buffer chunks and convert to a string
//             const buffer = Buffer.concat(responseData);
//             responseString = buffer.toString('utf-8');
//             // resolve(responseString); // Resolve with the string
//             console.log(responseString);
//         });
//     });
    
//     req.on('error', (error) => {
//         console.error(error);
//     });
    
//     req.write(data);
//     req.end();

// } 

// function print(){
//     console.log(responseString);
// }
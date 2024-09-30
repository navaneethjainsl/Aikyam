import axios from "axios";
import dotenv from 'dotenv/config';

const config = {
  headers: {
    "x-api-key": process.env.CHATPDF_API_KEY,
    "Content-Type": "application/json",
  },
};


// Upload
const data = {
  url: "https://firebasestorage.googleapis.com/v0/b/student-sync-nie.appspot.com/o/navaneethjainsl%2FIDS.pdf?alt=media&token=9264d4a0-d41b-4bd5-8942-2e4f841dd947",
};

axios
  .post("https://api.chatpdf.com/v1/sources/add-url", data, config)
  .then((response) => {
    console.log("Source ID:", response.data.sourceId);
  })
  .catch((error) => {
    console.log("Error:", error.message);
    console.log("Response:", error.response.data);
});



// // Chat
// const data = {
//     sourceId: "src_Ow0hS4Hgug0UDCy0rnsse",
//     messages: [
//       {
//         role: "user",
//         content: "what is Linear Regression?",
//       },
//     ],
// };
  
// axios
// .post("https://api.chatpdf.com/v1/chats/message", data, config)
// .then((response) => {
//     console.log("Result:", response.data.content);
// })
// .catch((error) => {
//     console.error("Error:", error.message);
//     console.log("Response:", error.response.data);
// });

// // Response
// const config = {
//     headers: {
//         "x-api-key": process.env.CHATPDF_API_KEY,
//         "Content-Type": "application/json",
//     },
//     responseType: "stream",
// };

// const data = {
//     stream: true,
//     sourceId: "src_Ow0hS4Hgug0UDCy0rnsse",
//     messages: [
//       {
//         role: "user",
//         content: "what is Linear Regression?",
//       },
//     ],
// };
  
// axios
// .post("https://api.chatpdf.com/v1/chats/message", data, config)
// .then((response) => {
//     const stream = response.data;
//     if (!stream) {
//     throw new Error("No data received");
//     }
//     stream.on("data", (chunk) => {
//     const text = chunk.toString();
//     console.log("Chunk:", text);
//     });

//     stream.on("end", () => {
//     console.log("End of stream");
//     });
// })
// .catch((error) => {
//     console.error("Error:", error.message);
// });


// // Delete
// const data = {
//     sources: ["src_Ow0hS4Hgug0UDCy0rnsse"],
// };
  
// axios
// .post("https://api.chatpdf.com/v1/sources/delete", data, config)
// .then((response) => {
//     console.log("Success");
// })
// .catch((error) => {
//     console.error("Error:", error.message);
//     console.log("Response:", error.response.data);
// });
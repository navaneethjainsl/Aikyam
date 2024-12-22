import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const chatSchema = new Schema({
    role: { type: String},
    parts: [
        {
            text: { type: String}
        },
        { _id: false }
    ]
},
{ _id: false });

const DocumentSchema = new mongoose.Schema({
    username: { type: String},
    chatbot: [chatSchema]
});

function getUserDocument(username){
    const Document = mongoose.model(username, DocumentSchema, username);
    // Document.createIndexes();
    return Document
}

export default getUserDocument;
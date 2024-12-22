import express from 'express';
import { body, validationResult } from 'express-validator'
import { name } from 'ejs';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fetchuser from '../Middleware/fetchuser.js';
import User from '../models/user.js';
import getUserDocument from '../models/document.js';
import model from '../models/geminiModel.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET


// Jarvis Assistant: POST 'http://localhost:5000/api/user/voice/assistant'
router.post('/voice/assistant', (req, res) => {
    const query = req.body.query

    console.log(query);
});

// Sign Language Detection Tab: POST 'http://localhost:5000/api/user/signup'
router.post('/recognize', fetchuser, async (req, res) => {
    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)


// Sign Language Detection Tab: GET 'http://localhost:5000/api/user/chatbot'
router.get('/chatbot', fetchuser, async (req, res) => {
    const username = "navaneethjainsl18"
    const userMessage = req.body.question;
    // const userMessage = "This is testing code. How are you?"
    console.log(userMessage)
    const Document = await getUserDocument(username)

    try {
        const doc = await Document.findOne({ username: `${username}` });
        console.log("doc")
        console.log(doc)
        if (!doc) {
            return res.status(400).json({ success: false, message: 'User Chat not found' });
        }

        let messages = doc.chatbot
        console.log("messages")
        console.log(messages)

        const chat = model.startChat({
            history: messages,
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        messages = [...messages,
        {
            role: "user",
            parts: [{ text: userMessage }],
        }
        ]

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();

        messages = [...messages,
            {
                role: "model",
                parts: [{ text: text }],
            }
        ]
        
        await Document.findOneAndUpdate(
            { username: username },
            {
                $set: {
                    chatbot: messages
                }
            },
            { new: true }
        );

        console.log(text);

        res.status(200).json({ success: true, message: text })
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)

// // Sign Language Detection Tab: POST 'http://localhost:5000/api/user/chatbot'
// router.post('/chatbot', fetchuser, async (req, res) => {
//     try {

//     }
//     catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// }
// )


// Sign Language Detection Tab: GET 'http://localhost:5000/api/user/multimedia'
router.get('/multimedia', fetchuser, async (req, res) => {
    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)

// Sign Language Detection Tab: POST 'http://localhost:5000/api/user/multimedia'
router.post('/multimedia', fetchuser, async (req, res) => {
    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)


// Sign Language Detection Tab: GET 'http://localhost:5000/api/user/learn'
router.get('/learn', fetchuser, async (req, res) => {
    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)

// Sign Language Detection Tab: POST 'http://localhost:5000/api/user/learn'
router.post('/learn', fetchuser, async (req, res) => {
    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)


// Sign Language Detection Tab: GET 'http://localhost:5000/api/user/accessibility'
router.get('/accessibility', fetchuser, async (req, res) => {
    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)

// Sign Language Detection Tab: POST 'http://localhost:5000/api/user/accessibility'
router.post('/accessibility', fetchuser, async (req, res) => {
    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)


// Sign Language Detection Tab: GET 'http://localhost:5000/api/user/profile'
router.get('/profile', fetchuser, async (req, res) => {
    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)

// Sign Language Detection Tab: POST 'http://localhost:5000/api/user/profile'
router.post('/profile', fetchuser, async (req, res) => {
    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)

export default router;
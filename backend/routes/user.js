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
import NewsAPI from 'newsapi';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

const newsapi = new NewsAPI(process.env.NEWSAPI_API);

// Jarvis Assistant: POST 'http://localhost:5000/api/user/voice/assistant'
// Key: T1 -> Redirect to SIGN DETECTION TAB
//      T2 -> Redirect to CHAT BOT TAB
//      T3 -> Redirect to MULTIMEDIA TAB
//      T4 -> Redirect to ACCESSIBILITY TAB
//      T5 -> Redirect to JOBS and SCHEMES TAB
//      none -> LLM will give the answer
router.get('/voice/assistant', async (req, res) => {
    const query = req.body.query
    console.log(query);

    const userMessage = `check if the given sentence is similar/closer to any one of the given sentences and return the sentence id. If none return none \nQuery: ${query}\nT1: Go to sign detection tab\nT2: Go to chat bot\nT3: Go to ( multimedia / OCR / Text to speech / speech to text / Interactive learning ) section\nT4: Go to accessibility section\nT5: Go to Jobs / Schemes section\nT6: Go to profile section\n Give the answer in one word`

    let messages = []
    // {
    //     role: "system",
    //     parts: [{ text: "Give the answer in one word" }],
    // }

    const system_instructions = "Give the answer in one word"

    const chat = model.startChat({
        system_instructions: system_instructions,
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

    if (text.toLowerCase().includes("none")) {
        const result = await model.generateContent(query);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        res.status(200).json({ success: true, message: text })
        return
    }

    res.status(200).json({ success: true, message: text })
});

// // Sign Language Detection Tab: POST 'http://localhost:5000/api/user/signup'
// router.post('/recognize', fetchuser, async (req, res) => {
//     try {

//     }
//     catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// }
// )


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

// Jobs and schemes Tab: GET 'http://localhost:5000/api/user/schemes'
router.get('/schemes', fetchuser, async (req, res) => {
    try {
        schemes = [
            "https://nationaltrust.nic.in/niramaya-e-card/",
            "https://nationaltrust.nic.in/disha/",
            "https://nationaltrust.nic.in/vikaas/",
            "https://nationaltrust.nic.in/gharaunda/",
            "https://nationaltrust.nic.in/samarth/",
            "https://nationaltrust.nic.in/badhte-kadam-scheme/",
        ]

        res.status(200).json({ success: true, message: schemes })
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)

// Jobs and schemes Tab: GET 'http://localhost:5000/api/user/jobs'
router.get('/jobs', fetchuser, async (req, res) => {
    try {
        const jobs = [
            "https://divyangcareer.com/jobs/locomotor-disability/job-description-assistant-to-the-founder-online-french-coaching-business/",
            "https://divyangcareer.com/jobs/physical-disability/telecaller-at-careerinpharma/",
            "https://divyangcareer.com/jobs/physical-disability/assistant-manager-milk-plant/",
            "https://divyangcareer.com/jobs/speech-and-language-disability/package-job/",
            "https://divyangcareer.com/jobs/physical-disability/data-entry-operator-2/",
            "https://divyangcareer.com/jobs/locomotor-disability/customer-care-executive-2/",
            "https://divyangcareer.com/jobs/multiple-sclerosis/computer-science/",
            "https://divyangcareer.com/jobs/multiple-disabilities/waiter-steward-delivery/",
            "https://divyangcareer.com/jobs/locomotor-disability/video-kyc-analyst/",
            "https://divyangcareer.com/jobs/locomotor-disability/punjabi-teacher/",
            "https://divyangcareer.com/jobs/multiple-disabilities/remote-internet-assessor-urdu-speakers/",
            "https://divyangcareer.com/jobs/multiple-disabilities/full-time-writer-analyst-bengali-speakers/",
            "https://divyangcareer.com/jobs/multiple-disabilities/at-home-internet-assessor-punjabi-speakers/",
            "https://divyangcareer.com/jobs/multiple-disabilities/homebased-sindhi-speaking-internet-rater/",
            "https://divyangcareer.com/jobs/blood-disorder/pharmacist-required-dpharm/",
            "https://divyangcareer.com/jobs/jobs-categories/junior-environmental-engineer/",
        ];

        otherJobs = [
            "https://www.swarajability.org/apply-job/5228",
            "https://www.swarajability.org/apply-job/5227",
            "https://www.swarajability.org/apply-job/5226",
            "https://www.swarajability.org/apply-job/5225",
            "https://www.swarajability.org/apply-job/5224",
            "https://www.swarajability.org/apply-job/5223",
            "https://www.swarajability.org/apply-job/5222",
        ]

        res.status(200).json({ success: true, message: [...jobs, ...otherJobs] })
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)


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


// // Sign Language Detection Tab: GET 'http://localhost:5000/api/user/learn'
// router.get('/learn', fetchuser, async (req, res) => {
//     try {

//     }
//     catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// }
// )

// // Sign Language Detection Tab: POST 'http://localhost:5000/api/user/learn'
// router.post('/learn', fetchuser, async (req, res) => {
//     try {

//     }
//     catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// }
// )


// // Sign Language Detection Tab: GET 'http://localhost:5000/api/user/accessibility'
// router.get('/accessibility', fetchuser, async (req, res) => {
//     try {

//     }
//     catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// }
// )

// // Sign Language Detection Tab: POST 'http://localhost:5000/api/user/accessibility'
// router.post('/accessibility', fetchuser, async (req, res) => {
//     try {

//     }
//     catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// }
// )


// // Sign Language Detection Tab: GET 'http://localhost:5000/api/user/profile'
// router.get('/profile', fetchuser, async (req, res) => {
//     try {

//     }
//     catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// }
// )

// // Sign Language Detection Tab: POST 'http://localhost:5000/api/user/profile'
// router.post('/profile', fetchuser, async (req, res) => {
//     try {

//     }
//     catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// }
// )

export default router;
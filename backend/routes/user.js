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
// import { gql, request } from 'graffle'
// import pkg from 'graffle';
// const { gql, request } = pkg;

import fetch from 'node-fetch';//mine

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

const newsapi = new NewsAPI(process.env.NEWSAPI_API);
// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// // Hash password before saving
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// Jarvis Assistant: POST 'http://localhost:5000/api/user/voice/assistant'
// Key: T1 -> Redirect to SIGN DETECTION TAB
//      T2 -> Redirect to CHAT BOT TAB
//      T3 -> Redirect to MULTIMEDIA TAB
//      T4 -> Redirect to ACCESSIBILITY TAB
//      T5 -> Redirect to JOBS and SCHEMES TAB
//      none -> LLM will give the answer
router.get('/voice/assistant', async (req, res) => {
    const query = req.query.query
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

// // Sign Language Detection Tab: POST 'http://localhost:5000/api/user/recognize'
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
    const userMessage = req.query.question;
    // const userMessage = "This is testing code. How are you?"
    console.log(userMessage)
    const Document = await getUserDocument(username)

    try {
        const doc = await Document.findOne({ username: `${username}` });
        console.log("doc")
        console.log(doc)
        if (!doc) {
            return res.json({ success: false, message: 'User Chat not found' });
        }

        let messages = doc.chatbot
        console.log("messages")
        console.log(messages)

        const chat = model.startChat({
            history: messages,
            generationConfig: {
                maxOutputTokens: 3000,
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
        const text = await response.text();

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
        const schemes = [
            {
                id: 1,
                title: "Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances (ADIP)",
                organization: "Ministry of Social Justice and Empowerment",
                provider: "Ministry of Social Justice and Empowerment",
                category: "Equipment Support",
                eligibility: "Persons with 40% disability and below monthly income of ₹20,000",
                benefits: "Financial assistance for assistive devices",
                description: "Up to 100% cost covered based on income criteria",
                link: "#",
                tags: ["Featured", "Equipment Support"],
                deadline: "Ongoing"
            },
            {
                id: 2,
                title: "Scholarship for Students with Disabilities",
                organization: "Department of Empowerment of Persons with Disabilities",
                provider: "Department of Empowerment of Persons with Disabilities",
                category: "Education",
                eligibility: "Students with disabilities pursuing higher education",
                benefits: "Financial support for education expenses",
                description: "Monthly stipend and annual grants for educational materials",
                link: "#",
                tags: ["Education", "Financial Aid"],
                deadline: "October 31, 2025"
            }
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
            {
                id: 1,
                title: "Assistant Manager - Milk Plant",
                company: "Divyang Career",
                location: "Pune",
                type: "Full-time",
                salary: "₹35,000 - ₹50,000/month",
                description: "Oversee the operations of the milk plant and ensure efficiency in production and distribution.",
                link: "https://divyangcareer.com/jobs/physical-disability/assistant-manager-milk-plant/",
                category: "Administrative",
                tags: ["Featured", "Full-time", "Administrative"],
                postedDate: "3 days ago"
            },
            {
                id: 2,
                title: "Package Job",
                company: "Speech and Language Disability Careers",
                location: "Bangalore",
                type: "Contract",
                salary: "₹25,000/month",
                description: "Pack and organize products as per the requirements. No prior experience required.",
                link: "https://divyangcareer.com/jobs/speech-and-language-disability/package-job/",
                category: "Administrative",
                tags: ["Contract", "Administrative"],
                postedDate: "1 week ago"
            },
            {
                id: 3,
                title: "Data Entry Operator",
                company: "Divyang Career",
                location: "Mumbai",
                type: "Full-time",
                salary: "₹12,000 - ₹18,000/month",
                description: "Perform accurate data entry tasks. Basic computer knowledge required.",
                link: "https://divyangcareer.com/jobs/physical-disability/data-entry-operator-2/",
                category: "Administrative",
                tags: ["Featured", "Full-time", "Administrative"],
                postedDate: "2 days ago"
            },
            {
                id: 4,
                title: "Customer Care Executive",
                company: "Divyang Career",
                location: "Delhi",
                type: "Full-time",
                salary: "₹20,000 - ₹30,000/month",
                description: "Provide support to customers by addressing queries and resolving issues.",
                link: "https://divyangcareer.com/jobs/locomotor-disability/customer-care-executive-2/",
                category: "Administrative",
                tags: ["Full-time", "Administrative"],
                postedDate: "5 days ago"
            },
            {
                id: 5,
                title: "Computer Science Specialist",
                company: "Multiple Sclerosis Careers",
                location: "Bangalore",
                type: "Full-time",
                salary: "₹40,000 - ₹70,000/month",
                description: "Work on cutting-edge computer science projects to support research and development.",
                link: "https://divyangcareer.com/jobs/multiple-sclerosis/computer-science/",
                category: "Technology",
                tags: ["Featured", "Full-time", "Technology"],
                postedDate: "4 days ago"
            },
            {
                id: 6,
                title: "Waiter/Steward/Delivery",
                company: "Multiple Disabilities Careers",
                location: "Chennai",
                type: "Full-time",
                salary: "₹15,000 - ₹25,000/month",
                description: "Serve customers in restaurants or handle delivery tasks efficiently.",
                link: "https://divyangcareer.com/jobs/multiple-disabilities/waiter-steward-delivery/",
                category: "Administrative",
                tags: ["Full-time", "Administrative"],
                postedDate: "1 week ago"
            },
            {
                id: 7,
                title: "Video KYC Analyst",
                company: "Divyang Career",
                location: "Kolkata",
                type: "Full-time",
                salary: "₹25,000 - ₹35,000/month",
                description: "Analyze KYC data via video interactions. Good communication skills are a must.",
                link: "https://divyangcareer.com/jobs/locomotor-disability/video-kyc-analyst/",
                category: "Technology",
                tags: ["Featured", "Full-time", "Technology"],
                postedDate: "3 days ago"
            },
            {
                id: 8,
                title: "Punjabi Teacher",
                company: "Divyang Career",
                location: "Amritsar",
                type: "Part-time",
                salary: "₹20,000/month",
                description: "Teach Punjabi language to students online or offline.",
                link: "https://divyangcareer.com/jobs/locomotor-disability/punjabi-teacher/",
                category: "Education",
                tags: ["Featured", "Part-time", "Education"],
                postedDate: "2 days ago"
            },
            {
                id: 9,
                title: "Remote Internet Assessor (Urdu Speakers)",
                company: "Multiple Disabilities Careers",
                location: "Remote",
                type: "Part-time",
                salary: "₹10,000 - ₹15,000/month",
                description: "Evaluate internet content quality in Urdu. Requires native proficiency.",
                link: "https://divyangcareer.com/jobs/multiple-disabilities/remote-internet-assessor-urdu-speakers/",
                category: "Technology",
                tags: ["Part-time", "Technology"],
                postedDate: "4 days ago"
            },
            {
                id: 10,
                title: "Full-time Writer/Analyst (Bengali Speakers)",
                company: "Multiple Disabilities Careers",
                location: "Kolkata",
                type: "Full-time",
                salary: "₹20,000 - ₹30,000/month",
                description: "Analyze and create content in Bengali. Writing skills are essential.",
                link: "https://divyangcareer.com/jobs/multiple-disabilities/full-time-writer-analyst-bengali-speakers/",
                category: "Technology",
                tags: ["Featured", "Full-time", "Technology"],
                postedDate: "2 days ago"
            },
            {
                id: 11,
                title: "At-home Internet Assessor (Punjabi Speakers)",
                company: "Multiple Disabilities Careers",
                location: "Remote",
                type: "Part-time",
                salary: "₹12,000/month",
                description: "Assess Punjabi internet content for quality and relevance.",
                link: "https://divyangcareer.com/jobs/multiple-disabilities/at-home-internet-assessor-punjabi-speakers/",
                category: "Technology",
                tags: ["Part-time", "Technology"],
                postedDate: "6 days ago"
            },
            {
                id: 12,
                title: "Homebased Sindhi Speaking Internet Rater",
                company: "Multiple Disabilities Careers",
                location: "Remote",
                type: "Part-time",
                salary: "₹10,000 - ₹15,000/month",
                description: "Evaluate and rate internet content in Sindhi. Requires native-level fluency.",
                link: "https://divyangcareer.com/jobs/multiple-disabilities/homebased-sindhi-speaking-internet-rater/",
                category: "Technology",
                tags: ["Part-time", "Technology"],
                postedDate: "3 days ago"
            },
            {
                id: 13,
                title: "Pharmacist (DPharm)",
                company: "Divyang Career",
                location: "Chennai",
                type: "Full-time",
                salary: "₹30,000 - ₹50,000/month",
                description: "Dispense medicines and counsel patients. DPharm qualification required.",
                link: "https://divyangcareer.com/jobs/blood-disorder/pharmacist-required-dpharm/",
                category: "Healthcare",
                tags: ["Featured", "Full-time", "Healthcare"],
                postedDate: "1 day ago"
            },
            {
                id: 14,
                title: "Junior Environmental Engineer",
                company: "Divyang Career",
                location: "Pune",
                type: "Full-time",
                salary: "₹40,000 - ₹60,000/month",
                description: "Work on environmental projects to promote sustainability.",
                link: "https://divyangcareer.com/jobs/jobs-categories/junior-environmental-engineer/",
                category: "Technology",
                tags: ["Full-time", "Technology"],
                postedDate: "5 days ago"
            },
            {
                id: 15,
                title: "Apply Job 5228",
                company: "Swarajability",
                location: "Remote",
                type: "Contract",
                salary: "₹15,000 - ₹25,000/month",
                description: "Work on unique assignments as part of the Swarajability initiative.",
                link: "https://www.swarajability.org/apply-job/5228",
                category: "Administrative",
                tags: ["Contract", "Administrative"],
                postedDate: "2 days ago"
            }
            // Add more jobs as needed
        ]


        const otherJobs = [
            // "https://www.swarajability.org/apply-job/5228",
            // "https://www.swarajability.org/apply-job/5227",
            // "https://www.swarajability.org/apply-job/5226",
            // "https://www.swarajability.org/apply-job/5225",
            // "https://www.swarajability.org/apply-job/5224",
            // "https://www.swarajability.org/apply-job/5223",
            // "https://www.swarajability.org/apply-job/5222",
        ]

        res.status(200).json({ success: true, message: [...jobs, ...otherJobs] })
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)

//mine
// Function to fetch news articles from NewsAPI
const fetchNewsArticles = async (query) => {

    const newsResponse = await newsapi.v2.everything({
        q: query,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 5,
    });

    if (newsResponse.status !== 'ok') {
        throw new Error('Failed to fetch multimedia content from NewsAPI.');
    }

    return newsResponse.articles.map((article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
    }));
};

// Function to fetch podcasts from Podcast API
const fetchPodcasts = async (str) => {
    console.log(str)
    const podcastApiUrl = 'https://api.taddy.org';
    const headers = {
        'Content-Type': 'application/json',
        'X-USER-ID': 2233,
        'X-API-KEY': process.env.PODCAST_API, // Replace with your actual API key
    };

    const body = JSON.stringify({
        query: `{ getPodcastSeries(name: "${str}") { uuid name rssUrl } }`,
    });

    try {
        const response = await fetch(podcastApiUrl, {
            method: 'POST',
            headers: headers,
            body: body,
        });
        console.log(response)
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch podcast series: ${errorText}`);
        }

        const data = await response.json();
        console.log("data")
        // console.log(data)
        return data;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};
//end mine
// Sign Language Detection Tab: GET 'http://localhost:5000/api/user/news'
router.get('/news', fetchuser, async (req, res) => {
    try {
        const query = "Sensory Disabled";

        const articles = await fetchNewsArticles(query);
        //console.log(podcasts)
        res.status(200).json({
            success: true,
            multimedia: {
                articles,
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)

// Sign Language Detection Tab: GET 'http://localhost:5000/api/user/podcast'
router.get('/podcast', fetchuser, async (req, res) => {
    try {
        const query = "Sensory Disabled";

        const podcasts = await fetchPodcasts(query);
        console.log(podcasts)
        res.status(200).json({
            success: true,
            multimedia: {
                podcasts,
            }
        });

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
)

// Sign Language Detection Tab: POST 'http://localhost:5000/api/user/multimedia'
// router.post('/multimedia', fetchuser, async (req, res) => {
//     try {
//         const query = "pwd";  // Replace with your dynamic query logic if needed

//         // Fetch news articles and podcasts
//         // const articles = await fetchNewsArticles(query);
//         const podcasts = await fetchPodcasts(query);
// console.log(podcasts)
//         // Combine both articles and podcasts and send the response
//         res.status(200).json({
//             success: true,
//             multimedia: {
//                 articles,
//                 podcasts,
//             }
//         });
//     }
//     catch (err) {
//         console.error('Error fetching multimedia data2:', err.message);
//         res.status(500).json({ success: false, error: err.message });
//     }
// }
// );


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
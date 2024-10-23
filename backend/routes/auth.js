import express from 'express';
import User from '../models/user.js';
import {body, validationResult} from 'express-validator'
import { name } from 'ejs';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fetchuser from '../Middleware/fetchuser.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

router.post('/signup',
    [
        body('name', "Name should have atleast 2 letters").isLength({ min: 2 }),
        body('username', "Password should have atleast 5 characters").isLength({ min: 5 }),
        body('password', "Password should have atleast 5 characters").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = await User.findOne({ username: `${req.body.username}` });
        // console.log(user);
        
        if(user){
            return res.status(400).json({
                success: false, 
                message: 'Username already exists'
            });
            
        }

        try{

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
            let user = await User.create({
                name: req.body.name,
                username: req.body.username,
                password: hashedPassword,
            });

            const data = {
                user: {
                    id: user._id,
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)
            
            return res.status(200).json({ success: true, authtoken });
        }
        catch(err){
            res.status(500).json({ success: false, error: err.message });
        }

    }
);

router.post('/login', 
    [
        body('username', "Password should have atleast 5 characters").isLength({ min: 5 }),
        body('password', "Password should have atleast 5 characters").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {username, password} = req.body;

        
        try{
            
            const user = await User.findOne({ username: `${req.body.username}` });
            if(!user){
                return res.status(400).json({ success: false, message: 'Login with correct credentials' });
            }
            
            const pwdCompare = await bcrypt.compare(password, user.password);
            if(!pwdCompare){
                return res.status(400).json({ success: false, message: 'Login with correct credentials' });
            }
            
            const data = {
                user: {
                    id: user._id,
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)
            
            return res.status(200).json({ success: true, authtoken });
        }
        catch(err){
            res.status(500).json({ success: false, error: err.message });
        }

    }
)

router.post('/getuser', fetchuser, async (req, res) => {
        try{
            const userId = req.user.id;
            const user = await User.findById(userId).select("-password");
            return res.status(200).json({ success: true, user });
        }
        catch(err){
            res.status(500).json({ success: false, error: err.message });
        }
    }
)

export default router;
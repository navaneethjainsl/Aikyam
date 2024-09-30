import fileUpload from 'express-fileupload';

import mongodb from 'mongodb';
import {MongoClient} from "mongodb";
import mongoose  from "mongoose";

import ejs from "ejs";
import lodash from "lodash";
import bodyParser from "body-parser";
import dotenv from 'dotenv/config';
import fs from 'fs';

import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import {Strategy} from 'passport-local';
import bcrypt from 'bcrypt-nodejs';
import cookieParser from 'cookie-parser';

import axios from "axios";
import cors from "cors";

import { PdfReader } from "pdfreader";

import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

const port = process.env.PORT || 3000;

// dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileUpload());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // allow session cookie from browser to pass through
}));
app.use((req, res, next) => {
    // access-control-allow-origin http://localhost:5173
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use(cookieParser());
// app.use(cors());

app.use(session({
    secret: "aikyam",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    } 
}));

app.use(passport.initialize());
app.use(passport.session());

////////////////////////////////////////////////////NJ////////////////////////////////////////////////////



////////////////////////////////////////////////////Chinmayi////////////////////////////////////////////////////



////////////////////////////////////////////////////Chaithra////////////////////////////////////////////////////



////////////////////////////////////////////////////Amrutha////////////////////////////////////////////////////



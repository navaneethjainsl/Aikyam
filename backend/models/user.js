import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: false,
        default: "",
    },
    phone:{
        type: Number,
        required: false,
    },
    address:{
        type: String,
        required: false,
        unique: false,
        deafult: "",
    },
    bio:{
        type: String,
        required: false,
        unique: false,
        deafult: "",
    },
    password:{
        type: String,
        required: true,
    }
});

const User = mongoose.model("user", userSchema);
User.createIndexes();

export default User;
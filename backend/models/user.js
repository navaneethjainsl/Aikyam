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
    password:{
        type: String,
        required: true,
    }
});

const User = mongoose.model("user", userSchema);
User.createIndexes();

export default User;
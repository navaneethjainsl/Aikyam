import mongoose from 'mongoose';
import dotenv from 'dotenv/config';

const uri = process.env.MONGODB_URI;

const connectToFirebase = ()=>{
    
    const appf = initializeApp(firebaseConfig);

    const dbf = getFirestore(appf);
    const storage = getStorage();
}

export default connectToFirebase
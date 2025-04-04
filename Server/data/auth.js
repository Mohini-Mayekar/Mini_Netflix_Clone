import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { validateEmail, validatePass } from '../helper.js';

const saltRounds = 16;

const getUserByEmail = async (email) => {
    email = validateEmail(email, 'Email');
    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ email: email });
    if (existingUser != null) throw `User with email ${email} already exist.`;
    //delete existingUser._id;
    return existingUser;
}

const registerUser = async (email, pass) => {
    email = validateEmail(email, 'Email');
    pass = validatePass(pass, 'Password');
    const hash = await bcrypt.hash(pass, saltRounds);
    let newUser = {
        email: email,
        pass: hash,
        watchlist: []
    }
    const usersCollection = await users();
    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add user';

    return { signupCompleted: true };
}


export default {
    getUserByEmail, registerUser
}




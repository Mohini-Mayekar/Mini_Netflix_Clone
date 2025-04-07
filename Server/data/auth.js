import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { validateEmail, validatePass } from '../helper.js';

const saltRounds = 16;

const checkDuplicateEmail = async (email) => {
    email = validateEmail(email, 'Email');
    email = email.toLowerCase();
    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ email: email });
    if (existingUser != null) throw `User with email ${email} already exist.`;
    //delete existingUser._id;
    return existingUser;
}

const getUserByEmail = async (email) => {
    email = validateEmail(email, 'Email');
    email = email.toLowerCase();
    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ email: email });
    if (existingUser == null) throw `User with email ${email} does not exist.`;
    //delete existingUser._id;
    return existingUser;
}

const registerUser = async (email, pass) => {
    email = validateEmail(email, 'Email');
    email = email.toLowerCase();
    pass = validatePass(pass, 'Password');
    const hash = await bcrypt.hash(pass, saltRounds);
    let newUser = {
        email: email,
        pass: hash,
        watchlist: [],
        refreshToken: null
    }
    const usersCollection = await users();
    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add user';

    return { signupCompleted: true };
}

const updateToken = async (email, token) => {
    const usersCollection = await users();
    email = email.toLowerCase();
    await usersCollection.updateOne(
        { email: email },
        { $set: { refreshToken: token } }
    );
}

const getToken = async (email, token) => {
    const usersCollection = await users();
    email = email.toLowerCase();
    const user = await usersCollection.findOne({
        email: email,
        refreshToken: token
    });
    return user;
}


export default {
    getUserByEmail, registerUser, checkDuplicateEmail, updateToken, getToken
}




import { ObjectId } from "mongodb";

let checkUndefinedOrNull = (obj, variable) => {
    if (obj === undefined || obj === null) throw `All fields need to have valid values. Input for '${variable || 'provided variable'}' param is undefined or null.`;
};

let checkisValidString = (str, variable) => {
    //check input type is string
    if (typeof str !== 'string') throw `Input '${variable || 'provided'}' of value '${str || 'provided variable'}' is not a string.`;
    //empty string or has only spaces
    if ((str.replaceAll(/\s/g, '').length) === 0) throw `Input '${variable || 'provided'}' string of value '${str}' has just spaces or is an empty string.`;
    return str.trim();
};

export const validateId = (id, variable) => {
    checkUndefinedOrNull(id, variable);
    id = checkisValidString(id, variable);
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    return id;
};

export const validateIdStrInt = (id, variable) => {
    checkUndefinedOrNull(id, variable);
    id = checkisValidString(id, variable);
    if ((isNaN(id))) throw 'invalid ID';
    return id;
};

export const errorMsg = (e) => {
    return { error: e.message ? e.message : e }
}

export const usernamePattern = new RegExp(/^[a-zA-Z0-9]{8,20}$/);

export const emailPattern = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

export const passPattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/);

export const validateUserName = (username, variable) => {
    checkUndefinedOrNull(username, variable);
    username = checkisValidString(username, variable);
    if (!usernamePattern.test(username)) throw 'Username must be 8-20 characters long and contain only letters and numbers!';
    return username;
}

export const validateEmail = (email, variable) => {
    checkUndefinedOrNull(email, variable);
    email = checkisValidString(email, variable);
    if (!emailPattern.test(email)) throw 'Please enter a valid email address in the format: johndoe@example.com.';
    return email;
}

export const validatePass = (pass, variable) => {
    checkUndefinedOrNull(pass, variable);
    pass = checkisValidString(pass, variable);
    if (!passPattern.test(pass)) throw 'Password must be 8-20 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.';
    return pass;
}
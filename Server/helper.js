import { ObjectId } from "mongodb";

export const validateId = (id, variable) => {
    checkUndefinedOrNull(id, variable);
    id = checkisValidString(id, variable);
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    return id;
};
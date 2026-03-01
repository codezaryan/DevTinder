const validator = require('validator');

const validateSignUpData = (req) => {
    const {firstName, lastName, email, password, age, gender} = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is invalid!");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is invalid!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password should be strong!");
    }
}

module.exports = {validateSignUpData}
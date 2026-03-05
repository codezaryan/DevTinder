const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password, age, gender } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is invalid!");
    }
    else if (!validator.isEmail(email)) {
        throw new Error("Email is invalid!");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Password should be strong!");
    }
    
    // Convert email to lowercase for consistent validation
    req.body.email = email.toLowerCase();
}

const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "email","photoUrl", "gender", "age", "about", "skills"];
    const isEditAllowed = Object.keys(req.body).every((field)=> allowedEditFields.includes(field));
    
    // Also ensure password is not being edited through profile
    if (req.body.password) {
        return false;
    }
    
    return isEditAllowed;
}

module.exports = { validateSignUpData, validateProfileEditData }
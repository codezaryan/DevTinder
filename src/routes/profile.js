const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validator");
const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async(req, res) => {
    try{
        if(!validateProfileEditData(req)) { throw new Error("Invalid Edit Request!")};
        const loggedInUser = req.user;

        // loggedInUser.firstName = req.body.firstName; {bad way}
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));
        await loggedInUser.save();

        res.send({
            message:`${loggedInUser.firstName}, Profile updated successfully!`,
            data: loggedInUser
        });

    } catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = profileRouter

// const express = require("express");
// const { userAuth } = require("../middlewares/auth");
// const { validateProfileEditData } = require("../utils/validator");
// const User = require("../models/user");
// const profileRouter = express.Router();

// profileRouter.get('/profile/view', userAuth, async (req, res) => {
//     try {
//         res.send(req.user);
//     } catch (err) {
//         res.status(400).send("Error: " + err.message);
//     }
// });

// profileRouter.patch('/profile/edit', userAuth, async(req, res) => {
//     try{
//         if(!validateProfileEditData(req)) throw new Error("Invalid Edit Request!");
//         const loggedInUser = req.user;
//         const userId = loggedInUser._id;
        
//         console.log("User ID:", userId);
//         console.log("Update data:", req.body);

//         // Use findByIdAndUpdate to directly update in DB
//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { $set: req.body },
//             { runValidators: true, new: true }
//         );

//         if (!updatedUser) {
//             throw new Error("User not found!");
//         }

//         console.log("Updated user:", updatedUser);
//         res.send(`${updatedUser.firstName}, Profile updated successfully!`);

//     } catch(err){
//         res.status(400).send("Error: " + err.message);
//     }
// })

// module.exports = profileRouter
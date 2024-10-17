const express = require('express');
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");
const bcrypt =require('bcrypt');
const saltRounds =10;

const signupBody = zod.object({
    username: zod.string().email(),
	name: zod.string(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = await User.create({
        username: req.body.username,
        password: hashedPassword,
        name: req.body.name
    })

    const userId = user._id;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);
    res.json({
        message: "User created successfully",
        token: token,
        user: { username: user.username, name: user.name,img:"",phone:"",about:"" }
    })
})


const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username
    });

    if (!user) {
        return res.status(411).json({
            message: "User not found"
        });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
        return res.status(411).json({
            message: "Incorrect password"
        });
    }
    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET);

    res.json({
        token: token,
        user: { username: user.username, name: user.name,img:null,phone:null,about:null }
    });
    
})

router.post("/verifytoken",authMiddleware, (req, res) => {
    res.status(200).json({ valid: true });
});

module.exports = router;
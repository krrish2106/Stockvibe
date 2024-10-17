const express = require('express');
const userRouter = require("./user");
const stockRouter = require("./stocks");

const router = express.Router();

router.use("/user", userRouter);
router.use("/stocks", stockRouter);

module.exports = router;
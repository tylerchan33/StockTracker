const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')
const user = require('../models/user')
const methodOverride = require("method-override")

router.use(methodOverride("_method"))

router.get("/", (req, res) => {
    res.send("hi")
})

module.exports = router
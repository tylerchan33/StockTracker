const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')

router.get("/", (req, res) => {
    res.send("hello from the stocks")
})

module.exports = router
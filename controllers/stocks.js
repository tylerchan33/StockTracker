const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')

router.get("/", (req, res) => {
    res.render("stocks/search.ejs")
})

router.get("/search", (req, res) => {
    console.log(req.query)
    const url = `https://api.finage.co.uk/last/trade/stock/${req.query.symbols}?apikey=${process.env.API_KEY}`
    console.log(url)
    axios.get(url)
        .then(response => {
            console.log("response:", response.data)
            console.log(response.data.price)
            res.render('stocks/stocks.ejs', { 
                stocks: response.data
             })
        })
        .catch(console.log)
  })

module.exports = router
const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')
const user = require('../models/user')

router.get("/", (req, res) => {
    res.render("stocks/search.ejs")
})

router.get("/search", async (req, res) => {
    try {
    console.log(req.query)
    const url = `https://api.twelvedata.com/quote?symbol=${req.query.symbols}&apikey=${process.env.API_KEY}&source=docs`
    console.log(url)
    axios.get(url)
        .then(response => {
            res.render('stocks/stocks.ejs', { 
                stocks: response.data
             })
        })
    } catch(err) {
        console.log(err)
        res.send("server error")
    }
  })

router.get("/add", (req, res) => {
    res.render("stocks/add.ejs")
})

router.post("/add", async (req, res) => {
   try{
    const [user, created] = await db.category.findOrCreate({
        where: {
            userId: res.locals.user.id
        }
    })
    console.log("USERINFO", res.locals.user.id)
    const stock = db.stock.create({
        userId: res.locals.user.id,
        stockId: req.params.id,
        stock_symbol: req.body.symbol,
        price_bought: req.body.priceBought,
        shares_bought: req.body.sharesBought
    })
    await user.createStock(stock)
    .then((stock) => {
        res.redirect("/users/profile")
    })
   }
    catch(err) {
        console.log(err)
        res.send("server error")
    }
    
})



module.exports = router
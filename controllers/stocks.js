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


// adds a new stock to user profile
router.post("/add", async (req, res) => {
   try{
    const stock = await db.stock.create({
        stock_symbol: req.body.symbol,
        price_bought: req.body.priceBought,
        shares_bought: req.body.sharesBought
    })
    const user = await db.user.findOne({
        where: {
            email: res.locals.user.email
        }
    })
    await user.addStock(stock)
    .then((stock) => {
        res.redirect("/users/profile")
    })
   }
    catch(err) {
        console.log(err)
        res.send("server error")
    }
})

router.get("/:id", async (req, res) => {
    console.log(req.params.id)
    try {
        const oneStock = await db.stock.findOne({
            where: {
                id: req.params.id
            }
        })
        res.render("stocks/one.ejs", { stock: oneStock })

    } catch(err) {
        console.log(err)
        res.send("server error")
    }

})

router.get("/:id/update", async (req, res) => {
    try {
       res.render("stocks/update.ejs")
    } catch(err) {
        console.log(err)
        res.send("server erro")
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const deleteStock = await db.stock.destroy({
            where: {
                id: req.params.id 
            }
        })
        res.redirect("/users/profile")
    } catch(err) {
        console.log(err)
    }
})


module.exports = router
const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const axios = require('axios')
const user = require('../models/user')
const methodOverride = require("method-override")

router.use(methodOverride("_method"))

// renders search page for crypto
router.get("/", (req, res) => {
    res.render("cryptos/search")
})

// uses the API to search for stock information based on what user inputted
router.get("/search", async (req, res) => {
    try {
    console.log(req.query)
    const url = `https://api.twelvedata.com/quote?symbol=${req.query.symbols}&apikey=${process.env.API_KEY}&source=docs`
    console.log(url)
    axios.get(url)
        .then(response => {
           
            res.render('cryptos/cryptos.ejs', { 
                cryptos: response.data
             })
        })
    } catch(err) {
        console.log(err)
        res.send("server error")
    }
  })

  router.get("/add", (req, res) => {
    res.render("cryptos/add.ejs")
})


// adds a new crypto to user profile
router.post("/add", async (req, res) => {
    try{
     const crypto = await db.crypto.create({
        crypto_symbol: req.body.cryptoSymbol,
        crypto_price_bought: req.body.cryptoPriceBought,
        crypto_amount_bought: req.body.cryptoBought
     })
     const user = await db.user.findOne({
         where: {
             email: res.locals.user.email
         }
     })
     console.log(user.email)
     await user.addCrypto(crypto)
     .then((stock) => {
         res.redirect("/users/cryptos")
     })
    }
     catch(err) {
         console.log(err)
         res.send("server error")
     }
 })

 // displays one of the user's crypto to them
router.get("/:id", async (req, res) => {
    console.log(req.params.id)
    try {
        const oneCrypto = await db.crypto.findOne({
            where: {
                id: req.params.id
            }
        })
        res.render("cryptos/one.ejs", { crypto: oneCrypto })
    } catch(err) {
        console.log(err)
        res.send("server error")
    }
})

// sends user to a page where they can update information about their crypto
router.get("/:id/update", async (req, res) => {
    try {
        const oneCrypto = await db.crypto.findOne({
            where: {
                id: req.params.id
            }
        })
       res.render("cryptos/update.ejs", { crypto: oneCrypto })
    } catch(err) {
        console.log(err)
        res.send("server erro")
    }
})

//updates the crypto information
router.put("/:id/update", async (req, res) => {
    try {
        const updateCrypto = await db.crypto.update({
            crypto_symbol: req.body.cryptoSymbol,
            crypto_price_bought: req.body.cryptoPriceBought,
            crypto_amount_bought: req.body.cryptoBought
        }, {
        where: {
            id: req.params.id
        }
    })
        res.redirect("/users/cryptos")
    } catch(err) {
        console.log(err)
        res.send("server erro")
    }
})

// deletes specific crypto from user profile after pressing button
router.delete("/:id", async (req, res) => {
    try {
        const user = await db.user.findOne({
            where: {email: res.locals.user.email}
        })
        const deleteCrypto = await db.crypto.destroy({
            where: {
                id: req.params.id 
            }
        })
        const deleteUserCrypto = await db.users_cryptos.destroy({
            where: {
                userId: user.id,
                cryptoId: req.params.id
            }
        })
        res.redirect("/users/cryptos")
    } catch(err) {
        console.log(err)
    }
})
module.exports = router
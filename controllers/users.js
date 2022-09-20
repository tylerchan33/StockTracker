const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const user = require('../models/user')
const { default: axios } = require('axios')
const methodOverride = require("method-override")
const noLoginMessage = 'Incorrect username or password'

router.use(methodOverride("_method"))

// GET /users/new -- render a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs')
})

// POST /users -- create a new user in the db
router.post('/', async (req, res) => {
    try {
        // has the password from the req.body
        const hashedPassword = bcrypt.hashSync(req.body.password, 12)        
        // create a new user
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            }, 
            defaults: {
                password: hashedPassword
            }
        })

        // if the user was found...send them to the login form
        console.log('created is:',  created)
        if (!created) {
            console.log('user exists already')
            res.redirect('/users/login?message=Please log into your account to continue.')
        } else {
            // store that new user's id as a cookie in the browser
            const encryptedUserId = crypto.AES.encrypt(newUser.id.toString(), process.env.ENC_SECRET)
            const encryptedUserIdString = encryptedUserId.toString()
            res.cookie('userId', encryptedUserIdString)
            // redirect to the homepage
            res.redirect('/users/profile')
        }

    } catch(err) {
        console.log(err)
        res.send('server error')
    }
})

//http://127.0.0.1:3000/users/login?message=Incorrect%20username%20or%20password
// GET /users/login -- show a login form to the user
router.get('/login', (req, res) => {
    console.log(req.query)
    res.render('users/login.ejs', {
        // if the req.query.message exists, pass it is as the message, otherwise pass in null
        // ternary operator
        // condition ? expression if truthy : expression if falsy
        message: req.query.message ? req.query.message : null
    })
})

// POST /users/login -- accept a payload of form data and use it log a user in 
router.post('/login', async (req, res) => {
    try {
        // look up the user in the db using the supplied email
        const user = await db.user.findOne({ 
            where: {
                email: req.body.email
            } 
        })

        // if the user is not found -- send the user back to the login form
        if (!user) {
            console.log('user not found')
            res.redirect('/users/login?message=' + noLoginMessage)
        // if the user is found but has given the wrong password -- send them back to the login form
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
            console.log('wrong password')
            res.redirect('/users/login?message=' + noLoginMessage)
        // if the user is found and the supplied password matches what is in the database -- log them in
        } else {
            const encryptedUserId = crypto.AES.encrypt(user.id.toString(), process.env.ENC_SECRET)
            const encryptedUserIdString = encryptedUserId.toString()
            res.cookie('userId', encryptedUserIdString)
            res.redirect('/users/profile')
        }
    } catch(err) {
        console.log(err)
        res.send('server error')
    }
})

// GET /users/logout -- log out a user by clearing the stored cookie
router.get('/logout', (req, res) => {
    // clear the cookie
    res.clearCookie('userId')
    // redirect to the homepage
    res.redirect('/')
})

router.get('/profile', (req, res) => {
    // if the user is not logged ... we need to redirect to the login form
    if (!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource.')
    // otherwise, show them their profile
    } else {
        res.render('users/profile.ejs', {
            user: res.locals.user
        })
    }
})

router.get('/stocks', async (req, res) => {
    // if the user is not logged ... we need to redirect to the login form
    try {
        if (!res.locals.user) {
            res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource.')
        // otherwise, show them their profile
        } else {
         console.log("USERINFOOOO:", res.locals.user)
         const user = await db.user.findOne({
            where: {
                email: res.locals.user.email
            }
         })
            const myStocks = await user.getStocks()

            function localStock() {
                const stockList = []
                for (let i = 0; i < myStocks.length; i++){
                    let name = myStocks[i].dataValues.stock_symbol
                    console.log(name) 
                    stockList.push(name)
                }
                return stockList
            }
            localStock()
            const stocky = localStock()
          
            console.log("STOCKY", stocky)
        
            const url =  `https://api.twelvedata.com/price?symbol=${stocky}&apikey=${process.env.API_KEY}&source=docs`
            axios.get(url)
                .then(response => {
                    
                    res.render('users/stocks.ejs', {
                        user: res.locals.user,
                        stockAPI: response.data,
                        myStocks,
                        stocky
                    })
                
                })
           
        }
    } catch(err) {
        console.log(err)
        res.send("servor error")
    }
})

router.get('/cryptos', async (req, res) => {
    // if the user is not logged ... we need to redirect to the login form
    try {
        if (!res.locals.user) {
            res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource.')
        // otherwise, show them their profile
        } else {
         console.log("USERINFOOOO:", res.locals.user)
         const user = await db.user.findOne({
            where: {
                email: res.locals.user.email
            }
         })
            const myCryptos = await user.getCryptos()

            function localCrypto() {
                const cryptoList = []
                for (let i = 0; i < myCryptos.length; i++){
                    let cryptoName = myCryptos[i].dataValues.crypto_symbol
                    console.log(cryptoName) 
                    cryptoList.push(cryptoName)
                }
                return cryptoList
            }
            localCrypto()
            const crypty = localCrypto()
          
            console.log("CRYPTY", crypty)
        
            const url =  `https://api.twelvedata.com/price?symbol=${crypty}&apikey=${process.env.API_KEY}&source=docs`
            axios.get(url)
                .then(response => {
                    
                    res.render('users/cryptos.ejs', {
                        user: res.locals.user,
                        cryptoAPI: response.data,
                        myCryptos,
                        crypty
                    })
                
                })
           
        }
    } catch(err) {
        console.log(err)
        res.send("servor error")
    }
})


router.delete("/profile", async (req, res) => {
    try {
        if(!res.locals.user) {
            res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource.')
        } else {
            await db.user.destroy({
                where: {
                email: res.locals.user.email
                }
            })
        res.redirect("/")
        }
    } catch(err) {
        console.log(err)
    }
})

router.get("/profile/edit", async (req, res) => {
    try {
        if(!res.locals.user) {
            res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource.')

        } else {
            res.render("users/edit")
            }
        }
        catch(err) {
        console.log(err)
        }
    
})

router.put("/profile/edit", async (req, res) => {
    try {
        const user = await db.user.findOne({
            where: {
                email: res.locals.user.email
            }
        })
        if(!res.locals.user) {
            res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource.')

        }  else if(!bcrypt.compareSync(req.body.password, user.password)) {
            console.log('wrong password')
            res.redirect('/users/profile/account/?message=' + noLoginMessage)
        } else {
            const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12)
            const editUser = await db.user.update({
                email: req.body.email,
                password: hashedPassword
            },{
                where: {
                    id: res.locals.user.id
                }
            })
            res.redirect("/users/profile")
        } 
        }catch(err) {
            console.log(err)
        }
})



module.exports = router
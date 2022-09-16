function localStock() {
    const url =  `https://api.twelvedata.com/price?symbol=AAPL&apikey=${process.env.API_KEY}&source=docs`
        axios.get(url)
    for (let i = 0; i < myStocks.length; i++){
        console.log(myStocks[i].dataValues.stock_symbol)
        return myStocks[i].dataValues.stock_symbol
    }
}


function shuffleDeck(fullDeck) {
    // let currentIndex = fullDeck.length
    let randomIndex = 0;
    // while (currentIndex != 0) 
    for (let i = 0; i < fullDeck.length; i++) {
        randomIndex = Math.floor(Math.random() * i);
        // currentIndex--
        [fullDeck[i], fullDeck[randomIndex]] = [fullDeck[randomIndex], fullDeck[i]]
    }
    
    return fullDeck
    
}
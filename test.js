


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
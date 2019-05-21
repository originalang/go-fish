class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
        this.name = `${cardNames[this.value]} of ${this.suit}`
    }
}

class Deck {
    constructor() {
        const suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];

        this.cards = [];

        suits.forEach((suit) => {
            for(let i = 1; i < 14; i++) {
                this.cards.push(new Card(i, suit));
            }
        });
    }

    shuffle() {
        return this.cards.sort(() => Math.random() - 0.5);
    }

    draw() {
        return this.cards.pop();
    }
}

const cardNames = {
    1: 'Ace',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: 'Jack',
    12: 'Queen',
    13: 'King'
}

module.exports = {
    Deck
}
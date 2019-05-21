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
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine',
    10: 'Ten',
    11: 'Jack',
    12: 'Queen',
    13: 'King'
}

module.exports = {
    Deck
}
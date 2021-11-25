import { Suit } from "./interface-deck-of-cards";

export class Card {
    public suit: Suit;
    public letter: string;
    public value: number;

    constructor(suit: Suit, letter: string, value: number) {
        this.suit = suit;
        this.letter = letter;
        this.value = value;
    }
}
import { Card } from "./card";
import { Suit } from "./interface-deck-of-cards";

export const RANK_POINTS = {
    HIGH_CARD : 1,
    PAIR: 2,
    TWO_PAIR: 3,
    THREE_OF_KIND: 4, 
    STRAIGHT: 5,
    FLUSH: 6,
    FULL_HOUSE: 7,
    FOUR_OF_KIND: 8,
    STRAIGHT_FLUSH: 9,
    ROYAL_FLUSH: 10,
}

export const RANK_MAP: {[key:number]: string} = {
    1: 'High card',
    2: 'Pair',
    3: 'Two pairs',
    4: ' Three of a kind', 
    5: 'Straight',
    6: 'Flush',
    7: 'Full house',
    8: 'Four of a kind',
    9: 'Straigh flush',
    10: 'Royal flush',
};
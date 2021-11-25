import { Component, OnInit } from '@angular/core';
import { Card } from './card';
import { Suit } from './interface-deck-of-cards';
import { SUITS } from './mock-deck';
import { RANK_MAP, RANK_POINTS } from './types';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit {

  cards:Card[] = [];
  isDealed: boolean = true;
  ranking: string = '';
  isShuffled: boolean = false;
  isDisabled: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.getCards();
  }

  reset() {
    this.isDealed = true;
    this.isShuffled = true;
    this.ranking = '';
    this.isDisabled = false;

    this.getCards();
  }

  getCards() {
    this.cards = [];
    const suits = SUITS;
    suits.forEach((suit: Suit) => {
      this.cards.push(new Card(suit, 'A', 14));
      for (var i = 2; i <= 10; i++) {
        this.cards.push(new Card(suit, i+'', i));
      }
      this.cards.push(new Card(suit, 'J', 11));
      this.cards.push(new Card(suit, 'Q', 12));
      this.cards.push(new Card(suit, 'K', 13));
    });
  }

  randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  cut(cards: Card[]) {
    if (cards.length === 0) {
      return {
        top: [],
        bottom: []
      };
    } else if (cards.length === 1) {
      return {
        top: [cards[0]],
        bottom: []
      };
    } else {
      var middle = Math.floor(cards.length / 2);
      var variance = this.randomInt(0, 12) - 6;
      middle += variance;
      middle = Math.max(middle, 1);
      return {
        top: cards.slice(0, middle),
        bottom: cards.slice(middle)
      };
    }
  }

  cutInPlace(pile: Card[]) {
    var halves = this.cut(pile);
    return halves.bottom.concat(halves.top);
  }

  dealFiveCards(numberOfCards: number) {
    if(!this.isDealed){
      return;
    }

    this.isDealed = true;
    this.isShuffled = false;
    
    if(this.cards.length === 0){
      return;
    }
    
    this.cards = this.sortedCards(this.dealCards(numberOfCards, this.cards));
    const rank:number = this.calculateHandRank(this.cards);
    this.ranking = RANK_MAP[rank];
    this.isDisabled = true;

  }

  dealCards(numberOfCard: number, cards: Card[]): Card[] {
    if(numberOfCard < 0 ||numberOfCard > cards.length){
      throw 'Parameter is invalid!!!';
    }
    
    const handCards:Card[] = [];
    for(let i = 1; i <= numberOfCard; i++){
      const index = this.randomInt(0, 51);
      handCards.push(cards[index]);
    }

    return handCards;
  }

  shuffle() {
    if(!this.isShuffled){
      this.cards;
    }

    this.isDealed = true;
    for (let i = 0; i < 20; i++) {
      const halves = this.cut(this.cards);
      let pile:Card[] = [];
      while (halves.top.length > 0 || halves.bottom.length > 0) {
        var take = this.randomInt(1, 5);
        pile = pile.concat(halves.top.splice(0, take));
        take = this.randomInt(1, 5);
        pile = pile.concat(halves.bottom.splice(0, take));
      }
      this.cards = this.cutInPlace(pile);
    }
  }

  sortedCards(cardList: Card[]) {
    return cardList.sort((card1 , card2) => card1.value - card2.value);
  }
  
  isStraight(cards: Card[]): boolean {
    for(let i=0; i < cards.length-1; i++){
      if(cards[i + 1].value !== cards[i].value + 1){
        return false;
      }
    }

   return cards[0].value === 2 && cards[4].value === 14 || cards[4].value === cards[3].value + 1;
  }

  getSuitsFromCards(cards: Card[]){
    let suits:{ [key: string]: any } = {};
    let values:{ [key: string]: any } = {};
    cards.forEach(card => {
      const name = card.suit.name;
      if (suits[name] === undefined) {
        suits[name] = 1;
      } else {
        suits[name]++;
      }

      const value = card.value;
      if (values[value] === undefined) {
        values[value] = 1;
      } else {
        values[value]++;
      }

    });

    return {suits, values};
  }

  getValuesFromCards(cards: Card[]){
    let values:{ [key: string]: any } = {};
    cards.forEach(card => {
      const value = card.value;
      if (values[value] === undefined) {
        values[value] = 1;
      } else {
        values[value]++;
      }
    });

    return values;
  }

  isFlush(sortedCards: Card[]): boolean {
    const suits = this.getSuitsFromCards(sortedCards);
    return Object.keys(suits).length === 1;
  }

  isRoyalFlush(sortedCards: Card[]): boolean {
    if(!this.isFlush(sortedCards)){
      return false;
    }
    const royal = [11, 12, 13, 14];
    let isRoyal = true;
    sortedCards.forEach(card => {

      if(!royal.includes(card.value)){
        isRoyal = false;
        return ;
      }
    });

    if(!isRoyal){
      return false;
    }

    return sortedCards[0].suit.name == 'Diamonds';
  }

  calculateHandRank(cards: Card[]): number {
    if(this.isRoyalFlush(cards)){
      return RANK_POINTS.ROYAL_FLUSH
    } else if(this.isStraight(cards) && this.isFlush(cards)){
      return RANK_POINTS.STRAIGHT_FLUSH;
    } else if(this.isStraight(cards)){
      return RANK_POINTS.STRAIGHT
    } else if(this.isFlush(cards)){
      return RANK_POINTS.FLUSH
    }  
    
    const cardValues = this.getValuesFromCards(cards);
    const countCardValue = Object.keys(cardValues).length;
    const valueOfcardValues = Object.values(cardValues);
    if (countCardValue === 2) {
      return valueOfcardValues.includes(4) ? RANK_POINTS.FOUR_OF_KIND : RANK_POINTS.FULL_HOUSE
    } else if (countCardValue === 3) {
      return valueOfcardValues.includes(3) ? RANK_POINTS.THREE_OF_KIND : RANK_POINTS.TWO_PAIR;
    } else if (countCardValue === 4) {
      return RANK_POINTS.PAIR;
    } else {
      return RANK_POINTS.HIGH_CARD;
    }
  }
}

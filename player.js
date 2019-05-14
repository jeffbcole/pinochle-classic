var Player = function() {

    this.name = "";
    this.isHuman = false;
    this.skillLevel = "";
    this.playerPosition = "";
    this.playerPositionInt = 0;
    this.cards = [];
    this.currentRoundBid = -1;
    this.currentRoundMaximumBid = 0;
    this.currentRoundWinningBidTrump = 'S';
    this.currentRoundBidIsPass = false;
    this.currentRoundMeldScore = 0;
    this.currentRoundCountersTaken = 0;
    this.gameScore = 0;
    this.isShownVoidInSuit = [false, false, false, false];
    this.passingCards = [];
    this.receivedCards = [];
    this.melds = [];
    
    this.Initialize = function(aName, aIsHuman, aSkill, aPosition) {
        this.name = aName;
        this.isHuman = aIsHuman;
        this.skillLevel = aSkill;
        this.currentRoundBid = -1;
        this.currentRoundMaximumBid = 0;
        this.currentRoundMeldScore = 0;
        this.currentRoundCountersTaken = 0;
        this.gameScore = 0;
        this.isShownVoidInSuit = [false, false, false, false];
        this.passingCards = [];
        this.receivedCards = [];
        this.melds = [];
        this.playerPosition = aPosition;
        switch (this.playerPosition) {
            case 'South':
                this.playerPositionInt = 0;
                break;
            case 'West':
                this.playerPositionInt = 1;
                break;
            case 'North':
                this.playerPositionInt = 2;
                break;
            default:
                this.playerPositionInt = 3;
                break;
        }
    }

    this.ChooseBid = function(biddingSpeed)  {
        var minimumWaitTime = biddingSpeed == 1 ? 0 : 300;

        if (this.isHuman) {
            if (game.currentHighestBidder == null) {
                // Player must bid minimum
                this.currentRoundBid = Number(GetSetting('setting_minimum_bid'));
                game.currentHighestBidder = this;
                game.OnPlayerFinishedChoosingBid(this);
            } else {
                if (this.currentRoundBidIsPass) {
                    game.OnPlayerFinishedChoosingBid(this);
                } else {
                    setTimeout(function() {            
                        game.PromptPlayerToChooseBid();
                    }, minimumWaitTime);
                }
            }
        } else {
            var startTime = performance.now();
            
            if (this.currentRoundMaximumBid == -1) {
                game.IndicatePlayerIsThinking(this.playerPosition);
                worker.postMessage({
                    'cmd': 'FindBestBid', 
                    'gameState': CreateClonableGameState(game),
                    'passingCardsCount': GetSetting('setting_passing_cards_count'),
                    'playerSkill': this.skillLevel,
                    'playerIndex': this.playerPositionInt,
                    'playerCards': CreateClonableCards(this.cards),
                    'simulationsPerSuit': 1000,
                    'isForSimulationView': false,
                    'minimumEndTime': startTime + minimumWaitTime
                });
                return;                
            }

            if (this.currentRoundBidIsPass) {
                game.OnPlayerFinishedChoosingBid(this);
                return;
            } else {
                if (game.currentHighestBidder == null) {
                    this.currentRoundBid = Number(GetSetting('setting_minimum_bid'));
                    game.currentHighestBidder = this;
                } else {
                    // Don't get into a bidding war with your partner
                    var passCount = 0;
                    for (var i=0; i<4; i++) {
                        if (game.players[i].currentRoundBidIsPass) {
                            passCount++;
                        }
                    }
                    if (passCount == 2 && game.currentHighestBidder.playerPositionInt == (this.playerPositionInt+2)%4) {
                        this.currentRoundBidIsPass = true;
                    } else if (this.currentRoundMaximumBid > game.currentHighestBidder.currentRoundBid) {
                        this.currentRoundBid = game.currentHighestBidder.currentRoundBid + 1;
                        game.currentHighestBidder = this;
                    } else {
                        this.currentRoundBidIsPass = true;
                    }
                }
            }

            var endTime = performance.now();
            var elapsedTime = endTime - startTime;
            var waitTime = 0;
            if (elapsedTime < minimumWaitTime) {
                waitTime = minimumWaitTime - elapsedTime;
            }
            setTimeout(function(player) {
                game.OnPlayerFinishedChoosingBid(player);
            }, waitTime, this);
            
        }
    }

    this.OnFinishedAnalyzingBestBid = function(bestBid, minimumEndTime) {
        this.currentRoundMaximumBid = bestBid[0];
        this.currentRoundWinningBidTrump = bestBid[1];
        
        if (game.currentHighestBidder == null) {
            this.currentRoundBid = Number(GetSetting('setting_minimum_bid'));
            game.currentHighestBidder = this;
        } else {
            // Don't get into a bidding war with your partner
            var passCount = 0;
            for (var i=0; i<4; i++) {
                if (game.players[i].currentRoundBidIsPass) {
                    passCount++;
                }
            }
            if (passCount == 2 && game.currentHighestBidder.playerPositionInt == (this.playerPositionInt+2)%4) {
                this.currentRoundBidIsPass = true;
            } else if (this.currentRoundMaximumBid > game.currentHighestBidder.currentRoundBid) {
                this.currentRoundBid = game.currentHighestBidder.currentRoundBid + 1;
                game.currentHighestBidder = this;
            } else {
                this.currentRoundBidIsPass = true;
            }
        }
    

        var endTime = performance.now();
        var waitTime = 0;
        if (endTime < minimumEndTime) {
            waitTime = minimumEndTime - endTime;
        }
        setTimeout(function(player) {
            game.OnPlayerFinishedChoosingBid(player);
        }, waitTime, this);
    }

    this.ChoosePassingCards = function(passingCardsCount) {
        this.passingCards = [];
        if (this.isHuman) {
            game.PromptPlayerToChoosePassingCards();
        } else {
            var bestCards = this.FindBestPassingCards(passingCardsCount, game);
            this.passingCards = bestCards;
            this.cards = this.cards.filter((el) => !bestCards.includes(el));
            game.PlayerChosePassingCards(this);
        }
    }

    this.FindBestPassingCards = function(passingCardsCount, aGame) {
        switch (this.skillLevel) {
            case 'Easy':
            {
                var cardsToPass = [];
                for (var i=0; i<passingCardsCount; i++) {
                    cardsToPass.push(this.cards[i]);
                }
                return cardsToPass;
            }
            case 'Standard':
            {
                var cardsToPass = [];
                var availableCards = [].concat(this.cards);
                this.CalculateMelds(availableCards, aGame.trumpSuit, aGame.isDoubleDeck, true);

                var fullHandCardCount = aGame.isDoubleDeck ? 20 : 12;
                if (availableCards.length > fullHandCardCount) {
                    
                    //
                    // Passing back to partner
                    //

                    // Remove melding cards
                    var nonMeldCards = [].concat(availableCards);
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var index = nonMeldCards.indexOf(this.melds[i].cards[j]);
                            if (index != -1) {
                                nonMeldCards.splice(index, 1);
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // add nontrump kings (but not if they were received because they are thus not a potential marriage)
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (this.receivedCards.includes(card)) {
                            continue;
                        }
                        if (card.rank == 13 && card.suit != aGame.trumpSuit) {
                            cardsToPass.push(card);
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;

                            // Stop if we have enough
                            if (cardsToPass.length == passingCardsCount) {
                                return cardsToPass;
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // add nontrump queens (but not if they were received because they are thus not a potential marriage)
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (this.receivedCards.includes(card)) {
                            continue;
                        }
                        if (card.rank == 12 && card.suit != aGame.trumpSuit) {
                            cardsToPass.push(card);
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;

                            // Stop if we have enough
                            if (cardsToPass.length == passingCardsCount) {
                                return cardsToPass;
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // Jack of Diamonds (but not if they were received because they are thus not a potential marriage)
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (this.receivedCards.includes(card)) {
                            continue;
                        }
                        if (card.rank == 11 && card.suit == 'D') {
                            cardsToPass.push(card);
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;

                            // Stop if we have enough
                            if (cardsToPass.length == passingCardsCount) {
                                return cardsToPass;
                            }
                        }
                    }

                    // Add the rest of the non trump cards (prefer low non trumps)
                    nonMeldCards.sort(function(a,b){
                        if (a.suit == aGame.trumpSuit && b.suit == aGame.trumpSuit) {
                            return a.value - b.value;
                        } else if (a.suit == aGame.trumpSuit) {
                            return 1;
                        } else if (b.suit == aGame.trumpSuit) {
                            return -1;
                        } else {
                            return a.value - b.value;
                        }
                    });
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        cardsToPass.push(card);
                        // Stop if we have enough
                        if (cardsToPass.length == passingCardsCount) {
                            return cardsToPass;
                        }
                    }

                    // We will have to break up meld scores so find the amount of meld score that each card is responsible for
                    var meldCards = [];
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var card = this.melds[i].cards[j];
                            if (!meldCards.includes(card)) {
                                card.meldScoreIncrease = 0;
                                meldCards.push(card);
                            }
                        }
                    }
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            this.melds[i].cards[j].meldScoreIncrease += this.melds[i].score;
                        }
                    }
                    meldCards.sort(function(a,b){
                        return a.meldScoreIncrease - b.meldScoreIncrease;
                    });
                    for (var i=0; i<meldCards.length; i++) {
                        var card = meldCards[i];
                        cardsToPass.push(card);
                        // Stop if we have enough
                        if (cardsToPass.length == passingCardsCount) {
                            return cardsToPass;
                        }
                    }

                } else {
                    //
                    // Passing to the bid winner
                    //

                    // Remove the melding cards
                    for (var i=0; i<this.melds.length; i++) {
                        var meld = this.melds[i];
                        if (availableCards.length - meld.cards.length >= passingCardsCount) {
                            for (var j=0; j<meld.cards.length; j++) {
                                var index = availableCards.indexOf(meld.cards[j]);
                                if (index != -1) {
                                    availableCards.splice(index, 1);
                                }
                            }
                        }
                    }

                    // Prefer high trumps and then high non-trumps
                    availableCards.sort(function(a,b){
                        if (a.suit == aGame.trumpSuit && b.suit == aGame.trumpSuit) {
                            // Prefer high trumps
                            return b.value - a.value;
                        } else if (a.suit == aGame.trumpSuit) {
                            // Prefer trumps
                            return -1;
                        } else if (b.suit == aGame.trumpSuit) {
                            // Prefer trumps
                            return 1;
                        } else {
                            return b.value - a.value;
                        }
                    });
                    while (availableCards.length > passingCardsCount) {
                        availableCards.pop();
                    }
                    return availableCards;
                }

                return cardsToPass;
            }
            break;

            case 'Pro':
            {
                var cardsToPass = [];
                var availableCards = [].concat(this.cards);

                // Include cards that have already been selected for passing
                if (this.passingCards.length > 0) {
                    availableCards = availableCards.concat(this.passingCards);
                    if (GetSetting('setting_sort_left_to_right')) {
                        availableCards.sort(function(a,b) {
                            if (a.suit != b.suit) {
                                return a.suitInt - b.suitInt;
                            } else if (a.value == b.value) {
                                return a.deckID - b.deckID;
                            } else {
                                return b.value - a.value;
                            }
                        });
                    } else {
                        availableCards.sort(function(a,b) {
                            if (a.suit != b.suit) {
                                return a.suitInt - b.suitInt;
                            } else if (a.value == b.value) {
                                return a.deckID - b.deckID;
                            } else {
                                return a.value - b.value;
                            }
                        });
                    }
                }

                this.CalculateMelds(availableCards, aGame.trumpSuit, aGame.isDoubleDeck, true);

                var fullHandCardCount = aGame.isDoubleDeck ? 20 : 12;
                if (availableCards.length > fullHandCardCount) {
                    
                    //
                    // Passing back to partner
                    //

                    // Remove melding cards
                    var nonMeldCards = [].concat(availableCards);
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var index = nonMeldCards.indexOf(this.melds[i].cards[j]);
                            if (index != -1) {
                                nonMeldCards.splice(index, 1);
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // add nontrump kings (but not if they were received because they are thus not a potential marriage)
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (this.receivedCards.includes(card)) {
                            continue;
                        }
                        if (card.rank == 13 && card.suit != aGame.trumpSuit) {
                            card.hintText = "Possible<br>Marriage";
                            cardsToPass.push(card);
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;

                            // Stop if we have enough
                            if (cardsToPass.length == passingCardsCount) {
                                return cardsToPass;
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // add nontrump queens (but not if they were received because they are thus not a potential marriage)
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (this.receivedCards.includes(card)) {
                            continue;
                        }
                        if (card.rank == 12 && card.suit != aGame.trumpSuit) {
                            card.hintText = "Possible<br>Marriage";
                            cardsToPass.push(card);
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);

                            // Stop if we have enough
                            if (cardsToPass.length == passingCardsCount) {
                                return cardsToPass;
                            }
                        }
                    }

                    // Reason: Potential marriage
                    // Jack of Diamonds (but not if they were received because they are thus not a potential marriage and not if trump is Diamonds)
                    if (aGame.trumpSuit != 'D') {
                        for (var i=0; i<nonMeldCards.length; i++) {
                            var card = nonMeldCards[i];
                            if (this.receivedCards.includes(card)) {
                                continue;
                            }
                            if (card.rank == 11 && card.suit == 'D') {
                                card.hintText = "Possible<br>Pinochle";
                                cardsToPass.push(card);
                                nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                                i--;

                                // Stop if we have enough
                                if (cardsToPass.length == passingCardsCount) {
                                    return cardsToPass;
                                }
                            }
                        }
                    }

                    // Add the rest of the non trump cards (prefer low non trumps)
                    nonMeldCards.sort(function(a,b){
                        if (a.suit == aGame.trumpSuit && b.suit == aGame.trumpSuit) {
                            return a.value - b.value;
                        } else if (a.suit == aGame.trumpSuit) {
                            return 1;
                        } else if (b.suit == aGame.trumpSuit) {
                            return -1;
                        } else {
                            return a.value - b.value;
                        }
                    });
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (card.suit == aGame.trumpSuit) {
                            card.hintText = "Not Trump<br>No Meld Value";
                        } else {
                            card.hintText = "No Meld<br>Value";
                        }
                        cardsToPass.push(card);
                        // Stop if we have enough
                        if (cardsToPass.length == passingCardsCount) {
                            return cardsToPass;
                        }
                    }

                    // We will have to break up meld scores so find the amount of meld score that each card is responsible for
                    var meldCards = [];
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var card = this.melds[i].cards[j];
                            if (!meldCards.includes(card)) {
                                card.meldScoreIncrease = 0;
                                meldCards.push(card);
                            }
                        }
                    }
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            this.melds[i].cards[j].meldScoreIncrease += this.melds[i].score;
                        }
                    }
                    meldCards.sort(function(a,b){
                        return a.meldScoreIncrease - b.meldScoreIncrease;
                    });
                    for (var i=0; i<meldCards.length; i++) {
                        var card = meldCards[i];
                        card.hintText = "Least Meld<br>Reduction";
                        cardsToPass.push(card);
                        // Stop if we have enough
                        if (cardsToPass.length == passingCardsCount) {
                            return cardsToPass;
                        }
                    }

                } else {

                    //
                    // Passing to the bid winner
                    //
                    
                    // Find the first set of cards in this order:
                    // ATrump, 10Trump, KTrump, QTrump, JTrump
                    // AH, AS, AD, AC
                    // ATrump, 10Trump, KTrump, QTrump, JTrump
                    // AH, AS, AD, AC
                    // 9Trump
                    // QS, JD
                    // Js
                    // 9s
                    // lowest contributing meld cards
                    // Ks
                    // 10s

                    // Remove melding cards
                    var nonMeldCards = [].concat(availableCards);
                    for (var i=0; i<this.melds.length; i++) {
                        if (this.melds[i].meldType == 'RoyalMarriage') {
                            continue;
                        }
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var index = nonMeldCards.indexOf(this.melds[i].cards[j]);
                            if (index != -1) {
                                nonMeldCards.splice(index, 1);
                            }
                        }
                    }

                    var hintText = "";
                    var timesToLoop = aGame.isDoubleDeck ? 4 : 2;
                    for (var ctr=0; ctr<timesToLoop; ctr++) {
                        // ATrump, 10Trump, KTrump, QTrump, JTrump
                        hintText = "Trump";
                        this.TryToGetCard(1,aGame.trumpSuit,nonMeldCards,cardsToPass,hintText);
                        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                        this.TryToGetCard(10,aGame.trumpSuit,nonMeldCards,cardsToPass,hintText);
                        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                        this.TryToGetCard(13,aGame.trumpSuit,nonMeldCards,cardsToPass,hintText);
                        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                        this.TryToGetCard(12,aGame.trumpSuit,nonMeldCards,cardsToPass,hintText);
                        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                        this.TryToGetCard(11,aGame.trumpSuit,nonMeldCards,cardsToPass,hintText);
                        if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                        
                        // AH, AS, AD, AC
                        hintText = "Trick Taker";
                        var suits = ['S','H','C','D'];
                        for (var i=0; i<suits.length; i++) {
                            if (aGame.trumpSuit != suits[i]) {
                                this.TryToGetCard(1,suits[i],nonMeldCards,cardsToPass,hintText);
                                if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            }
                        }
                    }
                    
                    // Any trump left
                    hintText = "Trump";
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (card.suit == aGame.trumpSuit) {
                            card.hintText = hintText;
                            cardsToPass.push(card);
                            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;
                        }
                    }

                    // QS, JD
                    hintText = "Possible Pinochle";
                    this.TryToGetCard(12,'S',nonMeldCards,cardsToPass,hintText);
                    if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                    this.TryToGetCard(11,'D',nonMeldCards,cardsToPass,hintText);
                    if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                    
                    // Jacks
                    hintText = "No Meld Value";
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (card.rank == 11) {
                            card.hintText = hintText;
                            cardsToPass.push(card);
                            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;
                        }
                    }

                    // 9s
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (card.rank == 9) {
                            card.hintText = hintText;
                            cardsToPass.push(card);
                            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;
                        }
                    }

                    // Lowest meld cards
                    // We will have to break up meld scores so find the amount of meld score that each card is responsible for
                    var meldCards = [];
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            var card = this.melds[i].cards[j];
                            if (!meldCards.includes(card)) {
                                card.meldScoreIncrease = 0;
                                meldCards.push(card);
                            }
                        }
                    }
                    for (var i=0; i<this.melds.length; i++) {
                        for (var j=0; j<this.melds[i].cards.length; j++) {
                            this.melds[i].cards[j].meldScoreIncrease += this.melds[i].score;
                        }
                    }
                    meldCards.sort(function(a,b){
                        return a.meldScoreIncrease - b.meldScoreIncrease;
                    });
                    for (var i=0; i<meldCards.length; i++) {
                        var card = meldCards[i];
                        card.hintText = "Least Meld<br>Reduction";
                        cardsToPass.push(card);
                        // Stop if we have enough
                        if (cardsToPass.length == passingCardsCount) {
                            return cardsToPass;
                        }
                    }

                    // Kings
                    hintText = "Possible Marriage";
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (card.rank == 13) {
                            card.hintText = hintText;
                            cardsToPass.push(card);
                            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;
                        }
                    }

                    // 10s
                    hintText = "?";
                    for (var i=0; i<nonMeldCards.length; i++) {
                        var card = nonMeldCards[i];
                        if (card.rank == 10) {
                            card.hintText = hintText;
                            cardsToPass.push(card);
                            if (cardsToPass.length == passingCardsCount) { return cardsToPass; }
                            nonMeldCards.splice(nonMeldCards.indexOf(card),1);
                            i--;
                        }
                    }
                }

                // Safety
                cardsToPass = [];
                for (var i=0; i<passingCardsCount; i++) {
                    cardsToPass.push(this.cards[i]);
                }
                return cardsToPass;
            }
        }
    }

    this.TryToGetCard = function(rank, suit, aCards, aPassingCards, hintText) {
        for (var i=0; i<aCards.length; i++) {
            var card = aCards[i];
            if (card.suit == suit && card.rank == rank) {
                aPassingCards.push(card);
                aCards.splice(aCards.indexOf(card),1);
                card.hintText = hintText;
                return;
            }
        }
    }


    this.ChoosePlayCard = function() {
        if (this.isHuman) {
            game.PromptPlayerToPlayCard();
        } else {
            var card = this.FindBestPlayingCard(game, false);
            game.OnPlayerChosePlayCard(card);
        }
    }

    this.FindBestPlayingCard = function(aGame) {
        var possiblePlays = GetLegalCardsForCurrentPlayerTurn(aGame);
        switch (this.skillLevel) {
            case 'Easy':
                return possiblePlays[0];
            case 'Standard':
                return this.FindStandardPlayingCard(aGame, possiblePlays);
            default:
                // 'Pro'
                return this.FindProPlayingCard(aGame, possiblePlays);
        }
    }

    this.FindStandardPlayingCard = function(aGame, possiblePlays) {

        if (aGame.trickCards.length == 0) {
            //
            // Choose a lead card
            //
            
            // Sort all cards with trumps first and then by highest value
            possiblePlays.sort(function(a,b){
                if (a.suit == aGame.trumpSuit && b.suit != aGame.trumpSuit) {
                    return -1;
                } else if (a.suit != aGame.trumpSuit && b.suit == aGame.trumpSuit) {
                    return 1;
                } else {
                    return b.value - a.value;
                }
            });

            // Play highest trump that is gauranteed to take the trick
            // Otherwise play the highest non trump card
            for (var i=0; i<possiblePlays.length; i++) {
                var card = possiblePlays[i];
                if (card.suit == aGame.trumpSuit) {
                    var higherTrumpCardExists = false;
                    for (var j=0; j<4; j++) {
                        if (j==this.playerPositionInt) {
                            continue;
                        }
                        var unPlayedCards = aGame.players[j].cards;
                        for (var k=0; k<unPlayedCards.length; k++) {
                            if (unPlayedCards[k].suit == card.suit && unPlayedCards[k].value > card.value) {
                                higherTrumpCardExists = true;
                                break;
                            }
                        }
                        if (higherTrumpCardExists) {
                            break;
                        }
                    }
                    if (!higherTrumpCardExists) {
                        // This trump card is gauranteed to take the trick
                        // If this is our last trump card and everyone else is void in trump then we will save it
                        if (possiblePlays.length > 1 && possiblePlays[1].suit != aGame.trumpSuit) {
                            // This is the last trump card in our hand and no one can beat it
                            continue;
                        }
                        // Play this guaranteed trump
                        return card;
                    }
                } else {
                    // Highest non trump card
                    return card;
                }
            }
        
            // We only have trumps and none will take the trick so play our lowest
            return possiblePlays[possiblePlays.length-1];
        
        } else {
            var leadCard = aGame.trickCards[0];
            var play = possiblePlays[0];
            if (play.suit == leadCard.suit) {
                //
                // Must play of same suit
                //
                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }
                // Check if we already cant take the trick
                var cantTakeTrick = true;
                for (var i=0; i<possiblePlays.length; i++) {
                    var card = possiblePlays[i];
                    if ((card.suit == highestCardInTrick.suit && card.value > highestCardInTrick.value) ||
                        (card.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)){
                        cantTakeTrick = false;
                        break;
                    }
                }
                if (cantTakeTrick) {
                    var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                    if (highestTakerIsPartner) {
                        // Play our lowest counter
                        for (var i=0; i<possiblePlays.length; i++) {
                            var card = possiblePlays[i];
                            if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                                return card;
                            }
                        }
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } else {
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } 
                }

                if (aGame.trickCards.length < 3) {
                    // play our highest card
                    var highestCard = possiblePlays[possiblePlays.length - 1];
                    return highestCard;
                } else {
                    // Play the lowest card that will take the trick
                    for (var i=0; i<possiblePlays.length; i++) {
                        var card = possiblePlays[i];
                        if (card.value > highestCardInTrick.value) {
                            return card;
                        }
                    }
                    // Safety - this should not happen
                    return possiblePlays[0];
                }
            } else if (play.suit == aGame.trumpSuit) {
                //
                // Must play a trump card
                //
                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }
                
                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                // Check if we already cant take the trick
                var cantTakeTrick = true;
                for (var i=0; i<possiblePlays.length; i++) {
                    var card = possiblePlays[i];
                    if ((card.suit == highestCardInTrick.suit && card.value > highestCardInTrick.value) ||
                        (card.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)){
                        cantTakeTrick = false;
                        break;
                    }
                }
                if (cantTakeTrick) {
                    var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                    if (highestTakerIsPartner) {
                        // Play our lowest counter
                        for (var i=0; i<possiblePlays.length; i++) {
                            var card = possiblePlays[i];
                            if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                                return card;
                            }
                        }
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } else {
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    }
                } else {
                    if (aGame.trickCards.length < 3) {
                        // Play highest card
                        return possiblePlays[possiblePlays.length-1];
                    } else {
                        // Play lowest card
                        return possiblePlays[0];
                    }
                }
            } else {
                //
                // Must play a non trump, off suit card
                //

                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }

                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                if (highestTakerIsPartner) {
                    // Play our lowest counter
                    for (var i=0; i<possiblePlays.length; i++) {
                        var card = possiblePlays[i];
                        if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                            return card;
                        }
                    }
                    // No counter found so play the lowest card possible
                    return possiblePlays[0];
                } else {
                    // Play lowest card
                    return possiblePlays[0];
                }
            }
        }
    }

    this.FindProPlayingCard = function(aGame, possiblePlays) {
        
        if (aGame.trickCards.length == 0) {
            //
            // Choose a lead card
            //
            
            // Sort all cards with trumps first and then by highest value
            possiblePlays.sort(function(a,b){
                if (a.suit == aGame.trumpSuit && b.suit != aGame.trumpSuit) {
                    return -1;
                } else if (a.suit != aGame.trumpSuit && b.suit == aGame.trumpSuit) {
                    return 1;
                } else {
                    return b.value - a.value;
                }
            });

            var firstCard = possiblePlays[0];
            if (firstCard.suit == aGame.trumpSuit) {
                var higherTrumpCardExists = false;
                var anyTrumpSuitExists = false;
                for (var j=0; j<4; j++) {
                    if (j == this.playerPositionInt) {
                        continue;
                    }
                    var unPlayedCards = aGame.players[j].cards;
                    for (var k=0; k<unPlayedCards.length; k++) {
                        if (unPlayedCards[k].suit == aGame.trumpSuit) {
                            anyTrumpSuitExists = true;
                        }
                        if (unPlayedCards[k].suit == aGame.trumpSuit && unPlayedCards[k].value > firstCard.value) {
                            higherTrumpCardExists = true;
                            break;
                        }
                    }
                    if (higherTrumpCardExists) {
                        break;
                    }
                }
                if (!higherTrumpCardExists) {
                    if (anyTrumpSuitExists) {
                        // Play this gauranteed trump
                        return firstCard;
                    }
                }
            }

            // Check for any non-trump gauranteed trick takers
            var suits = ['S', 'H', 'C', 'D'];
            var trumpSuitIndex = 0;
            for (var i=0; i<suits.length; i++) {
                if (suits[i] == aGame.trumpSuit) {
                    trumpSuitIndex = i;
                    break;
                }
            }
            for (var k=0; k<suits.length; k++) {
                var checkSuit = suits[k];
                if (checkSuit == aGame.trumpSuit) {
                    continue;
                }

                var highestCardOfSuit = null;
                for (var j=possiblePlays.length-1; j>=0; j--) {
                    var possibleCard = possiblePlays[j];
                    if (possibleCard.suit == checkSuit &&
                        (highestCardOfSuit == null || highestCardOfSuit.value < possibleCard.value)) {
                        highestCardOfSuit = possibleCard;
                    }
                }
                if (highestCardOfSuit != null) {
                    // Check if it is gauranteed
                    var higherCardExists = false;
                    for (var j=0; j<4; j++) {
                        if (j == this.playerPositionInt) {
                            continue;
                        }

                        var otherPlayer = aGame.players[j];
                        // If the other player is void in this suit
                        //and they are not void in trumps then consider that higher card exists
                        if (otherPlayer.playerPositionInt == (this.playerPositionInt+1)%4 || otherPlayer.playerPositionInt == (this.playerPositionInt+3)%4) {
                            if (otherPlayer.isShownVoidInSuit[k] && !otherPlayer.isShownVoidInSuit[trumpSuitIndex]) {
                                higherCardExists = true;
                                break;
                            }
                        }
                        
                        var otherCards = otherPlayer.cards;
                        for (var m=0; m<otherCards.length; m++) {
                            var otherCard = otherCards[m];
                            if (otherCard.suit == checkSuit && otherCard.value > highestCardOfSuit.value)
                            {
                                higherCardExists = true;
                                break;
                            }
                        }
                        if (higherCardExists)
                        {
                            break;
                        }
                    }
                    if (!higherCardExists) {
                        return highestCardOfSuit;
                    }
                }
            }

            // If the only cards left are trump then play the highest trump
            if (possiblePlays[possiblePlays.length-1].suit == aGame.trumpSuit) {
                // We only have trumps
                // Don't play a counter if our opponent still has a higher trump
                var otherPlayer1 = aGame.players[(this.playerPositionInt+1)%4];
                var otherPlayer2 = aGame.players[(this.playerPositionInt+3)%4];
                var highestTrump = possiblePlays[0];
                for (var m=0; m<otherPlayer1.cards.length; m++) {
                    var otherCard = otherPlayer1.cards[m];
                    if (otherCard.suit == highestTrump.suit && otherCard.value > highestTrump.value) {
                        // Opponents have a higher trump so we will play our lowest to hopefully not give away a pointer
                        return possiblePlays[possiblePlays.length-1];
                    }
                }
                for (var m=0; m<otherPlayer2.cards.length; m++) {
                    var otherCard = otherPlayer2.cards[m];
                    if (otherCard.suit == highestTrump.suit && otherCard.value > highestTrump.value) {
                        // Opponents have a higher trump so we will play our lowest to hopefully not give away a pointer
                        return possiblePlays[possiblePlays.length-1];
                    }
                }
                
                // Play our highest trump
                return possiblePlays[0];
            } else {
                // Otherwise we are not going to take the trick so we might be able to save our higher counters
                return possiblePlays[possiblePlays.length-1];
            }
        
        } else {
            
            var leadCard = aGame.trickCards[0];
            var play = possiblePlays[0];
            if (play.suit == leadCard.suit) {
                //
                // Must play of same suit
                //
                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }
                // Check if we already cant take the trick
                var cantTakeTrick = true;
                for (var i=0; i<possiblePlays.length; i++) {
                    var card = possiblePlays[i];
                    if ((card.suit == highestCardInTrick.suit && card.value > highestCardInTrick.value) ||
                        (card.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)){
                        cantTakeTrick = false;
                        break;
                    }
                }
                if (cantTakeTrick) {
                    var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                    if (highestTakerIsPartner) {
                        // Play our lowest counter
                        for (var i=0; i<possiblePlays.length; i++) {
                            var card = possiblePlays[i];
                            if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                                return card;
                            }
                        }
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } else {
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } 
                }

                if (aGame.trickCards.length < 3) {
                    // play our highest card
                    var highestCard = possiblePlays[possiblePlays.length - 1];
                    return highestCard;
                } else {
                    // Play the lowest card that will take the trick
                    for (var i=0; i<possiblePlays.length; i++) {
                        var card = possiblePlays[i];
                        if (card.value > highestCardInTrick.value) {
                            return card;
                        }
                    }
                    // Safety - this should not happen
                    return possiblePlays[0];
                }
            } else if (play.suit == aGame.trumpSuit) {
                //
                // Must play a trump card
                //
                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }
                
                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                // Check if we already cant take the trick
                var cantTakeTrick = true;
                for (var i=0; i<possiblePlays.length; i++) {
                    var card = possiblePlays[i];
                    if ((card.suit == highestCardInTrick.suit && card.value > highestCardInTrick.value) ||
                        (card.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)){
                        cantTakeTrick = false;
                        break;
                    }
                }
                if (cantTakeTrick) {
                    var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                    if (highestTakerIsPartner) {
                        // Play our lowest counter
                        for (var i=0; i<possiblePlays.length; i++) {
                            var card = possiblePlays[i];
                            if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                                return card;
                            }
                        }
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    } else {
                        // No counter found so play the lowest card possible
                        return possiblePlays[0];
                    }
                } else {
                    if (aGame.trickCards.length < 3) {
                        // Play highest card
                        return possiblePlays[possiblePlays.length-1];
                    } else {
                        // Play lowest card
                        return possiblePlays[0];
                    }
                }
            } else {
                //
                // Must play a non trump, off suit card
                //

                var highestCardInTrickPosition = aGame.leadIndex;
                var highestCardInTrick = leadCard;
                for (var i=1; i<aGame.trickCards.length; i++) {
                    var playedCard = aGame.trickCards[i];
                    if ((playedCard.suit == highestCardInTrick.suit && playedCard.value > highestCardInTrick.value) ||
                        (playedCard.suit == aGame.trumpSuit && highestCardInTrick.suit != aGame.trumpSuit)) {
                            highestCardInTrick = playedCard;
                            highestCardInTrickPosition = (aGame.leadIndex+i)%4;
                        }
                }

                possiblePlays.sort(function(a,b){
                    return a.value - b.value;
                });

                var highestTakerIsPartner = highestCardInTrickPosition == (this.playerPositionInt+2)%4;
                if (highestTakerIsPartner) {
                    // Play our lowest counter
                    for (var i=0; i<possiblePlays.length; i++) {
                        var card = possiblePlays[i];
                        if (card.rank == 13 || card.rank == 10 || card.rank == 1) {
                            return card;
                        }
                    }
                    // No counter found so play the lowest card possible
                    return possiblePlays[0];
                } else {
                    // Play lowest card
                    return possiblePlays[0];
                }
            }
        }
    }

    var AcesQuadrupleArrayHashes = [['AS',4],['AC',4],['AD',4],['AH',4]];
    var AcesTripleArrayHashes = [['AS',3],['AC',3],['AD',3],['AH',3]];
    var AcesDoubleArrayHashes = [['AS',2],['AC',2],['AD',2],['AH',2]];
    var AcesArrayHashes = [['AS',1],['AC',1],['AD',1],['AH',1]];
    var KingsQuadrupleArrayHashes = [['KS',4],['KC',4],['KD',4],['KH',4]];
    var KingsTripleArrayHashes = [['KS',3],['KC',3],['KD',3],['KH',3]];
    var KingsDoubleArrayHashes = [['KS',2],['KC',2],['KD',2],['KH',2]];
    var KingsArrayHashes = [['KS',1],['KC',1],['KD',1],['KH',1]];
    var QueensQuadrupleArrayHashes = [['QS',4],['QC',4],['QD',4],['QH',4]];
    var QueensTripleArrayHashes = [['QS',3],['QC',3],['QD',3],['QH',3]];
    var QueensDoubleArrayHashes = [['QS',2],['QC',2],['QD',2],['QH',2]];
    var QueensArrayHashes = [['QS',1],['QC',1],['QD',1],['QH',1]];
    var JacksQuadrupleArrayHashes = [['JS',4],['JC',4],['JD',4],['JH',4]];
    var JacksTripleArrayHashes = [['JS',3],['JC',3],['JD',3],['JH',3]];
    var JacksDoubleArrayHashes = [['JS',2],['JC',2],['JD',2],['JH',2]];
    var JacksArrayHashes = [['JS',1],['JC',1],['JD',1],['JH',1]];
    var RunSpadesQuadrupleArrayHashes = [['AS',4],['TS',4],['KS',4],['QS',4],['JS',4]];
    var RunSpadesTripleArrayHashes = [['AS',3],['TS',3],['KS',3],['QS',3],['JS',3]];
    var RunSpadesDoubleArrayHashes = [['AS',2],['TS',2],['KS',2],['QS',2],['JS',2]];
    var RunSpadesArrayHashes = [['AS',1],['TS',1],['KS',1],['QS',1],['JS',1]];
    var RunHeartsQuadrupleArrayHashes = [['AH',4],['TH',4],['KH',4],['QH',4],['JH',4]];
    var RunHeartsTripleArrayHashes = [['AH',3],['TH',3],['KH',3],['QH',3],['JH',3]];
    var RunHeartsDoubleArrayHashes = [['AH',2],['TH',2],['KH',2],['QH',2],['JH',2]];
    var RunHeartsArrayHashes = [['AH',1],['TH',1],['KH',1],['QH',1],['JH',1]];
    var RunClubsQuadrupleArrayHashes = [['AC',4],['TC',4],['KC',4],['QC',4],['JC',4]];
    var RunClubsTripleArrayHashes = [['AC',3],['TC',3],['KC',3],['QC',3],['JC',3]];
    var RunClubsDoubleArrayHashes = [['AC',2],['TC',2],['KC',2],['QC',2],['JC',2]];
    var RunClubsArrayHashes = [['AC',1],['TC',1],['KC',1],['QC',1],['JC',1]];
    var RunDiamondsQuadrupleArrayHashes = [['AD',4],['TD',4],['KD',4],['QD',4],['JD',4]];
    var RunDiamondsTripleArrayHashes = [['AD',3],['TD',3],['KD',3],['QD',3],['JD',3]];
    var RunDiamondsDoubleArrayHashes = [['AD',2],['TD',2],['KD',2],['QD',2],['JD',2]];
    var RunDiamondsArrayHashes = [['AD',1],['TD',1],['KD',1],['QD',1],['JD',1]];

    var MarriageSpadesQuadrupleArrayHashes = [['KS',4],['QS',4]];
    var MarriageSpadesTripleArrayHashes = [['KS',3],['QS',3]];
    var MarriageSpadesDoubleArrayHashes = [['KS',2],['QS',2]];
    var MarriageSpadesArrayHashes = [['KS',1],['QS',1]];
    
    var MarriageHeartsQuadrupleArrayHashes = [['KH',4],['QH',4]];
    var MarriageHeartsTripleArrayHashes = [['KH',3],['QH',3]];
    var MarriageHeartsDoubleArrayHashes = [['KH',2],['QH',2]];
    var MarriageHeartsArrayHashes = [['KH',1],['QH',1]];
    
    var MarriageClubsQuadrupleArrayHashes = [['KC',4],['QC',4]];
    var MarriageClubsTripleArrayHashes = [['KC',3],['QC',3]];
    var MarriageClubsDoubleArrayHashes = [['KC',2],['QC',2]];
    var MarriageClubsArrayHashes = [['KC',1],['QC',1]];

    var MarriageDiamondsQuadrupleArrayHashes = [['KD',4],['QD',4]];
    var MarriageDiamondsTripleArrayHashes = [['KD',3],['QD',3]];
    var MarriageDiamondsDoubleArrayHashes = [['KD',2],['QD',2]];
    var MarriageDiamondsArrayHashes = [['KD',1],['QD',1]];

    var PinochleQuadrupleArrayHashes = [['QS',4],['JD',4]];
    var PinochleTripleArrayHashes = [['QS',3],['JD',3]];
    var PinochleDoubleArrayHashes = [['QS',2],['JD',2]];
    var PinochleArrayHashes = [['QS',1],['JD',1]];

    var DixSpadesDoubleArrayHashes = [['9S',2]];
    var DixHeartsDoubleArrayHashes = [['9H',2]];
    var DixClubsDoubleArrayHashes = [['9C',2]];
    var DixDiamondsDoubleArrayHashes = [['9D',2]];
    
    var DixSpadesArrayHashes = [['9S',1]];
    var DixHeartsArrayHashes = [['9H',1]];
    var DixClubsArrayHashes = [['9C',1]];
    var DixDiamondsArrayHashes = [['9D',1]];
    
    this.CalculateMelds = function(availableCards, trumpSuit, isDoubleDeck, ignoreDix) {
        this.melds = [];
        
        var cardsDictionary = {};
        for (var i=0; i<availableCards.length; i++) {
            if (cardsDictionary[availableCards[i].hash]) {
                cardsDictionary[availableCards[i].hash] += 1;
            } else {
                cardsDictionary[availableCards[i].hash] = 1;
            }
        }

        // Arounds
        if (isDoubleDeck) {
            this.TryToCountMeld(cardsDictionary, AcesQuadrupleArrayHashes, 'AllAces', 200);
            this.TryToCountMeld(cardsDictionary, AcesTripleArrayHashes, 'TripleAces', 150);
            this.TryToCountMeld(cardsDictionary, KingsQuadrupleArrayHashes, 'AllKings', 160);
            this.TryToCountMeld(cardsDictionary, KingsTripleArrayHashes, 'TripleKings', 120);
            this.TryToCountMeld(cardsDictionary, QueensQuadrupleArrayHashes, 'AllQueens', 120);
            this.TryToCountMeld(cardsDictionary, QueensTripleArrayHashes, 'TripleQueens', 90);
            this.TryToCountMeld(cardsDictionary, JacksQuadrupleArrayHashes, 'AllJacks', 80);
            this.TryToCountMeld(cardsDictionary, JacksTripleArrayHashes, 'TripleJacks', 60);
        }
        this.TryToCountMeld(cardsDictionary, AcesDoubleArrayHashes, 'AcesAbound', 100);
        this.TryToCountMeld(cardsDictionary, AcesArrayHashes, 'AcesAround', 10);
        this.TryToCountMeld(cardsDictionary, KingsDoubleArrayHashes, 'KingsAbound', 80);
        this.TryToCountMeld(cardsDictionary, KingsArrayHashes, 'KingsAround', 8);
        this.TryToCountMeld(cardsDictionary, QueensDoubleArrayHashes, 'QueensAbound', 60);
        this.TryToCountMeld(cardsDictionary, QueensArrayHashes, 'QueensAround', 6);
        this.TryToCountMeld(cardsDictionary, JacksDoubleArrayHashes, 'JacksAbound', 40);
        this.TryToCountMeld(cardsDictionary, JacksArrayHashes, 'JacksAround', 4);

        // Reset the cards available
        var keys = Object.keys(cardsDictionary);
        for (var i=0; i<keys.length; i++) {
            cardsDictionary[keys[i]] = 0;
        }
        for (var i=0; i<availableCards.length; i++) {
            cardsDictionary[availableCards[i].hash] += 1;
        }
        
        // Runs and Marriages
        var quadrupleRunsScore = 300;
        var tripleRunsScore = 225;
        var doubleRunScore = 150;
        var runScore = 15;
        switch (trumpSuit) {
            case 'S':
                if (isDoubleDeck) {
                    this.TryToCountMeld(cardsDictionary, RunSpadesQuadrupleArrayHashes, 'QuadrupleRun', quadrupleRunsScore);
                    this.TryToCountMeld(cardsDictionary, RunSpadesTripleArrayHashes, 'TripleRun', tripleRunsScore);
                }
                this.TryToCountMeld(cardsDictionary, RunSpadesDoubleArrayHashes, 'DoubleRun', doubleRunScore);
                this.TryToCountMeld(cardsDictionary, RunSpadesArrayHashes, 'Run', runScore);
            break;
            case 'H':
                if (isDoubleDeck) {
                    this.TryToCountMeld(cardsDictionary, RunHeartsQuadrupleArrayHashes, 'QuadrupleRun', quadrupleRunsScore);
                    this.TryToCountMeld(cardsDictionary, RunHeartsTripleArrayHashes, 'TripleRun', tripleRunsScore);
                }
                this.TryToCountMeld(cardsDictionary, RunHeartsDoubleArrayHashes, 'DoubleRun', doubleRunScore);
                this.TryToCountMeld(cardsDictionary, RunHeartsArrayHashes, 'Run', runScore);
            break;
            case 'C':
                if (isDoubleDeck) {
                    this.TryToCountMeld(cardsDictionary, RunClubsQuadrupleArrayHashes, 'QuadrupleRun', quadrupleRunsScore);
                    this.TryToCountMeld(cardsDictionary, RunClubsTripleArrayHashes, 'TripleRun', tripleRunsScore);
                }
                this.TryToCountMeld(cardsDictionary, RunClubsDoubleArrayHashes, 'DoubleRun', doubleRunScore);
                this.TryToCountMeld(cardsDictionary, RunClubsArrayHashes, 'Run', runScore);
            break;
            case 'D':
                if (isDoubleDeck) {
                    this.TryToCountMeld(cardsDictionary, RunDiamondsQuadrupleArrayHashes, 'QuadrupleRun', quadrupleRunsScore);
                    this.TryToCountMeld(cardsDictionary, RunDiamondsTripleArrayHashes, 'TripleRun', tripleRunsScore);
                }
                this.TryToCountMeld(cardsDictionary, RunDiamondsDoubleArrayHashes, 'DoubleRun', doubleRunScore);
                this.TryToCountMeld(cardsDictionary, RunDiamondsArrayHashes, 'Run', runScore);
            break;
        }

        var marriageScore = 2;
        var royalMarriageScore = 4;
        var doubleMarriageScore = 4;
        var doubleRoyalMarriageScore = 8;
        if (isDoubleDeck) {
            var tripleMarriageScore = 6;
            var tripleRoyalMarriageScore = 12;
            var quadrupleMarriageScore = 8;
            var quadrupleRoyalMarriageScore = 16;
            this.TryToCountMeld(cardsDictionary, MarriageHeartsQuadrupleArrayHashes, trumpSuit=='H' ? 'QuadRoyalMarriage':'QuadMarriage', trumpSuit=='H'?quadrupleRoyalMarriageScore:quadrupleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageHeartsTripleArrayHashes, trumpSuit=='H' ? 'TripleRoyalMarriage':'TripleMarriage', trumpSuit=='H'?tripleRoyalMarriageScore:tripleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageSpadesQuadrupleArrayHashes, trumpSuit=='S' ? 'QuadRoyalMarriage':'QuadMarriage', trumpSuit=='S'?quadrupleRoyalMarriageScore:quadrupleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageSpadesTripleArrayHashes, trumpSuit=='S' ? 'TripleRoyalMarriage':'TripleMarriage', trumpSuit=='S'?tripleRoyalMarriageScore:tripleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageClubsQuadrupleArrayHashes, trumpSuit=='C' ? 'QuadRoyalMarriage':'QuadMarriage', trumpSuit=='C'?quadrupleRoyalMarriageScore:quadrupleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageClubsTripleArrayHashes, trumpSuit=='C' ? 'TripleRoyalMarriage':'TripleMarriage', trumpSuit=='C'?tripleRoyalMarriageScore:tripleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageDiamondsQuadrupleArrayHashes, trumpSuit=='D' ? 'QuadRoyalMarriage':'QuadMarriage', trumpSuit=='D'?quadrupleRoyalMarriageScore:quadrupleMarriageScore);
            this.TryToCountMeld(cardsDictionary, MarriageDiamondsTripleArrayHashes, trumpSuit=='D' ? 'TripleRoyalMarriage':'TripleMarriage', trumpSuit=='D'?tripleRoyalMarriageScore:tripleMarriageScore);
        }
        this.TryToCountMeld(cardsDictionary, MarriageHeartsDoubleArrayHashes, trumpSuit=='H'?'DoubleRoyalMarriage':'DoubleMarriage', trumpSuit=='H'?doubleRoyalMarriageScore:doubleMarriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageSpadesDoubleArrayHashes, trumpSuit=='S'?'DoubleRoyalMarriage':'DoubleMarriage', trumpSuit=='S'?doubleRoyalMarriageScore:doubleMarriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageDiamondsDoubleArrayHashes, trumpSuit=='D'?'DoubleRoyalMarriage':'DoubleMarriage', trumpSuit=='D'?doubleRoyalMarriageScore:doubleMarriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageClubsDoubleArrayHashes, trumpSuit=='C'?'DoubleRoyalMarriage':'DoubleMarriage', trumpSuit=='C'?doubleRoyalMarriageScore:doubleMarriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageHeartsArrayHashes, trumpSuit=='H'?'RoyalMarriage':'Marriage', trumpSuit=='H'?royalMarriageScore:marriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageSpadesArrayHashes, trumpSuit=='S'?'RoyalMarriage':'Marriage', trumpSuit=='S'?royalMarriageScore:marriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageDiamondsArrayHashes, trumpSuit=='D'?'RoyalMarriage':'Marriage', trumpSuit=='D'?royalMarriageScore:marriageScore);
        this.TryToCountMeld(cardsDictionary, MarriageClubsArrayHashes, trumpSuit=='C'?'RoyalMarriage':'Marriage', trumpSuit=='C'?royalMarriageScore:marriageScore);
    
        // Reset the cards available
        var keys = Object.keys(cardsDictionary);
        for (var i=0; i<keys.length; i++) {
            cardsDictionary[keys[i]] = 0;
        }
        for (var i=0; i<availableCards.length; i++) {
            cardsDictionary[availableCards[i].hash] += 1;
        }
        
        // Pinochles
        if (isDoubleDeck) {
            this.TryToCountMeld(cardsDictionary, PinochleQuadrupleArrayHashes, 'QuadPinochle', 90);
            this.TryToCountMeld(cardsDictionary, PinochleTripleArrayHashes, 'TriplePinochle', 60);
        }
        this.TryToCountMeld(cardsDictionary, PinochleDoubleArrayHashes, 'DoublePinochle', 30);
        this.TryToCountMeld(cardsDictionary, PinochleArrayHashes, 'Pinochle', 4);

        // Dix
        if (!ignoreDix) {
            switch (trumpSuit) {
                case 'H':
                    this.TryToCountMeld(cardsDictionary, DixHeartsDoubleArrayHashes, 'DoubleDix', 2);
                    this.TryToCountMeld(cardsDictionary, DixHeartsArrayHashes, 'Dix', 1);
                break;
                case 'S':
                    this.TryToCountMeld(cardsDictionary, DixSpadesDoubleArrayHashes, 'DoubleDix', 2);
                    this.TryToCountMeld(cardsDictionary, DixSpadesArrayHashes, 'Dix', 1);
                break;
                case 'D':
                    this.TryToCountMeld(cardsDictionary, DixDiamondsDoubleArrayHashes, 'DoubleDix', 2);
                    this.TryToCountMeld(cardsDictionary, DixDiamondsArrayHashes, 'Dix', 1);
                break;
                case 'C':
                    this.TryToCountMeld(cardsDictionary, DixClubsDoubleArrayHashes, 'DoubleDix', 2);
                    this.TryToCountMeld(cardsDictionary, DixClubsArrayHashes, 'Dix', 1);
                break;
            }
        }

        this.currentRoundMeldScore = 0;
        for (var i=0; i<this.melds.length; i++) {
            this.currentRoundMeldScore += this.melds[i].score;
        }
    }

    this.TryToCountMeld = function(cardsDictionary, arrayHashes, meldName, meldScore) {
        for (var i=0; i<arrayHashes.length; i++) {
            var curCount = cardsDictionary[arrayHashes[i][0]];
            if (curCount == null || curCount < arrayHashes[i][1]) {
                return;
            }
        }

        // Meld was found
        var meld = {};
        meld.meldType = meldName;
        meld.cards = [];
        meld.score = meldScore;
        for (var i=0; i<arrayHashes.length; i++) {
            var cardHash = arrayHashes[i][0];
            var cardCount = arrayHashes[i][1];
            cardsDictionary[cardHash] -= cardCount;
            for (var j=0; j<this.cards.length && cardCount>0; j++) {
                if (this.cards[j].hash == cardHash) {
                    meld.cards.push(this.cards[j]);
                    cardCount--;
                }
            }
        }
        this.melds.push(meld);
    }
}

function GetLegalCardsForCurrentPlayerTurn(aGame) {
    var legalCards = [];
    var player = aGame.players[aGame.turnIndex%4];
    if (aGame.trickCards.length === 0) {
        for (var i=0; i<player.cards.length; i++) {
            var card = player.cards[i];
            legalCards.push(card);
        }
    } else {
        var leadCard = aGame.trickCards[0];
        var currentWinningCard = leadCard;
        for (var i=1; i<aGame.trickCards.length; i++) {
            var card = aGame.trickCards[i];
            if ((card.suit == currentWinningCard.suit && card.value > currentWinningCard.value) ||
                (card.suit == aGame.trumpSuit && currentWinningCard.suit != aGame.trumpSuit)) {
                    currentWinningCard = card;
            }
        }

        var playerHasCardInLeadSuit = false;
        var playerHighestCardInLeadSuit = null;
        var playerHasCardInTrumpSuit = false;
        var playerHighestCardInTrumpSuit = null;
        for (var i=0; i<player.cards.length; i++) {
            var card = player.cards[i];
            if (card.suit == leadCard.suit) {
                playerHasCardInLeadSuit = true;
                if (playerHighestCardInLeadSuit == null || card.value > playerHighestCardInLeadSuit.value) {
                    playerHighestCardInLeadSuit = card;
                }
            }
            if (card.suit == aGame.trumpSuit) {
                playerHasCardInTrumpSuit = true;
                if (playerHighestCardInTrumpSuit == null || card.value > playerHighestCardInTrumpSuit.value) {
                    playerHighestCardInTrumpSuit = card;
                }
            }
        }
        
        if (playerHasCardInLeadSuit) {
            if (leadCard.suit != aGame.trumpSuit && currentWinningCard.suit == aGame.trumpSuit) {
                // Play any card of the lead suit because it has already been trumped
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit == leadCard.suit) {
                        legalCards.push(card);
                    }
                }
            } else if (playerHighestCardInLeadSuit.value > currentWinningCard.value) {
                // Play a winning card of the lead suit
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit == currentWinningCard.suit && card.value > currentWinningCard.value) {
                        legalCards.push(card);
                    }
                }
            } else {
                // Play any card of the lead suit
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit == leadCard.suit) {
                        legalCards.push(card);
                    }
                }
            }
        } else if (playerHasCardInTrumpSuit) {
            if (currentWinningCard.suit == aGame.trumpSuit && playerHighestCardInTrumpSuit.value > currentWinningCard.value) {
                // Play any trump that beats the current highest trump
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit == aGame.trumpSuit && card.value > currentWinningCard.value) {
                        legalCards.push(card);
                    }
                }
            } else {
                // Play any trump
                for (var i=0; i<player.cards.length; i++) {
                    var card = player.cards[i];
                    if (card.suit == aGame.trumpSuit) {
                        legalCards.push(card);
                    }
                }
            }
        } else {
            // Play any card
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                legalCards.push(card);
            }
        }
    }

    return legalCards;
}

function PlayCard(aGame, card) {
    var player = aGame.players[aGame.turnIndex%4];
    aGame.cardsPlayedThisRound.push(card);
    if (aGame.trickCards.length !== 0) {
        var leadCard = aGame.trickCards[0];
        if (card.suit !== leadCard.suit) {
            player.isShownVoidInSuit[leadCard.suitInt] = true;
            if (card.suit != aGame.trumpSuit) {
                var suits = ['S','H','C','D'];
                var trumpSuitIndex = suits.indexOf(aGame.trumpSuit);
                player.isShownVoidInSuit[trumpSuitIndex] = true;
            }
        }
    }

    player.cards.splice(player.cards.indexOf(card), 1);
    aGame.trickCards.push(card);
    aGame.turnIndex = aGame.turnIndex + 1;
}

function GetTrickResult(aGame) {
    var trickResult = {};
    trickResult.highestCard = aGame.trickCards[0];
    trickResult.trickTaker = aGame.players[aGame.leadIndex];
    trickResult.countersTaken = 0;
    for (var i=1; i<aGame.trickCards.length; i++) {
        var card = aGame.trickCards[i];
        if ((card.suit == trickResult.highestCard.suit && card.value > trickResult.highestCard.value) ||
            (card.suit == aGame.trumpSuit && trickResult.highestCard.suit != aGame.trumpSuit)) {
            trickResult.highestCard = card;
            trickResult.trickTaker = aGame.players[(aGame.leadIndex + i)%4];
        }
    }

    for (var i=0; i<aGame.trickCards.length; i++) {
        var card = aGame.trickCards[i];
        if (card.rank == 1 || card.rank == 10 || card.rank == 13) {
            trickResult.countersTaken += 1;
        }
    }

    if (aGame.players[0].cards.length == 0) {
        // Last trick
        trickResult.countersTaken += 1;
    }

    return trickResult;
}
self.addEventListener('message', function(e){
    importScripts('player.js');
    var data = e.data;
    switch (data.cmd) {
        case 'FindRoundBidAnalysis':
            FindRoundBidAnalysis(data.gameState, data.passingCardsCount, data.playerSkill, data.playerIndex, data.playerCards, data.simulationsPerSuit, data.isForSimulationView, data.minimumEndTime);
            break;
        case 'FindBestBid':
            FindBestBidWithData(data);
            break;
    }
}, false);

var FindBestBidWithData = function(data) {
    switch (data.playerSkill) {
        case 'Easy':
            var bidAndSuit = [0, ''];
            if (data.gameState.isDoubleDeck) {
                bidAndSuit[0] = Math.floor(Math.random() * 25) + 50
            } else {
                bidAndSuit[0] = Math.floor(Math.random() * 10) + 20
            }
            var suitStrength = [];
            for (var i=0; i<4; i++) {
                suitStrength[i] = 0;
            }
            for (var i=0; i<data.playerCards.length; i++) {
                suitStrength[data.playerCards[i].suitInt] += data.playerCards[i].value;
            }
            var bestStrength = 0;
            var suits = ['H','S','D','C'];
            for (var i=0; i<4; i++) {
                if (suitStrength[i] >= bestStrength) {
                    bestStrength = suitStrength[i];
                    bidAndSuit[1] = suits[i];
                }
            }
            ReturnBid(data.playerIndex, bidAndSuit, data.minimumEndTime);
        break;
        default:
            FindRoundBidAnalysis(data.gameState, data.passingCardsCount, data.playerSkill, data.playerIndex, data.playerCards, data.simulationsPerSuit, data.isForSimulationView, data.minimumEndTime);
    }    
}

var allCards = [
    { id: 'AS0', hash: 'AS', deckID:0, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'TS0', hash: 'TS', deckID:0, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'KS0', hash: 'KS', deckID:0, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'QS0', hash: 'QS', deckID:0, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'JS0', hash: 'JS', deckID:0, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: '9S0', hash: '9S', deckID:0, rank: 9, value: 0, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'AS1', hash: 'AS', deckID:1, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'TS1', hash: 'TS', deckID:1, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'KS1', hash: 'KS', deckID:1, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'QS1', hash: 'QS', deckID:1, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'JS1', hash: 'JS', deckID:1, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: '9S1', hash: '9S', deckID:1, rank: 9, value: 0, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'AS2', hash: 'AS', deckID:2, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'TS2', hash: 'TS', deckID:2, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'KS2', hash: 'KS', deckID:2, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'QS2', hash: 'QS', deckID:2, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'JS2', hash: 'JS', deckID:2, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'AS3', hash: 'AS', deckID:3, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'TS3', hash: 'TS', deckID:3, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'KS3', hash: 'KS', deckID:3, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'QS3', hash: 'QS', deckID:3, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    { id: 'JS3', hash: 'JS', deckID:3, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false },
    
    { id: 'AH0', hash: 'AH', deckID:0, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'TH0', hash: 'TH', deckID:0, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'KH0', hash: 'KH', deckID:0, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'QH0', hash: 'QH', deckID:0, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'JH0', hash: 'JH', deckID:0, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: '9H0', hash: '9H', deckID:0, rank: 9, value: 0, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'AH1', hash: 'AH', deckID:1, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'TH1', hash: 'TH', deckID:1, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'KH1', hash: 'KH', deckID:1, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'QH1', hash: 'QH', deckID:1, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'JH1', hash: 'JH', deckID:1, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: '9H1', hash: '9H', deckID:1, rank: 9, value: 0, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'AH2', hash: 'AH', deckID:2, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'TH2', hash: 'TH', deckID:2, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'KH2', hash: 'KH', deckID:2, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'QH2', hash: 'QH', deckID:2, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'JH2', hash: 'JH', deckID:2, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'AH3', hash: 'AH', deckID:3, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'TH3', hash: 'TH', deckID:3, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'KH3', hash: 'KH', deckID:3, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'QH3', hash: 'QH', deckID:3, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    { id: 'JH3', hash: 'JH', deckID:3, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false },
    
    { id: 'AC0', hash: 'AC', deckID:0, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'TC0', hash: 'TC', deckID:0, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'KC0', hash: 'KC', deckID:0, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'QC0', hash: 'QC', deckID:0, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'JC0', hash: 'JC', deckID:0, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: '9C0', hash: '9C', deckID:0, rank: 9, value: 0, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'AC1', hash: 'AC', deckID:1, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'TC1', hash: 'TC', deckID:1, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'KC1', hash: 'KC', deckID:1, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'QC1', hash: 'QC', deckID:1, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'JC1', hash: 'JC', deckID:1, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: '9C1', hash: '9C', deckID:1, rank: 9, value: 0, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'AC2', hash: 'AC', deckID:2, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'TC2', hash: 'TC', deckID:2, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'KC2', hash: 'KC', deckID:2, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'QC2', hash: 'QC', deckID:2, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'JC2', hash: 'JC', deckID:2, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'AC3', hash: 'AC', deckID:3, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'TC3', hash: 'TC', deckID:3, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'KC3', hash: 'KC', deckID:3, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'QC3', hash: 'QC', deckID:3, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    { id: 'JC3', hash: 'JC', deckID:3, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false },
    
    { id: 'AD0', hash: 'AD', deckID:0, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'TD0', hash: 'TD', deckID:0, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'KD0', hash: 'KD', deckID:0, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'QD0', hash: 'QD', deckID:0, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'JD0', hash: 'JD', deckID:0, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: '9D0', hash: '9D', deckID:0, rank: 9, value: 0, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'AD1', hash: 'AD', deckID:1, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'TD1', hash: 'TD', deckID:1, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'KD1', hash: 'KD', deckID:1, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'QD1', hash: 'QD', deckID:1, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'JD1', hash: 'JD', deckID:1, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: '9D1', hash: '9D', deckID:1, rank: 9, value: 0, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'AD2', hash: 'AD', deckID:2, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'TD2', hash: 'TD', deckID:2, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'KD2', hash: 'KD', deckID:2, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'QD2', hash: 'QD', deckID:2, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'JD2', hash: 'JD', deckID:2, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'AD3', hash: 'AD', deckID:3, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'TD3', hash: 'TD', deckID:3, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'KD3', hash: 'KD', deckID:3, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'QD3', hash: 'QD', deckID:3, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
    { id: 'JD3', hash: 'JD', deckID:3, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false },
];

function GetCards(isDoubleDeck) {
    cards=[];
    for (i=0; i<allCards.length; i++) {
        var card = allCards[i];
        if (isDoubleDeck && card.rank != 9) {
            cards.push(card);
        } else if (!isDoubleDeck && card.deckID<2) {
            cards.push(card);
        }
    }
    return cards;
}

var FindRoundBidAnalysis = function(aGame, passingCardsCount, currentPlayerSkill, currentPlayerIndex, currentPlayerCards, simulationsPerSuit, isForSimulationView, minimumEndTime) {

    // Create a game state copy that can be manipulated and restored to simulate outcomes
    var simGame = {};
    simGame.isDoubleDeck = aGame.isDoubleDeck;
    simGame.cardsPlayedThisRound = [];
    simGame.trickCards = [];
    simGame.leadIndex = aGame.leadIndex;
    simGame.dealerIndex = aGame.dealerIndex;
    simGame.turnIndex = aGame.turnIndex;
    simGame.players = [];
    var player = new Player();
    player.Initialize('You', true, 'Standard', 'South');
    simGame.players.push(player);
    player = new Player();
    player.Initialize('Catalina', false, 'Standard', 'West');
    simGame.players.push(player);
    player = new Player();
    player.Initialize('Amelia', false, 'Standard', 'North');
    simGame.players.push(player);
    player = new Player();
    player.Initialize('Seward', false, 'Standard', 'East');
    simGame.players.push(player);

    var currentSimPlayer = simGame.players[currentPlayerIndex];
    simGame.bidWinner = currentPlayerIndex;
    simGame.currentHighestBidder = currentSimPlayer;

    // Create the list of cards remaining in the deck
    var gameCards = GetCards(simGame.isDoubleDeck);
    var cardsRemaining = [];
    for (var i=0; i<gameCards.length; i++) {
        var isAlreadyPlayed = false;
        for (var j=0; j<currentPlayerCards.length; j++) {
            if (currentPlayerCards[j].id === gameCards[i].id) {
                isAlreadyPlayed = true;
                break;
            }
        }
        if (isAlreadyPlayed) {
            continue;
        }
        
        cardsRemaining.push(gameCards[i]);
    }

    // Create a round bid analysis result
    var roundBidAnalysis = {};
    roundBidAnalysis.safeBids = [];
    roundBidAnalysis.standardBids = [];
    roundBidAnalysis.suggestedBids = [];
    var suits = ['S','H','C','D'];
    roundBidAnalysis.histogramsBySuit = [];
    for (var i=0; i<suits.length; i++) {
        roundBidAnalysis.histogramsBySuit[suits[i]] = [];
    }

    var totalSimulations = simulationsPerSuit*4;
    for (var simIndex = 0; simIndex < totalSimulations; simIndex++) {
        // Try each suit
        simGame.trumpSuit = suits[simIndex%4];

        // Reset the sim game state
        for (var k=0; k<4; k++) {
            var simPlayer = simGame.players[k];
            simPlayer.currentRoundMeldScore = 0;
            simPlayer.currentRoundCountersTaken = 0;
            simPlayer.melds = [];
            simPlayer.cards = [];
            simPlayer.isShownVoidInSuit = [false, false, false, false];
        }
        simGame.cardsPlayedThisRound = [];
        simGame.trickCards = [];
        simGame.dealerIndex = aGame.dealerIndex;
        simGame.leadIndex = currentSimPlayer.playerPositionInt;
        simGame.turnIndex = currentSimPlayer.playerPositionInt;

        // Shuffle the deck
        var deckIdx = 0;
        for (var k = cardsRemaining.length - 1; k > 0; k--) {
            var randIdx = Math.floor(Math.random() * (k + 1));
            x = cardsRemaining[k];
            cardsRemaining[k] = cardsRemaining[randIdx];
            cardsRemaining[randIdx] = x;
        }

        // Deal the cards to each player
        for (var n=0; n<currentPlayerCards.length; n++) {
            var card = currentPlayerCards[n];
            card.wasPassed = false;
            card.wasShown = false;
            currentSimPlayer.cards.push(card);
        }
        var deckIdx = 0;
        for (var n=0; n<4; n++) {
            var player = simGame.players[n];
            while (player.cards.length != currentSimPlayer.cards.length) {
                player.cards.push(cardsRemaining[deckIdx]);
                deckIdx++;
            }
        }

        // Pass cards
        if (passingCardsCount > 0) {
            var passingPlayer = simGame.players[(currentSimPlayer.playerPositionInt+2)%4];
            var receivingPlayer = currentSimPlayer;
            receivingPlayer.receivedCards = [];
            var passingCards = passingPlayer.FindBestPassingCards(passingCardsCount, simGame);
            for (var n=0; n<passingCards.length; n++) {
                var card = passingCards[n];
                card.wasPassed = true;
                passingPlayer.cards.splice(passingPlayer.cards.indexOf(card),1);
                receivingPlayer.cards.push(card);
                receivingPlayer.receivedCards.push(card);
            }

            passingPlayer = currentSimPlayer;
            receivingPlayer = simGame.players[(currentSimPlayer.playerPositionInt+2)%4];
            receivingPlayer.receivedCards = [];
            var passingCards = passingPlayer.FindBestPassingCards(passingCardsCount, simGame);
            for (var n=0; n<passingCards.length; n++) {
                var card = passingCards[n];
                card.wasPassed = true;
                passingPlayer.cards.splice(passingPlayer.cards.indexOf(card),1);
                receivingPlayer.cards.push(card);
                receivingPlayer.receivedCards.push(card);
            }
        }

        // Count Melds
        for (var i=0; i<4; i++) {
            var player = simGame.players[i];
            player.passingCards = [];
            player.CalculateMelds(player.cards, simGame.trumpSuit, simGame.isDoubleDeck, false);
            for (var n=0; n<player.melds.length; n++) {
                var meld = player.melds[n];
                for (var k=0; k<meld.cards.length; k++) {
                    var card = meld.cards[k];
                    card.wasShown = true;
                }
            }
        }

        // Play out trick taking
        while (currentSimPlayer.cards.length>0) {
            simGame.trickCards = [];
            while (simGame.trickCards.length < 4) {
                var nextPlayer = simGame.players[simGame.turnIndex%4];
                var nextCard = nextPlayer.FindBestPlayingCard(simGame);
                PlayCard(simGame,nextCard);
            }

            var trickResult = GetTrickResult(simGame);
            trickResult.trickTaker.currentRoundCountersTaken += trickResult.countersTaken;
            simGame.leadIndex = trickResult.trickTaker.playerPositionInt;
            simGame.turnIndex = simGame.leadIndex;
        }

        // Count round score
        var teamMeldScore = simGame.players[(currentSimPlayer.playerPositionInt+2)%4].currentRoundMeldScore + currentSimPlayer.currentRoundMeldScore;
        var teamCountersScore = simGame.players[(currentSimPlayer.playerPositionInt+2)%4].currentRoundCountersTaken + currentSimPlayer.currentRoundCountersTaken;
        var teamRoundScore = teamMeldScore + teamCountersScore;
        var curSuitHistograms = roundBidAnalysis.histogramsBySuit[simGame.trumpSuit];
        if (curSuitHistograms[teamRoundScore] == null) {
            curSuitHistograms[teamRoundScore] = 1;
        } else {
            curSuitHistograms[teamRoundScore] += 1;
        }

        if (isForSimulationView) {
            if (simIndex > 100 && simIndex%800==0) {
                roundBidAnalysis.simulationsCount = Math.floor(simIndex/4);
                roundBidAnalysis.suggestedSuit = suits[0];
                roundBidAnalysis.standardBid = 0;
                roundBidAnalysis.suggestedBid = 0;
                for (var i=0; i<4; i++) {
                    var scoresAchievedCount = 0;
                    var safeScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.1;
                    var standardScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.18;
                    var suggestedScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.25;
                    var safeScoresThreshFound = false;
                    var suggestedThreshFound = false;
                    var standardScoresThreshFound = false;
                    var roundScoresHistogram = roundBidAnalysis.histogramsBySuit[suits[i]];
                    for (var j=0; j<roundScoresHistogram.length; j++) {
                        if (roundScoresHistogram[j] == null) {
                            continue;
                        }
                        scoresAchievedCount += roundScoresHistogram[j];
                        if (!safeScoresThreshFound && scoresAchievedCount >= safeScoresAchievedThresh) {
                            safeScoresThreshFound = true;
                            roundBidAnalysis.safeBids[i] = j;
                        }
                        if (!standardScoresThreshFound && scoresAchievedCount >= standardScoresAchievedThresh) {
                            standardScoresThreshFound = true;
                            roundBidAnalysis.standardBids[i] = j;
                            if (j > roundBidAnalysis.standardBid) {
                                roundBidAnalysis.standardBid = j;
                            }
                            continue;
                        }
                        if (!suggestedThreshFound && scoresAchievedCount >= suggestedScoresAchievedThresh) {
                            suggestedThreshFound = true;
                            roundBidAnalysis.suggestedBids[i] = j;
                            if (j > roundBidAnalysis.suggestedBid) {
                                roundBidAnalysis.suggestedBid = j;
                                roundBidAnalysis.suggestedSuit = suits[i];
                            }
                        }
                    }
                }
                self.postMessage({'cmd': 'UpdateRoundSimulationsView', 'roundBidAnalysis': roundBidAnalysis});
            }
        }
    }

    roundBidAnalysis.simulationsCount = simulationsPerSuit;
    roundBidAnalysis.suggestedSuit = suits[0];
    roundBidAnalysis.standardBid = 0;
    roundBidAnalysis.suggestedBid = 0;
    for (var i=0; i<4; i++) {
        var scoresAchievedCount = 0;
        var safeScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.1;
        var standardScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.18;
        var suggestedScoresAchievedThresh = roundBidAnalysis.simulationsCount * 0.25;
        var safeScoresThreshFound = false;
        var suggestedThreshFound = false;
        var standardScoresThreshFound = false;
        var roundScoresHistogram = roundBidAnalysis.histogramsBySuit[suits[i]];
        for (var j=0; j<roundScoresHistogram.length; j++) {
            if (roundScoresHistogram[j] == null) {
                continue;
            }
            scoresAchievedCount += roundScoresHistogram[j];
            if (!safeScoresThreshFound && scoresAchievedCount >= safeScoresAchievedThresh) {
                safeScoresThreshFound = true;
                roundBidAnalysis.safeBids[i] = j;
            }
            if (!standardScoresThreshFound && scoresAchievedCount >= standardScoresAchievedThresh) {
                standardScoresThreshFound = true;
                roundBidAnalysis.standardBids[i] = j;
                if (j > roundBidAnalysis.standardBid) {
                    roundBidAnalysis.standardBid = j;
                }
                continue;
            }
            if (!suggestedThreshFound && scoresAchievedCount >= suggestedScoresAchievedThresh) {
                suggestedThreshFound = true;
                roundBidAnalysis.suggestedBids[i] = j;
                if (j > roundBidAnalysis.suggestedBid) {
                    roundBidAnalysis.suggestedBid = j;
                    roundBidAnalysis.suggestedSuit = suits[i];
                }
            }
        }
    }

    if (isForSimulationView) {
        self.postMessage({'cmd': 'UpdateRoundSimulationsView', 'roundBidAnalysis': roundBidAnalysis});
    } else {
        var bid;
        if (currentPlayerSkill == 'Standard') {
            bid = [roundBidAnalysis.standardBid, roundBidAnalysis.suggestedSuit];
        } else { // Pro
            bid = [roundBidAnalysis.suggestedBid, roundBidAnalysis.suggestedSuit];
        }
        ReturnBid(currentPlayerIndex, bid, minimumEndTime);
    }
}

var ReturnBid = function(playerIndex, bid, minimumEndTime) {
    self.postMessage({
        'cmd': 'PlayerFoundBestBid',
        'playerIndex': playerIndex,
        'bid': bid,
        'minimumEndTime': minimumEndTime
    });
}
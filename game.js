var Game = function () {

    // Constants
    var cardLoweredWidth = 115;
    var cardLoweredHeight = 162;
    
    // Local variables
    var scoreboard = new Scoreboard();
    var currentDraggedCardView;
    var currentPlayerHandCardSpacing = 0;
    var autoPlayBoundaryY = 0;

    // Members
    this.currentMoveStage = "";
    this.skillLevel = "";
    this.winningScore = 0;
    this.isDoubleDeck = false;
    this.players = [];
    this.trickCards = [];
    this.roundNumber = 0;
    this.dealerIndex = 0;
    this.leadIndex = 0;
    this.turnIndex = 0;
    this.bidWinner = 0;
    this.currentHighestBidder = null;
    this.trumpSuit = 'S';
    this.cardsPlayedThisRound = [];
    this.roundContracts = [];
    this.roundMelds = [];
    this.roundCountersTaken = [];
    this.roundScores = [];

    var deckTopIndex = 0;
    var allCards = [
        { id: 'AS0', hash: 'AS', deckID:0, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Ace.jpg')" },
        { id: 'TS0', hash: 'TS', deckID:0, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_10.jpg')" },
        { id: 'KS0', hash: 'KS', deckID:0, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_King.jpg')" },
        { id: 'QS0', hash: 'QS', deckID:0, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Queen.jpg')" },
        { id: 'JS0', hash: 'JS', deckID:0, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Jack.jpg')" },
        { id: '9S0', hash: '9S', deckID:0, rank: 9, value: 0, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_9.jpg')" },
        { id: 'AS1', hash: 'AS', deckID:1, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Ace.jpg')" },
        { id: 'TS1', hash: 'TS', deckID:1, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_10.jpg')" },
        { id: 'KS1', hash: 'KS', deckID:1, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_King.jpg')" },
        { id: 'QS1', hash: 'QS', deckID:1, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Queen.jpg')" },
        { id: 'JS1', hash: 'JS', deckID:1, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Jack.jpg')" },
        { id: '9S1', hash: '9S', deckID:1, rank: 9, value: 0, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_9.jpg')" },
        { id: 'AS2', hash: 'AS', deckID:2, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Ace.jpg')" },
        { id: 'TS2', hash: 'TS', deckID:2, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_10.jpg')" },
        { id: 'KS2', hash: 'KS', deckID:2, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_King.jpg')" },
        { id: 'QS2', hash: 'QS', deckID:2, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Queen.jpg')" },
        { id: 'JS2', hash: 'JS', deckID:2, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Jack.jpg')" },
        { id: 'AS3', hash: 'AS', deckID:3, rank: 1, value: 5, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Ace.jpg')" },
        { id: 'TS3', hash: 'TS', deckID:3, rank: 10, value: 4, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_10.jpg')" },
        { id: 'KS3', hash: 'KS', deckID:3, rank: 13, value: 3, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_King.jpg')" },
        { id: 'QS3', hash: 'QS', deckID:3, rank: 12, value: 2, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Queen.jpg')" },
        { id: 'JS3', hash: 'JS', deckID:3, rank: 11, value: 1, suit: 'S', suitInt: 0, wasShown: false, wasPassed: false, image: "url('images/Card_Spade_Jack.jpg')" },
        
        { id: 'AH0', hash: 'AH', deckID:0, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Ace.jpg')" },
        { id: 'TH0', hash: 'TH', deckID:0, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_10.jpg')" },
        { id: 'KH0', hash: 'KH', deckID:0, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_King.jpg')" },
        { id: 'QH0', hash: 'QH', deckID:0, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Queen.jpg')" },
        { id: 'JH0', hash: 'JH', deckID:0, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Jack.jpg')" },
        { id: '9H0', hash: '9H', deckID:0, rank: 9, value: 0, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_9.jpg')" },
        { id: 'AH1', hash: 'AH', deckID:1, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Ace.jpg')" },
        { id: 'TH1', hash: 'TH', deckID:1, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_10.jpg')" },
        { id: 'KH1', hash: 'KH', deckID:1, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_King.jpg')" },
        { id: 'QH1', hash: 'QH', deckID:1, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Queen.jpg')" },
        { id: 'JH1', hash: 'JH', deckID:1, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Jack.jpg')" },
        { id: '9H1', hash: '9H', deckID:1, rank: 9, value: 0, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_9.jpg')" },
        { id: 'AH2', hash: 'AH', deckID:2, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Ace.jpg')" },
        { id: 'TH2', hash: 'TH', deckID:2, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_10.jpg')" },
        { id: 'KH2', hash: 'KH', deckID:2, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_King.jpg')" },
        { id: 'QH2', hash: 'QH', deckID:2, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Queen.jpg')" },
        { id: 'JH2', hash: 'JH', deckID:2, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Jack.jpg')" },
        { id: 'AH3', hash: 'AH', deckID:3, rank: 1, value: 5, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Ace.jpg')" },
        { id: 'TH3', hash: 'TH', deckID:3, rank: 10, value: 4, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_10.jpg')" },
        { id: 'KH3', hash: 'KH', deckID:3, rank: 13, value: 3, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_King.jpg')" },
        { id: 'QH3', hash: 'QH', deckID:3, rank: 12, value: 2, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Queen.jpg')" },
        { id: 'JH3', hash: 'JH', deckID:3, rank: 11, value: 1, suit: 'H', suitInt: 1, wasShown: false, wasPassed: false, image: "url('images/Card_Heart_Jack.jpg')" },
        
        { id: 'AC0', hash: 'AC', deckID:0, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Ace.jpg')" },
        { id: 'TC0', hash: 'TC', deckID:0, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_10.jpg')" },
        { id: 'KC0', hash: 'KC', deckID:0, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_King.jpg')" },
        { id: 'QC0', hash: 'QC', deckID:0, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Queen.jpg')" },
        { id: 'JC0', hash: 'JC', deckID:0, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Jack.jpg')" },
        { id: '9C0', hash: '9C', deckID:0, rank: 9, value: 0, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_9.jpg')" },
        { id: 'AC1', hash: 'AC', deckID:1, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Ace.jpg')" },
        { id: 'TC1', hash: 'TC', deckID:1, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_10.jpg')" },
        { id: 'KC1', hash: 'KC', deckID:1, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_King.jpg')" },
        { id: 'QC1', hash: 'QC', deckID:1, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Queen.jpg')" },
        { id: 'JC1', hash: 'JC', deckID:1, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Jack.jpg')" },
        { id: '9C1', hash: '9C', deckID:1, rank: 9, value: 0, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_9.jpg')" },
        { id: 'AC2', hash: 'AC', deckID:2, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Ace.jpg')" },
        { id: 'TC2', hash: 'TC', deckID:2, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_10.jpg')" },
        { id: 'KC2', hash: 'KC', deckID:2, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_King.jpg')" },
        { id: 'QC2', hash: 'QC', deckID:2, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Queen.jpg')" },
        { id: 'JC2', hash: 'JC', deckID:2, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Jack.jpg')" },
        { id: 'AC3', hash: 'AC', deckID:3, rank: 1, value: 5, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Ace.jpg')" },
        { id: 'TC3', hash: 'TC', deckID:3, rank: 10, value: 4, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_10.jpg')" },
        { id: 'KC3', hash: 'KC', deckID:3, rank: 13, value: 3, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_King.jpg')" },
        { id: 'QC3', hash: 'QC', deckID:3, rank: 12, value: 2, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Queen.jpg')" },
        { id: 'JC3', hash: 'JC', deckID:3, rank: 11, value: 1, suit: 'C', suitInt: 2, wasShown: false, wasPassed: false, image: "url('images/Card_Club_Jack.jpg')" },
        
        { id: 'AD0', hash: 'AD', deckID:0, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Ace.jpg')" },
        { id: 'TD0', hash: 'TD', deckID:0, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_10.jpg')" },
        { id: 'KD0', hash: 'KD', deckID:0, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_King.jpg')" },
        { id: 'QD0', hash: 'QD', deckID:0, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Queen.jpg')" },
        { id: 'JD0', hash: 'JD', deckID:0, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Jack.jpg')" },
        { id: '9D0', hash: '9D', deckID:0, rank: 9, value: 0, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_9.jpg')" },
        { id: 'AD1', hash: 'AD', deckID:1, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Ace.jpg')" },
        { id: 'TD1', hash: 'TD', deckID:1, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_10.jpg')" },
        { id: 'KD1', hash: 'KD', deckID:1, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_King.jpg')" },
        { id: 'QD1', hash: 'QD', deckID:1, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Queen.jpg')" },
        { id: 'JD1', hash: 'JD', deckID:1, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Jack.jpg')" },
        { id: '9D1', hash: '9D', deckID:1, rank: 9, value: 0, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_9.jpg')" },
        { id: 'AD2', hash: 'AD', deckID:2, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Ace.jpg')" },
        { id: 'TD2', hash: 'TD', deckID:2, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_10.jpg')" },
        { id: 'KD2', hash: 'KD', deckID:2, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_King.jpg')" },
        { id: 'QD2', hash: 'QD', deckID:2, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Queen.jpg')" },
        { id: 'JD2', hash: 'JD', deckID:2, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Jack.jpg')" },
        { id: 'AD3', hash: 'AD', deckID:3, rank: 1, value: 5, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Ace.jpg')" },
        { id: 'TD3', hash: 'TD', deckID:3, rank: 10, value: 4, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_10.jpg')" },
        { id: 'KD3', hash: 'KD', deckID:3, rank: 13, value: 3, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_King.jpg')" },
        { id: 'QD3', hash: 'QD', deckID:3, rank: 12, value: 2, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Queen.jpg')" },
        { id: 'JD3', hash: 'JD', deckID:3, rank: 11, value: 1, suit: 'D', suitInt: 3, wasShown: false, wasPassed: false, image: "url('images/Card_Diamond_Jack.jpg')" },
    ];

    this.ConvertSuitIntToSuit = function(suitInt) {
        switch (suitInt) {
            case 0:
                return 'S';
            case 1:
                return 'H';
            case 2:
                return 'C';
            default:
                return 'D';
        }
    }
    var cards = [];

    this.GetCards = function () {
        return cards;
    }

    var cardsRegion = document.getElementById('cards_region');
    cardsRegion.onmousedown = dragMouseDown;

    // template for card
    var cardElement = document.createElement("div");
    cardElement.className = "card";
    var raiseContainer = document.createElement("div");
    raiseContainer.className = "raiseContainer";
    cardElement.appendChild(raiseContainer);
    var flipContainer = document.createElement("div");
    flipContainer.className = "cardFlipContainer";
    raiseContainer.appendChild(flipContainer);
    var shadow = document.createElement("div");
    shadow.className = "cardShadow";
    flipContainer.appendChild(shadow);
    var back = document.createElement("div");
    back.className = "cardBack";
    flipContainer.appendChild(back);
    var front = document.createElement("div");
    front.className = "cardFront";
    flipContainer.appendChild(front);
    var frontShade = document.createElement("div");
    frontShade.className = "cardFrontShade";
    front.appendChild(frontShade);
    var cardHighlight = document.createElement("div");
    cardHighlight.className = "cardFrontHighlight";
    front.appendChild(cardHighlight);

    var cardBackURI = "url('images/card_back_" + GetSetting('setting_card_color') + ".jpg')";

    for (var i = 0; i < allCards.length; i++) {
        var newCard = cardElement.cloneNode(true);
        var card = allCards[i];
        card.cardView = newCard;
        card.cardView.isSlidUp = false;
        card.cardView.isFlippedUp = false;
        newCard.id = card.id;
        newCard.card = card;
        newCard.positionIndex = i;
        newCard.getElementsByClassName('cardBack')[0].style.backgroundImage = cardBackURI;
        newCard.getElementsByClassName('cardFront')[0].style.backgroundImage = card.image;
        newCard.style.visibility = "hidden";
        cards_region.appendChild(newCard);
    }

    this.GetCardFromString = function (cardString) {
        for (var i = 0; i < allCards.length; i++) {
            if (allCards[i].id == cardString) {
                return allCards[i];
            }
        }
        return null;
    }

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    function dragMouseDown(e) {
        e = e || window.event;

        if (!e.target.classList.contains('card')) {
            return;
        }

        scoreboard.Contract();

        if(game.currentMoveStage == 'ChoosingPassCards') {
            autoPlayBoundaryY = GetHandCardLocation(0,6,13)[1] - cardLoweredHeight * 0.4;
            var tappedCardView = e.target;
            if (tappedCardView.isClickable) {
                currentDraggedCardView = tappedCardView;
                currentDraggedCardView.style.transition = "none";
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                currentDraggedCardView.startTime = Date.now();
                currentDraggedCardView.startPosition = [e.clientX, e.clientY];
                passingCardsPointerPressed();
            }
        } else if (game.currentMoveStage === 'ChoosingTrickCard') {
            autoPlayBoundaryY = GetHandCardLocation(0,6,13)[1] - cardLoweredHeight * 0.4;
            var tappedCardView = e.target;
            if (tappedCardView.isClickable) {
                currentDraggedCardView = tappedCardView;
                currentDraggedCardView.style.transition = "none";
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                currentDraggedCardView.startTime = Date.now();
                currentDraggedCardView.startPosition = [e.clientX, e.clientY];
                raiseCard(currentDraggedCardView);
            }
        } else {
            return;
        }
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        currentDraggedCardView.style.top = (currentDraggedCardView.offsetTop - pos2) + "px";
        currentDraggedCardView.style.left = (currentDraggedCardView.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse released
        cardTouchFinished();
        document.onmouseup = null;
        document.onmousemove = null;
    }

    var currentPassingCardViews = [];
    var currentDraggedCardWasLastInHand;

    function passingCardsPointerPressed() {
        
        // Find the autoplay line for dropped cards
        var cardWasInSlot = false;
        for (var i=0; i<currentPassingCardViews.length; i++) {
            if (currentDraggedCardView === currentPassingCardViews[i]) {
                currentDraggedCardView.style.zIndex = 200;
                autoPlayBoundaryY = GetPassingCardsLocation(i)[1] + 70;
                currentPassingCardViews[i] = null;
                currentDraggedCardWasLastInHand = false;
                HidePassCardsButton();
                game.players[0].passingCards.splice(game.players[0].passingCards.indexOf(currentDraggedCardView.card),1);
                game.players[0].cards.push(currentDraggedCardView.card);
                if (GetSetting('setting_sort_left_to_right')) {
                    game.players[0].cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return b.value - a.value;
                        }
                    });
                } else {
                    game.players[0].cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return a.value - b.value;
                        }
                    });
                }
                cardWasInSlot = true;
                break;
            }
        }
        if (!cardWasInSlot) {
            autoPlayBoundaryY = GetHandCardLocation('South', 0, 13)[1] - 50;
            currentDraggedCardWasLastInHand = true;
        }
        raiseCard(currentDraggedCardView);
    }

    function cardTouchFinished() {    
        // Check for tap
        var distX = pos3 - currentDraggedCardView.startPosition[0];
        var distY = pos4 - currentDraggedCardView.startPosition[1];
        var distance = Math.sqrt(distX * distX + distY * distY);
        var elapsed = Date.now() - currentDraggedCardView.startTime;
        var tapped = elapsed < 500 && distance < 10;

        if (game.currentMoveStage === 'ChoosingPassCards') {
            if (currentDraggedCardWasLastInHand) {
                if (tapped || (currentDraggedCardView.offsetTop < autoPlayBoundaryY)) {
                    DropCurrentDraggedCardViewIntoPassingSlot();
                } else {
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                }
            } else {
                if (tapped || currentDraggedCardView.offsetTop > autoPlayBoundaryY) {
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                } else {
                    DropCurrentDraggedCardViewIntoPassingSlot();
                }
            }
        } else if (game.currentMoveStage === 'ChoosingTrickCard') {
            if (tapped) {
                game.DropCardInTrickPile();
            } else {
                if (currentDraggedCardView.offsetTop < autoPlayBoundaryY) {
                    game.DropCardInTrickPile();
                } else {
                    AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                }
            }
        }
         
        lowerCard(currentDraggedCardView);
    }

    function DropCurrentDraggedCardViewIntoPassingSlot()
    {
        var player = game.players[0];
        if (player.passingCards.length < currentPassingCardViews.length) {
            var indexOfCard = player.cards.indexOf(currentDraggedCardView.card);
            var card = player.cards[indexOfCard];
            player.cards.splice(indexOfCard, 1);
            player.passingCards.push(card);
            
            // Pick the closest passing spot
            var closestOpenPassingIndex = -1;
            var closestDistance = 10000000;
            var cardHeightHalf = 162*0.5;
            for (var i=0; i<currentPassingCardViews.length; i++) {
                if (currentPassingCardViews[i] !== null) {
                    continue;
                }
                
                var spotLoc = GetPassingCardsLocation(i);
                var distX = currentDraggedCardView.offsetLeft - spotLoc[0];
                var distY = currentDraggedCardView.offsetTop - spotLoc[1];
                var dist = Math.sqrt(distX*distX + distY*distY);
                if (dist < closestDistance) {
                    closestDistance = dist;
                    closestOpenPassingIndex = i;
                }
            }
            
            if (closestOpenPassingIndex < 0) {
                AnimatePlayerHandCardsIntoPosition('South', "0.3s");
                return;
            } else {
                currentPassingCardViews[closestOpenPassingIndex] = currentDraggedCardView;
            }
            
            currentDraggedCardView.positionFunction = 'GetPassingCardsLocation(' + closestOpenPassingIndex + ')';
            var pos = eval(currentDraggedCardView.positionFunction);
            with (currentDraggedCardView.style) {
                transition =  "0.3s ease-out";
                transitionDelay = '0ms';
                left = pos[0] + "px";
                top = pos[1] + "px";
                transform = 'rotate(0deg)';
                zIndex = 0;
            }

            if (player.passingCards.length === currentPassingCardViews.length) {
                ShowPassCardsButton();
            }
        }
        
        AnimatePlayerHandCardsIntoPosition('South', "0.3s");
    }

    function ShowPassCardsButton() {
        var passCardsButton = document.getElementById('confirm_passing_cards_button');
        passCardsButton.positionFunction = 'GetPassingCardsConfirmLocation()';
        var loc = eval(passCardsButton.positionFunction);
        passCardsButton.style.transition = 'none';
        passCardsButton.style.left = loc[0] + 'px';
        passCardsButton.style.top = loc[1] + 'px';
        passCardsButton.style.visibility = "visible";
        with (passCardsButton.style) {
            transition = "0.3s linear";
            opacity = 1;
            pointerEvents = "auto";
        }
    }

    function GetPassingCardsConfirmLocation() {
        var loc = GetPassingCardsLocation(0);
        return [window.innerWidth*0.5, loc[1] + 185];
    }

    function HidePassCardsButton() {
        var confirmCribRegion = document.getElementById('confirm_passing_cards_button');
        with (confirmCribRegion.style) {
            transition = "0.2s linear";
            opacity = 0;
            pointerEvents = "none";
        }
    }

    /**
    * detect IE
    * returns version of IE or false, if browser is not Internet Explorer
    */
    function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            //return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            return true;
        }
    
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            //return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            return true;
        }
    
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            //return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            return true;
        }
    
        // other browser
        return false;
    }

    var isIE = detectIE();

    function flipUpCard(cardView, animate) {
        if (cardView.isFlippedUp) {
            return;
        }

        cardView.isFlippedUp = true;
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = animate ? "0.7s ease-out" : "none";
        flipContainer.style.transition = ease;
        cardShadow.style.transition = ease;
        cardBack.style.transition = ease;
        cardFront.style.transition = ease;
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1.15)";
        
        if (animate) {
            if (isIE) {
                cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
                cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(-180deg)";
                cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(0deg)";
                setTimeout(function () {
                    raiseContainer.style.transform = "scale(1)";
                    cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(0deg)";
                }, 400);
            } else {
                flipContainer.style.transform = "perspective(500px) rotateY(180deg)";
                cardShadow.style.transform = "translate3d(-20px,20px,0px)";
                setTimeout(function () {
                    raiseContainer.style.transform = "scale(1)";
                    cardShadow.style.transform = "translate3d(0px,0px,0px)";
                }, 400);
            }
        } else {
            if (isIE) {
                cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
                cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(-180deg)";
                cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(0deg)";
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(0deg)";
            } else {
                flipContainer.style.transform = "perspective(500px) rotateY(180deg)";
                cardShadow.style.transform = "translate3d(-20px,20px,0px)";
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px)";
            }
        }
    }

    function flipDownCard(cardView, animate) {
        if (!cardView.isFlippedUp) {
            return;
        }

        cardView.isFlippedUp = false;
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = animate ? "0.7s ease-out" : "none";
        flipContainer.style.transition = ease;
        cardShadow.style.transition = ease;
        cardBack.style.transition = ease;
        cardFront.style.transition = ease;
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1.15)";
        
        if (animate) {
            if (isIE) {
                cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(180deg)";
                cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
                cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(180deg)";
                setTimeout(function () {
                    raiseContainer.style.transform = "scale(1)";
                    cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(180deg)";
                }, 400);
            } else {
                flipContainer.style.transform = "perspective(500px) rotateY(0deg)";
                cardShadow.style.transform = "translate3d(-20px,20px,0px)";
                setTimeout(function () {
                    raiseContainer.style.transform = "scale(1)";
                    cardShadow.style.transform = "translate3d(0px,0px,0px)";
                }, 400);
            }
        } else {
            if (isIE) {
                cardFront.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(180deg)";
                cardBack.style.transform = "translate3d(0px,0px,1px) perspective(500px) rotateY(0deg)";
                cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(180deg)";
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(180deg)";
            } else {
                flipContainer.style.transform = "perspective(500px) rotateY(0deg)";
                cardShadow.style.transform = "translate3d(-20px,20px,0px)";
                raiseContainer.style.transform = "scale(1)";
                cardShadow.style.transform = "translate3d(0px,0px,0px)";
            }         
        }
    }

    function raiseCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = "0.1s linear";
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1.15)";
        cardShadow.style.transition = ease;
        if (isIE) {
            cardShadow.style.transform = "translate3d(20px,20px,0px) perspective(500px) rotateY(0deg)";
        } else {
            cardShadow.style.transform = "translate3d(-20px,20px,0px)";
        }
    }

    function lowerCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardShadow = flipContainer.children[0];
        var cardBack = flipContainer.children[1];
        var cardFront = flipContainer.children[2];
        var ease = "0.1s linear";
        raiseContainer.style.transition = ease;
        raiseContainer.style.transform = "scale(1)";
        cardShadow.style.transition = ease;
        if (isIE) {
            cardShadow.style.transform = "translate3d(0px,0px,0px) perspective(500px) rotateY(0deg)";
        } else {
            cardShadow.style.transform = "translate3d(0px,0px,0px)";
        }
    }

    function ShadeCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var shade = cardFront.firstChild;
        with (shade.style) {
            transition = "0.3s linear";
            opacity = 0.3;
        }
    }

    function UnshadeCard(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var shade = cardFront.firstChild;
        with (shade.style) {
            transition = "0.3s linear";
            opacity = 0;
        }
    }

    function BumpCards(cards, delay) {
        setTimeout(function() {
            for (var i=0; i<cards.length; i++) {
                BumpCard(cards[i].cardView);
            }    
        }, delay);
    }

    function BumpCard(cardView) {
        var raiseContainer = cardView.firstChild;
        raiseContainer.addEventListener("animationend", function() {
            raiseContainer.classList.remove('bump');
        });
        raiseContainer.classList.add('bump');
    }

    function FlashHighlightCardView(cardView) {
        var raiseContainer = cardView.firstChild;
        var flipContainer = raiseContainer.firstChild;
        var cardFront = flipContainer.children[2];
        var flashHighlight = cardFront.children[1];
        flashHighlight.addEventListener("animationend", function() {
            flashHighlight.classList.remove('flashHighlight');
        });
        flashHighlight.classList.add('flashHighlight');
    }

    function TwistCard(cardView) {
        cardView.addEventListener("animationend", function() {
            cardView.classList.remove('twist');
        });
        cardView.classList.add('twist');
    }

    function ShakeCard(cardView) {
        cardView.addEventListener("animationend", function() {
            cardView.classList.remove('shake');
        });
        cardView.classList.add('shake');
    }

    function GetHandCardLocation(position, index, cardCount) {
        var cardWidthHalf = 115*0.5;
        var cardHeightHalf = 162*0.5;
        switch (position)
        {
            case 'West':
                var firstLeft = -40;
                var lastLeft = -40;
                var firstTop = 250;
                var lastTop = window.innerHeight-300;
                var handWidth = lastTop - firstTop;
                var cardSpacing = handWidth/cardCount;
                var curTop = firstTop;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curTop = firstTop + (handWidth - cardSpacing*cardCount)*0.5;
                }
                curTop = curTop + index*cardSpacing;
                curLeft = (firstLeft + lastLeft)*0.5;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, 90];
            case 'North':
                var firstLeft = window.innerWidth*0.5 - 120;
                var lastLeft = window.innerWidth*0.5 + 120;
                var firstTop = -40;
                var lastTop = -40;
                var handWidth = lastLeft - firstLeft;
                var cardSpacing = handWidth/(cardCount-1);
                var curLeft = firstLeft;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curLeft = firstLeft + (handWidth - cardSpacing*(cardCount-1))*0.5;
                }
                var curTop = firstTop;
                curLeft = curLeft + index*cardSpacing;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, 0];
            case 'East':
                var firstLeft = window.innerWidth+40;
                var lastLeft = window.innerWidth+40;
                var firstTop = 250;
                var lastTop = window.innerHeight - 300;
                var handWidth = lastTop - firstTop;
                var cardSpacing = handWidth/cardCount;
                var curTop = firstTop;
                var maxSpacing = 30;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    curTop = firstTop + (handWidth - cardSpacing*cardCount)*0.5;
                }
                curTop = curTop + index*cardSpacing;
                curLeft = firstLeft;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, -90];
            default:
                var firstLeft = 150;
                var lastLeft = window.innerWidth-150;
                var firstTop = window.innerHeight-180;
                var lastTop = window.innerHeight-180;
                var handWidth = lastLeft-firstLeft;
                var cardSpacing = handWidth/(cardCount-1);
                var maxSpacing = cardWidthHalf;
                if (cardSpacing > maxSpacing) {
                    cardSpacing = maxSpacing;
                    handWidth = cardSpacing*(cardCount-1);
                    firstLeft = (window.innerWidth - handWidth)*0.5;
                    lastLeft = (window.innerWidth + handWidth)*0.5;
                }
                var curLeft = firstLeft + index*cardSpacing;
                var percent = handWidth > 0 ? (curLeft - firstLeft)/handWidth : 0.5;
                var radius = 2000;
                var distanceFromCenter = handWidth*(0.5 - percent);
                var curveHeight = Math.sqrt(radius*radius-distanceFromCenter*distanceFromCenter) - Math.sqrt(radius*radius - handWidth*0.5*handWidth*0.5); 
                var curveRotation = Math.asin(-distanceFromCenter/radius)*180/Math.PI;
                var curTop = firstTop - curveHeight;
                return [curLeft-cardWidthHalf, curTop-cardHeightHalf, curveRotation];
        }
    }

    this.InitializeGame = function(difficulty) {
        // Game properties
        this.skillLevel = difficulty;
        this.winningScore = Number(GetSetting('setting_winning_score'));
        this.isDoubleDeck = GetSetting('setting_deck_count')==1;
        this.cardsPlayedThisRound = [];
        this.trickCards = [];
        this.roundNumber = 0;
        this.dealerIndex = 0;
        this.leadIndex = 0;
        this.turnIndex = 0;
        this.isSpadesBroken = false;
        this.currentMoveStage = 'None';
        this.roundContracts = [];
        this.roundMelds = [];
        this.roundCountersTaken = [];
        this.roundScores = [];

        this.players = [];
        var player = new Player();
        player.Initialize('You', true, 'Pro', 'South');
        this.players.push(player);
        switch(difficulty)
        {
            case 'Easy':
            {
                player = new Player();
                player.Initialize('Conrad', false, difficulty, 'West');
                this.players.push(player);
                player = new Player();
                player.Initialize('Louisa', false, 'Pro', 'North');
                this.players.push(player);
                player = new Player();
                player.Initialize('Davina', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
            case 'Standard':
            {
                player = new Player();
                player.Initialize('Catalina', false, difficulty, 'West');
                this.players.push(player);
                player = new Player();
                player.Initialize('Amelia', false, 'Pro', 'North');
                this.players.push(player);
                player = new Player();
                player.Initialize('Seward', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
            default:
            {
                player = new Player();
                player.Initialize('Charlotte', false, difficulty, 'West');
                this.players.push(player);
                player = new Player();
                player.Initialize('Dixon', false, 'Pro', 'North');
                this.players.push(player);
                player = new Player();
                player.Initialize('Isabella', false, difficulty, 'East');
                this.players.push(player);
            }
            break;
        }

        undoGameStates = [];
        redoGameStates = [];
    }

    var CreateGameStateString = function() {
        if (game == null) {
            return null;
        }
        var gameStateString = "";
        gameStateString += game.skillLevel;
        gameStateString += "," + game.winningScore;
        gameStateString += "," + game.currentMoveStage;
        gameStateString += "," + game.roundNumber;
        gameStateString += "," + game.dealerIndex;
        gameStateString += "," + game.leadIndex;
        gameStateString += "," + game.turnIndex;
        gameStateString += "," + game.trumpSuit;
        gameStateString += "," + game.bidWinner;
        gameStateString += "," + game.isDoubleDeck;
        gameStateString += "\n";
        
        for (var i=0; i<game.cardsPlayedThisRound.length; i++) {
            gameStateString += game.cardsPlayedThisRound[i].id + ".";
        }
        gameStateString += "\n";

        for (var i=0; i<game.trickCards.length; i++) {
            gameStateString += game.trickCards[i].id + ".";
        }
        gameStateString += "\n";

        for (var i=0; i<4; i++) {
            var player = game.players[i];
            gameStateString += player.name + "," + player.isHuman + "," + player.skillLevel + "," + player.playerPosition + "," + player.currentRoundBid + "," + player.currentRoundMaximumBid + "," + player.currentRoundWinningBidTrump + "," + player.currentRoundBidIsPass + "," + player.currentRoundMeldScore + "," + player.currentRoundCountersTaken + "," + player.gameScore + ",";
            for (var j=0; j<player.cards.length; j++) {
                var card = player.cards[j];
                gameStateString += card.id + ":" + card.wasShown + ":" + card.wasPassed + ".";
            }
            gameStateString += ",";
            for (var j=0; j<player.isShownVoidInSuit.length; j++) {
                gameStateString += player.isShownVoidInSuit[j] + ".";
            }
            gameStateString += "\n";
        }

        for (var i=0; i<game.roundContracts.length; i++) {
            gameStateString += game.roundContracts[i][0] + "." + game.roundContracts[i][1] + ",";
        }
        gameStateString += "\n";

        for (var i=0; i<game.roundMelds.length; i++) {
            gameStateString += game.roundMelds[i][0] + "." + game.roundMelds[i][1] + ",";
        }
        gameStateString += "\n";

        for (var i=0; i<game.roundCountersTaken.length; i++) {
            gameStateString += game.roundCountersTaken[i][0] + "." + game.roundCountersTaken[i][1] + ",";
        }
        gameStateString += "\n";

        for (var i=0; i<game.roundScores.length; i++) {
            gameStateString += game.roundScores[i][0] + "." + game.roundScores[i][1] + ",";
        }
        gameStateString += "\n";

        return gameStateString;
    }

    function LoadGameState(gameState) {
        var lines = gameState.split("\n");
        var gameStateComps = lines[0].split(",");
        game.skillLevel = gameStateComps[0];
        game.winningScore = Number(gameStateComps[1]);
        game.currentMoveStage = gameStateComps[2];
        game.roundNumber = Number(gameStateComps[3]);
        game.dealerIndex = Number(gameStateComps[4]);
        game.leadIndex = Number(gameStateComps[5]);
        game.turnIndex = Number(gameStateComps[6]);
        game.trumpSuit = gameStateComps[7];
        game.bidWinner = Number(gameStateComps[8]);
        game.isDoubleDeck = gameStateComps[9]=='true';

        var alreadyCards = [];
        game.cardsPlayedThisRound = [];
        if (lines[1].length > 0) {
            var cardsThisRoundStrings = lines[1].split('.');
            for (var i=0; i<cardsThisRoundStrings.length; i++) {
                var cardID = cardsThisRoundStrings[i];
                if (cardID.length>0) {
                    var card = game.GetCardFromString(cardID);
                    game.cardsPlayedThisRound.push(card);
                    alreadyCards.push(card);
                }
            }
        }

        game.trickCards = [];
        if (lines[2].length > 0) {
            var cardsThisRoundStrings = lines[2].split('.');
            for (var i=0; i<cardsThisRoundStrings.length; i++) {
                var cardID = cardsThisRoundStrings[i];
                if (cardID.length>0) {
                    var card = game.GetCardFromString(cardID);
                    game.trickCards.push(card);
                    alreadyCards.push(card);
                }
            }
        }

        InitializeCardDeckWithPlayedCards(alreadyCards, game.isDoubleDeck);

        game.players = [];
        for (var i=0; i<4; i++) {
            var playerInfo = lines[3+i].split(",");
            var playerName = playerInfo[0];
            var player = new Player();
            var playerIsHuman = playerInfo[1]=='true';
            var playerSkill = playerInfo[2];
            var playerPosition = playerInfo[3];
            player.Initialize(playerName, playerIsHuman, playerSkill, playerPosition);
            player.currentRoundBid = Number(playerInfo[4]);
            player.currentRoundMaximumBid = Number(playerInfo[5]);
            player.currentRoundWinningBidTrump = playerInfo[6];
            player.currentRoundBidIsPass = playerInfo[7]=='true';
            player.currentRoundMeldScore = Number(playerInfo[8]);
            player.currentRoundCountersTaken = Number(playerInfo[9]);
            player.gameScore = Number(playerInfo[10]);
            
            player.cards = [];
            var playerCardsData = playerInfo[11].split(".");
            for (var j=0; j<playerCardsData.length; j++) {
                var cardData = playerCardsData[j];
                if (cardData.length>0) {
                    var cardInfo = cardData.split(":");
                    var card = game.GetCardFromString(cardInfo[0]);
                    card.wasShown = cardInfo[1]=='true';
                    card.wasPassed = cardInfo[2]=='true';
                    player.cards.push(card);
                }
            }

            player.isShownVoidInSuit = [];
            var playerVoidData = playerInfo[12].split(".");
            for (var j=0; j<4; j++) {
                player.isShownVoidInSuit[j] = playerVoidData[j]=='true';
            }

            game.players.push(player);
        }

        game.currentHighestBidder = game.players[game.bidWinner];

        game.roundContracts = [];
        var roundBidsText = lines[7];
        if (roundBidsText.length>0) {
            var roundBidsRounds = roundBidsText.split(",");
            for (var i=0; i<roundBidsRounds.length; i++) {
                var bids = roundBidsRounds[i].split(".");
                if (bids.length == 2) {
                    var bidsArray = [];
                    bidsArray.push(Number(bids[0]));
                    bidsArray.push(Number(bids[1]));
                    game.roundContracts.push(bidsArray);
                }
            }
        }
        
        game.roundMelds = [];
        var roundMeldsText = lines[8];
        if (roundMeldsText.length>0) {
            var roundMeldsRounds = roundMeldsText.split(",");
            for (var i=0; i<roundMeldsRounds.length; i++) {
                var melds = roundMeldsRounds[i].split(".");
                if (melds.length == 2) {
                    var meldsArray = [];
                    meldsArray.push(Number(melds[0]));
                    meldsArray.push(Number(melds[1]));
                    game.roundMelds.push(meldsArray);
                }
            }
        }

        game.roundCountersTaken = [];
        var roundCountersText = lines[9];
        if (roundCountersText.length>0) {
            var roundCountersRounds = roundCountersText.split(",");
            for (var i=0; i<roundCountersRounds.length; i++) {
                var counters = roundCountersRounds[i].split(".");
                if (counters.length == 2) {
                    var countersArray = [];
                    countersArray.push(Number(counters[0]));
                    countersArray.push(Number(counters[1]));
                    game.roundCountersTaken.push(countersArray);
                }
            }
        }

        game.roundScores = [];
        var roundScoresText = lines[10];
        if (roundScoresText.length>0) {
            var roundScoresRounds = roundScoresText.split(",");
            for (var i=0; i<roundScoresRounds.length; i++) {
                var roundScores = roundScoresRounds[i].split(".");
                if (roundScores.length == 2) {
                    var roundScoresArray = [];
                    roundScoresArray.push(Number(roundScores[0]));
                    roundScoresArray.push(Number(roundScores[1]));
                    game.roundScores.push(roundScoresArray);
                }
            }
        }

        scoreboard.Initialize();
        scoreboard.SlideDown();
        game.CreatePlayerInfoViews();

        if (game.currentMoveStage == 'ChoosingBids') {
            HideTrumpIndicator();
            HideSelectTrumpView();
            HidePassCardsViews();
            HideAcceptMeldView();
            HideRoundResultView();
            RepositionUndoButtons();

            for (var i=0; i<4; i++) {
                AnimatePlayerHandCardsIntoPosition(game.players[i].playerPosition, '0.5s');
            }

            // Bidding
            for (var i=1; i<4; i++) {
                var p = game.players[i];
                if (p.currentRoundBid > 0) {
                    if (game.currentHighestBidder == null || game.currentHighestBidder.currentRoundBid < p.currentRoundBid) {
                        game.currentHighestBidder = p;
                    }
                }
            }

            // Bid Views
            for (var i=1; i<4; i++) {
                var p = game.players[i];
                var bidView = document.getElementById('bid_view_' + p.playerPosition);
                bidView.style.background = '#000000';
                if (p.currentRoundMaximumBid > 0) {
                    UpdateBidViewBid(p.playerPosition, p.currentRoundBid, p.currentRoundBidIsPass);
                    UpdateBidviewBrightness(p.playerPosition, game.currentHighestBidder == p);
                    with (bidView.style) {
                        WebkitTransition = MozTransition = OTransition = msTransition = "0.2s linear";
                        visibility = 'visible';
                        opacity = 1;
                    }
                } else {
                    with (bidView.style) {
                        WebkitTransition = MozTransition = OTransition = msTransition = "0.2s linear";
                        visibility = 'hidden';
                        opacity = 0;
                    }
                }
            }

            var bidView = document.getElementById('bid_view_South');
            with (bidView.style) {
                WebkitTransition = MozTransition = OTransition = msTransition = "0.2s linear";
                visibility = 'hidden';
                opacity = 0;
            }

            var player = game.players[0];
            player.currentRoundBidIsPass = false;
            currentBiddingPlayerIndex = 0;
            game.PromptPlayerToChooseBid();

        } else if (game.currentMoveStage == 'ChoosingTrumpSuit') {
            HideTrumpIndicator();
            HideChoooseBidView();
            HidePassCardsViews();
            HideAcceptMeldView();
            RepositionUndoButtons();
            game.UpdateShowHintButton();

            for (var i=0; i<4; i++) {
                AnimatePlayerHandCardsIntoPosition(game.players[i].playerPosition, '0.5s');
            }

            game.currentHighestBidder = game.players[game.bidWinner];
            HideBidView('West');
            HideBidView('North');
            HideBidView('East');
            UpdateBidViewBid('South', game.players[0].currentRoundBid, false);
            UpdateBidviewBrightness('South', true);
            UpdateBidViewIsContract('South');
            var bidView = document.getElementById('bid_view_South');
            bidView.style.opacity = 1;
            bidView.style.visibility = 'visible';
            BumpSouthBidView();
            PromptPlayerToChooseTrumpSuit();

        } else if (game.currentMoveStage == 'ChoosingPassCards') {
            HideSelectTrumpView();
            HideChoooseBidView();
            RepositionUndoButtons();
            HideAcceptMeldView();
            IndicateTrumpSuit(null);
            HideAcceptTrickButton();
            document.getElementById('trick_score_bubble').style.visibility = 'hidden';

            for (var i=0; i<4; i++) {
                AnimatePlayerHandCardsIntoPosition(game.players[i].playerPosition, '0.5s');
            }

            if (game.currentHighestBidder.playerPositionInt == 0) {
                HideBidView('West');
                HideBidView('North');
                HideBidView('East');
                UpdateBidViewBid('South', game.players[0].currentRoundBid, false);
                UpdateBidviewBrightness('South', true);
                UpdateBidViewIsContract('South');
                var bidView = document.getElementById('bid_view_South');
                bidView.style.opacity = 1;
                bidView.style.visibility = 'visible';
                BumpSouthBidView();
                
            } else {  // North must have won the bid
                HideBidView('West');
                HideBidView('East');
                var bidView = document.getElementById('bid_view_North');
                bidView.style.opacity = 1;
                bidView.style.visibility = 'visible';
                UpdateBidViewIsContract(game.currentHighestBidder.playerPosition);
                ShowContractOnBidView(game.currentHighestBidder.playerPosition);
            }
    
            scoreboard.UpdateScores(true, false, false);
            game.PromptPlayerToChoosePassingCards();
            
        } else if (game.currentMoveStage == 'AcceptingMelds') {
            HideChoooseBidView();
            HidePassCardsViews();
            HideRoundResultView();
            HideHintButton();
            RepositionUndoButtons();
            HideAcceptTrickButton();
            document.getElementById('trick_score_bubble').style.visibility = 'hidden';
            HideSelectTrumpView();
            IndicateTrumpSuit(null);
            var playerPrompt = document.getElementById('player_play_prompt');
            with (playerPrompt.style) {
                transition = "0.1s linear";
                opacity = 0;
            }
            CountMeldsForRound(false);

        } else if (game.currentMoveStage == 'ChoosingTrickCard') {
            IndicateTrumpSuit(null);
            RepositionUndoButtons();
            HideAcceptMeldView();
            HideAcceptTrickButton();
            document.getElementById('trick_score_bubble').style.visibility = 'hidden';
            UpdatePlayerRoundScore(true);
            UpdatePlayerRoundScore(false);

            for (var i = 0; i < allCards.length; i++) {
                var cardView = allCards[i].cardView;
                cardView.needsToBeHidden = true;
            }

            for (var i=0; i<4; i++) {
                AnimatePlayerHandCardsIntoPosition(game.players[i].playerPosition, '0.5s');
            }

            var ctr = 0;
            for (var i=game.trickCards.length-1; i>=0; i--) {
                var player = game.players[3-ctr];
                var cardView = game.trickCards[i].cardView;
                cardView.needsToBeHidden = false;
                cardView.positionFunction = "GetTrickDiscardLocation('" + player.playerPosition + "')";
                var loc = eval(cardView.positionFunction);
                flipUpCard(cardView, false);
                with (cardView.style) {
                    transition = '0.3s ease-out';
                    transitionDelay = "0s";
                    left = loc[0] + 'px';
                    top = loc[1] + 'px';
                    transform = 'none';
                    visibility = 'visible';
                    opacity = 1;
                    zIndex = 0;
                }

                ctr++;
            }

            for (var i = 0; i < allCards.length; i++) {
                var cardView = allCards[i].cardView;
                if (cardView.needsToBeHidden) {
                    with (cardView.style) {
                        transition = '0.01s';
                        transitionDelay = 'none';
                        visibility = 'hidden';
                        opacity = 0;
                    }
                }
            }

            HideRoundResultView();

            game.PromptPlayerToPlayCard();

        } else if (game.currentMoveStage == 'AcceptingRoundScores') {
            HideChoooseBidView();
            HideAcceptMeldView();
            HideAcceptTrickButton();
            HideBidView('West');
            HideBidView('North');
            HideBidView('East');
            HideBidView('South');
            var playerPrompt = document.getElementById('player_play_prompt');
            with (playerPrompt.style) {
                transition = "0.1s linear";
                opacity = 0;
            }

            for (var i = 0; i < allCards.length; i++) {
                var cardView = allCards[i].cardView;
                with (cardView.style) {
                    transition = '0.01s';
                    transitionDelay = 'none';
                    visibility = 'hidden';
                    opacity = 0;
                }
            }
        
            game.ShowRoundResultWithDelay(0);
        }
    }

    this.StartAGame = function (difficulty) {

        this.InitializeGame(difficulty);        

        // Clean up all cards and messages
        for (var i = 0; i < allCards.length; i++) {
            var el = allCards[i].cardView;
            flipDownCard(el, false);
            UnshadeCard(el);
            with (el.style) {
                transition = "none";
                transform = "none";
                visibility = "hidden";
            }
        }
        HideAllMessages();
        HideTrumpIndicator();
        HideSelectTrumpView();

        scoreboard.Initialize();
        scoreboard.SlideDown();

        this.CreatePlayerInfoViews();
        
        this.AnimateDealCardsForRound();
    }

    this.CreatePlayerInfoViews = function() {
        for (var i=0; i<4; i++) {
            var playerName = document.getElementById('player_name_' + this.players[i].playerPosition);
            playerName.positionFunction = "GetPlayerNamePosition('" + this.players[i].playerPosition + "')";
            playerName.style.transition = "none";
            var position = eval(playerName.positionFunction);
            playerName.style.left = position[0] + 'px';
            playerName.style.top = position[1] + 'px';
            playerName.innerText = this.players[i].name;

            if (i!=0) {
                var playerThinking = document.getElementById('player_thinking_' + this.players[i].playerPosition);
                playerThinking.positionFunction = "GetPlayerBidPosition('" + this.players[i].playerPosition + "')";
                position = eval(playerThinking.positionFunction);
                playerThinking.style.left = position[0] + 'px';
                playerThinking.style.top = position[1] + 'px';
            }

            var bidView = document.getElementById('bid_view_' + this.players[i].playerPosition);
            bidView.positionFunction = "GetPlayerBidPosition('" + this.players[i].playerPosition + "')";
            position = eval(bidView.positionFunction);
            bidView.style.left = position[0] + 'px';
            bidView.style.top = position[1] + 'px';

            var playerScore = document.getElementById('player_score_' + this.players[i].playerPosition);
            playerScore.positionFunction = "GetPlayerScorePosition('" + this.players[i].playerPosition + "')";
            position = eval(playerScore.positionFunction);
            playerScore.style.left = position[0] + 'px';
            playerScore.style.top = position[1] + 'px';
            playerScore.innerText = "";
        }
        setTimeout(function () {
            for (var i=0; i<4; i++) {
                var playerName = document.getElementById('player_name_' + game.players[i].playerPosition);
                playerName.style.transition = "1s linear";
                playerName.style.visibility = "visible";
                playerName.style.opacity = 1;
                var playerScore = document.getElementById('player_score_' + game.players[i].playerPosition);
                playerScore.style.transition = "1s linear";
                playerScore.style.visibility = "visible";
                playerScore.style.opacity = 1;
            }
        }, 1000);
    }

    this.ResetPlayerRoundScores = function() {
        for (var i=0; i<4; i++) {
            var playerScore = document.getElementById('player_score_' + this.players[i].playerPosition);
            playerScore.positionFunction = "GetPlayerScorePosition('" + this.players[i].playerPosition + "')";
            position = eval(playerScore.positionFunction);
            playerScore.style.left = position[0] + 'px';
            playerScore.style.top = position[1] + 'px';
            playerScore.innerText = "";
        
            if (i===0) {
                var playerName = document.getElementById('player_name_' + this.players[i].playerPosition);
                playerName.style.transition = "0.2s linear";
                var pos = eval(playerName.positionFunction);
                playerName.style.left = pos[0] + 'px';
                playerName.style.top = pos[1] + 'px';
            }
        }
    }

    var playerWestNameTopForAcceptingMelds = 0;
    var playerEastNameTopForAcceptingMelds = 0;
    var playerSouthNameTopForAcceptingMelds = 0;

    function GetPlayerNamePosition(playerPosition) {
        switch (playerPosition) {
            case 'South':
            {
                if (game.currentMoveStage == 'AcceptingMelds') {
                    return [window.innerWidth*0.5-115*0.5 + 7, playerSouthNameTopForAcceptingMelds];
                } else {
                    var leftPos = GetHandCardLocation(playerPosition, 0, 14);
                    return [(window.innerWidth*0.5 + leftPos[0])*0.5 - 115*0.5, leftPos[1]-50];
                }
            }
            case 'West':
            {
                if (game.currentMoveStage == 'AcceptingMelds') {
                    return [50, playerWestNameTopForAcceptingMelds];
                } else {
                    return [50,250];
                }
            }
            case 'North':
                return [window.innerWidth*0.5 + 180,30];
            default:
            {
                if (game.currentMoveStage == 'AcceptingMelds') {
                    return [window.innerWidth-170, playerEastNameTopForAcceptingMelds];
                } else {
                    return [window.innerWidth-170,250];
                }
            }
        }
    }

    function GetPlayerBidPosition(playerPosition) {
        switch (playerPosition) {
            case 'South':
            {
                var pos = GetPlayerNamePosition(playerPosition);
                return [pos[0] + 7, pos[1] - 80];
            }
            case 'West':
                return [40+12,280];
            case 'North':
                return [window.innerWidth*0.5 + 180+12,60];
            default:
                return [window.innerWidth-140+12,280];
        }
    }

    function GetPlayerScorePosition(playerPosition) {
        var pos = GetPlayerNamePosition(playerPosition);
        switch (playerPosition) {
            case 'South':
                return [pos[0] - 50, pos[1] - 45];
            case 'West':
                return [pos[0], pos[1] + 30];
            case 'North':
                return [pos[0] - 50, pos[1] + 30];
            default:
                return [pos[0] - 100, pos[1] + 30];
        }
    }

    function GetTrumpSuitIndicatorPosition() {
        return [window.innerWidth-100, 40];
    }

    function GetTrumpSuitSelectorPosition() {
        return [window.innerWidth*0.5, window.innerHeight*0.3];
    }

    function InitializeCardDeck(isDoubleDeck) {
        cards=[];
        var j, x, i;
        for (i=0; i<allCards.length; i++) {
            var card = allCards[i];
            if (isDoubleDeck && card.rank != 9) {
                cards.push(card);
            } else if (!isDoubleDeck && card.deckID<2) {
                cards.push(card);
            }
        }
        for (i = cards.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = cards[i];
            cards[i] = cards[j];
            cards[j] = x;
        }
        deckTopIndex = cards.length-1;
    }

    function InitializeCardDeckWithPlayedCards(alreadyPlayedCards, isDoubleDeck) {
        // Create a shuffled deck of cards without already played cards
        cards=[];
        var j, x, i;
        for (i=0; i<allCards.length; i++) {
            var card = allCards[i];
            if (alreadyPlayedCards.includes(card)) {
                continue;
            }
            if (isDoubleDeck && card.rank != 9) {
                cards.push(card);
            } else if (!isDoubleDeck && card.deckID<2) {
                cards.push(card);
            }
        }
        for (i = cards.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = cards[i];
            cards[i] = cards[j];
            cards[j] = x;
        }
        deckTopIndex = cards.length-1;
    }

    this.UpdateScoreMultiplier = function() {
        var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');

        scoreboard.UpdateForScoreMultiplier();

        if (game != null && game.players.length!=0) {
            for (var i=0 ; i<4; i++) {
                UpdateBidViewBid(game.players[i].playerPosition, game.players[i].currentRoundBid, game.players[i].currentRoundBidIsPass);
                UpdateMeldViewValue(game.players[i].playerPosition, game.players[i].currentRoundMeldScore, isUsingScoreMultiplier);
            }

            var bidButton = document.getElementById('submit_bid_button');
            var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
            if (isUsingScoreMultiplier) {
                bidButton.innerText = "Bid: " + currentBidButtonValue*10;
            } else {
                bidButton.innerText = "Bid: " + currentBidButtonValue;
            }

            if (game != null && game.currentMoveStage == 'ChoosingTrickCard') {
                UpdatePlayerRoundScore(true);
                UpdatePlayerRoundScore(false);
            }

            if (game != null && game.currentMoveStage == 'AcceptingRoundScores') {
                UpdateRoundScoresViewText();
            }
        }
    }

    this.UpdateTrickTakingDisplay = function() {
        if (game != null && game.currentMoveStage == 'ChoosingTrickCard') {
            UpdatePlayerRoundScore(true);
            UpdatePlayerRoundScore(false);
        }
    }

    function UpdateMeldViewValue(playerPosition, meldScore, isUsingScoreMultiplier) {
        var textView = document.getElementById('meld_view_value_' + playerPosition);
        if (isUsingScoreMultiplier) {
            textView.innerText = meldScore*10;
        } else {
            textView.innerText = meldScore;
        }
    }

    this.UpdateSortLeftToRight = function() {
        AnimatePlayerHandCardsIntoPosition('South', "0.3s");
    }

    function AnimatePlayerHandCardsIntoPosition(playerPosition, duration) {
        var player;
        var flipUp = false;
        switch (playerPosition) {
            case 'South':
                player = game.players[0];
                flipUp = true;
                if (GetSetting('setting_sort_left_to_right')) {
                    game.players[0].cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return b.value - a.value;
                        }
                    });
                } else {
                    game.players[0].cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return a.value - b.value;
                        }
                    });
                }
                break;
            case 'West':
                player = game.players[1];
                break;
            case 'North':
                player = game.players[2];
                break;
            default:
                player = game.players[3];
                break;
        }
        
        for (var i=0; i<player.cards.length; i++) {
            var cardView = player.cards[i].cardView;
            cardView.needsToBeHidden = false;
            if (flipUp) {
                flipUpCard(cardView, true);
            } else {
                flipDownCard(cardView, true);
            }
            cardView.positionIndex = i;
            cardView.positionFunction = "GetHandCardLocation('" + playerPosition + "', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
            with (cardView.style) {
                var aposition = eval(cardView.positionFunction);
                transition =  duration + " ease-out";
                transitionDelay = '0ms';
                left = aposition[0] + "px";
                top = aposition[1] + "px";
                transform = 'rotate(' + aposition[2] + 'deg)';
                visibility = 'visible';
                opacity = 1;
            }
        }
    }

    this.AnimateDealCardsForRound = function() {
        this.roundNumber = this.roundNumber + 1;
        this.currentHighestBidder = null;
        this.trickCards = [];
        for (var i=0; i<this.players.length; i++) {
            var player = this.players[i];
            player.cards = [];
            player.currentRoundMeldScore = 0;
            player.currentRoundCountersTaken = 0;
            player.currentRoundBid = -1;
            player.currentRoundMaximumBid = -1;
            player.currentRoundBidIsPass = false;
            player.isShownVoidInSuit = [false,false,false,false];
        }

        this.ResetPlayerRoundScores();
        var bidView = document.getElementById('bid_view_South');
        with (bidView.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "none";
            background = '#000000';
        }
        bidView = document.getElementById('bid_view_West');
        with (bidView.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "none";
            background = '#000000';
        }
        bidView = document.getElementById('bid_view_North');
        with (bidView.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "none";
            background = '#000000';
        }
        bidView = document.getElementById('bid_view_East');
        with (bidView.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "none";
            background = '#000000';
        }

        // Deal cards for round
        this.cardsPlayedThisRound = [];
        var isDoubleDeck = GetSetting('setting_deck_count')==1;
        InitializeCardDeck(isDoubleDeck);
        var cardsPerHand = isDoubleDeck ? 20 : 12;
        for (var i=0; i<cardsPerHand; i++) {
            for (var j=0; j<4; j++) {
                this.players[j].cards.push(cards[deckTopIndex]);
                deckTopIndex = deckTopIndex-1;
            }
        }

        // Sort the players hand
        if (GetSetting('setting_sort_left_to_right')) {
            this.players[0].cards.sort(function(a,b) {
                if (a.suit != b.suit) {
                    return a.suitInt - b.suitInt;
                } else {
                    return b.value - a.value;
                }
            });
        } else {
            this.players[0].cards.sort(function(a,b) {
                if (a.suit != b.suit) {
                    return a.suitInt - b.suitInt;
                } else {
                    return a.value - b.value;
                }
            });
        }

        // Animate the cards dealt to each player
        // WEST
        var player = this.players[1];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('West', i, player.cards.length);
            var startLeft = -300;
            var endLeft = cardLocation[0];
            var startTop = cardLocation[1];
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
                opacity = 1;
            }
            cardView.positionFunction = "GetHandCardLocation('West', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[1];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
            }
        }, 50);

        // North
        var player = this.players[2];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('North', i, player.cards.length);
            var startLeft = cardLocation[0];
            var endLeft = cardLocation[0];
            var startTop = -300;
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
                opacity = 1;
            }
            cardView.positionFunction = "GetHandCardLocation('North', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[2];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
            }
        }, 50);

        // East
        var player = this.players[3];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('East', i, player.cards.length);
            var startLeft = window.innerWidth + 300;
            var endLeft = cardLocation[0];
            var startTop = cardLocation[1];
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = false;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
                opacity = 1;
            }
            cardView.positionFunction = "GetHandCardLocation('East', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[3];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
            }
        }, 50);

        // South
        var player = this.players[0];
        for (var i=0; i<player.cards.length; i++) {
            var cardLocation = GetHandCardLocation('South', i, player.cards.length);
            var startLeft = window.innerWidth*0.5;
            var endLeft = cardLocation[0];
            var startTop = window.innerHeight + 100;
            var endtop = cardLocation[1];
            var cardView = player.cards[i].cardView;
            flipDownCard(cardView, false);
            lowerCard(cardView);
            cardView.positionIndex = i;
            cardView.isClickable = true;
            with (cardView.style) {
                transition = "none";
                animationDelay = "";
                left = startLeft + "px";
                top = startTop + "px";
                zIndex = i + 1;
                visibility = "visible";
                opacity = 1;
            }
            cardView.positionFunction = "GetHandCardLocation('South', " + i + ", " + player.cards.length + ")";
            cardView.style.zIndex = i + 100;
        }
        setTimeout(function () {
            var player = game.players[0];
            for (var i=0; i<player.cards.length; i++) {
                var cardView = player.cards[i].cardView;
                var position = eval(cardView.positionFunction);
                cardView.style.transition =  "0.3s ease-out";
                cardView.style.transitionDelay = i * 80 + 'ms';
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + 'deg)';
                setTimeout(flipUpCard, i * 80, cardView, true);
            }
            game.currentMoveStage = "ChoosingBids";
        }, 50);
        
        setTimeout(function() {
            currentBiddingPlayerIndex = (game.dealerIndex + 1)%4;
            game.leadIndex = currentBiddingPlayerIndex;
            var player = game.players[currentBiddingPlayerIndex];
            player.ChooseBid(GetSetting('setting_bidding_speed'));
            if (player.isHuman) {
                var minimumBid = GetSetting('setting_minimum_bid');
                if (player.currentRoundBid != minimumBid) {
                    RememberLatestGameState();
                }
            }
        
        }, 500);
    }

    this.IndicatePlayerIsThinking = function(position) {
        var playerThinking = document.getElementById('player_thinking_' + position);
        playerThinking.style.opacity = 0;
        with (playerThinking.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "0.5s linear";
            transitionDelay = '0.3s';
            opacity = 1;
            visibility = "visible";
        }
    }

    var currentBidButtonValue = 0;

    this.PromptPlayerToChooseBid = function() {

        if (game.players[0].currentRoundBidIsPass) {
            OnPlayerFinishedChoosingBid(game.players[0]);
            return;
        }

        if (this.skillLevel === 'Easy' || GetSetting('setting_hints')) {
            ShowHintButton(0);
        }

        var bidButton = document.getElementById('submit_bid_button');
        var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
        currentBidButtonValue = game.currentHighestBidder.currentRoundBid + 1;
        if (isUsingScoreMultiplier) {
            bidButton.innerText = "Bid: " + currentBidButtonValue*10;
        } else {
            bidButton.innerText = "Bid: " + currentBidButtonValue;
        }
        var el = document.getElementById('choose_bid_view');
        with(el.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "0.3s linear";
            opacity = 1;
            visibility = "visible";
            pointerEvents = "auto";
        }
    }

    this.OnDecrementBidButtonPressed = function() {

        if (currentBidButtonValue > game.currentHighestBidder.currentRoundBid + 1) {
            IndicateDecrementBidView();
            currentBidButtonValue--;
            var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
            var bidButton = document.getElementById('submit_bid_button');
            if (isUsingScoreMultiplier) {
                bidButton.innerText = "Bid: " + currentBidButtonValue*10;
            } else {
                bidButton.innerText = "Bid: " + currentBidButtonValue;
            }
        } else {
            IndicateCantDecrementBidView();
        }
    }

    function IndicateDecrementBidView() {
        var el = document.getElementById('submit_bid_button');
        el.addEventListener("animationend", function() {
            el.classList.remove('decrementSubmitBidView');
        });
        el.classList.add('decrementSubmitBidView');
    }

    function IndicateCantDecrementBidView() {
        var el = document.getElementById('submit_bid_button');
        el.addEventListener("animationend", function() {
            el.classList.remove('shakeSubmitBidView');
        });
        el.classList.add('shakeSubmitBidView');
    }

    this.OnIncrementBidButtonPressed = function() {
        IndicateIncrementBidView();
        currentBidButtonValue++;
        var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
        var bidButton = document.getElementById('submit_bid_button');
        if (isUsingScoreMultiplier) {
            bidButton.innerText = "Bid: " + currentBidButtonValue*10;
        } else {
            bidButton.innerText = "Bid: " + currentBidButtonValue;
        }
    }

    function IndicateIncrementBidView() {
        var el = document.getElementById('submit_bid_button');
        el.addEventListener("animationend", function() {
            el.classList.remove('incrementSubmitBidView');
        });
        el.classList.add('incrementSubmitBidView');
    }

    this.OnPassBidButtonPressed = function() {
        var player = game.players[0];
        player.currentRoundBidIsPass = true;
        this.OnPlayerFinishedChoosingBid(player);
    }

    this.OnSubmitBidButtonPressed = function() {
        var player = game.players[0];
        player.currentRoundBid = currentBidButtonValue;
        game.currentHighestBidder = player;
        this.OnPlayerFinishedChoosingBid(player);
    }

    function HideChoooseBidView() {
        var el = document.getElementById('choose_bid_view');
        with(el.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "0.1s linear";
            opacity = 0;
            pointerEvents = "none";
        }
    }

    var currentBiddingPlayerIndex = 0;
    
    this.OnPlayerFinishedChoosingBid = function(player) {
        if (player.isHuman) {
            HideChoooseBidView();
            HideHintButton();
            HideUndoButton();
            HideRedoButton();
        } else {
            var bidView = document.getElementById('bid_view_' + player.playerPosition);
            UpdateBidviewBrightness('West', game.currentHighestBidder.playerPositionInt==1);
            UpdateBidviewBrightness('North', game.currentHighestBidder.playerPositionInt==2);
            UpdateBidviewBrightness('East', game.currentHighestBidder.playerPositionInt==3);

            UpdateBidViewBid(player.playerPosition, player.currentRoundBid, player.currentRoundBidIsPass);
            with (bidView.style) {
                WebkitTransition = MozTransition = OTransition = msTransition = "0.2s linear";
                visibility = 'visible';
                opacity = 1;
            }
            if (!player.currentRoundBidIsPass) {
                BumpBidView(player.playerPosition);
            }
        }

        var playersPassedCount = 0;
        for (var i=0; i<4; i++) {
            if (game.players[i].currentRoundBidIsPass) {
                playersPassedCount++;
            }
        }
        
        if (playersPassedCount >= 3) {
            game.trumpSuit = game.currentHighestBidder.currentRoundWinningBidTrump;
            game.bidWinner = game.currentHighestBidder.playerPositionInt;
            OnContractWon();
        } else {
            currentBiddingPlayerIndex++;
            var player = game.players[currentBiddingPlayerIndex%4];
            player.ChooseBid(GetSetting('setting_bidding_speed'));
            if (player.isHuman) {
                var minimumBid = GetSetting('setting_minimum_bid');
                if (player.currentRoundBid != minimumBid) {
                    RememberLatestGameState();
                }
            }
        }
    }

    function UpdateBidviewBrightness(playerPosition, isBright) {
        var title = document.getElementById('bid_view_title_' + playerPosition);
        var valueLabel = document.getElementById('bid_view_value_' + playerPosition);
        if (isBright) {
            title.style.color = "#FFFFFF";
            valueLabel.style.color = "#FFFFFF";
        } else {
            title.style.color = "#666666";
            valueLabel.style.color = "#666666";
        }
    }

    function UpdateBidViewBid(playerPosition, bid, isPassed) {
        var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
        if (playerPosition != 'South') {
            var thinkingView = document.getElementById('player_thinking_' + playerPosition);
            thinkingView.style.visibility = 'hidden';
        }
        var bidView = document.getElementById('bid_view_' + playerPosition);
        var bidViewTitle = document.getElementById('bid_view_title_' + playerPosition);
        var bidViewValue = document.getElementById('bid_view_value_' + playerPosition);
        if (isPassed) {
            bidViewTitle.innerText = "";
            bidViewValue.innerText = "Pass";
            bidViewValue.style.fontSize = '20pt';
        } else if (bid==-1) {
            bidViewTitle.innerText = "";
            bidViewValue.innerText = "";
        } else {
            bidViewTitle.innerText = "Bid:";
            bidViewValue.style.fontSize = '26pt'
            bidViewValue.innerText = isUsingScoreMultiplier ? 10*bid : bid;
        }
    }

    function UpdateBidViewIsContract(playerPosition) {
        var bidView = document.getElementById('bid_view_' + playerPosition);
        bidView.style.background = (playerPosition=='South' || playerPosition=='North') ? '#0000BB' : '#FF0000';
    }

    function HideBidView(playerPosition) {
        if (playerPosition != 'South') {
            var thinkingView = document.getElementById('player_thinking_' + playerPosition);
            thinkingView.style.visibility = 'hidden';
        }
        var bidView = document.getElementById('bid_view_' + playerPosition);
        with (bidView.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = "0.3s linear";
            opacity = 0;
        }
    }

    function BumpBidView(playerPosition) {
        var raiseContainer = document.getElementById('bid_view_' + playerPosition);
        raiseContainer.addEventListener("animationend", function() {
            raiseContainer.classList.remove('bumpBidView');
        });
        raiseContainer.classList.add('bumpBidView');
    }

    function BumpSouthBidView() {
        var raiseContainer = document.getElementById('bid_view_South');
        raiseContainer.addEventListener("animationend", function() {
            raiseContainer.classList.remove('bumpSouthBidView');
        });
        raiseContainer.classList.add('bumpSouthBidView');
    }

    function ShowContractOnBidView(position) {
        var raiseContainer = document.getElementById('bid_view_' + position);
        raiseContainer.addEventListener("animationend", function() {
            raiseContainer.classList.remove('showContractBidView' + position);
        });
        raiseContainer.classList.add('showContractBidView' + position);
    }

    function OnContractWon() {
        if (game.currentHighestBidder.playerPositionInt == 0) {
            HideBidView('West');
            HideBidView('North');
            HideBidView('East');
            UpdateBidViewBid('South', game.players[0].currentRoundBid, false);
            UpdateBidviewBrightness('South', true);
            UpdateBidViewIsContract('South');
            var bidView = document.getElementById('bid_view_South');
            bidView.style.opacity = 1;
            bidView.style.visibility = 'visible';
            BumpSouthBidView();

            game.currentMoveStage = 'ChoosingTrumpSuit';
            RememberLatestGameState();
            PromptPlayerToChooseTrumpSuit();

        } else {
            switch (game.currentHighestBidder.playerPositionInt) {
                case 1:
                    HideBidView('North');
                    HideBidView('East');
                    break;
                case 2:
                    HideBidView('West');
                    HideBidView('East');
                    break;
                case 3:
                    HideBidView('West');
                    HideBidView('North');
                    break;
            }
            UpdateBidViewIsContract(game.currentHighestBidder.playerPosition);
            ShowContractOnBidView(game.currentHighestBidder.playerPosition);
            IndicateTrumpSuit(game.currentHighestBidder.playerPosition);
            
            var passingCardsCount = Number(GetSetting('setting_passing_cards_count'));
            if (passingCardsCount > 0) {
                if (game.currentHighestBidder.playerPosition == 'North') {
                    setTimeout(function(){
                        game.currentMoveStage = 'ChoosingPassCards';
                        RememberLatestGameState();
                        game.players[0].ChoosePassingCards(passingCardsCount);    
                    }, 2000);
                } else if (game.currentHighestBidder.playerPosition == 'West') {
                    game.players[3].ChoosePassingCards(passingCardsCount);
                } else {
                    game.players[1].ChoosePassingCards(passingCardsCount);
                }
            } else {
                setTimeout(function() {
                    game.currentMoveStage = 'AcceptingMelds';
                    RememberLatestGameState();
                    CountMeldsForRound(true);
                }, 2000);
            }
        }

        scoreboard.UpdateScores(true, false, false);
    }

    var trumpIndicatorIsVisible = false;

    function IndicateTrumpSuit(playerPosition) {
        switch (game.trumpSuit) {
            case 'S':
                document.getElementById('trump_suit_image').style.backgroundImage = "url(images/score_spade.png)";
                break;
            case 'H':
                document.getElementById('trump_suit_image').style.backgroundImage = "url(images/score_heart.png)";
                break;
            case 'C':
                document.getElementById('trump_suit_image').style.backgroundImage = "url(images/score_club.png)";
                break;
            case 'D':
                document.getElementById('trump_suit_image').style.backgroundImage = "url(images/score_diamond.png)";
                break;
        }

        var trumpIndicator = document.getElementById('trump_suit_indicator');
        trumpIndicator.positionFunction = "GetTrumpSuitIndicatorPosition()";
        var endPosition = eval(trumpIndicator.positionFunction);

        if (playerPosition == null) {
            if (!trumpIndicatorIsVisible) {
                with (trumpIndicator.style) {
                    WebkitTransition = MozTransition = OTransition = msTransition = transition = "none";
                    transform = 'translate(-50%,-200%)';
                    visibility = 'visible';
                    opacity = 1;
                    left = endPosition[0] + 'px';
                    top = endPosition[1] + 'px';
                }
                setTimeout(function() {
                    with (trumpIndicator.style) {
                        WebkitTransition = MozTransition = OTransition = msTransition = transition = "0.3s ease-in-out";
                        transform = 'translate(-50%,-50%)';
                    }
                }, 100);
            }
        } else {
            var startPosition = [0,0];
            var pauseTop = window.innerHeight*0.25;
            switch (playerPosition) {
                case 'West':
                    startPosition[0] = -45;
                    startPosition[1] = window.innerHeight*0.5;
                    break;
                case 'North':
                    startPosition[0] = window.innerWidth*0.5;
                    startPosition[1] = -80;
                    pauseTop = 100;
                    break;
                default:
                    startPosition[0] = window.innerWidth + 45;
                    startPosition[1] = window.innerHeight*0.5;
                    break;
            }
            with (trumpIndicator.style) {
                WebkitTransition = MozTransition = OTransition = msTransition = transition = "none";
                left = startPosition[0] + 'px';
                top = startPosition[1] + 'px';
                visibility = 'visible';
                opacity = 1;
            }

            setTimeout(function() {
                var middlePosition = [window.innerWidth*0.5, pauseTop];
                with (trumpIndicator.style) {
                    WebkitTransition = MozTransition = OTransition = msTransition = transition = "1.0s ease-out";
                    left = middlePosition[0] + 'px';
                    top = middlePosition[1] + 'px';
                    transform = 'translate(-50%,-50%) scale(1.5)';
                }
                setTimeout(function() {
                    with (trumpIndicator.style) {
                        WebkitTransition = MozTransition = OTransition = msTransition = transition = "1s ease-in-out";
                        left = endPosition[0] + 'px';
                        top = endPosition[1] + 'px';
                        transform = 'translate(-50%,-50%) scale(1)';
                    }
                }, 3000);
            }, 100);
        }

        trumpIndicatorIsVisible = true;
    }

    function HideTrumpIndicator() {
        var trumpIndicator = document.getElementById('trump_suit_indicator');
        with (trumpIndicator.style) {
            WebkitTransition = MozTransition = OTransition = msTransition = transition = "0.3s ease-in-out";
            transform = 'translate(-50%,-200%)';
        }
        trumpIndicatorIsVisible = false;
    }

    var selectTrumpViewIsVisible = false;

    PromptPlayerToChooseTrumpSuit = function() {
        if (selectTrumpViewIsVisible) {
            return;
        }

        var selectTrumpView = document.getElementById('choose_trump_suit_view');
        selectTrumpView.positionFunction = "GetTrumpSuitSelectorPosition()";
        var position = eval(selectTrumpView.positionFunction);
        selectTrumpView.style.transition = 'none';
        selectTrumpView.style.left = position[0] + 'px';
        selectTrumpView.style.top = window.innerHeight - 130 + 'px';
        selectTrumpView.style.transform = "translate(-50%,-50%) scale(0.01) ";
        selectTrumpView.style.opacity = 1;
        selectTrumpView.style.visibility = 'visible';
        setTimeout(function() {
            with (selectTrumpView.style) {
                transition = '0.4s ease-out';
                transform = 'translate(-50%,-50%) scale(1) ';
                top = window.innerHeight*0.3 + 'px';
            }
        } ,500);

        selectTrumpViewIsVisible = true;

        if (this.skillLevel === 'Easy' || GetSetting('setting_hints')) {
            ShowHintButton(0);
        }

        scoreboard.UpdateScores(true, false, false);
    }

    HideSelectTrumpView = function() {
        if (!selectTrumpViewIsVisible) {
            return;
        }

        var selectTrumpView = document.getElementById('choose_trump_suit_view');
        with (selectTrumpView.style) {
            transition = '0.3s ease-in';
            transform = 'translate(-50%,-50%) scale(0.1) ';
            top = window.innerHeight + 100 + 'px';
            opacity = 0;
        }

        selectTrumpViewIsVisible = false;
    }

    this.OnTrumpSuitButtonPressed = function(suit) {
        game.trumpSuit = suit;
        HideHintButton();
        HideRedoButton();
        HideUndoButton();

        HideSelectTrumpView();
        IndicateTrumpSuit(null);

        var passingCardsCount = Number(GetSetting('setting_passing_cards_count'));
        if (passingCardsCount > 0) {
            game.players[2].ChoosePassingCards(passingCardsCount);
        } else {
            setTimeout(function() {
                game.currentMoveStage = 'AcceptingMelds';
                RememberLatestGameState();
                CountMeldsForRound(true);
            }, 1000);
        }
    }

    this.PromptPlayerToChoosePassingCards = function() {
      
        var selectPassingCardsMessage = document.getElementById('select_passing_cards_message');
        var passingCardsCount = Number(GetSetting('setting_passing_cards_count'));
        selectPassingCardsMessage.innerText = passingCardsCount>1 ? "Select " + passingCardsCount + " cards to pass:" : "Select 1 card to pass:";
        
        currentPassingCardViews = [];
        for (var i=0; i<passingCardsCount; i++) {
            currentPassingCardViews.push(null);
        }

        selectPassingCardsMessage.positionFunction = "GetPassingCardsMessageLocation()";
        var loc = eval(selectPassingCardsMessage.positionFunction);
        selectPassingCardsMessage.style.transition = "none";
        selectPassingCardsMessage.style.left = loc[0] + "px";
        selectPassingCardsMessage.style.top = loc[1] + "px";
        with (selectPassingCardsMessage.style) {
            visibility = "visible";
            transition = "0.5s linear";
            transitionDelay = "0s";
            opacity = 1;
        }

        for (var i=0; i<passingCardsCount; i++) {
            var selectPassingCardsRegion = document.getElementById('select_passing_cards_region_' + i);
            selectPassingCardsRegion.positionFunction = "GetPassingCardsLocation(" + i + ")";
            var loc = eval(selectPassingCardsRegion.positionFunction);
            selectPassingCardsRegion.style.transition = "none";
            selectPassingCardsRegion.style.left = loc[0] + "px";
            selectPassingCardsRegion.style.top = loc[1] + "px";
            with (selectPassingCardsRegion.style) {
                visibility = "visible";
                transition = "0.5s linear";
                transitionDelay = "0s";
                opacity = 1;
            }
        }

        for (var i=0; i<4; i++) {
            var player = game.players[i];
            for (var j=0; j<player.cards.length; j++) {
                player.cards[j].cardView.isClickable = i==0;
            }
        }
        this.currentMoveStage = "ChoosingPassCards";
        
        if (this.skillLevel === 'Easy' || GetSetting('setting_hints')) {
          ShowHintButton(0);
        }

        scoreboard.UpdateScores(true, false, false);
    }

    function GetPassingCardsMessageLocation() {
        return [0, window.innerHeight*0.5 - 220];
    }

    function GetPassingCardsLocation(index)
    {
        var spotWidth = 110;
        var spotPadding = 15;
        var totalWidth = spotWidth*currentPassingCardViews.length + spotPadding*(currentPassingCardViews.length-1);
        var left = (window.innerWidth - totalWidth)*0.5 + (spotWidth+spotPadding)*index;
        
        return [left, window.innerHeight*0.5 - 180];
    }

    this.passingCardsConfirmed= function() {
        HideHintButton();
        HideUndoButton();
        HideRedoButton();
        HidePassCardsViews();

        game.PlayerChosePassingCards(game.players[0]);
    }

    function HidePassCardsViews() {
        var viewsToHide = [
            'confirm_passing_cards_button',
            'select_passing_cards_message',
            'select_passing_cards_region_0',
            'select_passing_cards_region_1',
            'select_passing_cards_region_2',
            'select_passing_cards_region_3'
            ];
        for (var i = 0; i < viewsToHide.length; i++) {
            var view = document.getElementById(viewsToHide[i]);
            view.style.transition = "0.2s linear";
            view.style.opacity = 0;
            view.style.visibility = 'hidden';
        }
    }

    this.PlayerChosePassingCards = function(player) {
        var receivingPlayer = game.players[(player.playerPositionInt+2)%4];
        receivingPlayer.receivedCards = [];
        for (var i=0; i<player.passingCards.length; i++) {
            player.passingCards[i].wasPassed = true;
            receivingPlayer.receivedCards.push(player.passingCards[i]);
            receivingPlayer.cards.push(player.passingCards[i]);
        }
        
        var fullHandCardsCount = game.isDoubleDeck?20:12;
        if (player.cards.length < fullHandCardsCount) {
            var delay = 1000;
            if (receivingPlayer.playerPosition == 'South') {
                delay = 300;
            } else if (receivingPlayer.playerPosition == 'North') {
                delay = 0;
            }
            setTimeout(function() {
                AnimatePlayerHandCardsIntoPosition(player.playerPosition, '1s');
                AnimatePlayerHandCardsIntoPosition(receivingPlayer.playerPosition, '1s');
                
                if (receivingPlayer.playerPosition == 'South') {
                    setTimeout(function() {
                        var passingCardsCount = Number(GetSetting('setting_passing_cards_count'));
                        if (passingCardsCount > 0) {
                            if (receivingPlayer.isHuman) {
                                game.currentMoveStage = 'ChoosingPassCards';
                                RememberLatestGameState();
                            }
                            receivingPlayer.ChoosePassingCards(passingCardsCount);
                        } else {
                            setTimeout(function(){
                                game.currentMoveStage = 'AcceptingMelds';
                                RememberLatestGameState();
                                CountMeldsForRound(true);
                            }, 2000);
                        }
                    },1400);
                } else {
                    var passingCardsCount = Number(GetSetting('setting_passing_cards_count'));
                    if (passingCardsCount > 0) {
                        if (receivingPlayer.isHuman) {
                            game.currentMoveStage = 'ChoosingPassCards';
                            RememberLatestGameState();
                        }
                        receivingPlayer.ChoosePassingCards(passingCardsCount);
                    } else {
                        setTimeout(function() {
                            game.currentMoveStage = 'AcceptingMelds';
                            RememberLatestGameState();
                            CountMeldsForRound(true);
                        }, 1400);
                    }
                }

            }, delay);

        } else {
            var delay = 1300;
            if (receivingPlayer.playerPosition == 'North') {
                delay = 0;
            }

            if (receivingPlayer.playerPosition == 'South') {
                // Sort the players cards
                if (GetSetting('setting_sort_left_to_right')) {
                    receivingPlayer.cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return b.value - a.value;
                        }
                    });
                    player.passingCards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return b.value - a.value;
                        }
                    });
                } else {
                    receivingPlayer.cards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return a.value - b.value;
                        }
                    });
                    player.passingCards.sort(function(a,b) {
                        if (a.suit != b.suit) {
                            return a.suitInt - b.suitInt;
                        } else {
                            return a.value - b.value;
                        }
                    });
                }

                // Pause the cards so the user can see them before then go into the player's hand
                setTimeout(function() {
                    var spotWidth = 110;
                    var spotPadding = 15;
                    var totalWidth = spotWidth*currentPassingCardViews.length + spotPadding*(currentPassingCardViews.length-1);

                    var leftOffset = (window.innerWidth - totalWidth)*0.5;
                    var curTop = window.innerHeight*0.3;
                    for (var i=0; i<player.passingCards.length; i++) {
                        var cardView = player.passingCards[i].cardView;
                        flipUpCard(cardView, true);
                        var curLeft = leftOffset + (spotWidth+spotPadding)*i;
                        var z = receivingPlayer.cards.indexOf(player.passingCards[i]) + 100;
                        with (cardView.style) {
                            transition = "1s ease-out";
                            transitionDelay = "0s";
                            left = curLeft + 'px';
                            top = curTop + 'px';
                            transform = 'none';
                            zIndex = z;
                        }
                    }
                    setTimeout(function() {
                        AnimatePlayerHandCardsIntoPosition(player.playerPosition, '1s');
                        AnimatePlayerHandCardsIntoPosition(receivingPlayer.playerPosition, '1s');
                        setTimeout(function() {
                            game.currentMoveStage = 'AcceptingMelds';
                            RememberLatestGameState();
                            CountMeldsForRound(true);
                        }, 1300);
                    }, 1800);
                }, delay);

            } else {
                setTimeout(function() {
                    AnimatePlayerHandCardsIntoPosition(player.playerPosition, '1s');
                    AnimatePlayerHandCardsIntoPosition(receivingPlayer.playerPosition, '1s');
                    setTimeout(function() {
                        game.currentMoveStage = 'AcceptingMelds';
                        RememberLatestGameState();
                        CountMeldsForRound(true);
                    }, 1600);
                }, delay);
            }
        }
    }

    function CountMeldsForRound(updateStats) {
        HideBidView('South');
        HideBidView('West');
        HideBidView('East');
        HideBidView('North');

        for (var i=0; i<4; i++) {
            var player = game.players[i];
            player.passingCards = [];
            player.CalculateMelds(player.cards, game.trumpSuit, game.isDoubleDeck, false);
            for (var j=0; j<player.melds.length; j++) {
                var meld = player.melds[j];
                for (var k=0; k<meld.cards.length; k++) {
                    var card = meld.cards[k];
                    card.wasShown = true;
                }
            }
        }

        // Position for each player
        var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
        playerWestNameTopForAcceptingMelds = 250;
        playerEastNameTopForAcceptingMelds = 250;
        playerSouthNameTopForAcceptingMelds = window.innerHeight-315;
        for (var playerIndex=0; playerIndex<4; playerIndex++) {
            var player = game.players[playerIndex];
            var meldCards = [];
            for (var i=0; i<player.melds.length; i++) {
                for (var j=0; j<player.melds[i].cards.length; j++) {
                    var card = player.melds[i].cards[j];
                    if (!meldCards.includes(card)) {
                        meldCards.push(card);
                    }
                }
            }
            
            if (playerIndex==0 && meldCards.length==0) {
                playerSouthNameTopForAcceptingMelds = window.innerHeight-240;
            }

            var curDelay = 0;
            for (var i=0; i<meldCards.length; i++) {
                var cardView = meldCards[i].cardView;
                UnshadeCard(cardView);
                cardView.positionFunction = 'GetMeldCardLocation("' + player.playerPosition + '", ' + i + ', ' + meldCards.length + ', false)';
                if (i==0 && playerIndex==1) {
                    var p = eval(cardView.positionFunction);
                    playerWestNameTopForAcceptingMelds = p[1]-40;
                } else if (i==0 && playerIndex==3) {
                    var p = eval(cardView.positionFunction);
                    playerEastNameTopForAcceptingMelds = p[1]-40;
                }
                setTimeout(function(aCardView, aIndex) {
                    var pos = eval(aCardView.positionFunction);
                    flipUpCard(aCardView, true);
                    with (aCardView.style) {
                        transition = '0.3s ease-out';
                        left = pos[0] + 'px';
                        top = pos[1] + 'px';
                        transform = 'rotate(0deg)';
                        zIndex = 900 + aIndex;
                    }
                }, curDelay, cardView, i);
                if (playerIndex != 0) {
                    curDelay += 100;
                }
            }
            for (var i=0; i<player.cards.length; i++) {
                if (!meldCards.includes(player.cards[i])) {
                    var cardView = player.cards[i].cardView;
                    UnshadeCard(cardView);
                    cardView.positionFunction = 'GetMeldCardLocation("' + player.playerPosition + '", ' + i + ', ' + player.cards.length + ', true)';
                    var pos = eval(cardView.positionFunction);
                    if (playerIndex==0) {
                        with (cardView.style) {
                            transition = '0.6s ease-out';
                            left = pos[0] + 'px';
                            top = pos[1] + 'px';
                            transform = 'rotate(0deg)';
                        }
                    } else {
                        with (cardView.style) {
                            transition = '0.6s ease-out';
                            left = pos[0] + 'px';
                            top = pos[1] + 'px';
                        }
                    }
                }
            }

            var meldView = document.getElementById('meld_view_' + player.playerPosition);
            var meldTitle = document.getElementById('meld_view_title_' + player.playerPosition);
            var meldValue = document.getElementById('meld_view_value_' + player.playerPosition);
            meldValue.innerHTML = isUsingScoreMultiplier ? player.currentRoundMeldScore*10 : player.currentRoundMeldScore;
            if (player.melds.length == 0) {
                meldTitle.innerHTML = "Meld";
            } else {
                var meldTitleText = "";
                for (var i=0; i<player.melds.length; i++) {
                    if (i!=0) {
                        meldTitleText += ", ";
                    }
                    meldTitleText += player.melds[i].meldType;
                }
                meldTitle.innerText = meldTitleText;
            }
            meldView.positionFunction = "GetMeldViewPosition('" + player.playerPosition + "', " + meldCards.length + ")";
            var pos = eval(meldView.positionFunction);
            meldView.style.transition = "none";
            meldView.style.left = pos[0] + "px";
            meldView.style.top = pos[1] + "px";
            setTimeout(function(playerPos) {
                var meldView = document.getElementById('meld_view_' + playerPos);
                meldView.style.transition = "0.3s linear";
                meldView.style.opacity = 1;
                meldView.style.visibility = "visible";
            }, curDelay, player.playerPosition);

            var playerName = document.getElementById('player_name_' + player.playerPosition);
            playerName.style.transition = '0.3s ease-in-out';
            var pos = eval(playerName.positionFunction);
            playerName.style.left = pos[0] + "px";
            playerName.style.top = pos[1] + "px";
        }

        if (updateStats) {
            var bidString = "withoutbid";
            if (game.bidWinner == 0 || game.bidWinner == 2) {
                bidString = "withbid";
            }
            var doubleDeckString = "";
            if (game.isDoubleDeck) {
                doubleDeckString = "_DoubleDeck";
            }

            var totalKey = 'stat_meld_' + bidString + "_total_" + game.skillLevel + doubleDeckString;
            var curTotal = GetStatistic(totalKey);
            curTotal += game.players[0].currentRoundMeldScore + game.players[2].currentRoundMeldScore;
            SetStatistic(totalKey, curTotal);

            var countKey = 'stat_meld_' + bidString + "_count_" + game.skillLevel + doubleDeckString;
            var curCount = Number(GetStatistic(countKey));
            curCount += 1;
            SetStatistic(countKey, curCount);
        }

        var acceptMeldPrompt = document.getElementById('accept_meld_view_prompt');
        var acceptMeldButton = document.getElementById('accept_meld_view_button');
        var throwInButton = document.getElementById('thow_in_button');
        var maxPossibleCounters = game.isDoubleDeck ? 49 : 25;
        if (game.bidWinner == 0 || game.bidWinner == 2) {
            var contract = game.players[game.bidWinner].currentRoundBid;
            var meldScore = game.players[0].currentRoundMeldScore + game.players[2].currentRoundMeldScore;
            if (contract - meldScore > maxPossibleCounters) {
                acceptMeldPrompt.innerHTML = 'Contract is unreachable.<br>You must throw in.';
                acceptMeldPrompt.style.display = "block";
                acceptMeldButton.style.display = 'none';
                throwInButton.innerText = "Throw In";
                throwInButton.style.display = 'block';
            } else {
                acceptMeldPrompt.style.display = 'none';
                acceptMeldButton.style.display = 'block';
                throwInButton.style.display = 'none';
            }
        } else {
            var contract = game.players[game.bidWinner].currentRoundBid;
            var meldScore = game.players[1].currentRoundMeldScore + game.players[3].currentRoundMeldScore;
            if (contract - meldScore > maxPossibleCounters) {
                acceptMeldPrompt.innerHTML = 'Contract is unreachable.<br>Opponents throw in.';
                acceptMeldPrompt.style.display = "block";
                acceptMeldButton.style.display = 'none';
                throwInButton.innerText = "Accept";
                throwInButton.style.display = 'block';
            } else {
                acceptMeldPrompt.style.display = 'none';
                acceptMeldButton.style.display = 'block';
                throwInButton.style.display = 'none';
            }
        }

        var acceptMeldView = document.getElementById('accept_meld_view');
        with (acceptMeldView.style) {
            transition = '0.3s linear';
            transitionDelay = '1s';
            opacity = 1;
            visibility = 'visible';
        }

        setTimeout(function(){
            scoreboard.UpdateScores(true, true, false);
        }, 1000);
    }

    function HideAcceptMeldView() {
        var acceptMeldView = document.getElementById('accept_meld_view');
        with (acceptMeldView.style) {
            transition = '0.3s linear';
            transitionDelay = 'none';
            opacity = 0;
            visibility = 'hidden';
        }

        for (var i=0; i<4; i++) {
            var meldView = document.getElementById('meld_view_' + game.players[i].playerPosition);
            with (meldView.style) {
                transition = "0.5s linear";
                opacity = 0;
            }
            var playerName = document.getElementById('player_name_' + game.players[i].playerPosition);
            var pos = eval(playerName.positionFunction)
            with (playerName.style) {
                transition = "0.5s ease-in-out";
                left = pos[0] + 'px';
                top = pos[1] + 'px';
            }
        }
    }

    function GetMeldCardLocation(position, index, cardCount, isNonMeld) {

        var cardWidthHalf = 115*0.5;
        var meldCardSpacing = 50;
        var meldCardStackSpacing = 45;
        var meldCardMaxPerLine = 4;
        var meldLeftOffset = 90;
        var meldTopOffset = 70;
        var meldRightOffset = 90;

        switch (position) {
            case 'West':
            {
                var handLocationFirst = GetHandCardLocation(position, 0, 13);
                var handLocationLast = GetHandCardLocation(position, 12, 13);

                if (isNonMeld) {
                    return [(handLocationFirst[0] + handLocationLast[0])*0.5, (handLocationFirst[1] + handLocationLast[1])*0.5];
                } else {
                    var sideMeldCardStackSpacing = meldCardStackSpacing;
                    var curLeft = meldLeftOffset;
                    var curTop = (handLocationFirst[1] + handLocationLast[1])*0.5 - 10;
                    if (cardCount > meldCardMaxPerLine) {
                        var lines = Math.ceil(cardCount / meldCardMaxPerLine);
                        curTop -= (lines-1)*sideMeldCardStackSpacing*0.5;
                    }
                    var cardsOnLineCount = 0;
                    var remainingMeldCardsCount = cardCount;
                    for (var i=0; i<cardCount; i++) {
                        if (cardsOnLineCount >= meldCardMaxPerLine) {
                            cardsOnLineCount = 0;
                            curTop += sideMeldCardStackSpacing;
                            if (remainingMeldCardsCount < meldCardMaxPerLine) {
                                curLeft = meldLeftOffset + (meldCardMaxPerLine-remainingMeldCardsCount)*meldCardSpacing*0.5;
                            } else {
                                curLeft = meldLeftOffset;
                            }
                        }
                        if (i==index) {
                            return [curLeft - cardWidthHalf, curTop];
                        }
                        
                        curLeft += meldCardSpacing;
                        cardsOnLineCount++;
                        remainingMeldCardsCount--;
                    }
                }
            }
            break;
            case 'North':
            {
                var handLocationFirst = GetHandCardLocation(position, 0, 13);
                var handLocationLast = GetHandCardLocation(position, 12, 13);

                if (isNonMeld) {
                    return [(handLocationFirst[0] + handLocationLast[0])*0.5, (handLocationFirst[1] + handLocationLast[1])*0.5];
                } else {
                    var flatMeldCardSpacing = meldCardSpacing;
                    curLeft = (window.innerWidth - (cardCount-1)*flatMeldCardSpacing)*0.5;
                    if (curLeft < 50) {
                        curLeft = 50;
                        flatMeldCardSpacing = cardCount>1?((window.innerWidth-100)/(cardCount-1)):meldCardSpacing;
                    }
                    curTop = meldTopOffset;
                    for (var i=0; i<cardCount; i++) {
                        if (i==index) {
                            return [curLeft - cardWidthHalf, curTop];
                        }
                        curLeft += flatMeldCardSpacing;
                    }
                }
            }
            break;
            case 'East':
            {
                var handLocationFirst = GetHandCardLocation(position, 0, 13);
                var handLocationLast = GetHandCardLocation(position, 12, 13);

                if (isNonMeld) {
                    return [(handLocationFirst[0] + handLocationLast[0])*0.5, (handLocationFirst[1] + handLocationLast[1])*0.5];
                } else {
                    var sideMeldCardStackSpacing = meldCardStackSpacing;
                    var curLeft = (window.innerWidth - (cardCount-1)*meldCardSpacing) - meldRightOffset;
                    var curTop = (handLocationFirst[1] + handLocationLast[1])*0.5 - 10;
                    if (cardCount > meldCardMaxPerLine) {
                        var lines = Math.ceil(cardCount / meldCardMaxPerLine);
                        curTop -= (lines-1)*sideMeldCardStackSpacing*0.5;
                        curLeft = (window.innerWidth - (meldCardMaxPerLine-1)*meldCardSpacing) - meldRightOffset;
                    }

                    var cardsOnLineCount = 0;
                    var remainingMeldCardsCount = cardCount;
                    for (var i=0; i<cardCount; i++) {
                        if (cardsOnLineCount >= meldCardMaxPerLine) {
                            cardsOnLineCount = 0;
                            curTop += sideMeldCardStackSpacing;
                            if (remainingMeldCardsCount < meldCardMaxPerLine) {
                                curLeft = (window.innerWidth - (meldCardMaxPerLine-1)*meldCardSpacing) - meldRightOffset + (meldCardMaxPerLine-remainingMeldCardsCount)*meldCardSpacing*0.5;
                            } else {
                                curLeft = window.innerWidth - meldRightOffset - (meldCardMaxPerLine-1)*meldCardSpacing;
                            }
                        }
                        if (i==index) {
                            return [curLeft-cardWidthHalf, curTop];
                        }
                        
                        curLeft += meldCardSpacing;
                        cardsOnLineCount++;
                        remainingMeldCardsCount--;
                    }
                }
            }
            break;
            case 'South':
            {
                if (isNonMeld) {
                    return [window.innerWidth*0.5 - cardWidthHalf, window.innerHeight-50];

                    //var handCardLocation = GetHandCardLocation(position, index, cardCount);
                    //return [handCardLocation[0], window.innerHeight - 130];
                } else {
                    var flatMeldCardSpacing = meldCardSpacing;
                    curLeft = (window.innerWidth - (cardCount-1)*flatMeldCardSpacing)*0.5;
                    if (curLeft < 50) {
                        curLeft = 50;
                        flatMeldCardSpacing = cardCount>1?((window.innerWidth-100)/(cardCount-1)):meldCardSpacing;
                    }
                    curTop = window.innerHeight - 270;
                    for (var i=0; i<cardCount; i++) {
                        if (i==index) {
                            return [curLeft - cardWidthHalf, curTop];
                        }
                        curLeft += flatMeldCardSpacing;
                    }
                }
            }
            break;
        }

    }

    function GetMeldViewPosition(position, cardsCount) {
        switch (position) {
            case 'West':
            case 'East':
            {
                var cardWidthHalf = 115*0.25;
                if (cardsCount == 0) {
                    var pos = GetPlayerBidPosition(position);
                    return [pos[0]+cardWidthHalf, pos[1]];
                } else {
                    var meldCardMaxPerLine = 4;
                    if (cardsCount <= meldCardMaxPerLine) {
                        var leftPos = GetMeldCardLocation(position, 0, cardsCount, false);
                        var rightPos = GetMeldCardLocation(position, cardsCount-1, cardsCount, false);
                        return [(leftPos[0]+rightPos[0])*0.5 + 2*cardWidthHalf, leftPos[1]+50];
                    } else {
                        var midPos = GetMeldCardLocation(position, meldCardMaxPerLine*0.5, cardsCount, false);
                        var lastPos = GetMeldCardLocation(position, cardsCount-1, cardsCount, false);
                        return [midPos[0]+cardWidthHalf, lastPos[1]+50];
                    }   
                }
            }
            break;
            case 'North':
            {
                return [window.innerWidth*0.5, 130];
            }
            break;
            case 'South':
            {
                return [window.innerWidth*0.5, window.innerHeight-200];
            }
            break;
        }
    }

    this.OnThrowInButtonPressed = function() {
        game.currentMoveStage = 'none';
        var acceptMeldView = document.getElementById('accept_meld_view');
        acceptMeldView.style.transitionDelay = 'none';
        acceptMeldView.style.transition = 'none';
        acceptMeldView.style.opacity = 0;
        acceptMeldView.style.visibility = 'hidden';

        for (var i=0; i<4; i++) {
            var meldView = document.getElementById('meld_view_' + game.players[i].playerPosition);
            with (meldView.style) {
                transition = "0.5s linear";
                opacity = 0;
            }
            var playerName = document.getElementById('player_name_' + game.players[i].playerPosition);
            var pos = eval(playerName.positionFunction)
            with (playerName.style) {
                transition = "0.5s ease-in-out";
                left = pos[0] + 'px';
                top = pos[1] + 'px';
            }
        }

        AnimatePlayerHandCardsIntoPosition('West', '1s');
        AnimatePlayerHandCardsIntoPosition('North', '1s');
        AnimatePlayerHandCardsIntoPosition('East', '1s');
        AnimatePlayerHandCardsIntoPosition('South','1s');

        if (game.bidWinner == 0 || game.bidWinner == 2) {
            game.players[0].currentRoundCountersTaken = -1;
        } else {
            game.players[1].currentRoundCountersTaken = -1;
        }

        this.FinishRound();
    }

    this.OnAcceptMeldButtonPressed = function() {
        game.currentMoveStage = 'none';
        var acceptMeldView = document.getElementById('accept_meld_view');
        acceptMeldView.style.transitionDelay = 'none';
        acceptMeldView.style.transition = 'none';
        acceptMeldView.style.opacity = 0;
        acceptMeldView.style.visibility = 'hidden';

        for (var i=0; i<4; i++) {
            var meldView = document.getElementById('meld_view_' + game.players[i].playerPosition);
            with (meldView.style) {
                transition = "0.5s linear";
                opacity = 0;
            }
            var playerName = document.getElementById('player_name_' + game.players[i].playerPosition);
            var pos = eval(playerName.positionFunction)
            with (playerName.style) {
                transition = "0.5s ease-in-out";
                left = pos[0] + 'px';
                top = pos[1] + 'px';
            }
            
            var cardsLeftPos = GetHandCardLocation(game.players[i].playerPosition, 0, 12);
            var cardsRightPos = GetHandCardLocation(game.players[i].playerPosition, 11, 12);
            var x = (cardsLeftPos[0] + cardsRightPos[0])*0.5;
            var y = (cardsLeftPos[1] + cardsRightPos[1])*0.5;
            var rotation = i==0 ? "rotate(0deg)" : "rotate(" + cardsLeftPos[2] + "deg)";
            for (var j=0; j<game.players[i].cards.length; j++) {
                var cardView = game.players[i].cards[j].cardView;
                if (i!=0) {
                    flipDownCard(cardView, true);
                }
                with (cardView.style) {
                    transition = "0.8s ease-in-out";
                    transitionDelay = "none";
                    left = x + 'px';
                    top = y + 'px';
                    transform = rotation;
                    //if (i==0) {
                        zIndex = 100 + j;  
                    //}
                }
            }
        }
        
        
        setTimeout(function() {
            AnimatePlayerHandCardsIntoPosition('West', '1s');
            AnimatePlayerHandCardsIntoPosition('North', '1s');
            AnimatePlayerHandCardsIntoPosition('East', '1s');
            AnimatePlayerHandCardsIntoPosition('South','1s');   

            setTimeout(function() {
                scoreboard.UpdateScores(true, true, true);
                UpdatePlayerRoundScore(false);
                UpdatePlayerRoundScore(true);   
                game.StartTrickTaking();             
            }, 800);
            
        }, 1000);
        
        
        
    }

    function UpdatePlayerRoundScore(isNorthSouth) {
        
        var countersDisplay = Number(GetSetting('setting_counters_display'));
        var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
        var isShowingContract = false;
        var contractValue = game.players[game.bidWinner].currentRoundBid;
        var countersScore = 0;
        var currentRoundScoreValue = 0;
        var playerPositionToUpdate = 'South';
        if (isNorthSouth) {
            isShowingContract = game.bidWinner == 2 || game.bidWinner == 0;
            playerPositionToUpdate = isShowingContract ? game.players[game.bidWinner].playerPosition : 'South';
            var meldScore = game.players[0].currentRoundMeldScore + game.players[2].currentRoundMeldScore;
            countersScore = game.players[0].currentRoundCountersTaken + game.players[2].currentRoundCountersTaken;
            currentRoundScoreValue = meldScore + countersScore;
        } else {
            isShowingContract = game.bidWinner == 1 || game.bidWinner == 3;
            playerPositionToUpdate = isShowingContract ? game.players[game.bidWinner].playerPosition : 'West';
            var meldScore = game.players[1].currentRoundMeldScore + game.players[3].currentRoundMeldScore;
            countersScore = game.players[1].currentRoundCountersTaken + game.players[3].currentRoundCountersTaken;
            currentRoundScoreValue = meldScore + countersScore;
        }

        var playerScore = document.getElementById('player_score_' + playerPositionToUpdate);
        playerScore.positionFunction = "GetPlayerScorePosition('" + playerPositionToUpdate + "')";
        position = eval(playerScore.positionFunction);
        playerScore.style.left = position[0] + 'px';
        playerScore.style.top = position[1] + 'px';
        if (countersDisplay==0) {
            playerScore.innerText = "";
        } else if (countersDisplay==2) {
            playerScore.innerText = isUsingScoreMultiplier ? countersScore*10 : countersScore;
        } else if (isShowingContract) {
            if (isUsingScoreMultiplier) {
                playerScore.innerText = currentRoundScoreValue*10 + "/" + contractValue*10;
            } else {
                playerScore.innerText = currentRoundScoreValue + "/" + contractValue;
            }
        } else {
            playerScore.innerText = isUsingScoreMultiplier ? currentRoundScoreValue*10 : currentRoundScoreValue;
        }

        return;
    }
    
    function GetHintButtonPosition() {
        var leftPos = GetHandCardLocation('South', 13, 14);
        return [leftPos[0] + 35, leftPos[1]-90];
    }

    this.UpdateShowHintButton = function() {
        if (game == null || game.players.length == 0) {
            return;
        }

        var hintsOn = GetSetting('setting_hints');
        if (game.skillLevel == 'Easy' || hintsOn) {
            switch (game.currentMoveStage) {
                case 'ChoosingBids':
                case 'ChoosingTrumpSuit':
                case 'ChoosingTrickCard':
                    ShowHintButton(0);
                    break;
                default:
                    HideHintButton();
                    break;
            }
        } else {
            HideHintButton();
        }
    }

    function ShowHintButton(delay) {
        var hintButton = document.getElementById('hint_button');
        switch (game.currentMoveStage) {
            case 'ChoosingBids':
            case 'ChoosingTrumpSuit':
                hintButton.innerText = "Analyze";
                break;
            default:
                hintButton.innerText = "Hint";
        }
        hintButton.positionFunction = "GetHintButtonPosition()";
        hintButton.style.transition = "none";
        var loc = eval(hintButton.positionFunction);
        hintButton.style.left = loc[0] + 'px';
        hintButton.style.top = loc[1] + 'px';
        hintButton.style.visibility = 'visible';
        hintButton.style.pointerEvents = "auto";
        setTimeout(function () {
            hintButton.style.transition = "0.5s linear";
            hintButton.style.opacity = 1;
            setTimeout(function() {
                hintButton.style.transition = "none";
            }, 600);
        }, delay);
    }

    function HideHintButton() {
        var hintButton = document.getElementById('hint_button');
        hintButton.style.opacity = 0;
        hintButton.style.pointerEvents = "none";
    }

    this.OnHintButtonClick = function () {
        switch (game.currentMoveStage) {
            case 'ChoosingBids':
            case 'ChoosingTrumpSuit':
                ShowRoundSimulationsView();
                break;
            case 'ChoosingPassCards':
            {
                var player = this.players[0];
                var passingCardsCount = GetSetting('setting_passing_cards_count');
                var optimalCards = player.FindBestPassingCards(passingCardsCount, game);
                BumpCards(optimalCards, 0);
            }
            break;
            case 'ChoosingTrickCard':
            {
                var player = this.players[0];
                var bestCard = player.FindBestPlayingCard(game, true);
                BumpCard(bestCard.cardView);
            }
            break;
        }
    }

    this.BumpHintCards = function() {
        var optimalCards = [];
        if (this.currentMoveStage == 'ChoosingPassCards') {
            var player = this.players[0];
            var passingCardsCount = GetSetting('setting_passing_cards_count');
            optimalCards = player.FindBestPassingCards(passingCardsCount, game);

        } else if (this.currentMoveStage === 'ChoosingTrickCard') {
            var player = this.players[0];
            var bestCard = player.FindBestPlayingCard(game, true);
            optimalCards.push(bestCard);
        }

        BumpCards(optimalCards, 0);
    }

    this.StartTrickTaking = function() {
        
        game.currentMoveStage = 'ChoosingTrickCard';
        game.trickCards = [];
        this.turnIndex = this.bidWinner;
        this.leadIndex = this.bidWinner;
        var nextPlayer = this.players[this.turnIndex%4];
        nextPlayer.ChoosePlayCard();
        if (nextPlayer.isHuman) {
            RememberLatestGameState();
        }
    }

    this.PromptPlayerToPlayCard = function() {
        var playerPrompt = document.getElementById('player_play_prompt');
        playerPrompt.positionFunction = "GetTrickPlayPromptLocation()";
        playerPrompt.style.transition = 'none';
        var loc = eval(playerPrompt.positionFunction);
        playerPrompt.style.left = loc[0] + 'px';
        playerPrompt.style.top = loc[1] + 'px';
        playerPrompt.style.visibility = 'visible';
        with (playerPrompt.style) {
            transition = "0.5s linear";
            transitionDelay = "1s";
            opacity = 1;
        }

        var player = this.players[0];
        var legalPlayCards = GetLegalCardsForCurrentPlayerTurn(this);
        for (var i=0; i<player.cards.length; i++) {
            var card = player.cards[i];
            var cardView = card.cardView;
            var isLegal = false;
            for (var j=0; j<legalPlayCards.length; j++) {
                var legalCard = legalPlayCards[j];
                if (card.id === legalCard.id) {
                    isLegal = true;
                    break;
                }
            }
            if (isLegal) {
                UnshadeCard(cardView);
                cardView.isClickable = true;
            } else {
                ShadeCard(cardView);
                cardView.isClickable = false;
            }
        }
        
        if (this.skillLevel === 'Easy' || GetSetting('setting_hints')) {
            ShowHintButton(0);
        }

        this.currentMoveStage = "ChoosingTrickCard";
    }

    function GetTrickPlayPromptLocation() {
        var pos = GetTrickDiscardLocation('South');
        return [pos[0] + cardLoweredWidth*0.5, [pos[1] + cardLoweredHeight*0.5 + 80]]; 
    }

    function GetTrickDiscardLocation(playerPostion) {
        switch (playerPostion) {
            case 'South':
                return [window.innerWidth*0.5 - cardLoweredWidth*0.5, 330 - cardLoweredHeight*0.5];
            case 'West':
                return [window.innerWidth*0.5 - cardLoweredWidth*1.5 - 20, 250 - cardLoweredHeight*0.5];
            case 'North':
                return [window.innerWidth*0.5 - cardLoweredWidth*0.5, 150 - cardLoweredHeight*0.5];
            default:
                return [window.innerWidth*0.5 + cardLoweredWidth*0.5 + 20, 250 - cardLoweredHeight*0.5];
        }
    }

    this.OnPlayerChosePlayCard = function(card) {
        this.currentMoveStage = 'None';
        var playerPrompt = document.getElementById('player_play_prompt');
        with (playerPrompt.style) {
            transition = "0.1s linear";
            opacity = 0;
        }

        var player = this.players[this.turnIndex%4];
        PlayCard(this,card);
        
        var trickSpeed = GetSetting('setting_trick_speed');
        var cardTransition = "0.3s ease-out";
        if (trickSpeed == 2) {
            cardTransition = "0.1s ease-out";
        }

        var cardView = card.cardView;
        cardView.positionFunction = "GetTrickDiscardLocation('" + player.playerPosition + "')";
        var loc = eval(cardView.positionFunction);
        flipUpCard(cardView, trickSpeed != 2);
        with (cardView.style) {
            transition = cardTransition;
            transitionDelay = "0s";
            left = loc[0] + 'px';
            top = loc[1] + 'px';
            transform = 'none';
            zIndex = 0;
        }
        if (player.playerPosition === 'South') {
            for (var i=0; i<player.cards.length; i++) {
                var card = player.cards[i];
                var cardView = card.cardView;
                UnshadeCard(cardView);
                cardView.isClickable = false;
            }
        }
        AnimatePlayerHandCardsIntoPosition(player.playerPosition, "0.3s");

        if (this.trickCards.length !== 4) {
            var nextPlayer = this.players[this.turnIndex%4];
            if (nextPlayer.isHuman) {
                nextPlayer.ChoosePlayCard();
                RememberLatestGameState();
            } else {
                setTimeout(function() {
                    nextPlayer.ChoosePlayCard();
                }, 500);
            }
        } else {
            var trickResult = GetTrickResult(this);
            trickResult.trickTaker.currentRoundCountersTaken += trickResult.countersTaken;
            this.leadIndex = trickResult.trickTaker.playerPositionInt;
            this.AnimateTrickResult(trickResult);
        }
    }

    this.DropCardInTrickPile = function() {
        var playedCard = currentDraggedCardView.card;
        HideHintButton();
        this.OnPlayerChosePlayCard(playedCard);
    }

    var currentTrickResult;

    this.AnimateTrickResult = function(trickResult) {
        currentTrickResult = trickResult;
        var cardView = trickResult.highestCard.cardView;
        FlashHighlightCardView(cardView);

        var trickSpeed = GetSetting('setting_trick_speed');
        var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');

        if (trickResult.countersTaken > 0) {
            var displayPoints = isUsingScoreMultiplier ? trickResult.countersTaken*10 : trickResult.countersTaken;
            document.getElementById('trick_score_points').innerText = '+' + displayPoints;
            var scoreBubble = document.getElementById('trick_score_bubble');
            scoreBubble.style.background = trickResult.trickTaker.playerPositionInt==0||trickResult.trickTaker.playerPositionInt==2 ? '#0000BB' : '#FF0000';
            scoreBubble.positionFunction = 'GetScoreBubblePosition()';
            var scoreBubblePosition = eval(scoreBubble.positionFunction);
            with (scoreBubble.style) {
                transition = 'none';
                transitionDelay = 'none';
                left = scoreBubblePosition[0] + 'px';
                top = scoreBubblePosition[1] + 'px';
                transform = 'translate(-50%,-50%) scale(0)';
                visibility = 'visible';
                opacity = 1;
            }
            setTimeout(function(){
                with (scoreBubble.style) {
                    transition = '0.3s linear';
                    transform = 'translate(-50%,-50%) scale(1)';
                }
            },400);
        }

        if (trickSpeed == 0) {
            var acceptButton = document.getElementById('accept_trick_result');
            acceptButton.positionFunction = 'GetAcceptTrickButtonPosition()';
            var acceptButtonPosition = eval(acceptButton.positionFunction);
            with (acceptButton.style) {
                transition = 'none';
                left = acceptButtonPosition[0] + 'px';
                top = acceptButtonPosition[1] + 'px';
                opacity = 0;
                visibility = 'visible';
            }
            setTimeout(function(){
                with (acceptButton.style) {
                    transition = '0.3s linear';
                    opacity = 1;
                }
            }, 300);
        } else {
            this.ContinueAnimatingTrickResult(trickResult);
        }
    }

    this.OnAcceptTrickButtonPressed = function() {
        HideAcceptTrickButton();
        this.ContinueAnimatingTrickResult(currentTrickResult);
    }

    function HideAcceptTrickButton() {
        var acceptButton = document.getElementById('accept_trick_result');
        with (acceptButton.style) {
            transition = '0.3s linear';
            opacity = 0;
            visibility = 'hidden';
        }
    }

    this.ContinueAnimatingTrickResult = function(trickResult) {

        var trickSpeed = GetSetting('setting_trick_speed');
        
        var delay = 1700;
        var cardAnimationDuration = 1000;
        var animationTransition = '1s ease-in';
        if (trickSpeed == 0) {
            delay = 100;
        } else if (trickSpeed == 2) {
            delay = 1500;
            cardAnimationDuration = 200;
            animationTransition = '0.2s linear';
        }

        setTimeout(function() {
            for (var i=0; i<game.trickCards.length; i++) {
                var cardView = game.trickCards[i].cardView;
                cardView.positionFunction = "GetWonTrickCardsPilePostion('" + trickResult.trickTaker.playerPosition + "')";
                var loc = eval(cardView.positionFunction);
                with (cardView.style) {
                    transition = animationTransition;
                    left = loc[0] + 'px';
                    top = loc[1] + 'px';
                    visibility = 'hidden';
                }
            }   
            var pos = GetWonTrickCardsPilePostion(trickResult.trickTaker.playerPosition);
            var scoreBubble = document.getElementById('trick_score_bubble');
            with (scoreBubble.style) {
                transition = animationTransition;
                left = pos[0] + 115*0.5 + 'px';
                top = pos[1] + 162*0.5 + 'px';
                visibility = 'hidden';
            }    
        }, delay);

        setTimeout(function(player) {
            UpdatePlayerRoundScore(player.playerPositionInt==0 || player.playerPositionInt==2);
            scoreboard.UpdateScores(true, true, true);
        }, delay + cardAnimationDuration, trickResult.trickTaker);
    
        setTimeout(function() {
            if (game.players[0].cards.length !== 0) {
                game.trickCards = [];
                game.turnIndex = game.leadIndex;
                var nextPlayer = game.players[game.turnIndex];
                nextPlayer.ChoosePlayCard();
                if (nextPlayer.isHuman) {
                    RememberLatestGameState();
                }
            } else {
                game.FinishRound();
            }
        }, delay + cardAnimationDuration);
    }

    function GetScoreBubblePosition() {
        return [window.innerWidth*0.5, 180];
    }

    function GetAcceptTrickButtonPosition() {
        return [window.innerWidth*0.5 + 100, 400];
    }

    function GetWonTrickCardsPilePostion(playerPosition) {
        var loc = GetHandCardLocation(playerPosition, 6, 12);
        switch (playerPosition) {
            case 'South':
                return [loc[0], window.innerHeight + 150];
            case 'West':
                return [-150, loc[1]];
            case 'North':
                return [loc[0], -150];
            default:
                return [window.innerWidth + 150, loc[1]];
        }
    }

    this.FinishRound = function() {
        
        var aRoundContracts = [];
        var northSouthContract = -1;
        var eastWestContract = -1;
        if (game.bidWinner == 0 || game.bidWinner == 2) {
            northSouthContract = game.players[game.bidWinner].currentRoundBid;
        } else {
            eastWestContract = game.players[game.bidWinner].currentRoundBid;
        }
        aRoundContracts.push(northSouthContract);
        aRoundContracts.push(eastWestContract);

        var aRoundMelds = [];
        aRoundMelds.push(game.players[0].currentRoundMeldScore + game.players[2].currentRoundMeldScore);
        aRoundMelds.push(game.players[1].currentRoundMeldScore + game.players[3].currentRoundMeldScore)

        var aRoundCountersTaken = [];
        aRoundCountersTaken.push(game.players[0].currentRoundCountersTaken + game.players[2].currentRoundCountersTaken);
        aRoundCountersTaken.push(game.players[1].currentRoundCountersTaken + game.players[3].currentRoundCountersTaken);

        var aRoundScores = [];
        var totalPoints = aRoundMelds[0] + aRoundCountersTaken[0];
        if (game.bidWinner == 0 || game.bidWinner == 2) {
            if (game.players[0].countersTaken == -1) {
                // Throw in
                aRoundScores.push(-aRoundContracts[0]);
            } else {
                if (totalPoints >= aRoundContracts[0]) {
                    aRoundScores.push(totalPoints);
                } else {
                    aRoundScores.push(-aRoundContracts[0]);
                }
            }
        } else {
            if (game.players[1].countersTaken == -1) {
                // Opponent threw in
                aRoundScores.push(aRoundMelds[0]);
            } else {
                if (aRoundCountersTaken[0] == 0) {
                    aRoundScores.push(0);
                } else {
                    aRoundScores.push(totalPoints);
                }
            }
        }
        totalPoints = aRoundMelds[1] + aRoundCountersTaken[1];
        if (game.bidWinner == 1 || game.bidWinner == 3) {
            if (game.players[1].countersTaken == -1) {
                // Throw in
                aRoundScores.push(-aRoundContracts[1]);
            } else {
                if (totalPoints >= aRoundContracts[1]) {
                    aRoundScores.push(totalPoints);
                } else {
                    aRoundScores.push(-aRoundContracts[1]);
                }
            }
        } else {
            if (game.players[0].countersTaken == -1) {
                // Opponent threw in
                aRoundScores.push(aRoundMelds[1]);
            } else {
                if (aRoundCountersTaken[1] == 0) {
                    aRoundScores.push(0);
                } else {
                    aRoundScores.push(totalPoints);
                }
            }
        }

        game.players[0].gameScore += aRoundScores[0];
        game.players[1].gameScore += aRoundScores[1];

        game.roundContracts.push(aRoundContracts);
        game.roundMelds.push(aRoundMelds);
        game.roundCountersTaken.push(aRoundCountersTaken);
        game.roundScores.push(aRoundScores);
        game.dealerIndex += 1;

        // Update stats
        var curDifficulty = game.skillLevel;
        var doubleDeckString = "";
        if (game.isDoubleDeck) {
            doubleDeckString = "_DoubleDeck";
        }
        var bidString = "withoutbid";
        if (game.bidWinner == 0 || game.bidWinner == 2) {
            bidString = "withbid";
            var statKey = 'stat_winningbid_total_' + curDifficulty + doubleDeckString;
            var winningBidTotal = GetStatistic(statKey);
            winningBidTotal += aRoundContracts[0];
            SetStatistic(statKey, winningBidTotal);
            if (aRoundScores[0] > 0) {
                statKey = 'stat_winningbid_count_' + curDifficulty + doubleDeckString;
            } else {
                statKey = 'stat_notwinningbid_count_' + curDifficulty + doubleDeckString;
            }
            var curTotal = GetStatistic(statKey);
            curTotal += 1;
            SetStatistic(statKey, curTotal);
        }
        if (aRoundCountersTaken[0] > -1) {
            var statKey = 'stat_counters_' + bidString + '_total_' + curDifficulty + doubleDeckString;
            var curTotal = GetStatistic(statKey);
            curTotal += aRoundCountersTaken[0];
            SetStatistic(statKey, curTotal);
            statKey = 'stat_counters_' + bidString + '_count_' + curDifficulty + doubleDeckString;
            curTotal = GetStatistic(statKey);
            curTotal += 1;
            SetStatistic(statKey, curTotal);
        }
        if (aRoundScores[0] >= 0) {
            var statKey = 'stat_roundscores_' + bidString + '_total_' + curDifficulty + doubleDeckString;
            var curTotal = GetStatistic(statKey);
            curTotal += aRoundScores[0];
            SetStatistic(statKey, curTotal);
            statKey = 'stat_roundscores_' + bidString + '_count_' + curDifficulty + doubleDeckString;
            curTotal = GetStatistic(statKey);
            curTotal += 1;
            SetStatistic(statKey, curTotal);
        }

        game.currentMoveStage = 'AcceptingRoundScores';
        RememberLatestGameState();
        this.ShowRoundResultWithDelay(500);
    }

    this.ShowRoundResultWithDelay = function(delay) {
        setTimeout(function(){
            HideTrumpIndicator();
            for (var i=0; i<4; i++) {
                document.getElementById('player_score_' + game.players[i].playerPosition).innerText = "";
            }
            
            UpdateRoundScoresViewText();
            
            var roundResultView = document.getElementById('round_result_view');
            with (roundResultView.style) {
                transition = "none";
                transitionDelay = "none";
                opacity = 1;
                visibility = 'visible';
                transform = 'translate(-50%,-50%) scale(0)';
            }
            setTimeout(function(){
                with (roundResultView.style) {
                    transition = "0.3s linear";
                    transform = 'translate(-50%,-50%) scale(1)';
                }    
            },150);
        }, delay);
    }

    function HideRoundResultView() {
        var roundResultView = document.getElementById('round_result_view');
        with (roundResultView.style) {
            transition = "0.3s linear";
            transitionDelay = "none";
            opacity = 0;
            visibility = 'hidden';
        }
    }

    function UpdateRoundScoresViewText() {
        var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
        
        document.getElementById('round_result_title').innerText = "Round " + game.roundScores.length;  
        document.getElementById('round_result_names_north_south').innerHTML = "You &<br>" + game.players[2].name;
        document.getElementById('round_result_names_east_west').innerHTML = game.players[1].name + " & " + game.players[3].name;

        var roundContract = game.roundContracts[game.roundContracts.length-1];
        var bid = isUsingScoreMultiplier ? roundContract[0]*10 : roundContract[0];
        document.getElementById('round_result_bid_north_south').innerText = bid > 0 ? "(" + bid + ")" : "";
        bid = isUsingScoreMultiplier ? roundContract[1]*10 : roundContract[1];
        document.getElementById('round_result_bid_east_west').innerText = bid > 0 ? "(" + bid + ")" : "";

        var roundMelds = game.roundMelds[game.roundMelds.length-1];
        var meld = isUsingScoreMultiplier ? roundMelds[0]*10 : roundMelds[0];
        document.getElementById('round_result_melds_north_south').innerText = meld;
        meld = isUsingScoreMultiplier ? roundMelds[1]*10 : roundMelds[1];
        document.getElementById('round_result_melds_east_west').innerText = meld;

        var roundCounters = game.roundCountersTaken[game.roundCountersTaken.length-1];
        if (roundCounters[0] == -1) {
            document.getElementById('round_result_counters_north_south').style.fontSize = "12px";
            document.getElementById('round_result_counters_north_south').innerText = "throw in";
        } else {
            document.getElementById('round_result_counters_north_south').style.fontSize = "20px";
            document.getElementById('round_result_counters_north_south').innerText = isUsingScoreMultiplier ? roundCounters[0]*10 : roundCounters[0];
        }
        if (roundCounters[1] == -1) {
            document.getElementById('round_result_counters_east_west').style.fontSize = "12px";
            document.getElementById('round_result_counters_east_west').innerText = "throw in";
        } else {
            document.getElementById('round_result_counters_east_west').style.fontSize = "20px";
            document.getElementById('round_result_counters_east_west').innerText = isUsingScoreMultiplier ? roundCounters[1]*10 : roundCounters[1];
        }

        var roundScores = game.roundScores[game.roundScores.length-1];
        if (roundScores[0] >= 0) {
            document.getElementById('round_result_totals_north_south').innerText = isUsingScoreMultiplier ? "+" + roundScores[0]*10 : "+" + roundScores[0];
        } else {
            document.getElementById('round_result_totals_north_south').innerText = isUsingScoreMultiplier ? roundScores[0]*10 : roundScores[0];
        }
        if (roundScores[1] >= 0) {
            document.getElementById('round_result_totals_east_west').innerText = isUsingScoreMultiplier ? "+" + roundScores[1]*10 : "+" + roundScores[1];
        } else {
            document.getElementById('round_result_totals_east_west').innerText = isUsingScoreMultiplier ? roundScores[1]*10 : roundScores[1];
        }
    }

    this.OnAcceptRoundResultButtonPressed = function() {
        var roundResultView = document.getElementById('round_result_view');
        with (roundResultView.style) {
            transition = "0.3s linear";
            transitionDelay = "none";
            opacity = 0;
            visibility = 'hidden';
        }

        scoreboard.UpdateScoresAfterRound();
    }

    this.OnFinishedAnimatingUpdateGameScoreboard = function() {
        
        var winner = this.TryToGetWinningPlayer();
        if (winner !== null) {
            this.OnGameOver(winner);
        } else {
            this.AnimateDealCardsForRound();
        }
    }

    this.TryToGetWinningPlayer = function() {
        var southPlayer = game.players[0];
        var westPlayer = game.players[1];
        if (southPlayer.gameScore >= this.winningScore && westPlayer.gameScore >= this.winningScore) {
            // If both sides reach winning score on the same hand, the bidding side wins.
            if (this.currentHighestBidder.playerPosition == 'South' || this.currentHighestBidder.playerPosition == 'North') {
                return southPlayer;
            } else {
                return westPlayer;
            }
        } else if (southPlayer.gameScore >= this.winningScore) {
            return southPlayer;
        } else if (westPlayer.gameScore >= this.winningScore) {
            return westPlayer;
        }
        return null;
    }

    this.OnGameOver = function(winner) {
        var gameOverLine1 = "";
        var gameOverLine2 = "";
        var doubleDeckString = "";
        if (game.isDoubleDeck) {
            doubleDeckString = "_DoubleDeck";
        }
        if (winner.playerPosition == 'South') {
            var statKey = 'stat_wins_' + game.skillLevel + doubleDeckString;
            var curTotal = GetStatistic(statKey);
            curTotal +=1 ;
            SetStatistic(statKey, curTotal);
            gameOverLine1 = "You won!";
            gameOverLine2 = "vs the " + this.skillLevel.toLowerCase() + " players";
            
        } else {
            var statKey = 'stat_losses_' + game.skillLevel + doubleDeckString;
            var curTotal = GetStatistic(statKey);
            curTotal +=1 ;
            SetStatistic(statKey, curTotal);
            gameOverLine1 = "You lost";
            gameOverLine2 = "vs the " + this.skillLevel.toLowerCase() + " players";
        }

        HideHintButton();
        HideMenuButton();
        HideUndoButton();
        HideRedoButton();
        HideAllMessages();

        var gameOverView = document.getElementById('GameOverView');
        var gameOverLine1Elem = document.getElementById('GameOverResultText');
        gameOverLine1Elem.innerText = gameOverLine1;
        var gameOverLine2Elem = document.getElementById('GameOverResultText2');
        gameOverLine2Elem.innerText = gameOverLine2;
        with (gameOverView.style) {
            transition = 'none';
            transform = 'translate(-50%,-50%) scale(0)';
            top = "50%";
            opacity = 1;
            visibility = 'visible';
        }   
        setTimeout(function() {
            with (gameOverView.style) {
                transition = "0.5s ease-out";
                transform = 'translate(-50%,-50%) scale(1)';
            }
        }, 300); 
        setTimeout(function() {
            with (gameOverView.style) {
                transition = "0.5s ease-in";
                transform = 'translate(-50%,-50%) scale(1)';
                top = "-200px";
            }
            scoreboard.SlideUp();

            ShowMainMenu(false);
            ShowTitle();
            
        }, 7000);

        this.AnimateGameOverCardAnimations();
    }

    this.AnimateGameOverCardAnimations = function() {
        var curAnimationId = GetTotalGamesPlayed();
        var totalAnimationsAvailable = 4;
        var cardAnimStartDelay = 1000;
        switch (curAnimationId%totalAnimationsAvailable) {
            case 0:
            {
                // Gravity Bouncing
                
                var startLeft = 200;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";
                
                    var totalTime = 9;
                    var curTime = 0;
                    var deltaTime = 0.1;
                    var gravity = [0, 200];
                    var curVelocity = [200*deltaTime, 0];
                    var curPositionX = startLeft;
                    var curPositionY = startTop;
                    var isFallingOutOfView = false;
                    var bottomBounceY = window.innerHeight - cardLoweredHeight;
                    while (curTime < totalTime) {
                        var percentComplete = 100 * curTime / totalTime;
                        keyframesText = keyframesText + percentComplete + '% {opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                        
                        curPositionX = curPositionX + curVelocity[0];
                        curPositionY = curPositionY + curVelocity[1];
                        curVelocity[0] = curVelocity[0] + gravity[0]*deltaTime;
                        curVelocity[1] = curVelocity[1] + gravity[1]*deltaTime;
                        
                        isFallingOutOfView = totalTime - curTime < 1;

                        // Bounce
                        var bounceDampen = 0.75;
                        if (!isFallingOutOfView) {
                            if (curPositionY > bottomBounceY) {
                                var overshoot = curPositionY - bottomBounceY;
                                curPositionY = bottomBounceY;
                                curVelocity[1] = curVelocity[1] - gravity[1]*deltaTime;
                                curVelocity[1] = -curVelocity[1]*bounceDampen;
                            }
                        }
                        if (curPositionX < 0 || curPositionX > window.innerWidth-cardLoweredWidth) {
                            curPositionX = curPositionX - curVelocity[0];
                            curVelocity[0] = curVelocity[0] - gravity[0]*deltaTime;
                            curVelocity[0] = -curVelocity[0];
                        }
                                
                        curTime += deltaTime;
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }

            }
            break;

            case 1:
            {
                // Gravity Bouncing off game over view
                                
                var startLeft = window.innerWidth*0.5 - 200;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";

                    var totalTime = 9;
                    var curTime = 0;
                    var deltaTime = 0.1;
                    var gravity = [0, 200];
                    var curVelocity = [200*deltaTime, 0];
                    var curPositionX = startLeft;
                    var curPositionY = startTop;
                    var isFallingOutOfView = false;
                    var bottomBounceY = window.innerHeight - cardLoweredHeight;
                    var gameOverViewWidth = 340;
                    var gameOverViewHeight = 100;
                    var gameOverViewLeft = (window.innerWidth - gameOverViewWidth)*0.5 - cardLoweredWidth*0.5;
                    var gameOverViewRight = gameOverViewLeft + gameOverViewWidth + cardLoweredWidth*0.5;
                    var gameOverViewTop = (window.innerHeight - gameOverViewHeight)*0.5 - cardLoweredHeight*1.1;

                    while (curTime < totalTime) {
                        var percentComplete = 100 * curTime / totalTime;
                        keyframesText = keyframesText + percentComplete + '% {opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                        
                        var prevPositionY = curPositionY;
                        curPositionX = curPositionX + curVelocity[0];
                        curPositionY = curPositionY + curVelocity[1];
                        curVelocity[0] = curVelocity[0] + gravity[0]*deltaTime;
                        curVelocity[1] = curVelocity[1] + gravity[1]*deltaTime;
                        
                        isFallingOutOfView = totalTime - curTime < 1;

                        // Bounce
                        var bounceDampen = 0.75;
                        if (!isFallingOutOfView) {
                            if (curPositionY > bottomBounceY) {
                                curPositionY = bottomBounceY;
                                curVelocity[1] = curVelocity[1] - gravity[1]*deltaTime;
                                curVelocity[1] = -curVelocity[1]*bounceDampen;
                            } else {
                                // Bounce off game over view
                                if (curPositionX > gameOverViewLeft &&
                                    curPositionX < gameOverViewRight &&
                                    prevPositionY <= gameOverViewTop &&
                                    curPositionY > gameOverViewTop
                                    ) 
                                {
                                    curPositionY = gameOverViewTop;
                                    curVelocity[1] = curVelocity[1] - gravity[1]*deltaTime;
                                    curVelocity[1] = -curVelocity[1]*bounceDampen;    
                                }
                            }
                        }
                        if (curPositionX < 0 || curPositionX > window.innerWidth-cardLoweredWidth) {
                            curPositionX = curPositionX - curVelocity[0];
                            curVelocity[0] = curVelocity[0] - gravity[0]*deltaTime;
                            curVelocity[0] = -curVelocity[0];
                        }
                                
                        curTime += deltaTime;
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }
            }
            break;

            case 2:
            {
                // Spiral into center
                var totalTime = 7;       
                var startLeft = window.innerWidth*0.5 - 200;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";

                    var fullAngle = Math.PI * 2 * 4.25;
                    var spinCenterX = window.innerWidth*0.5;
                    var spinCenterY = window.innerHeight*0.5;
                    var radius = Math.sqrt((spinCenterY - startTop)*(spinCenterY - startTop) + (spinCenterX - startLeft)*(spinCenterX - startLeft));
                    for (var angle = fullAngle; angle >= 0; angle-=0.15) {
                        var percentComplete = 100 * (1 - (angle / fullAngle));
                        
                        var curPositionX = radius*Math.cos(-angle) + spinCenterX - cardLoweredWidth*0.5;
                        var curPositionY = radius*Math.sin(-angle) + spinCenterY - cardLoweredHeight*0.5;
                        keyframesText = keyframesText + percentComplete + '% { opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                        radius*=0.985;
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }
            }
            break;

            case 3:
            {
                // Spiral out from center
                var slideInTime = 0.5;
                var totalTime = 7;       
                var startLeft = window.innerWidth*0.5 - cardLoweredWidth*0.5;
                var startTop = -cardLoweredHeight - 30;
                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    flipDownCard(cardView, false);
                    raiseCard(cardView);
                    with (cardView.style) {
                        transition = 'none';
                        transform = 'none';
                        visibility = 'visible';
                        zIndex = i;
                        left = startLeft + 'px';
                        top = startTop + 'px';
                    }
                }

                for (var i=0; i<cards.length; i++) {
                    var cardView = cards[i].cardView;
                    var sheet = document.createElement('style');
                    var keyframesText = "@keyframes gameOverAnim" + i + " {";

                    var slideInPercent = slideInTime / (slideInTime + totalTime);
                    keyframesText = keyframesText + (slideInPercent*100) + '% { opacity: 1; left: ' + (spinCenterX - cardLoweredWidth*0.5) + 'px; top: ' + (spinCenterY - cardLoweredHeight*0.5) + 'px;}';
                    
                    var fullAngle = Math.PI * 2 * 4.25;
                    var spinCenterX = window.innerWidth*0.5;
                    var spinCenterY = window.innerHeight*0.5;
                    var fullRadius = Math.sqrt((spinCenterY - startTop)*(spinCenterY - startTop) + (spinCenterX - startLeft)*(spinCenterX - startLeft));
                    for (var angle = 0.01; angle < fullAngle; angle+=0.15) {
                        var percentComplete = (angle / fullAngle) * (1-slideInPercent);
                    
                        var radius = (angle/fullAngle)*fullRadius;
                        var curPositionX = radius*Math.cos(-angle) + spinCenterX - cardLoweredWidth*0.5;
                        var curPositionY = radius*Math.sin(-angle) + spinCenterY - cardLoweredHeight*0.5;
                        keyframesText = keyframesText + ((slideInPercent + percentComplete)*100) + '% { opacity: 1; left: ' + curPositionX + 'px; top: ' + curPositionY + 'px;}';
                    }
                    
                    keyframesText = keyframesText + '100% { opacity: 0; left: ' + startLeft + 'px; top: ' + startTop + 'px;}';
                    keyframesText += '}';
                    sheet.textContent = keyframesText;
                    cardView.appendChild(sheet);
                    cardView.addEventListener('animationend', 
                    function(event) { 
                        event.target.style.animation = '';
                        if (event.target.children.length > 1) {
                            event.target.removeChild(event.target.children[1]);
                        }
                    }, false);
                    cardView.style.animation = 'gameOverAnim' + i + ' ' + totalTime + 's linear ' + (i*100 + cardAnimStartDelay) + 'ms 1';
                }
            }
            break;
        }
    }

    this.OnScoreboardClick = function() {
        scoreboard.OnClick();
    }

    var undoGameStates = [];
    var redoGameStates = [];

    var RememberLatestGameState = function() {
        var gameState = CreateGameStateString();
        undoGameStates.push(gameState);
        var delay = 0;
        if (game.gameState == 'AcceptingRoundScores') {
            delay = 700;
        }
        if (undoGameStates.length > 1) {
            var undoOn = GetSetting('setting_undo');
            if (game.skillLevel == 'Easy' || undoOn) {
                ShowUndoButton(delay);
            }
        }
        redoGameStates = [];
        HideRedoButton();
    }

    function GetUndoButtonPosition() {
        var leftPos = GetHandCardLocation('South', 0, 14);
        if (game.currentMoveStage == 'AcceptingMelds') {
            return [leftPos[0], leftPos[1]-60];
        } else {
            return [leftPos[0], leftPos[1]-90];
        }
    }

    function GetRedoButtonPosition() {
        var leftPos = GetHandCardLocation('South', 0, 14);
        if (game.currentMoveStage == 'AcceptingMelds') {
            return [leftPos[0] + 90, leftPos[1]-60];
        } else {
            return [leftPos[0] + 90, leftPos[1]-90];
        }
    }

    function RepositionUndoButtons() {
        var button = document.getElementById('undo_button');
        button.positionFunction = "GetUndoButtonPosition()";
        button.style.transition = '0.3s ease-out';
        var loc = eval(button.positionFunction);
        button.style.left = loc[0] + 'px';
        button.style.top = loc[1] + 'px';

        button = document.getElementById('redo_button');
        button.positionFunction = "GetRedoButtonPosition()";
        button.style.transition = '0.3s ease-out';
        var loc = eval(button.positionFunction);
        button.style.left = loc[0] + 'px';
        button.style.top = loc[1] + 'px';
    }

    function ShowUndoButton(delay) {
        var button = document.getElementById('undo_button');
        button.positionFunction = "GetUndoButtonPosition()";
        button.style.transition = "none";
        var loc = eval(button.positionFunction);
        button.style.left = loc[0] + 'px';
        button.style.top = loc[1] + 'px';
        button.style.visibility = 'visible';
        button.style.pointerEvents = "auto";
        setTimeout(function () {
            button.style.transition = "0.5s linear";
            button.style.opacity = 1;
            setTimeout(function() {
                button.style.transition = "none";
            }, 600);
        }, delay);
    }

    this.UpdateShowUndoButton = function() {
        if (game == null || game.players.length == 0) {
            return;
        }

        var undoOn = GetSetting('setting_undo');
        if (game.skillLevel == 'Easy' || undoOn) {
            if (undoGameStates.length > 1) {
                ShowUndoButton(0);
            } else {
                HideUndoButton();
            }
            if (redoGameStates.length > 0) {
                ShowRedoButton(0);
            } else {
                HideRedoButton();
            }
        } else {
            HideUndoButton();
            HideRedoButton();
        }
    }

    function HideUndoButton() {
        var button = document.getElementById('undo_button');
        button.style.opacity = 0;
        button.style.pointerEvents = "none";
    }

    this.OnUndoButtonClick = function () {
        if (undoGameStates.length > 1) {
            var undoState = undoGameStates.pop();            
            redoGameStates.push(undoState);
            var curState = undoGameStates[undoGameStates.length-1];
            LoadGameState(curState);
            ShowRedoButton();
            if (undoGameStates.length == 1) {
                HideUndoButton();
            }
        }
    }

    function ShowRedoButton(delay) {
        var button = document.getElementById('redo_button');
        button.positionFunction = "GetRedoButtonPosition()";
        button.style.transition = "none";
        var loc = eval(button.positionFunction);
        button.style.left = loc[0] + 'px';
        button.style.top = loc[1] + 'px';
        button.style.visibility = 'visible';
        button.style.pointerEvents = "auto";
        setTimeout(function () {
            button.style.transition = "0.5s linear";
            button.style.opacity = 1;
            setTimeout(function() {
                button.style.transition = "none";
            }, 600);
        }, delay);
    }

    function HideRedoButton() {
        var button = document.getElementById('redo_button');
        button.style.opacity = 0;
        button.style.pointerEvents = "none";
    }

    this.OnRedoButtonClick = function () {
        if (redoGameStates.length>0) {
            var redoState = redoGameStates.pop();
            undoGameStates.push(redoState);
            LoadGameState(redoState);
            if (redoGameStates.length == 0) {
                HideRedoButton();
            }
            ShowUndoButton(0);
        }
    }

    function HideAllMessages() {
        var viewsToHide = [
            'player_name_South',
            'player_name_West',
            'player_name_North',
            'player_name_East',
            'player_thinking_West',
            'player_thinking_North',
            'player_thinking_East',
            'bid_view_West',
            'bid_view_North',
            'bid_view_East',
            'bid_view_South',
            'player_score_South',
            'player_score_West',
            'player_score_North',
            'player_score_East',
            'hint_button',
            'undo_button',
            'redo_button',
            'player_play_prompt',
            'round_simulations_view',
            'choose_bid_view',
            'confirm_passing_cards_button',
            'select_passing_cards_message',
            'select_passing_cards_region_0',
            'select_passing_cards_region_1',
            'select_passing_cards_region_2',
            'select_passing_cards_region_3',
            'meld_view_West',
            'meld_view_North',
            'meld_view_East',
            'meld_view_South',
            'accept_meld_view',
            'trick_score_bubble',
            'accept_trick_result'
            ];
        for (var i = 0; i < viewsToHide.length; i++) {
            var view = document.getElementById(viewsToHide[i]);
            view.style.transition = "none";
            view.style.opacity = 0;
            view.style.visibility = 'hidden';
        }
    }

    this.OnResizeWindow = function() {

        var ease = "0.4s ease-out";

        // Reposition all the cards
        for (var i = 0; i < allCards.length; i++) {
            var cardView = allCards[i].cardView;
            if (cardView.positionFunction !== undefined) {
                var position = eval(cardView.positionFunction);
                cardView.style.left = position[0] + "px";
                cardView.style.top = position[1] + "px";
                cardView.style.transform = 'rotate(' + position[2] + "deg)";
                cardView.style.transition = ease;
            }
        }

        // Reposition everything else
        var viewsToPosition = [
            'player_name_South',
            'player_name_West',
            'player_name_North',
            'player_name_East',
            'player_thinking_West',
            'player_thinking_North',
            'player_thinking_East',
            'bid_view_West',
            'bid_view_North',
            'bid_view_East',
            'bid_view_South',
            'player_score_South',
            'player_score_West',
            'player_score_North',
            'player_score_East',
            'hint_button',
            'undo_button',
            'redo_button',
            'player_play_prompt',
            'choose_bid_view',
            'trump_suit_indicator',
            'choose_trump_suit_view',
            'confirm_passing_cards_button',
            'select_passing_cards_message',
            'select_passing_cards_region_0',
            'select_passing_cards_region_1',
            'select_passing_cards_region_2',
            'select_passing_cards_region_3',
            'meld_view_West',
            'meld_view_North',
            'meld_view_East',
            'meld_view_South',
            'trick_score_bubble',
            'accept_trick_result'
        ];
        for (var i = 0; i < viewsToPosition.length; i++) {
            var view = document.getElementById(viewsToPosition[i]);
            if (view.positionFunction !== undefined) {
                view.style.transition = ease;
                var position = eval(view.positionFunction);
                view.style.left = position[0] + "px";
                view.style.top = position[1] + "px";
            }
        }
    }
}

//
// Async Workers
//
var worker = new Worker('GameSimulator.js');
worker.addEventListener('message', function(e){
    var data = e.data;
    switch (data.cmd) {
        case 'UpdateRoundSimulationsView':
            UpdateRoundSimulationsView(data.roundBidAnalysis);
        break;
        case 'PlayerFoundBestBid':
            var player = game.players[data.playerIndex];
            player.OnFinishedAnalyzingBestBid(data.bid, data.minimumEndTime);
        break;
    }
}, false);

function CreateClonableGameState(aGame) {
    return {
        'isDoubleDeck': aGame.isDoubleDeck,
        'leadIndex': aGame.leadIndex,
        'dealerIndex': aGame.dealerIndex,
        'turnIndex': aGame.turnIndex
    };
}

function CreateClonableCards(cards) {
    var cloneableCards = [];
    for (var i=0; i<cards.length; i++) {
        var card = cards[i];
        cloneableCards.push({ 
            id: card.id, 
            hash: card.hash, 
            deckID: card.deckID, 
            rank: card.rank, 
            value: card.value, 
            suit: card.suit, 
            suitInt: card.suitInt, 
            wasShown: card.wasShown, 
            wasPassed: card.wasPassed
         });
    }
    return cloneableCards;
}

//
// Simulations viewer
//
var histogramVisuals = [];
var histogramMinScore;
var histogramMaxVisibleScore;
var histogramBarWidth = 0;
var histogramBarsLeftOffset = 80;
var histogramRegionWidth = 450;

function CreateSimulationHistogramVisuals() {

    histogramVisuals = [];
    if (game.isDoubleDeck) {
        histogramMinScore = 40;
        histogramMaxVisibleScore = 105;
    } else {
        histogramMinScore = 10;
        histogramMaxVisibleScore = 55;
    }
    document.getElementById('round_simulations_subtitle').innerText = "This is the range of scores for your hand after many round simulations*";
    for (var i=0; i<4; i++) {
        var visuals = {};
        histogramVisuals.push(visuals);
        var histogramContainer = document.getElementById('round_simulations_histogram_' + i);
        while (histogramContainer.firstChild) {
            histogramContainer.removeChild(histogramContainer.firstChild);
        }

        var elem = document.createElement('div');
        elem.className = 'round_simulations_horizontal_axis';
        histogramContainer.appendChild(elem);

        for (var j=histogramMinScore+10; j<histogramMaxVisibleScore; j+=10) {
            elem = document.createElement('div');
            elem.className = 'round_simulations_horizontal_axis_label';
            elem.innerText = j;
            var leftOffset = histogramBarsLeftOffset + (histogramRegionWidth-histogramBarsLeftOffset)*(j-histogramMinScore)/(histogramMaxVisibleScore-histogramMinScore);
            elem.style = "left: " + leftOffset + "px";
            histogramContainer.appendChild(elem);
        }

        histogramBarWidth = Math.floor((histogramRegionWidth-histogramBarsLeftOffset)/(histogramMaxVisibleScore-histogramMinScore)-1);
        visuals.bars = [];
        for (var j=histogramMinScore; j<histogramMaxVisibleScore; j++) {
            elem = document.createElement('div');
            elem.className = 'round_simulations_bar';
            var leftOffset = histogramBarsLeftOffset + (histogramRegionWidth-histogramBarsLeftOffset)*(j-histogramMinScore)/(histogramMaxVisibleScore-histogramMinScore);
            elem.style = "left: " + leftOffset + "px; width: " + histogramBarWidth + "px; transform: scaleY(0);";
            histogramContainer.appendChild(elem);
            visuals.bars[j] = elem;
        }

        visuals.safeBidLine = document.createElement('div');
        visuals.safeBidLine.className = 'round_simulations_vertical_line';
        visuals.safeBidLine.style.left = '0px';
        visuals.safeBidLine.style.opacity = 0;
        histogramContainer.appendChild(visuals.safeBidLine);
        visuals.safeBidValue = document.createElement('div');
        visuals.safeBidValue.className = 'round_simulations_safe_bid_value';
        visuals.safeBidValue.style.left = '0px';
        visuals.safeBidValue.style.opacity = 0;
        visuals.safeBidValue.innerText = '21';
        histogramContainer.appendChild(visuals.safeBidValue);
        visuals.safeBidLabel = document.createElement('div');
        visuals.safeBidLabel.className = 'round_simulations_safe_bid_label';
        visuals.safeBidLabel.style.left = '0px';
        visuals.safeBidLabel.style.opacity = 0;
        visuals.safeBidLabel.innerText = 'Safe bid';
        histogramContainer.appendChild(visuals.safeBidLabel);

        visuals.suggestedBidLine = document.createElement('div');
        visuals.suggestedBidLine.className = 'round_simulations_vertical_line';
        visuals.suggestedBidLine.style.left = '450px;';
        visuals.suggestedBidLine.style.opacity = 0;
        histogramContainer.appendChild(visuals.suggestedBidLine);
        visuals.suggestedBidValue = document.createElement('div');
        visuals.suggestedBidValue.className = 'round_simulations_suggested_bid_value';
        visuals.suggestedBidValue.style.left = '450px';
        visuals.suggestedBidValue.style.opacity = 0;
        visuals.suggestedBidValue.innerText = '21';
        histogramContainer.appendChild(visuals.suggestedBidValue);
        visuals.suggestedBidLabel = document.createElement('div');
        visuals.suggestedBidLabel.className = 'round_simulations_suggested_bid_label';
        visuals.suggestedBidLabel.style.left = '450px';
        visuals.suggestedBidLabel.style.opacity = 0;
        visuals.suggestedBidLabel.innerText = 'Suggested bid';
        histogramContainer.appendChild(visuals.suggestedBidLabel);

        visuals.suitImage = document.createElement('img');
        visuals.suitImage.className = 'round_simulations_suit_image';
        histogramContainer.appendChild(visuals.suitImage);
    }
}

function UpdateRoundSimulationsView(roundBidAnalysis) {
    var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
    document.getElementById('round_simulations_subtitle').innerText = "This is the range of scores for your hand after " + roundBidAnalysis.simulationsCount + " round simulations*";
    
    // Sort to find the descending indices
    var suits = ['S','H','C','D'];
    var indices = [0,0,0,0];
    var suggestedBids = [0,0,0,0];
    for (var i=0; i<4; i++){
        indices[i] = i;
        suggestedBids[i] = roundBidAnalysis.suggestedBids[i];
    }
    for (var i=0; i<4; i++) {
        for (var j=0; j<4; j++) {
            if (suggestedBids[j] < suggestedBids[i]) {
                var tmp1 = suggestedBids[i];
                var tmp2 = indices[i];
                suggestedBids[i] = suggestedBids[j];
                indices[i] = indices[j];
                suggestedBids[j] = tmp1;
                indices[j] = tmp2;
            }
        }
    }

    for (var idx=0; idx<4; idx++) {
        var curSuit = suits[indices[idx]];
        var visuals = histogramVisuals[idx];
        switch (curSuit) {
            case 'S':
                visuals.suitImage.src = 'images/score_spade.png';
                break;
            case 'H':
                visuals.suitImage.src = 'images/score_heart.png';
                break;
            case 'D':
                visuals.suitImage.src = 'images/score_diamond.png';
                break;
            case 'C':
                visuals.suitImage.src = 'images/score_club.png';
                break;
        }

        var roundScoresHistogram = roundBidAnalysis.histogramsBySuit[curSuit];
        
        // Find the max count
        var maxHistogramCount = 10;
        for (var i=0; i<=histogramMaxVisibleScore; i++) {
            if (roundScoresHistogram[i] == null) {
                continue;
            }
            var histogramCountForScore = roundScoresHistogram[i];
            if (histogramCountForScore > maxHistogramCount) {
                maxHistogramCount = histogramCountForScore;
            }
        }

        // Draw all the histogram bars
        for (var i=0; i<histogramMaxVisibleScore; i++) {
            if (visuals.bars[i] == null) {
                continue;
            }
            var bar = visuals.bars[i];
            if (roundScoresHistogram[i] == null) {
                bar.style.transform = 'scaleY(0)';
            } else {
                var score = roundScoresHistogram[i];
                var percent = score/maxHistogramCount;
                bar.style.transform = 'scaleY(' + percent + ')';
            }
        }

        var safeBid = roundBidAnalysis.safeBids[indices[idx]];
        var leftOffset = histogramBarsLeftOffset + (histogramRegionWidth-histogramBarsLeftOffset)*(safeBid-histogramMinScore)/(histogramMaxVisibleScore-histogramMinScore) + histogramBarWidth/2;
        visuals.safeBidLine.style.left = leftOffset + 'px';
        visuals.safeBidLine.style.opacity = 1;
        visuals.safeBidValue.innerText = safeBid;
        visuals.safeBidValue.style.left = leftOffset + 'px';
        visuals.safeBidValue.style.opacity = 1;
        visuals.safeBidLabel.style.left = leftOffset + 'px';
        visuals.safeBidLabel.style.opacity = 1;

        var suggestedBid = roundBidAnalysis.suggestedBids[indices[idx]];
        leftOffset = histogramBarsLeftOffset + (histogramRegionWidth-histogramBarsLeftOffset)*(suggestedBid-histogramMinScore)/(histogramMaxVisibleScore-histogramMinScore) + histogramBarWidth/2;
        visuals.suggestedBidLine.style.left = leftOffset + 'px';
        visuals.suggestedBidLine.style.opacity = 1;
        visuals.suggestedBidValue.innerText = suggestedBid;
        visuals.suggestedBidValue.style.left = leftOffset + 'px';
        visuals.suggestedBidValue.style.opacity = 1;
        visuals.suggestedBidLabel.style.left = leftOffset + 'px';
        visuals.suggestedBidLabel.style.opacity = 1;
    }
}

function ShowRoundSimulationsView() {
    
    CreateSimulationHistogramVisuals();

    worker.postMessage({
        'cmd': 'FindRoundBidAnalysis', 
        'gameState': CreateClonableGameState(game),
        'passingCardsCount': GetSetting('setting_passing_cards_count'),
        'playerSkill': 'Pro',
        'playerIndex': 0,
        'playerCards': CreateClonableCards(game.players[0].cards),
        'simulationsPerSuit': 1000,
        'isForSimulationView': true
    });
    
    var elem = document.getElementById('round_simulations_view');
    with (elem.style) {
        transition = 'none';
        transform = 'translate(-50%, -50%) scale(0)';
        opacity = 1;
        visibility = 'visible';
    }
    setTimeout(function(){
        with (elem.style) {
            transition = '0.3s linear';
            transform = 'translate(-50%, -50%) scale(1)';
        }
    }, 100);
}

function HideRoundSimulationsView() {
    var elem = document.getElementById('round_simulations_view');
    with (elem.style) {
        transition = '0.3s linear';
        transform = 'translate(-50%, -' + window.innerHeight + 'px) scale(1)';
        visibility = 'hidden';
    }
}
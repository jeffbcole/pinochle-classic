var Scoreboard = function () {
    
    this.isExpanded = false;
    this.isSlidDown = false;

    this.Initialize = function() {
        var difficultyView = document.getElementById('scoreboardDifficulty');
        difficultyView.innerHTML = game.skillLevel;
        document.getElementById('scoreboardNameNorthSouth').innerText = "You &\n" + game.players[2].name; 
        document.getElementById('scoreboardNameEastWest').innerText = game.players[1].name + " & " + game.players[3].name; 
        
        this.UpdateForScoreMultiplier();
    }

    this.UpdateForScoreMultiplier = function() {
        var isBidVisible = false;
        var isMeldVisible = false;
        var isCountersVisible = false;
        switch (game.currentMoveStage) {
            case 'ChoosingTrumpSuit':
                isBidVisible = true;
                break;
            case 'ChoosingPassCards':
                isBidVisible = true;
                break;
            case 'AcceptingMelds':
                isBidVisible = true;
                isMeldVisible = true;
                break;
            case 'ChoosingTrickCard':
            case 'AcceptingRoundScores':
                isBidVisible = true;
                isMeldVisible = true;
                isCountersVisible = true;
                break;
            default:
                break;
        }

        this.UpdateScores(isBidVisible, isMeldVisible, isCountersVisible);
    }

    this.OnClick = function() {
        if (this.isExpanded) {
            this.Contract();
        } else {
            this.Expand();
        }
        
    }

    this.Expand = function() {
        if (this.isExpanded) {
            return;
        }

        if (game != null && game.roundScores.length == 0) {
            return;
        }

        this.isExpanded = true;

        var singleRoundWidth = 150;
        var roundScoresLeftMargin = 5;
        var roundScoresRowHeight = 20;
        var scoreboardBackground = document.getElementById('scoreboardBackground');
        var container = document.getElementById('scoreboardRoundScoresRegion');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        for (var i=0; i<game.roundScores.length; i++) {
            var roundSeparator = document.createElement('div');
            roundSeparator.className = 'scoreboardRoundEntrySeparator';
            roundSeparator.style.left = i*singleRoundWidth + roundScoresLeftMargin + 'px';
            container.appendChild(roundSeparator);

            var roundNumber = document.createElement('div');
            roundNumber.className = 'scoreboardRoundNumber';
            roundNumber.style.left = i*singleRoundWidth + roundScoresLeftMargin + 'px';
            roundNumber.innerText = "Round " + (i+1);
            container.appendChild(roundNumber);

            var roundPlayerName = document.createElement('div');
            roundPlayerName.className = 'scoreboardRoundNameNorthSouth';
            roundPlayerName.style.left = i*singleRoundWidth + roundScoresLeftMargin + 5 + 'px';
            roundPlayerName.innerHTML = 'Y&' + game.players[2].name.charAt(0);
            container.appendChild(roundPlayerName);

            roundPlayerName = document.createElement('div');
            roundPlayerName.className = 'scoreboardRoundNameEastWest';
            roundPlayerName.style.left = i*singleRoundWidth + roundScoresLeftMargin + 75 + 'px';
            roundPlayerName.innerHTML = game.players[1].name.charAt(0) + '&' + game.players[3].name.charAt(0);
            container.appendChild(roundPlayerName);

            var roundLabel = document.createElement('div');
            roundLabel.className = 'scoreboardRoundLabel';
            roundLabel.style.left = i*singleRoundWidth + roundScoresLeftMargin + 'px';
            roundLabel.style.top = 60 + 'px';
            roundLabel.innerHTML = 'Bid';
            container.appendChild(roundLabel);

            roundLabel = document.createElement('div');
            roundLabel.className = 'scoreboardRoundLabel';
            roundLabel.style.left = i*singleRoundWidth + roundScoresLeftMargin + 'px';
            roundLabel.style.top = 60 + roundScoresRowHeight + 'px';
            roundLabel.innerHTML = 'Meld';
            container.appendChild(roundLabel);

            roundLabel = document.createElement('div');
            roundLabel.className = 'scoreboardRoundLabel';
            roundLabel.style.left = i*singleRoundWidth + roundScoresLeftMargin + 'px';
            roundLabel.style.top = 60 + 2*roundScoresRowHeight + 'px';
            roundLabel.innerHTML = 'Ctrs';
            container.appendChild(roundLabel);

            var roundContracts = game.roundContracts[i];
            var roundValue = document.createElement('div');
            roundValue.className = 'scoreboardRoundValueNorthSouth';
            roundValue.style.left = i*singleRoundWidth + roundScoresLeftMargin + 'px';
            roundValue.style.top = 60 + 'px';
            roundValue.innerHTML = roundContracts[0] > 0 ? '(' + roundContracts[0] + ')' : "";
            container.appendChild(roundValue);

            roundValue = document.createElement('div');
            roundValue.className = 'scoreboardRoundValueEastWest';
            roundValue.style.left = i*singleRoundWidth + roundScoresLeftMargin + 80 + 'px';
            roundValue.style.top = 60 + 'px';
            roundValue.innerHTML = roundContracts[1] > 0 ? '(' + roundContracts[1] + ')' : "";
            container.appendChild(roundValue);

            var roundMelds = game.roundMelds[i];
            roundValue = document.createElement('div');
            roundValue.className = 'scoreboardRoundValueNorthSouth';
            roundValue.style.left = i*singleRoundWidth + roundScoresLeftMargin + 'px';
            roundValue.style.top = 60 + roundScoresRowHeight + 'px';
            roundValue.innerHTML = roundMelds[0] > 0 ? + roundMelds[0] : "";
            container.appendChild(roundValue);

            roundValue = document.createElement('div');
            roundValue.className = 'scoreboardRoundValueEastWest';
            roundValue.style.left = i*singleRoundWidth + roundScoresLeftMargin + 80 + 'px';
            roundValue.style.top = 60 + roundScoresRowHeight + 'px';
            roundValue.innerHTML = roundMelds[1] > 0 ? roundMelds[1] : "";
            container.appendChild(roundValue);

            var roundCounters = game.roundCountersTaken[i];
            roundValue = document.createElement('div');
            roundValue.className = 'scoreboardRoundValueNorthSouth';
            roundValue.style.left = i*singleRoundWidth + roundScoresLeftMargin + 'px';
            roundValue.style.top = 60 + 2*roundScoresRowHeight + 'px';
            roundValue.innerHTML = roundCounters[0] >= 0 ? + roundCounters[0] : "-";
            container.appendChild(roundValue);

            roundValue = document.createElement('div');
            roundValue.className = 'scoreboardRoundValueEastWest';
            roundValue.style.left = i*singleRoundWidth + roundScoresLeftMargin + 80 + 'px';
            roundValue.style.top = 60 + 2*roundScoresRowHeight + 'px';
            roundValue.innerHTML = roundCounters[1] >= 0 ? roundCounters[1] : "-";
            container.appendChild(roundValue);

            var roundTotalDivider = document.createElement('div');
            roundTotalDivider.className = 'scoreboardRoundHorizontalDivider';
            roundTotalDivider.style.left = i*singleRoundWidth + roundScoresLeftMargin + 5 + 'px';
            roundTotalDivider.style.top = 65 + 3*roundScoresRowHeight + 'px';
            container.appendChild(roundTotalDivider);

            var roundScores = game.roundScores[i];
            var roundScore = document.createElement('div');
            roundScore.className = 'scoreboardRoundScoreNorthSouth';
            roundScore.style.left = i*singleRoundWidth + roundScoresLeftMargin + 'px';
            roundScore.style.top = 65 + 3*roundScoresRowHeight + 10 + 'px';
            roundScore.innerHTML = roundScores[0] > 0 ? "+" + roundScores[0] : roundScores[0];
            container.appendChild(roundScore);

            roundScore = document.createElement('div');
            roundScore.className = 'scoreboardRoundScoreEastWest';
            roundScore.style.left = i*singleRoundWidth + roundScoresLeftMargin + 80 + 'px';
            roundScore.style.top = 65 + 3*roundScoresRowHeight + 10 + 'px';
            roundScore.innerHTML = roundScores[1] > 0 ? "+" + roundScores[1] : roundScores[1];
            container.appendChild(roundScore);
        }

        var containerWidth = singleRoundWidth*game.roundScores.length + roundScoresLeftMargin;
        container.scrollLeft = containerWidth;
        if (containerWidth + 400 > window.innerWidth) {
            containerWidth = window.innerWidth - 400;
        }
        container.style.width = containerWidth + "px";
        with (scoreboardBackground.style) {
            transition = "0.3s linear";
            background = "#000000BB";
            width = 200 + containerWidth + "px";
            height = 160 + 'px';
        }
        
        var scoreboard = document.getElementById('scoreboard');
        scoreboard.style.zIndex = 1000;
    }

    this.Contract = function() {
        if (!this.isExpanded) {
            return;
        }
        this.isExpanded = false;

        var scoreboard = document.getElementById('scoreboard');
        with (scoreboard.style) {
            transition = "0.3s linear";
            zIndex = 999;
        }
        var scoreboardBackground = document.getElementById('scoreboardBackground');
        with (scoreboardBackground.style) {
            transition = "0.3s linear";
            background = "#00000077";
            width = "200px";
            height = currentScoreboardVisibleHeight + 'px';
        }
    }

    this.SlideDown = function() {
        if (this.isSlidDown) {
            return;
        }

        this.isSlidDown = true;
        var element = document.getElementById('scoreboard');
        with (element.style) {
            transition = "1s ease-in-out";
            top = "0px";
        }
    }

    this.SlideUp = function() {
        if (!this.isSlidDown) {
            return;
        }

        this.isSlidDown = false;
        var element = document.getElementById('scoreboard');
        with (element.style) {
            transition = "1s ease-in-out";
            top = "-152px";
        }

        this.Contract();

        var difficultyView = document.getElementById('scoreboardDifficulty');
        difficultyView.innerHTML = "";
    }

    var currentScoreboardVisibleHeight = 0;

    this.UpdateScores = function(isBidVisible, isMeldVisible, isCountersVisible) {
        
        if (game==null || game.players.length==0) {
            return;
        }

        var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');

        var score = game.players[0].gameScore;
        var scorePercent = 100*score/game.winningScore;
        document.getElementById('scoreboardScoreFillNorthSouth').style.width = scorePercent + "%";
        document.getElementById('scoreboardScoreNorthSouth').innerText = score;

        score = game.players[1].gameScore;
        scorePercent = 100*score/game.winningScore;
        document.getElementById('scoreboardScoreFillEastWest').style.width = scorePercent + "%";
        document.getElementById('scoreboardScoreEastWest').innerText = score;

        var rowHeight = 25;
        var frameHeight = 80;
        var isVerticalExpanded = false;
        var bidRow = document.getElementById('scoreboardRowBid');
        if (isBidVisible) {
            frameHeight += rowHeight;
            isVerticalExpanded = true;
            bidRow.style.visibility = 'visible';
            var bidNorthSouth = document.getElementById('scoreboardRowBidNorthSouth');
            var bidEastWest = document.getElementById('scoreboardRowBidEastWest');
            var currentRoundBid = game.players[game.bidWinner].currentRoundBid;
            if (isUsingScoreMultiplier) {
                currentRoundBid = currentRoundBid*10;
            }
            if (game.bidWinner == 0 || game.bidWinner == 2) {
                bidNorthSouth.innerHTML = "(" + currentRoundBid + ")";
                bidEastWest.innerHTML = "";
            } else {
                bidNorthSouth.innerHTML = "";
                bidEastWest.innerHTML = "(" + currentRoundBid + ")";
            }
        } else {
            bidRow.style.visibility = 'hidden';
        }

        var meldRow = document.getElementById('scoreboardRowMeld');
        if (isMeldVisible) {
            frameHeight += rowHeight;
            isVerticalExpanded = true;
            meldRow.style.visibility = 'visible';
            var meldNorthSouth = document.getElementById('scoreboardRowMeldNorthSouth');
            var currentRoundMeld = game.players[0].currentRoundMeldScore + game.players[2].currentRoundMeldScore;
            if (isUsingScoreMultiplier) {
                currentRoundMeld = currentRoundMeld*10;
            }
            meldNorthSouth.innerText = currentRoundMeld;
            var meldEastWest = document.getElementById('scoreboardRowMeldEastWest');
            currentRoundMeld = game.players[1].currentRoundMeldScore + game.players[3].currentRoundMeldScore;
            if (isUsingScoreMultiplier) {
                currentRoundMeld = currentRoundMeld*10;
            }
            meldEastWest.innerText = currentRoundMeld; 
        } else {
            meldRow.style.visibility = 'hidden';
        }

        var countersRow = document.getElementById('scoreboardRowCounters');
        if (isCountersVisible) {
            frameHeight += rowHeight;
            isVerticalExpanded = true;
            countersRow.style.visibility = 'visible';
            var countersNorthSouth = document.getElementById('scoreboardRowCountersNorthSouth');
            var currentRoundCounters = game.players[0].currentRoundCountersTaken + game.players[2].currentRoundCountersTaken;
            if (isUsingScoreMultiplier) {
                currentRoundCounters = currentRoundCounters*10;
            }
            countersNorthSouth.innerText = currentRoundCounters;
            var countersEastWest = document.getElementById('scoreboardRowCountersEastWest');
            currentRoundCounters = game.players[1].currentRoundCountersTaken + game.players[3].currentRoundCountersTaken;
            if (isUsingScoreMultiplier) {
                currentRoundCounters = currentRoundCounters*10;
            }
            countersEastWest.innerText = currentRoundCounters; 
        } else {
            countersRow.style.visibility = 'hidden';
        }
        
        var radius = '0px';
        if (isVerticalExpanded) {
            frameHeight += 5;
            radius = '5px';
        }
        var scoreboardBackground = document.getElementById('scoreboardBackground');
        with (scoreboardBackground.style) {
            transition = '0.3s linear';
            borderBottomLeftRadius = radius;
            borderBottomRightRadius = radius;
            height = frameHeight + 'px';
        }
        currentScoreboardVisibleHeight = frameHeight;
    }

    this.UpdateScoresAfterRound = function() {

        var barFill = document.getElementById('scoreboardScoreFillNorthSouth');
        barFill.style.transition = "1s linear";
        var percent = 100 * game.players[0].gameScore / game.winningScore;
        if (percent > 100) {
            percent = 100;
        } else if (percent < 0) {
            percent = 0;
        }
        barFill.style.width = percent + "%";
        var teamScore = document.getElementById('scoreboardScoreNorthSouth');
        teamScore.innerText = game.players[0].gameScore;

        barFill = document.getElementById('scoreboardScoreFillEastWest');
        barFill.style.transition = "1s linear";
        var percent = 100 * game.players[1].gameScore / game.winningScore;
        if (percent > 100) {
            percent = 100;
        } else if (percent < 0) {
            percent = 0;
        }
        barFill.style.width = percent + "%";
        var teamScore = document.getElementById('scoreboardScoreEastWest');
        teamScore.innerText = game.players[1].gameScore;

        this.UpdateScores(false, false, false);

        setTimeout(function() {
            game.OnFinishedAnimatingUpdateGameScoreboard();
        }, 1000);
    }
}
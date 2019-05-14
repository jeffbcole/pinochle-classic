var visibleMenuCards = [];
			
function MenuCardAppear(elementID) {
	var el = document.getElementById(elementID);
	visibleMenuCards.push(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		top = "50%";
		opacity = 1;
		pointerEvents = "auto";
	}
}

function MenuCardPressDown(elementID) {
	var el = document.getElementById(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.5s ease-out";
		boxShadow = "0px 0px 0px rgba(0,0,0,0.5)";
		transform = "scale(0.93) translate(-54%,-54%)";
		pointerEvents = "none";
	}
}

function MenuCardPopUp(elementID) {
	var el = document.getElementById(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.5s ease-in-out";
		boxShadow = "30px 30px 0px rgba(0,0,0,0.5)";
		transform = "scale(1) translate(-50%,-50%)";
		pointerEvents = "auto";
	}
}

function MenuCardDisappear(elementID) {
	var el = document.getElementById(elementID);
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.4s ease-in";
		top = "100%";
		opacity = 0;
		pointerEvents = "none";
	}
}

function ShowTitle() {
	var el = document.getElementById("game_title");
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		top = "15%";
		opacity = 1;
	}
}

function HideTitle() {
	var el = document.getElementById("game_title");
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		top = "0%";
		opacity = 0;
	}
}
function HideMenuButton() {
	var el = document.getElementById('menu_button');
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.4s linear";
		opacity = 0;
		pointerEvents = "none";
	}
}

function ShowMenuButton() {
var el = document.getElementById('menu_button');
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.4s linear";
		opacity = 1;
		pointerEvents = "auto";
	}
}

function MenuButtonPressed() {
	if (visibleMenuCards.length == 0)
	{
		// Show the close button
		var el = document.getElementById('menu_main_close_button');
		with(el.style) {
			display = 'block';
		}
		
		ShowMainMenu(true);
	}
}

function ShowMainMenu(showCloseButton) {
	if (showCloseButton) {
		var el = document.getElementById('menu_main_close_button');
		with(el.style) {
			display = 'block';
		}
	} else {
		var el = document.getElementById('menu_main_close_button');
		with(el.style) {
			display = 'none';
		}
	}
	MenuCardAppear('menu_main');
	HideMenuButton();
}

function menu_main_close_click() {
	visibleMenuCards = [];
	MenuCardDisappear('menu_main');
	ShowMenuButton();
}

function ShowPlayAsAComputerMenu() {
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_start_a_game");
}

function ShowStartAGameMenu() {
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_start_a_game");
}

function menu_card_close_click() {
	var topMenu = visibleMenuCards.pop();
	MenuCardDisappear(topMenu);
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPopUp(menuName);
}

function menu_start_game_click(difficulty) {
	game.StartAGame(difficulty);
	while (visibleMenuCards.length > 0) {
		var topMenu = visibleMenuCards.pop();
		MenuCardPopUp(topMenu);
		MenuCardDisappear(topMenu);
	}
	HideTitle();
	ShowMenuButton();
}

function ShowDifficultiesExplainedMenu()
{
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	var scrollDiv = document.getElementById('menu_difficulties_explained_body');
	scrollDiv.scrollTop = 0;
	MenuCardAppear("menu_difficulties_explained");
}

function ShowSettingsMenu() {
	InitializeSettingsView();
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	MenuCardAppear("menu_settings");
}

function InitializeSettingsView() {
	var scrollDiv = document.getElementById('menu_settings_body');
	scrollDiv.scrollTop = 0;
	document.getElementById("setting_hints_checkbox").checked = GetSetting('setting_hints');
	document.getElementById("setting_undo_checkbox").checked = GetSetting('setting_undo');
	document.getElementById("setting_sort_left_to_right_checkbox").checked = GetSetting('setting_sort_left_to_right');
	document.getElementById("setting_score_multiplier_checkbox").checked = GetSetting('setting_score_multiplier');

	document.getElementById("deck_count_dropdown").value = GetSetting('setting_deck_count');
	document.getElementById("winning_score_dropdown").value = GetSetting('setting_winning_score');
	document.getElementById("bidding_speed_dropdown").value = GetSetting('setting_bidding_speed');
	document.getElementById("minimum_bid_dropdown").value = GetSetting('setting_minimum_bid');
	document.getElementById("passing_cards_count_dropdown").value = GetSetting('setting_passing_cards_count');
	document.getElementById("trick_taking_speed_dropdown").value = GetSetting('setting_trick_speed');
	document.getElementById("trick_taking_display_dropdown").value = GetSetting('setting_counters_display');
	
	var board_color = GetSetting('setting_board_color');
	var allElems = document.getElementsByName('settings_boardbackground_selector');
	for (i = 0; i < allElems.length; i++) {
		if (allElems[i].type == 'radio' && allElems[i].value == board_color) {
			allElems[i].checked = true;
		}
	}
	
	var card_color = GetSetting('setting_card_color');
	var allElems = document.getElementsByName('settings_card_color_selector');
	for (i = 0; i < allElems.length; i++) {
		if (allElems[i].type == 'radio' && allElems[i].value == card_color) {
			allElems[i].checked = true;
		}
	}

	GenerateWinningScoreOptions();
	GenerateMinimumBidOptions();
}

var WinningScoreOptions = [100, 150, 200, 250, 300, 500, 1000];

function GenerateWinningScoreOptions() {
	var winningScoreDropDown = document.getElementById("winning_score_dropdown");
	var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
	for (var i=0; i<winningScoreDropDown.children.length; i++) {
		winningScoreDropDown.children[i].textContent = isUsingScoreMultiplier ? WinningScoreOptions[i]*10 : WinningScoreOptions[i];
	}
}

function GenerateMinimumBidOptions() {
	var miniumBidDropDown = document.getElementById("minimum_bid_dropdown");
	var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
	for (var i=0; i<miniumBidDropDown.children.length; i++) {
		miniumBidDropDown.children[i].textContent = isUsingScoreMultiplier ? (i+1)*10 : (i+1);
	}
}

function SettingHintsClicked(cb) {
	SetSetting('setting_hints', cb.checked);
	game.UpdateShowHintButton();
}

function SettingUndoClicked(cb) {
	SetSetting('setting_undo', cb.checked);
	game.UpdateShowUndoButton();
}

function SettingSortLeftToRightClicked(cb) {
	SetSetting('setting_sort_left_to_right', cb.checked);
	game.UpdateSortLeftToRight();
}

function SettingScoreMultiplierClicked(cb) {
	SetSetting('setting_score_multiplier', cb.checked);

	GenerateWinningScoreOptions();
	GenerateMinimumBidOptions();
	game.UpdateScoreMultiplier();
}

function SettingDeckCountChanged(selector) {
	SetSetting('setting_deck_count', selector.value);

	var passingCardsCount = 3;
	var minimumBid = 20;
	var deckCount = GetSetting('setting_deck_count');
	if (deckCount == 1) {
		passingCardsCount = 4;
		minimumBid = 50;
	}

	var passingCardsDropDown = document.getElementById("passing_cards_count_dropdown");
	passingCardsDropDown.value = passingCardsCount;
	SetSetting('setting_passing_cards_count', passingCardsCount);
	var minimumBidDropDown = document.getElementById("minimum_bid_dropdown");
	minimumBidDropDown.value = minimumBid;
	SetSetting('setting_minimum_bid', minimumBid);
}

function SettingWinningScoreChanged(winningScoreSelect) {
	SetSetting('setting_winning_score', winningScoreSelect.value);
}

function SettingBiddingSpeedChanged(selector) {
	SetSetting('setting_bidding_speed', selector.value);
}

function SettingMinimumBidChanged(selector) {
	SetSetting('setting_minimum_bid', selector.value);
}

function SettingPassingCardsCountChanged(selector) {
	SetSetting('setting_passing_cards_count', selector.value);
}

function SettingTrickTakingSpeedChanged(selector) {
	SetSetting('setting_trick_speed', selector.value);
}

function SettingTrickTakingDisplayChanged(selector) {
	SetSetting('setting_counters_display', selector.value);
	game.UpdateTrickTakingDisplay();
}

function SettingPreferredDifficultyDisplayChanged(selector) {
	SetSetting('setting_preferred_skill', selector.value);
}

function BoardSelectorClick(radio) {
	SetSetting('setting_board_color', radio.value);
	UpdateBackgroundImageFromSettings();
}

function UpdateBackgroundImageFromSettings() {
	var boardColor = GetSetting('setting_board_color');
	switch (boardColor){
		case 'wood_light':
			document.documentElement.style.backgroundImage = "url(images/woodlightboard.jpg)";
			break;
		case 'wood':
			document.documentElement.style.backgroundImage = "url(images/woodboard.jpg)";
			break;
		case 'wood_dark':
			document.documentElement.style.backgroundImage = "url(images/wooddarkboard.jpg)";
			break;
		case 'wood_gray':
			document.documentElement.style.backgroundImage = "url(images/woodgreyboard.jpg)";
			break;
		case 'green':
			document.documentElement.style.backgroundImage = "none";
			document.documentElement.style.backgroundColor = "#354216";
			break;
		case 'red':
			document.documentElement.style.backgroundImage = "none";
			document.documentElement.style.backgroundColor = "#C20A00";
			break;
		case 'blue':
			document.documentElement.style.backgroundImage = "none";
			document.documentElement.style.backgroundColor = "#071A5F";
			break;
	}
}

function CardSelectorClick(radio) {
	SetSetting('setting_card_color', radio.value);

	var cardBackURI = "url('images/card_back_" + radio.value + ".jpg')";
	var elements = document.getElementsByClassName('cardBack');
	for (var i=0; i<elements.length; i++)
	{
		elements[i].style.backgroundImage = cardBackURI;
	}
}

function ShowStatisticsMenu() {
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	InitializeStatisticsView();
	MenuCardAppear("menu_statistics");
}

function InitializeStatisticsView() {

	var scrollDiv = document.getElementById('menu_statistics_body');
	scrollDiv.scrollTop = 0;
	
	var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');
	var deckCount = GetSetting('setting_deck_count');
	var doubleDeckString = "";
	if (deckCount == 1) {
		doubleDeckString = "_DoubleDeck";
	}
	
	var difficulties = ["Easy", "Standard", "Pro"];
	var totalGamesPlayed = 0;
	var totalWins = 0;
	for (var i=0; i<difficulties.length; i++) {
		var curDifficulty = difficulties[i];
		var wins = GetStatistic('stat_wins_' + curDifficulty + doubleDeckString);
		var losses = GetStatistic('stat_losses_' + curDifficulty + doubleDeckString);
		var gamesPlayed = wins + losses;
		var gamesPlayedElement = document.getElementById('menu_stat_games_played_' + curDifficulty);
		var winsElement = document.getElementById('menu_stat_wins_' + curDifficulty);
		var winPercentElement = document.getElementById('menu_stat_win_percent_' + curDifficulty);
		if (gamesPlayed > 0) {
			gamesPlayedElement.innerText = gamesPlayed;
			winsElement.innerText = wins;
			winPercentElement.innerText = parseFloat(100*wins / gamesPlayed).toFixed(0) + "%";
		} else {
			gamesPlayedElement.innerText = "";
			winsElement.innerText = "";
			winPercentElement.innerText = "";
		}
		totalGamesPlayed = totalGamesPlayed + gamesPlayed;
		totalWins = totalWins + wins;
	}
	var gamesPlayedElement = document.getElementById('menu_stat_games_played_Total');
	var winsElement = document.getElementById('menu_stat_wins_Total');
	var winPercentElement = document.getElementById('menu_stat_win_percent_Total');
	if (totalGamesPlayed > 0) {
		gamesPlayedElement.innerText = totalGamesPlayed;
		winsElement.innerText = totalWins;
		winPercentElement.innerText = parseFloat(100*totalWins / totalGamesPlayed).toFixed(0) + "%";
	} else {
		gamesPlayedElement.innerText = "0";
		winsElement.innerText = "0";
		winPercentElement.innerText = "";
	}

	// Stats with bid
	var totalWinningBidTotal = 0;
	var totalWinningBidCount = 0;
	var totalMakeContract = 0;
	var totalMeldWithBidTotal = 0;
	var totalMeldWithBidCount = 0;
	var totalCountersWithBidTotal = 0;
	var totalCountersWithBidCount = 0;
	var totalRoundScoresWithBidTotal = 0;
	var totalRoundScoresWithBidCount = 0;
	var totalMeldWithoutBidTotal = 0;
	var totalMeldWithoutBidCount = 0;
	var totalCountersWithoutBidTotal = 0;
	var totalCountersWithoutBidCount = 0;
	var totalRoundScoresWithoutBidTotal = 0;
	var totalRoundScoresWithoutBidCount = 0;
	for (var i=0; i<difficulties.length; i++) {
		var curDifficulty = difficulties[i];
		
		// Avg Contract
		var winningBidTotal = GetStatistic('stat_winningbid_total_' + curDifficulty + doubleDeckString);
		var winningBidCount = GetStatistic('stat_winningbid_count_' + curDifficulty + doubleDeckString);
		var notWinningBidCount = GetStatistic('stat_notwinningbid_count_' + curDifficulty + doubleDeckString);
		var bidsWonAndNotWon = winningBidCount + notWinningBidCount;
		var curElement = document.getElementById('menu_stat_avg_bid_contract_with_bid_' + curDifficulty);
		if (bidsWonAndNotWon > 0) {
			var avg = isUsingScoreMultiplier ? parseFloat(10*winningBidTotal/bidsWonAndNotWon).toFixed(1) : parseFloat(winningBidTotal/bidsWonAndNotWon).toFixed(1);
			curElement.innerText = avg;
		} else {
			curElement.innerText = "";
		}
		totalWinningBidTotal += winningBidTotal;
		totalWinningBidCount += bidsWonAndNotWon;

		// Make Contract
		curElement = document.getElementById('menu_stat_make_contract_percent_' + curDifficulty);
		if (bidsWonAndNotWon > 0) {
			var contractMakePercent = bidsWonAndNotWon > 0 ? winningBidCount/bidsWonAndNotWon : 0;
			curElement.innerText = parseFloat(100*contractMakePercent).toFixed(0) + "%";	
		} else {
			curElement.innerText = "";
		}
		totalMakeContract += winningBidCount;

		// Avg meld
		var meldWithBidTotal = GetStatistic('stat_meld_withbid_total_' + curDifficulty + doubleDeckString);
		var meldWithBidCount = GetStatistic('stat_meld_withbid_count_' + curDifficulty + doubleDeckString);
		var meldWithBidAverage = meldWithBidCount > 0 ? meldWithBidTotal/meldWithBidCount : 0;
		if (isUsingScoreMultiplier) {
			meldWithBidAverage = meldWithBidAverage*10;
		}
		curElement = document.getElementById('menu_stat_avg_meld_with_bid_' + curDifficulty);
		curElement.innerText = meldWithBidCount > 0 ? parseFloat(meldWithBidAverage).toFixed(1) : "";
		totalMeldWithBidTotal += meldWithBidTotal;
		totalMeldWithBidCount += meldWithBidCount;

		// Avg counters
		var countersWithBidTotal = GetStatistic('stat_counters_withbid_total_' + curDifficulty + doubleDeckString);
		var countersWithBidCount = GetStatistic('stat_counters_withbid_count_' + curDifficulty + doubleDeckString);
		var countersWithBidAverage = countersWithBidCount > 0 ? countersWithBidTotal/countersWithBidCount : 0;
		if (isUsingScoreMultiplier) {
			countersWithBidAverage = countersWithBidAverage*10;
		}
		curElement = document.getElementById('menu_stat_avg_counters_with_bid_' + curDifficulty);
		curElement.innerText = countersWithBidCount > 0 ? parseFloat(countersWithBidAverage).toFixed(1) : "";
		totalCountersWithBidTotal += countersWithBidTotal;
		totalCountersWithBidCount += countersWithBidCount;

		// Avg positive round score
		var roundScoresWithBidTotal = GetStatistic('stat_roundscores_withbid_total_' + curDifficulty + doubleDeckString);
		var roundScoresWithBidCount = GetStatistic('stat_roundscores_withbid_count_' + curDifficulty + doubleDeckString);
		var roundScoresWithBidAverage = roundScoresWithBidCount > 0 ? roundScoresWithBidTotal/roundScoresWithBidCount : 0;
		if (isUsingScoreMultiplier) {
			roundScoresWithBidAverage = roundScoresWithBidAverage*10;
		}
		curElement = document.getElementById('menu_stat_avg_round_score_with_bid_' + curDifficulty);
		curElement.innerText = roundScoresWithBidCount > 0 ? parseFloat(roundScoresWithBidAverage).toFixed(1) : "";
		totalRoundScoresWithBidTotal += roundScoresWithBidTotal;
		totalRoundScoresWithBidCount += roundScoresWithBidCount;

		// Avg meld
		var meldWithOutBidTotal = GetStatistic('stat_meld_withoutbid_total_' + curDifficulty + doubleDeckString);
		var meldWithOutBidCount = GetStatistic('stat_meld_withoutbid_count_' + curDifficulty + doubleDeckString);
		var meldWithOutBidAverage = meldWithOutBidCount > 0 ? meldWithOutBidTotal/meldWithOutBidCount : 0;
		if (isUsingScoreMultiplier) {
			meldWithOutBidAverage = meldWithOutBidAverage*10;
		}
		curElement = document.getElementById('menu_stat_avg_meld_without_bid_' + curDifficulty);
		curElement.innerText = meldWithOutBidCount > 0 ? parseFloat(meldWithOutBidAverage).toFixed(1) : "";
		totalMeldWithoutBidTotal += meldWithOutBidTotal;
		totalMeldWithoutBidCount += meldWithOutBidCount;

		// Avg counters
		var countersWithoutBidTotal = GetStatistic('stat_counters_withoutbid_total_' + curDifficulty + doubleDeckString);
		var countersWithoutBidCount = GetStatistic('stat_counters_withoutbid_count_' + curDifficulty + doubleDeckString);
		var countersWithoutBidAverage = countersWithoutBidCount > 0 ? countersWithoutBidTotal/countersWithoutBidCount : 0;
		if (isUsingScoreMultiplier) {
			countersWithoutBidAverage = countersWithoutBidAverage*10;
		}
		curElement = document.getElementById('menu_stat_avg_counters_without_bid_' + curDifficulty);
		curElement.innerText = countersWithoutBidCount > 0 ? parseFloat(countersWithoutBidAverage).toFixed(1) : "";
		totalCountersWithoutBidTotal += countersWithoutBidTotal;
		totalCountersWithoutBidCount += countersWithoutBidCount;

		// Avg round score
		var roundScoresWithoutBidTotal = GetStatistic('stat_roundscores_withoutbid_total_' + curDifficulty + doubleDeckString);
		var roundScoresWithoutBidCount = GetStatistic('stat_roundscores_withoutbid_count_' + curDifficulty + doubleDeckString);
		var roundScoresWithoutBidAverage = roundScoresWithoutBidCount > 0 ? roundScoresWithoutBidTotal/roundScoresWithoutBidCount : 0;
		if (isUsingScoreMultiplier) {
			roundScoresWithoutBidAverage = roundScoresWithoutBidAverage*10;
		}
		curElement = document.getElementById('menu_stat_avg_round_score_without_bid_' + curDifficulty);
		curElement.innerText = roundScoresWithoutBidCount > 0 ? parseFloat(roundScoresWithoutBidAverage).toFixed(1) : "";
		totalRoundScoresWithoutBidTotal += roundScoresWithoutBidTotal;
		totalRoundScoresWithoutBidCount += roundScoresWithoutBidCount;
	}

	// Totals
	curElement = document.getElementById('menu_stat_avg_bid_contract_with_bid_Total');	
	if (totalWinningBidCount > 0) {
		var avg = totalWinningBidTotal/totalWinningBidCount;
		if (isUsingScoreMultiplier) {
			avg = avg*10;
		}
		curElement.innerText = parseFloat(avg).toFixed(1);
	} else {
		curElement.innerText = "";
	}
	
	curElement = document.getElementById('menu_stat_avg_meld_with_bid_Total');
	if (totalMeldWithBidCount > 0) {
		avg = totalMeldWithBidTotal/totalMeldWithBidCount;
		if (isUsingScoreMultiplier) {
			avg = avg*10;
		}
		curElement.innerText = parseFloat(avg).toFixed(1);
	} else {
		curElement.innerText = "";
	}

	curElement = document.getElementById('menu_stat_avg_counters_with_bid_Total');
	if (totalCountersWithBidCount > 0) {
		avg = totalCountersWithBidTotal/totalCountersWithBidCount;
		if (isUsingScoreMultiplier) {
			avg = avg*10;
		}
		curElement.innerText = parseFloat(avg).toFixed(1);
	} else {
		curElement.innerText = "";
	}

	curElement = document.getElementById('menu_stat_avg_round_score_with_bid_Total');
	if (totalRoundScoresWithBidCount > 0) {
		avg = totalRoundScoresWithBidTotal/totalRoundScoresWithBidCount;
		if (isUsingScoreMultiplier) {
			avg = avg*10;
		}
		curElement.innerText = parseFloat(avg).toFixed(1);
	} else {
		curElement.innerText = "";
	}

	curElement = document.getElementById('menu_stat_make_contract_percent_Total');
	if (totalWinningBidCount > 0) {
		avg = totalMakeContract/totalWinningBidCount;
		curElement.innerText = parseFloat(avg).toFixed(0) + "%";
	} else {
		curElement.innerText = "";
	}
	
	curElement = document.getElementById('menu_stat_avg_meld_without_bid_Total');
	if (totalMeldWithoutBidCount > 0) {
		avg = totalMeldWithoutBidTotal/totalMeldWithoutBidCount;
		if (isUsingScoreMultiplier) {
			avg = avg*10;
		}
		curElement.innerText = parseFloat(avg).toFixed(1);
	} else {
		curElement.innerText = "";
	}

	curElement = document.getElementById('menu_stat_avg_counters_without_bid_Total');
	if (totalCountersWithoutBidCount > 0) {
		avg = totalCountersWithoutBidTotal/totalCountersWithoutBidCount;
		if (isUsingScoreMultiplier) {
			avg = avg*10;
		}
		curElement.innerText = parseFloat(avg).toFixed(1);
	} else {
		curElement.innerText = "";
	}

	curElement = document.getElementById('menu_stat_avg_round_score_without_bid_Total');
	if (totalRoundScoresWithoutBidCount > 0) {
		avg = totalRoundScoresWithoutBidTotal/totalRoundScoresWithoutBidCount;
		if (isUsingScoreMultiplier) {
			avg = avg*10;
		}
		curElement.innerText = parseFloat(avg).toFixed(1);
	} else {
		curElement.innerText = "";
	}
}

function GetTotalGamesPlayed() {
	var difficulties = ["Easy", "Standard", "Pro"];
	var totalGamesPlayed = 0;
	for (var i=0; i<difficulties.length; i++) {
		var curDifficulty = difficulties[i];
		var wins = GetStatistic('stat_wins_' + curDifficulty);
		var losses = GetStatistic('stat_losses_' + curDifficulty);
		totalGamesPlayed += (wins + losses);
	}
	return totalGamesPlayed;
}

function ResetStatisticsButtonClick() {
	var r = confirm("Are you sure you want to reset your statistics?");
	if (r != true) {
		return;
	}

	var doubleDeckString = "";
	if (GetSetting('setting_deck_count')==1) {
		doubleDeckString = "_DoubleDeck";
	}
	var difficulties = ['Easy', 'Standard', 'Pro'];
	var statsToReset = [
		'stat_wins_',
		'stat_losses_',
		'stat_winningbid_total_',
		'stat_winningbid_count_',
		'stat_notwinningbid_count_',
		'stat_meld_withbid_total_',
		'stat_meld_withbid_count_',
		'stat_counters_withbid_total_',
		'stat_counters_withbid_count_',
		'stat_roundscores_withbid_total_',
		'stat_roundscores_withbid_count_',
		'stat_meld_withoutbid_total_',
		'stat_meld_withoutbid_count_',
		'stat_counters_withoutbid_total_',
		'stat_counters_withoutbid_count_',
		'stat_roundscores_withoutbid_total_',
		'stat_roundscores_withoutbid_count_'
	];
	for (var i=0; i<statsToReset.length; i++) {
		for (var j=0; j<difficulties.length; j++) {
			var statName = statsToReset[i] + difficulties[j] + doubleDeckString;
			window.localStorage.removeItem(statName);
		}
	}
	
	InitializeStatisticsView();
}

function ShowRulesMenu() {
	var menuName = visibleMenuCards[visibleMenuCards.length-1];
	MenuCardPressDown(menuName);
	InitializeRulesView();
	MenuCardAppear("menu_rules");
}

function InitializeRulesView() {
	var scrollDiv = document.getElementById('menu_rules_body');
	scrollDiv.scrollTop = 0;

	var isUsingDoubleDeck = GetSetting('setting_deck_count') == 1;
	var isUsingScoreMultiplier = GetSetting('setting_score_multiplier');

	var curElement = document.getElementById('menu_rules_card_deck');
	if (isUsingDoubleDeck) {
        curElement.innerText = "The deck has 80 cards consisting of the 10s through Aces.  There are four of every card. The cards are ranked from highest to lowest: A,10,K,Q,J. Notice that the 10s are ranked higher than the Kings!";
    } else {
        curElement.innerText = "The deck has 48 cards consisting of the 9s through Aces.  There are two of every card. The cards are ranked from highest to lowest: A,10,K,Q,J,9. Notice that the 10s are ranked higher than the Kings!";
	}
	
	curElement = document.getElementById('menu_rules_passing_cards');
	if (isUsingDoubleDeck) {
		curElement.innerText = "The team that declares trump then gets to pass cards to each other.  The default number of cards passed is 4 but this setting can be changed in the app settings.  First the non-declaring partner passes to the declarer and then the declarer passes cards back.";
	} else {
		curElement.innerText = "The team that declares trump then gets to pass cards to each other.  The default number of cards passed is 3 but this setting can be changed in the app settings.  First the non-declaring partner passes to the declarer and then the declarer passes cards back.";
	}

	curElement = document.getElementById('menu_rules_tricktaking');
	if (isUsingScoreMultiplier) {
		curElement.innerHTML = "The last stage of a round is trick-taking.  A trick is four cards (one from each player).<br><br>The player who won the bid starts by playing a lead card.  Then, in a clockwise order, each other player also plays a card.<br><br>When trick-taking there are rules that limit which cards you can play.  Pinochle Classic will only let you make legal moves, but you should understand the rules:  You must play the lead suit if possible.  If you don't have a card in lead suit you must play a trump suited card if possible.  You must beat the winning card in the trick if you can.<br><br>Once all four players have played a card, the highest card of the lead suit or the highest trump card wins the trick.  If two identical cards are played, the first wins.<br><br>The trick winner receives ten points for each Ace, 10, or King in the trick pile.  These cards are called 'Counters'.  The final trick of the round is worth an extra ten points.<br><br>The trick winner then gets to play the next lead card and play continues until all players are out of cards.";
	} else {
		curElement.innerHTML = "The last stage of a round is trick-taking.  A trick is four cards (one from each player).<br><br>The player who won the bid starts by playing a lead card.  Then, in a clockwise order, each other player also plays a card.<br><br>When trick-taking there are rules that limit which cards you can play.  Pinochle Classic will only let you make legal moves, but you should understand the rules:  You must play the lead suit if possible.  If you don't have a card in lead suit you must play a trump suited card if possible.  You must beat the winning card in the trick if you can.<br><br>Once all four players have played a card, the highest card of the lead suit or the highest trump card wins the trick.  If two identical cards are played, the first wins.<br><br>The trick winner receives a point for each Ace, 10, or King in the trick pile.  These cards are called 'Counters'.  The final trick of the round is worth an extra point.<br><br>The trick winner then gets to play the next lead card and play continues until all players are out of cards.";	
	}

	var doubleDeckCells = [
		'menu_rules_cell_pinochle_3x',
		'menu_rules_cell_pinochle_4x',
		'menu_rules_cell_jacksaround_3x',
		'menu_rules_cell_jacksaround_4x',
		'menu_rules_cell_queensaround_3x',
		'menu_rules_cell_queensaround_4x',
		'menu_rules_cell_kingsaround_3x',
		'menu_rules_cell_kingsaround_4x',
		'menu_rules_cell_acesaround_3x',
		'menu_rules_cell_acesaround_4x',
		'menu_rules_cell_marriage_3x',
		'menu_rules_cell_marriage_4x',
		'menu_rules_cell_royalmarriage_3x',
		'menu_rules_cell_royalmarriage_4x',
		'menu_rules_cell_run_3x',
		'menu_rules_cell_run_4x',
		'menu_rules_cell_points_3x',
		'menu_rules_cell_points_4x'
	]
	if (isUsingDoubleDeck) {
		curElement = document.getElementById('menu_rules_row_dix');
		curElement.style = "visibility:collapse;";
		curElement = document.getElementById('menu_rules_cell_points');
		curElement.setAttribute('colspan', '4');
		for (var i=0; i<doubleDeckCells.length; i++) {
			curElement = document.getElementById(doubleDeckCells[i]);
			curElement.style = "display:;"
		}
		
	} else {
		curElement = document.getElementById('menu_rules_row_dix');
		curElement.style = "visibility:visible;";	
		curElement = document.getElementById('menu_rules_cell_points');
		curElement.setAttribute('colspan', '2');
		for (var i=0; i<doubleDeckCells.length; i++) {
			curElement = document.getElementById(doubleDeckCells[i]);
			curElement.style = "display:none;"
		}
	}
}

function PlayMoreGamesButtonPressed() {
	var el = document.getElementById('play_more_games_menu');
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.8s cubic-bezier(0.175, 0.885, 0.320, 1.275)";
		bottom = '10pt';
		opacity = 1;
		pointerEvents = "auto";
	}
}

function play_more_games_close_click() {
	var el = document.getElementById('play_more_games_menu');
	with(el.style) {
		WebkitTransition = MozTransition = OTransition = msTransition = "0.4s ease-in";
		bottom = "-200pt";
		opacity = 0;
		pointerEvents = "none";
	}
}

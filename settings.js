var setting_hints_default = false;
var setting_undo_default = false;
var setting_winning_score_default = 500;
var setting_minimum_bid_default = 20;
var setting_sort_left_to_right_default = true;
var setting_score_multiplier_default = false;
var setting_counters_display_default = 1;
var setting_passing_cards_count_default = 3;
var setting_preferred_skill_default = 0;
var setting_deck_count_default = 0;
var setting_bidding_speed_default = 0;
var setting_trick_speed_default = 1;
var setting_board_color_default = 'wood';
var setting_card_color_default = 'blue';

function GetSetting(setting) {
	switch (setting) {
		case "setting_hints":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_hints_default : (settingVal == 'true');
			break;
		case "setting_undo":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_undo_default : (settingVal == 'true');
			break;
		case "setting_winning_score":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_winning_score_default : settingVal;
			break;
		case "setting_minimum_bid":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_minimum_bid_default : settingVal;
			break;
		case "setting_sort_left_to_right":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_sort_left_to_right_default : (settingVal == 'true');
			break;
		case "setting_score_multiplier":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_score_multiplier_default : (settingVal == 'true');
			break;
		case "setting_counters_display":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_counters_display_default : settingVal;
			break;
			case "setting_passing_cards_count":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_passing_cards_count_default : settingVal;
			break;
		case "setting_preferred_skill":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_preferred_skill_default : settingVal;
			break;
		case "setting_deck_count":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_deck_count_default : settingVal;
			break;
		case "setting_bidding_speed":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_bidding_speed_default : settingVal;
			break;
		case "setting_trick_speed":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_trick_speed_default : settingVal;
			break;
		case "setting_board_color":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_board_color_default : settingVal;
			break;
		case "setting_card_color":
			var settingVal = window.localStorage.getItem(setting);
			return settingVal == null ? setting_card_color_default : settingVal;
			break;
	}
}

function SetSetting(setting, val) {
	window.localStorage.setItem(setting, val);
}

function GetStatistic(statistic) {
    var val = window.localStorage.getItem(statistic);
    return val == null ? Number(0) : Number(val);
}

function GetStatisticString(statistic) {
	var val = window.localStorage.getItem(statistic);
	return val == null ? "" : val;
}

function SetStatistic(statistic, value) {
	window.localStorage.setItem(statistic, value);
}

function redirectToAppStore() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
	if (/android/i.test(userAgent)) {
		window.location.replace("https://play.google.com/store/apps/details?id=com.gamesbypost.pinochleclassic");
		return true;
	}
  
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		window.location.replace("https://itunes.apple.com/us/app/pinochle-classic/id1449858929?mt=8");
		return true;
	}
	
	return false;
}
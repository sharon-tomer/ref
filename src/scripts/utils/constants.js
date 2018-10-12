export const APP_ID = 'ref-extension';

export const ACTIONS = {
	PROMPT_TO_SET_REFERRAL_INFO: 'prompt-to-add-referral-info',
	PROMPT_TO_GET_REWARD: 'prompt-to-get-reward',
	PROMPT_TO_GET_REWARD_ON_REGISTERATION: 'prompt_to_get_reward_on_registeration',
	SET_REFERRAL_INFO: 'add_new_referral_info',
	GET_REFERRAL: 'get_referral',
	SCRAPE_REFERRAL_INFO: 'scrape_referral_info',
	OPT_OUT: 'opt_out',
	HAS_ACCOUNT: 'has_account',
	NAV_TO_REF_LINK: 'nav_to_referral_link'
};

export const COPY = {
	UI: {
		PROMPTS: {
			ADD_REFERRAL: {
				TITLE_PRE: 'Want to share your ',
				TITLE_MID: ' referral code and ',
				TITLE_POST: ' for every person who uses it?',
				ACTIVATE_NOW: 'Yes! I want free $$$!',
				ACTIVATE_LATER: 'Activate later',
				LEAVE_ME_ALONE: 'Leave me alone'
			},
			ADDED_SUCCESSFULLY: {
				TITLE: 'And... Done!',
				DESCRIPTION1: 'your referral code ',
				DESCRIPTION2: ' will be shared with your friends & random internet people.\n You will automaticlly be rewarded for anyone who redeems it!',
				CLOSE_BUTTON: 'Sweet!'
			},
			FAILED_ADDING: {
				TITLE: 'Darn it! Something went wrong when we were trying to get your referral code. Please try again later',
				CLOSE_BUTTON: 'I forgive you!'
			},
			GET_REWARD: {
				TITLE_PRE: 'Don\'t have a ',
				TITLE_MID: ' account? <b>Great!</b> you can get ',
				TITLE_POST: ' by using a referral!',
				ACTIVATE_NOW: 'Yes! I want free $$$!',
				ACTIVATE_LATER: 'Remind me later',
				LEAVE_ME_ALONE: 'Leave me alone',
				HAVE_AN_ACCOUNT: 'I have an account'
			},
			GET_REWARD_ON_REGISTERATION: {
				TITLE_PRE: 'Wait! you can get ',
				TITLE_POST: 'by using a referral code! We\'ve got one for you...',
				ACTIVATE_NOW: 'Hook me up!',
				LEAVE_ME_ALONE: 'Leave me alone'
			},
			OPT_OUT: {
				DESCRIPTION: 'Got it.' 
			},
			REFERRAL_WAS_USED: {
				TITLE: 'And... Done!',
				DESCRIPTION1: 'We applied the referral code.\n',
				DESCRIPTION2: 'You will now get the reward as promised.',
				CLOSE_BUTTON: 'Sweet!'
			},
			REFERRAL_USE_FAILED: {
				TITLE: 'Darn it! Something went wrong when we were trying to get your referral code. Please try again later',
				CLOSE_BUTTON: 'I forgive you!'
			}
		}
	}
};

export const SERVICE_STATUS = {
	NO_ACCOUNT: 'no_account',
	HAS_ACCOUNT: 'has_account',
	OPTED_OUT: 'opted_out'
};

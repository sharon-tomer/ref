export const APP_ID = 'ref-extension';

export const ACTIONS = {
	PROMPT_TO_ADD_CODE: 'prompt-to-add-code',
	PROMPT_TO_GET_REWARD: 'prompt-to-get-reward',
	PROMPT_TO_GET_REWARD_ON_REGISTERATION: 'prompt_to_get_reward_on_registeration',
	ADD_NEW_CODE: 'add_new_code',
	GET_CODE: 'get_code',
	SCRAPE_CODE: 'scrape_code',
	OPT_OUT: 'opt_out',
	HAS_ACCOUNT: 'has_account',
	NAV_TO_REF_LINK: 'nav_to_referral_link'
};

export const COPY = {
	UI: {
		PROMPTS: {
			ADD_CODE: {
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
			CODE_USED: {
				TITLE: 'And... Done!',
				DESCRIPTION1: 'We applied the referral code.\n',
				DESCRIPTION2: 'You will now get the reward as promised.',
				CLOSE_BUTTON: 'Sweet!'
			},
			CODE_USE_FAILED: {
				TITLE: 'Darn it! Something went wrong when we were trying to get your referral code. Please try again later',
				CLOSE_BUTTON: 'I forgive you!'
			}
		}
	}
};

export const SERVICES = {
	uber: {
		NAME: 'Uber',
		ID: 'uber',
		ROOT_DOMAIN: 'uber.com',
		MEMBER_URL_REGEX: /^.*\briders.uber.com\b.*$/,
		NON_MEMBER_URL_REGEX:  /^.*\b(auth).uber.com\b.*$/,
		REGISTERATION_FORM_REGEX: /^(.*)(auth\.uber\.com\/login)(.*?)(uber_client_name=riderSignUp)(.*?)$/,
		CODE_URL: 'https://riders.uber.com/invite',
		CODE_XPATH: '//div/div[contains(text(), \'https://www.uber.com/invite/\')]',
		COPY: {
			REFER_REWARD: 'free rides every time it is redeemed',
			REFERRED_REWARD: 'your first ride for free'
		},
	}
};

export const SERVICE_STATUS = {
	NO_ACCOUNT: 'no_account',
	HAS_ACCOUNT: 'has_account',
	OPTED_OUT: 'opted_out'
};

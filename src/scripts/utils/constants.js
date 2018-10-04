export const APP_ID = 'ref-extension';

export const ACTIONS = {
    PROMPT_TO_ADD_CODE: 'prompt-to-add-code',
    PROMPT_TO_GET_REWARD: 'prompt-to-get-reward',
    GET_CODE: 'get-code',
    SCRAPE_CODE: 'scrape-code'
};

export const COPY = {
    UI: {
        BUTTONS: {
        },
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
            }
        }
    }
};

export const SERVICES = {
    uber: {
        NAME: 'Uber',
        ID: 'uber',
        MEMBER_URL_REGEX: /^.*\briders.uber.com\b.*$/,
        NON_MEMBER_URL_REGEX:  /^.*\b(auth).uber.com\b.*$/,
        REGISTERATION_FORM_REGEX: /^(.*)(auth\.uber\.com\/login)(.*?)(uber_client_name=riderSignUp)(.*?)$/,
        CODE_URL: 'https://riders.uber.com/invite',
        CODE_XPATH: "//div/div[contains(text(), 'https://www.uber.com/invite/')]",
        COPY: {
            REWARD: 'get free rides every time it is redeemed'
        }
    }
};

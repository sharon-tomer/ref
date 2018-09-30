export const APP_ID = 'ref-extension';

export const supportedServices = [
    {name: 'uber', id: 'uber', regex: /^.*\buber.com\b.*$/}
];

export const ACTIONS = {
    PROMPT_TO_ADD_CODE: 'prompt-to-add-code',
    GET_CODE: 'get-code'
};

export const COPY = {
    SERVICES: {
        dropbox: {
            NAME: 'Dropbox',
            REWARD: 'Extra 500 MB of free storage space'
        },
        uber: {
            NAME: 'Uber',
            REWARD: 'get free rides every time it is redeemed'
        }
    },
    UI: {
        BUTTONS: {
        },
        PROMPTS: {
            ADD_CODE: {
                TITLE_PRE: 'Want to share your ',
                TITLE_MID: ' referral code and get ',
                TITLE_POST: ' for every person who uses it?',
                ACTIVATE_NOW: 'Yes! I want free $$$!',
                ACTIVATE_LATER: 'Activate later',
                LEAVE_ME_ALONE: 'Leave me alone'
            }
        }
    }
};

export const SERVICES = {
    uber: {
        NAME: 'Uber',
        ID: 'uber',
        XPATH: /^.*\buber.com\b.*$/,
        REF_URL: 'https://riders.uber.com/invite',
        REF_XPATH: "//div/div[contains(text(), 'https://www.uber.com/invite/')]"
    }
};
export const SUCCESS = 'success';
export const FAILED = 'failed';
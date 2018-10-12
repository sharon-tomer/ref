
export default {
	uber: {
		name: 'Uber',
		id: 'uber',
		urls: {
			root_domain: 'uber.com',
			referral_url: 'https://riders.uber.com/invite',
			member_url_regex: /^.*\briders.uber.com\b.*$/,
			non_member_url_regex:  /^.*\b(auth).uber.com\b.*$/,
			registeration_form_regex: /^(.*)(auth\.uber\.com\/login)(.*?)(uber_client_name=riderSignUp)(.*?)$/
		},
		copy: {
			REFER_REWARD: 'free rides every time it is redeemed',
			REFERRED_REWARD: 'your first ride for free'
		}
	}
};

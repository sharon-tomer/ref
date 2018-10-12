export default {
	set: {
		uber: {
			code: code => [               
				{key: 'find', val: '//*[text()=\'Add a promo code\'] | //*[text()=\'הוספת קוד מבצע\']'},
				{key: 'click'},
				{key: 'find', val: '//input[@name=\'promoCode\'] | //input[@id=\'promoCode\']'},
				{key: 'paste', val: code}
			]
		}
	},
	get: {
		uber: {
			code: () => [               
				{key: 'find', val: '//div/div[contains(text(), \'https://www.uber.com/invite/\')]'},
				{key: 'gettext'},
				{key: 'regex', val: /https:\/\/www\.uber\.com\/invite\/(.*)/},
			],
			link: () => [               
				{key: 'find', val: '//div/div[contains(text(), \'https://www.uber.com/invite/\')]'},
				{key: 'gettext'}			
			]
		}
	},
};
export default {
	uber: { 
		buildCodeInjectionActions: code => [               
			{key: 'find', val: '//*[text()=\'Add a promo code\'] | //*[text()=\'הוספת קוד מבצע\']'},
			{key: 'click'},
			{key: 'find', val: '//input[@name=\'promoCode\'] | //input[@id=\'promoCode\']'},
			{key: 'paste', val: code}
		]}
    
};
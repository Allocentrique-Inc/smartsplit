/**
 * Default minimal configuration. See `src/config.js` for all the possible
 * configuration options that can be tweaked.
 */
module.exports = {
	apiUrl: 'http://localhost:3001/v1',

	clientUrl: 'https://www.smartsplit.org',

	mongodb: {
		uri: 'mongodb://localhost/smartsplit',
	},

	sendgrid: {
		apikey: null,
	},

	jwt_secret: 'set this to something random',

	listen: {
		port: 3001,
		host: '::',
	},

	logger: true,

	twilio: {
		accountSid: 'AC66bb772c95516aa73ec942b4868ece9e',
		authToken: '807cf91c7f12ba83f0c58910b68ed669',
		phoneNumber: '+19999999999',
	},

	zumrails: {
		apiUsername: '66006e77-44c5-4023-bd28-c41f3846f553',
		apiPassword: '4w4#Tawo^c7jy[G9uq1chGF{>q*lJ45-',
		walletId: '0a872cb0-9de1-48b5-b7bb-220a97b5a956',
		fundingSourceId: 'f20e28e7-c164-49ce-9560-76bc57cae3c6',
		env: 'https://api-sandbox.zumrails.com',
	},
}

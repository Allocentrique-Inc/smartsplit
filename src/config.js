const DefaultConfig = {
	defaultLanguage: 'fr',

	clientUrl: process.env.CLIENT_URL || 'http://www-dev.smartsplit.org',

	apiUrl: process.env.API_BASE_URL || 'http://localhost:3001/v1',

	mongodb: {
		uri: process.env.MONGODB_PATH || 'mongodb://localhost/smartsplit',
	},

	sendgrid: {
		apikey: null,
		defaultTemplate: null,
	},

	twilio: {
		accountSid: null,
		authToken: null,
		phoneNumber: null,
	},

	stripe: {
		apikey: null,
	},

	email: {
		from_name: 'Smartsplit',
		from_email: 'noreply@smartsplit.org',
		to_name: 'Utilisateur SmartSplit',
		to_email: 'qa@smartsplit.org',
	},

	jwt_secret: null,

	listen: {
		port: process.env.API_PORT || 3001,
		host: '0.0.0.0',
	},

	http: {
		entityMaxSize: 16 * 1024 * 1024, // 16MB
	},

	logger: true,

	zumrails: {
		apiUsername: '',
		apiPassword: '',
		walletId: '',
		fundingSourceId: '',
		env: 'https://api-sandbox.zumrails.com',
	},
}

try {
	module.exports = {
		...DefaultConfig,
		...require('../config'),
	}
} catch (e) {
	console.warn('Failed to load global configuration, using defaults...')
	module.exports = DefaultConfig
}

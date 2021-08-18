/**
 * Default minimal configuration. See `src/config.js` for all the possible
 * configuration options that can be tweaked.
 */
module.exports = {
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
}

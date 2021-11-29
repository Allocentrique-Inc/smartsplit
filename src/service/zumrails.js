const got = require('got')
const Config = require('../config')

const ENV = Config.zumrails.env || 'https://api-sandbox.zumrails.com'
const API_URL = `${ENV}/api`

function Zumrails(opts = {}) {
	this.apiUsername = opts.apiUsername || Config.zumrails.apiUsername
	this.apiPassword = opts.apiPassword || Config.zumrails.apiPassword
	this.walletId = opts.walletId || Config.zumrails.walletId
	this.fundingSourceId = opts.fundingSourceId || Config.zumrails.fundingSourceId
	this.accessTokenExpireDate = Date.now()
	this.accessToken = undefined
	this.customerId = undefined

	if (!this.apiUsername) {
		throw new Error('apiUsername is required')
	}

	if (!this.apiPassword) {
		throw new Error('apiPassword is required')
	}
}

Zumrails.prototype.apiRequest = async function apiRequest(
	method,
	path,
	body = {},
	auth = true
) {
	const opts = { body, json: true }
	if (auth)
		opts.headers = { Authorization: `Bearer ${await this.getAccessToken()}` }
	try {
		const response = await got[method](API_URL + path, opts)
		return response.body.result
	} catch (err) {
		throw new Error(
			'Zumrails API Request failed with error: ' +
				JSON.stringify({
					url: `${err.method} ${err.url}`,
					statusCode: err.statusCode,
					statusMessage: err.statusMessage,
					body: err.body,
				})
		)
	}
}

Zumrails.prototype.getUserById = function getUserById(userId) {
	return this.apiRequest('get', `/user/${userId}`)
}

Zumrails.prototype.getFundingSources = function getFundingSources() {
	return this.apiRequest('post', '/fundingsource/filter')
}

Zumrails.prototype.getWallets = function getWallets() {
	return this.apiRequest('get', '/wallet')
}

Zumrails.prototype.withdrawZumWallet = function withdrawZumWallet(amount) {
	return this.apiRequest('post', '/transaction', {
		ZumRailsType: 'WithdrawZumWallet',
		TransactionMethod: 'Eft',
		Amount: amount,
		WalletId: this.walletId,
		FundingSourceId: this.fundingSourceId,
	})
}

Zumrails.prototype.fundZumWallet = function fundZumWallet(amount) {
	return this.apiRequest('post', '/transaction', {
		ZumRailsType: 'FundZumWallet',
		TransactionMethod: 'Eft',
		Amount: amount,
		WalletId: this.walletId,
		FundingSourceId: this.fundingSourceId,
	})
}

Zumrails.prototype.fundUser = function fundUser(amount, userId) {
	return this.apiRequest('post', '/transaction', {
		ZumRailsType: 'AccountsPayable',
		TransactionMethod: 'Eft',
		Amount: amount,
		WalletId: this.walletId,
		UserId: userId,
	})
}

Zumrails.prototype.withdrawUser = function withdrawUser(amount, userId) {
	return this.apiRequest('post', '/transaction', {
		ZumRailsType: 'AccountsReceivable',
		TransactionMethod: 'Eft',
		Amount: amount,
		UserId: userId,
		WalletId: this.walletId,
	})
}

Zumrails.prototype.userTransfer = function userTransfer(
	amount,
	userFrom,
	userTo
) {
	return this.apiRequest('post', '/transaction', {
		ZumRailsType: 'UserTransfer',
		TransactionMethod: 'Eft',
		Amount: amount,
		UserId: userFrom,
		TargetUserId: userTo,
	})
}

Zumrails.prototype.authorize = function authorize() {
	return this.apiRequest(
		'post',
		'/authorize',
		{
			Username: this.apiUsername,
			Password: this.apiPassword,
		},
		false
	)
}

Zumrails.prototype.getAccessToken = async function getAccessToken() {
	if (this.accessToken && Date.now() < this.accessTokenExpireDate)
		return this.accessToken
	try {
		const res = await this.authorize()
		this.accessToken = res.Token
		this.accessTokenExpireDate = Date.now() + 3300
		this.customerId = res.CustomerId
		return this.accessToken
	} catch (err) {
		throw new Error('Invalid credentials, cannot obtain access token')
	}
}

const zumrails = new Zumrails()

module.exports = zumrails

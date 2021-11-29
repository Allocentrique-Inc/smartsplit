async function routes(fastify, options) {
	fastify.register(require('./auth'))
	fastify.register(require('./promos'))
	fastify.register(require('./products'))
	fastify.register(require('./entities'))
	fastify.register(require('./purchases'))
	fastify.register(require('./webhooks'))
	fastify.register(require('./users/routes'))
	fastify.register(require('./workpieces/routes'))
	fastify.register(require('./transactions'))
	fastify.register(require('./stocks'))
}

module.exports = routes

import JSONSerializer from '@ember-data/serializer/json';

export default JSONSerializer.extend({
	keyForAttribute(key) {
		return key;
	},

	normalizeResponse(store, primaryModelClass, payload, id, requestType) {
		return this._super(store, primaryModelClass, payload.accounts, id, requestType);
	},
});

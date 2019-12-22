import JSONSerializer from '@ember-data/serializer/json';
import { underscore } from '@ember/string';

export default JSONSerializer.extend({
	keyForAttribute(key) {
		return underscore(key);
	},

	normalizeResponse(store, primaryModelClass, payload, id, requestType) {
		return this._super(store, primaryModelClass, payload.transactions, id, requestType);
	},
});

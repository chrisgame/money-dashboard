import JSONApiSerializer from '@ember-data/serializer/json-api';

export default JSONApiSerializer.extend({
	keyForAttribute(key) {
		return key;
	},

	normalizeResponse(store, primaryModelClass, payload, id, requestType) {
		let newPayload = {
			data: {
				id: payload.client_id,
				attributes: { ...payload },
				type: 'monzo/who-am-i'
			}
		};

		return this._super(store, primaryModelClass, newPayload, id, requestType);
	},
});

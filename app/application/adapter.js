import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { computed } from '@ember/object';

const { RESTAdapter } = DS;

export default RESTAdapter.extend(DataAdapterMixin, {
	host: 'https://api.monzo.com',

	headers: computed('session.data.authenticated.accessToken', function() {
		let headers = {};
		if (this.session.isAuthenticated) {
			headers['Authorization'] = `Bearer ${this.session.data.authenticated.accessToken}`;
		}

		return headers;
	}),

	pathForType(type) {
		if (type === 'monzo/who-am-i') {
			return 'ping/whoami';
		} else {
			return this._super(...arguments);
		}
	},
});

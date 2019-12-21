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
    switch (type) {
      case 'monzo/who-am-i':
        return 'ping/whoami';
      case 'monzo/accounts':
        return 'accounts';
      default:
        return this._super(...arguments);
    }
  },
});

import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
	async model() {
		let result = await this.store.findAll('monzo/who-am-i');

		return result.firstObject;
	}
});

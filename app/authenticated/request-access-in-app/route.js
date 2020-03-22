import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
	async model() {
		return {
      profile: await this.store.findAll('monzo/who-am-i').firstObject,
    };
	}
});

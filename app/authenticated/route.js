import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
	async model() {
    let results = await RSVP.hash({
      profile: this.store.findAll('monzo/who-am-i'),
      accounts: this.store.findAll('monzo/accounts'),
    });

    let { profile, accounts } = results;

		return {
      profile: profile.firstObject,
      accounts,
    };
	}
});

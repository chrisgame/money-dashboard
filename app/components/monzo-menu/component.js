import Component from '@ember/component';
import { dasherize } from '@ember/string';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  session: service(),

  actions: {
    redirectToAccount(account) {
      this.session.set('data.monzo.account', {
        id: account.id,
        description: account.description,
        created: account.created,
      });
      this.router.transitionTo('authenticated.transactions', dasherize(account.description));
    },
  },
});

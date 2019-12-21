import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  session: service(),

  actions: {
    redirectToAccount(account) {
      this.session.set('data.account', account);
      this.router.transitionTo('authenticated.account', account.id);
    },
  },
});

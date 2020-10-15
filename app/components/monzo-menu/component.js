import Component from '@ember/component';
import { dasherize } from '@ember/string';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  session: service(),

  init() {
    this._super(...arguments);
    let account = this.get('accounts').firstObject;

    this.get('session').set('data.monzo.account', {
      id: account.id,
      description: account.description,
      personalizedDescription: account.personalizedDescription,
      created: account.created,
    });
    this.router.transitionTo('authenticated.accounts.transactions', dasherize(account.personalizedDescription));
  },

  actions: {
    redirectToAccount(account) {
      this.get('session').set('data.monzo.account', {
        id: account.id,
        description: account.description,
        personalizedDescription: account.personalizedDescription,
        created: account.created,
      });
      this.router.transitionTo('authenticated.accounts.transactions', dasherize(account.personalizedDescription));
    },
  },
});

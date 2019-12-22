import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  async model() {
    let { monzo } = get(this.session, 'data');

    if (!monzo.account || !monzo.account.id) {
      this.transitionTo('authenticated');
    }

    let { id } = get(this.session, 'data.monzo.account');
    let transactions;

    try {
      transactions = await this.store.query('monzo/transactions', { 'account_id': id });
    } catch(e) {
      this.transitionTo('login');
    }
    return {
      transactions,
    };
  },
});

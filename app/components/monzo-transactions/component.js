import Component from '@ember/component';

export default Component.extend({
  init() {
		this._super(...arguments);
    console.table(this.attrs.transactions.value.map((transaction) => transaction.toJSON()));
  }
});

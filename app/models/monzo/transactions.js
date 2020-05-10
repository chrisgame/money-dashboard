import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  accountBalance: attr('number'),
  amount: attr('number'),
  created: attr('date'),
  currency: attr('string'),
  description: attr('string'),
  isLoad: attr('boolean'),
  notes: attr('string'),
  settled: attr('date'),
  merchant: attr(),

  amountString: computed('amount,currency', function() {
    let { amount, currency } = this;

    return new Intl.NumberFormat('en-gb', { style: 'currency', currency }).format(amount/100);
  }),

  smartDescription: computed('merchant.name,notes', function() {
    let { merchant, notes } = this;

    if (merchant && notes) {
      return `${merchant.name} - ${notes}`;
    } else if (merchant) {
      return merchant.name;
    } else {
      return undefined;
    }
  }),
});

import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { DateTime } from 'luxon';

export default Model.extend({
  accountBalance: attr('number'),
  amount: attr('number'),
  created: attr('string'),
  currency: attr('string'),
  description: attr('string'),
  isLoad: attr('boolean'),
  notes: attr('string'),
  settled: attr('string'),
  merchant: attr(),

  unsignedAmount: computed('amount', function() {
    let { amount } = this;
    return amount * -1;
  }),

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

  createdDate: computed('created', function() {
    let { created } = this;

    return DateTime.fromISO(created);
  }),

  createdDateString: computed('createdDate', function() {
    let { createdDate } = this;

    return createdDate.toFormat('yyyy/MM/dd');
  }),
});

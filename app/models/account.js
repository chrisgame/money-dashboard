import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  account: DS.attr('string'),

  transaction: DS.hasMany('transaction'),

  accountNumber: computed('account', function() {
    let account = this.account;

    return account.match(/\s(.*)/)[1];
  }),

  sortCode: computed('account', function() {
    let account = this.account;

    return account.match(/(.*)\s/)[1];
  })
});

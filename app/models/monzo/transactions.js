import Model, { attr } from '@ember-data/model';

export default Model.extend({
  accountBalance: attr('number'),
  amount: attr('number'),
  category: attr('string'),
  created: attr('date'),
  currency: attr('string'),
  description: attr('string'),
  isLoad: attr('boolean'),
  merchant: attr('string'),
  notes: attr('string'),
  settled: attr('date'),
});

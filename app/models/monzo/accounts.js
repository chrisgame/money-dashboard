import Model, { attr } from '@ember-data/model';

export default Model.extend({
  description: attr('string'),
  created: attr('string'),
});

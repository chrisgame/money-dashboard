import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  description: attr('string'),
  type: attr('string'),
  created: attr('string'),
  owners: attr(),

  personalizedDescription: computed('type,desciption,owners', function() {
    let { type } = this;

    if (type === "uk_retail_joint") {
      let firstNames = this.owners.mapBy('preferred_first_name');
      firstNames.lastObject.pluralize;

      return `${firstNames.join(' and ')}'s joint account`;
    }

    return `${this.owners.firstObject.preferred_first_name}'s account`;
  }),
});

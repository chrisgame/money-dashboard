import { Serializer } from 'ember-cli-mirage';
import { dasherize } from '@ember/string';

export default Serializer.extend({
  keyForAttribute(attr) {
    return attr.underscore();
  },

  keyForRelationship(attr) {
    return dasherize(attr);
  }
});

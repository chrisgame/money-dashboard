import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  authenticated: attr('boolean'),
  client_id: attr('string'),
  user_id: attr('string'),

  clientId: computed.reads('client_id'),
  userId: computed.reads('user_id'),
});

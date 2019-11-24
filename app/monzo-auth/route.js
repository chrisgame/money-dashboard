import Route from '@ember/routing/route';
import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Route.extend({
  queryParams: {
    code: {
      refreshModel: true
    },
    state: {
      refreshModel: true
    },
  },

  session: service(),

  model(params) {
    return this.session.authenticate('authenticator:monzo', params);
  },

  afterModel() {
    if (!Ember.production) {
      this.redirectTo('authenticated');
    }
  },
});

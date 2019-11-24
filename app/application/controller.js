import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  session: service(),

  notOnLoginRoute: computed('router.currentRoute', function() {
    return this.router.currentRoute.name !== 'login';
  }),

  actions: {
    login() {
      this.router.transitionTo('login');
    },
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});

import Controller from '@ember/controller';
import ENV from 'money-dashboard/config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  session: service(),

  actions: {
    authenticate() {
      let { clientId, clientSecret } = this;
      let redirectUri = 'http://local-money-dashboard.com:4200/monzo-auth';

      localStorage.setItem('monzo', JSON.stringify({
        clientId,
        clientSecret,
      }));

      if(ENV.environment !== 'production') {
        this.router.transitionTo('monzo-auth', {
          queryParams: {
            code: 'acbdfe',
            state: 'random'
          }
        });
      } else {
        window.location = `https://auth.monzo.com/?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${clientSecret}`;
      }
    }
  }
});

import EmberRouter from '@ember/routing/router';
import config from 'money-dashboard/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('login');
  this.route('monzo-auth');
  this.route('authenticated', { path: '' }, function() {
    this.route('request-access-in-app');
    this.route('accounts', function() {
      this.route('transactions', { path: '/:account_description/transactions' });
    });
  });
  this.route('statement-upload');
});

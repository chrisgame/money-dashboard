import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  actions: {
    async authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      try {
        await this.session.authenticate('authenticator:oauth2', identification, password);
      } catch(error) {
        this.set('errorMessage', error.error || error);
      }

      if (this.session.isAuthenticated) {
        // What to do with all this success?
      }
    }
  }
});

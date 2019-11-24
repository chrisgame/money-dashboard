import Base from 'ember-simple-auth/authenticators/base';
import RSVP from 'rsvp';
import ajax from 'ember-fetch/ajax';
import { inject as service } from '@ember/service';

export default Base.extend({
  session: service(),

  async authenticate({ code, state }) {
    let redirectUri = 'http://local-money-dashboard.com:4200/monzo-auth';
    let { clientId, clientSecret } = this.session.get('data');
    if (clientSecret !== state) {
      //abort
    }

    let formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('redirect_uri', redirectUri);
    formData.append('code', code);

    let {
      'access_token': accessToken,
      'client_id': responseClientId,
      'expires_in': expiresIn,
      'token_type': tokenType,
    } = await ajax(
      'https://api.monzo.com/oauth2/token',
      {
        method: 'POST',
        body: formData,
      }
    );

    return {
      accessToken,
      clientId: responseClientId,
      expiresIn,
      tokenType,
    };
  },

  restore() {
    return RSVP.resolve();
  },
});

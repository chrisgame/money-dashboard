import Base from 'ember-simple-auth/authenticators/base';
import RSVP from 'rsvp';
import ajax from 'ember-fetch/ajax';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Base.extend({
  session: service(),

  async authenticate({ code, state }) {
    let redirectUri = 'http://local-money-dashboard.com:4200/monzo-auth';
    let { accessToken, clientId, clientSecret } = JSON.parse(localStorage.getItem('monzo'));

    if (!accessToken && code) {
      let formData = new FormData();
      formData.append('grant_type', 'authorization_code');
      formData.append('client_id', clientId);
      formData.append('client_secret', clientSecret);
      formData.append('redirect_uri', redirectUri);
      formData.append('code', code);

      let tokenResponse = await ajax(
        'https://api.monzo.com/oauth2/token',
        {
          method: 'POST',
          body: formData,
        }
      );

      let {
        'access_token': accessToken,
        'expires_in': expiresIn,
        'token_type': tokenType,
        'user_id': userId,
        scope,
      } = tokenResponse;

      this.session.data.monzo = {
        accessToken,
        expiresIn,
        tokenType,
        userId,
        scope
      };
    }

    return RSVP.resolve();
  },

  restore() {
    let { accessToken, clientId, expiresIn, tokenType, userId, scope } = get(this.session, 'data.monzo');

    if (accessToken) {
      return RSVP.resolve();
    }

    return RSVP.reject();
  },

  invalidate() {
    let { session } = this;

    session.set('data.monzo', {});

    return RSVP.resolve()
  },
});

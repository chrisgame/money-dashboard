import { Response } from 'ember-cli-mirage';

export default function() {

  let accessToken = '123-abc-456';

  this.post('https://api.monzo.com/oauth2/authorize', () => {
    return {};
  });

  this.post('https://api.monzo.com/oauth2/token', (schema, request) => {
    let requestBodyAsJson = {};
    request.requestBody.forEach((value, key) => { requestBodyAsJson[key] = value });

    return {
      'access_token': accessToken,
      'client_id': requestBodyAsJson['client_id'],
      'expires_in': 21600,
      'token_type': 'Bearer',
      'user_id': requestBodyAsJson['user_id'],
    };
  });

	this.get('https://api.monzo.com/ping/whoami', (schema, request) => {
    let error = undefined;

    if (request.requestHeaders.authorization !== `Bearer ${accessToken}`) {
      error = {
        'code':'bad_request.invalid_token',
        'message':'Token is invalid',
      };
    }

    if (error) {
      return new Response(400, {}, error);
    }

		return {
			'authenticated': true,
			'client_id': 'the_client_id',
			'user_id': 'the_user_id'
		};
	});

  this.get('https://api.monzo.com/accounts', (schema, request) => {
    let error = undefined;

    if (request.requestHeaders.authorization !== `Bearer ${accessToken}`) {
      error = {
        'code':'bad_request.invalid_token',
        'message':'Token is invalid',
      };
    }

    if (error) {
      return new Response(400, {}, error);
    }

    return {
      'accounts': [
        {
          'id': 'acc_00009237aqC8c5umZmrRdh',
          'description': "Peter Pan's Account",
          'created': '2015-11-13T12:17:42Z'
        },
        {
          'id': 'acc_01009237sdfdsfdsw4rwefxsew',
          'description': "Captain Hook's Account",
          'created': '2016-11-13T12:17:42Z'
        }
      ]
    };
  });

  this.get('https://api.monzo.com/transactions', (schema, request) => {
    let error = undefined;

    if (request.requestHeaders.authorization !== `Bearer ${accessToken}`) {
      error = {
        'code':'bad_request.invalid_token',
        'message':'Token is invalid',
      };
    }

    if (!request.queryParams['account_id'].length) {
      error = {
        'code':'bad_request.no_account_id',
        'message':'Account id was not specified',
      };
    }

    if (error) {
      return new Response(400, {}, error);
    }

    return schema['monzoTransactions'].all();
  });
}

import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  keyForModel() {
    return 'transaction';
  }
});

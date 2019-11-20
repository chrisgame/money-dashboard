import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | transaction uploader', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{transaction-uploader}}`);

    assert.equal(this.element.text().trim(), '');

    // Template block usage:
    await render(hbs`
      {{#transaction-uploader}}
        template block text
      {{/transaction-uploader}}
    `);

    assert.equal(this.element.text().trim(), 'template block text');
  });
});

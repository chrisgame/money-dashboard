import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('transaction-uploader', 'Integration | Component | transaction uploader', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{transaction-uploader}}`);

  assert.equal(this.element.text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#transaction-uploader}}
      template block text
    {{/transaction-uploader}}
  `);

  assert.equal(this.element.text().trim(), 'template block text');
});

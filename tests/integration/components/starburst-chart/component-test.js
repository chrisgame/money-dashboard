import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('starburst-chart', 'Integration | Component | starburst chart', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{starburst-chart}}`);

  assert.equal(this.element.text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#starburst-chart}}
      template block text
    {{/starburst-chart}}
  `);

  assert.equal(this.element.text().trim(), 'template block text');
});

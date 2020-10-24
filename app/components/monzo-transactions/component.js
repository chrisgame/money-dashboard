import Component from '@ember/component';
import { computed } from '@ember/object';
import d3 from 'd3';

export default Component.extend({
  init() {
		this._super(...arguments);
    console.table(this.attrs.transactions.value.map((transaction) => transaction.toJSON()));
  },

  width: computed(function() {
    return Math.min(window.innerWidth, window.innerHeight) - 20;
  }),

  lineChartHeight: computed('width', function() {
    let width = this.get('width');

    return width / 3;
  }),

  colorScale: computed('accounts', function() {
    let uniqDescriptions = this.store.peekAll('transaction').filterBy('direction', 'outgoing').mapBy('category').uniq().sort();
    return d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, uniqDescriptions.length + 1));
  }),
});

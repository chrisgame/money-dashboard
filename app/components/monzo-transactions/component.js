import Component from '@ember/component';
import { capitalize } from '@ember/string';
import { computed } from '@ember/object';
import d3 from 'd3';

export default Component.extend({
  init() {
		this._super(...arguments);
    console.table(this.attrs.transactions.value.map((transaction) => transaction.toJSON()));
  },

  width: computed(function() {
    return window.innerWidth - 20;
  }),

  lineChartHeight: computed('width', function() {
    let width = this.get('width');

    return width / 2;
  }),

  colorScale: computed('accounts', function() {
    let uniqDescriptions = this.store.peekAll('transaction').filterBy('direction', 'outgoing').mapBy('category').uniq().sort();
    return d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, uniqDescriptions.length + 1));
  }),

  convertToGbp(value) {
    let formatter = new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP',
			minimumFractionDigits: 2
		});

    return formatter.format(value / 100);
  },

  convertToWholeGbp(value) {
    let formatter = new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP',
			minimumFractionDigits: 0
		});

    return formatter.format(Math.ceil(value / 100));
  },

  formatText(text) {
    return capitalize(text).replaceAll('_', ' ');
  }
});

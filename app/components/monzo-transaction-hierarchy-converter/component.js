import Component from '@ember/component';
import { capitalize } from '@ember/string';
import { computed } from '@ember/object';
import d3 from 'd3';

export default Component.extend({
  rootName: undefined,
  tabularData: undefined,

  init() {
    this._super(...arguments);

    //this.set('hierarchy', []);
  },

  hierarchy: computed('tabularData', function() {
    let tabularData = this.get('tabularData');
    if (!tabularData.get('length')) {
      return [];
    }

    let root = { name: this.get('rootName'), parent: null };

    let categories = tabularData.filter(transaction => transaction.amount < 0).mapBy('merchant.category').uniq().sort();
    let parents = categories.map(category => {
      let childrenTotal = Math.abs(tabularData.filterBy('merchant.category', category).reduce((sum, current) => {
          return sum + parseFloat(current.get('amount') * 1);
        }, 0)) / 100;

      return {
        nodeType: 'group',
        name: this.capitalizeString(category),
        parent: this.get('rootName'),
        category: this.capitalizeString(category),
        total: childrenTotal.toFixed(2)
      };
    });

    let children = tabularData.filter(transaction => transaction.amount < 0).map(transaction => {
      let { amount, merchant, smartDescription } = transaction;
      let direction = amount < 0 ? 'outgoing' : 'incoming';
      let unsignedAmount = amount * -1;
      let adjustedAmount = unsignedAmount / 100
      let parentString;

      if (merchant && merchant.category) {
        parentString = merchant.category;
      } else {
        parentString = 'general';
      }

      return {
        nodeType: 'transaction',
        name: smartDescription,
        parent: this.capitalizeString(parentString),
        value: adjustedAmount.toFixed(2),
        direction
      }
    });

    let preStratData = [
      root,
      ...parents.sort((a, b) => {
        return b.total - a.total;
      }),
      ...children.sort((a, b) => {
        return b.value - a.value;
      })
    ];

    if (children.length) {
      return d3.stratify()
        .id(function(d) { return d.name; })
        .parentId(function(d) { return d.parent; })(preStratData);
    } else {
      return [];
    }
  }),

  colorScale: computed('hierarchy', function() {
    let parentsLength = this.get('hierarchy').children.length;

    return d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, parentsLength + 1));
  }),

  capitalizeString(string) {
    if (!string) {
      return string;
    }

    return string.split('_').map(text => text.capitalize()).join(' ');
  },
});

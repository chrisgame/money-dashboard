import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import d3 from 'd3';

export default Component.extend({
  accounts: null,

  store: service(),

  colorScale: computed(function() {
    return d3.scaleOrdinal(d3.schemeCategory20);
  }),

  transactionsGroupHierarchy: computed('accounts', function() {
    let accounts = this.store.peekAll('account');
    if (!accounts.get('length')) {
      return [];
    }

    let account = accounts.get('firstObject');
    let root = { name: account.get('accountNumber'), parent: null };

    let uniqDescriptions = this.store.peekAll('transaction').filterBy('direction', 'outgoing').mapBy('payee').uniq().sort();
    let parents = uniqDescriptions.map(payee => {
      let childrenTotal = Math.abs(this.store.peekAll('transaction').filterBy('payee', payee).reduce((sum, current) => {
          return sum + parseFloat(current.get('amount'));
        }, 0)).toFixed(2);

      return {
        nodeType: 'group',
        name: payee,
        parent: account.get('accountNumber'),
        payee: payee,
        total: childrenTotal
      };
    });

    let children = this.store.peekAll('transaction').filterBy('direction', 'outgoing').map(transaction => {
      return {
        nodeType: 'transaction',
        name: transaction.get('memo'),
        parent:  transaction.get('payee'),
        value: transaction.get('value'),
        direction: transaction.get('direction')
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

  actions: {
    handleFileUpload(evt) {
      let file = evt.target.files[0];
      let reader = new FileReader();
      let createdAccounts = new Map();

      reader.onloadend = (endEvt => {
        if (endEvt.target.readyState == FileReader.DONE) {
          d3.csvParseRows(endEvt.target.result, data => {
            if (data[0] !== 'Number') {
              if (![...createdAccounts.keys()].includes(data[2])) {
                let accountRecord = this.store.createRecord('account', {
                  account: data[2].trim()
                });

                createdAccounts.set(data[2], accountRecord);
              }

              this.store.createRecord('transaction', {
                date: data[1],
                account: createdAccounts.get(data[2]),
                amount: data[3].trim(),
                subcategory: data[4].trim(),
                memo: this._buildMemoString(data[5], data[6], data[4])
              });
            }
          });

          this.set('accounts', this.store.peekAll('account'));
        }
      });

      let blob = file.slice(0, file.size);
      reader.readAsText(blob);
    }
  },

  _buildMemoString(col1, col2, subcategory) {
    if (col2) {
      return `${col1.trim()} ${col2.trim()}`;
    }

    if (subcategory === 'OTH') {
      return `Bank Charges   ${col1.trim()}`;
    }

    return col1.trim();
  },
});

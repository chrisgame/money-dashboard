import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import d3 from 'd3';

export default Component.extend({
  accounts: null,

  store: service(),

  transactionsGroupHierarchy: computed('accounts', function() {
    let accounts = this.get('store').peekAll('account');
    if (!accounts.get('length')) {
      return [];
    }

    let account = accounts.get('firstObject');
    let root = { name: account.get('accountNumber'), parent: null };

    let uniqDescriptions = this.get('store').peekAll('transaction').mapBy('payee').uniq().sort();
    let parents = uniqDescriptions.map(description => {
      return { name: description, parent: account.get('accountNumber'), amount: null };
    });

    let children = this.get('store').peekAll('transaction').map(transaction => {
      return {
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
        .parentId(function(d) { return d.parent; })
        (preStratData);
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
                let accountRecord = this.get('store').createRecord('account', {
                  account: data[2].trim()
                });

                createdAccounts.set(data[2], accountRecord);
              }

              this.get('store').createRecord('transaction', {
                date: data[1],
                account: createdAccounts.get(data[2]),
                amount: data[3].trim(),
                subcategory: data[4].trim(),
                memo: data[5].trim()
              });
            }
          });

          this.set('accounts', this.get('store').peekAll('account'));
        }
      });

      let blob = file.slice(0, file.size);
      reader.readAsText(blob);
    }
  }
});

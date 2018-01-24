import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import d3 from 'd3';

export default Component.extend({
  accounts: null,

  store: service(),

  transactionsGroupHierarchy: computed('accounts', function() {
    let root = new Map();
    let groupedTransactions = this.get('store').peekAll('transaction').map((transaction) => {
      return {
        description: transaction.get('description').trim(),
        memo:  transaction.get('memo').trim(),
        amount: transaction.get('amount')
      }
    }).sort();

    groupedTransactions.forEach(transaction => {
      if (root.get(transaction.description)) {
        let children = root.get(transaction.description);
        root.set(transaction.description, [
          ...children,
          {
            name: transaction.memo,
            size: transaction.amount
          }
        ]);
      } else {
        root.set(transaction.description, [
          {
            name: transaction.memo,
            size: transaction.amount
          }
        ]);
      }
    });

    let rootChildren = [...root.keys()].map(key => {
      let children = root.get(key);

      return {
        name: key,
        children: children.map(child => {
          return {
            name: child.name,
            size: child.size
          }
        })
      }
    });

    return {
      name: 'root',
      children: rootChildren
    };
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
                  account: data[2]
                });

                createdAccounts.set(data[2], accountRecord);
              }

              this.get('store').createRecord('transaction', {
                date: data[1],
                account: createdAccounts.get(data[2]),
                amount: data[3],
                subcategory: data[4],
                memo: data[5]
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

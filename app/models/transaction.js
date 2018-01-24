import DS from 'ember-data';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import d3 from 'd3';

export default DS.Model.extend({
  date: DS.attr('date'),
  amount: DS.attr('string'),
  subcategory: DS.attr('string'),
  memo: DS.attr('string'),

  account: DS.belongsTo('account'),

  transactionDate: readOnly('date'),

  description: computed('memo', function() {
    let memo = this.get('memo');

    return memo.match(/(.*)\sON\s/) ? memo.match(/(.*)\sON\s/)[1] : memo;
  }),

  requestDate: computed('memo', function() {
    let memo = this.get('memo');
    let transactionDateParser = d3.utcParse("%d/%m/%Y");
    let requestDateParser = d3.utcParse("%d %b %Y");
    let transactionDateYearFormatter = d3.utcFormat("%Y");
    let transactionDateFormatter = d3.utcFormat("%d/%m/%Y");
    let transactionDateYear = transactionDateYearFormatter(transactionDateParser(this.get('date')));

    if (memo.match(/\sON\s(.*)/)) {
      let memoDate =  memo.match(/\sON\s(\d\d\s\w\w\w)/)[1];

      return transactionDateFormatter(requestDateParser(`${memoDate} ${transactionDateYear}`));
    } else {
      return null;
    }
  })
});

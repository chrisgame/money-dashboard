import Component from '@glimmer/component';
import d3 from 'd3';
import { DateTime } from 'luxon';

export default class MonzoTransactionBucketerComponent extends Component {

  get data() {
    let { tabularData } = this.args;
    let categories = Array.from(
      new Set(
        tabularData.map(
          transaction => transaction.merchant.category
        )
      )
    )

    let categoryList = categories.map(category => ({ name: category, values: [] }));

    let dates = tabularData.map(
      transaction => transaction.createdDate
    )

    let minDate = DateTime.min(...dates);
    let maxDate = DateTime.max(...dates);

    let allDates = d3.timeDay.every(1).range(
        minDate.toJSDate(),
        maxDate.toJSDate(),
      ).map(date => DateTime.fromJSDate(date).toFormat('yyyy-MM-dd'));

    let series = allDates.reduce((acc, date) => {
      let transactions = tabularData.filter(transaction => {
        let a = transaction.createdDate.toFormat('yyyy-MM-dd');
        let b = date;

        return a === b;
      });

      acc.map(category => {
        let amount = transactions.reduce((acc, transaction) => {
          if (transaction.merchant.category === category.name) {
            acc += transaction.unsignedAmount;
          };

          return acc;
        }, 0);
        category.values.push(amount);
      });
      return acc;
    }, categoryList);

    return { series, dates: allDates.map(date => DateTime.fromFormat(date, 'yyyy-MM-dd').toJSDate()) };
  }

  get colorScale() {
    return d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, 11));
  }
}

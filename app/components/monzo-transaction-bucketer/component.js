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

    let transactionDates = tabularData.map(
      transaction => transaction.createdDate
    )

    let minDate = DateTime.min(...transactionDates);
    let maxDate = DateTime.max(...transactionDates);

    let allDates = d3.timeMonth.every(1).range(
        minDate.toJSDate(),
        maxDate.toJSDate(),
      ).map(date => DateTime.fromJSDate(date).toFormat('yyyy-MM'));

    let series = allDates.reduce((acc, date) => {
      let transactions = tabularData.filter(transaction => {
        let a = transaction.createdDate.toFormat('yyyy-MM');
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

		let dates = allDates.map(date => DateTime.fromFormat(date, 'yyyy-MM').toJSDate());

		logValues(dates, series);

    return { series, dates };
  }

  get colorScale() {
    return d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, 11));
  }
}

function logValues(dates, series) {
	let modifiedValues = dates.reduce((acc, date) => {
		if (!acc.date) {
			acc.date = [];
		}

		acc.date.push(DateTime.fromJSDate(date).toFormat('yyyy-MM'));
		series.map((series) => {
			acc[series.name] = series.values;
		});

		return acc;
	}, []);

	console.table(modifiedValues);
}

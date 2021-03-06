import Component from '@glimmer/component';
import d3 from 'd3';
import { DateTime } from 'luxon';

const DEFAULT_CATEGORIES = ['bills', 'cash', 'charity', 'eating_out', 'entertainment', 'expenses', 'family', 'finances', 'general', 'gifts', 'groceries', 'holidays', 'personal_care', 'shopping', 'transport'];

export default class MonzoTransactionBucketerComponent extends Component {

  get data() {
    let { tabularData } = this.args;
    let categories = [
      ...DEFAULT_CATEGORIES,
      ...Array.from(
        new Set(
          tabularData.map(
            transaction => transaction.merchant.category
          )
        )
      )
    ].uniq();

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
    return d3.scaleOrdinal()
      .domain(DEFAULT_CATEGORIES)
      .range(['#5fbedf', '#7cf8fb', '#6a7482', '#aada72', '#9f5ef7', '#b47a5e', '#6083d4', '#5fcc8b', '#9fa5b1', '#bd608e', '#eec074', '#f3a488', '#ed808e', '#ec5fab', '#60a1b1']);
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

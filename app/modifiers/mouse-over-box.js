import { modifier } from 'ember-modifier';
import d3 from 'd3';
import { DateTime } from 'luxon';
import { guidFor } from '@ember/object/internals';

export default modifier((element, [], {
  data,
  dimentions,
  formatLegendLabel,
  y,
  x,
  color,
  onEnterDataPoint,
  onExitDataPoint,
  onEnterDataPointLine,
  onExitDataPointLine,
  onDataPointClick,
}) => {
    const id = `mouse-over-box-${guidFor(element)}`;
    const dataPointDotRadius = 6;

    document.getElementById(id)?.remove();

    const svg = d3.select(element);

		const dataPointLine = svg.append('line');
		const dataPointDots = svg.append('g')
      .selectAll('circle')
      .data(data.series)
      .join('circle');

    const mouseOverLineChartBox = svg.append('rect')
        .attr('width', dimentions.width - dimentions.margin.right - dimentions.yTickGutter - dimentions.legendWidth)
        .attr('height', dimentions.height)
        .attr('opacity', 0)
        .on('mousemove', () => {
          let valueAtMousePosition = y.invert(d3.mouse(mouseOverLineChartBox.node())[1]).toFixed(0);
					let dateAtMousePosition = x.invert(d3.mouse(mouseOverLineChartBox.node())[0]);
          let roundedDateAtMousePosition = nearestMonthTo(dateAtMousePosition);
					let index = data.dates.findIndex(date => DateTime.fromJSDate(date).toFormat('yyyy-MM') === DateTime.fromJSDate(roundedDateAtMousePosition).toFormat('yyyy-MM'));
          let seriesAndValue = data.series.map((item) => ({[item.name]: item.values[index]}));

          if (seriesAndValue) {
            onEnterDataPoint(seriesAndValue, roundedDateAtMousePosition);
          } else {
            onExitDataPoint();
          }

          let isOnDataPointLine = approximateDateMatch(dateAtMousePosition, roundedDateAtMousePosition);

          if (isOnDataPointLine) {
            let values = seriesAndValue.map((item) => Object.values(item)[0]);
            let series = nameOfClosestMatch(seriesAndValue, values, valueAtMousePosition);
            onEnterDataPointLine(series);
          } else {
            onExitDataPointLine();
          }

					dataPointLine.attr('stroke', 'black')
						.attr('x1', x(roundedDateAtMousePosition))
						.attr('x2', x(roundedDateAtMousePosition))
						.attr('y1', dimentions.margin.top)
						.attr('y2', dimentions.height - dimentions.margin.bottom);

          dataPointDots.attr('r', dataPointDotRadius)
            .style('display', 'block')
            .attr('fill', d => color(d.name))
            .attr('stroke', 'white')
            .attr('cx', () => x(roundedDateAtMousePosition))
            .attr('cy', d => y(d.values[index]));
				})
        .on('mouseout', () => {
          if (dataPointLine) dataPointLine.attr('stroke', 'none');
          if (dataPointDots) dataPointDots.style('display', 'none');
          onExitDataPoint();
          onExitDataPointLine();
				})
        .on('click', () => {
          if (onDataPointClick) {
            let dateAtMousePosition = x.invert(d3.mouse(mouseOverLineChartBox.node())[0]);
            let roundedDateAtMousePosition = nearestMonthTo(dateAtMousePosition);

            onDataPointClick(roundedDateAtMousePosition);
          }
        });

  return () =>  {
    /* Cleanup when the modifier is torn down */
    document.getElementById(id)?.remove();
  };
});

function approximateDateMatch(dateTime1, dateTime2) {
  let date1 = DateTime.fromJSDate(dateTime1).startOf('day');
  let date2 = DateTime.fromJSDate(dateTime2).startOf('day');
  let diff = date1.diff(date2, 'days').days;

  return diff <= 3 && diff >= -3;
}

function nearestMonthTo(date) {
  let parsedDate = DateTime.fromJSDate(date);
  let resetDate = parsedDate.set({ day: 1, hour: 0, minute: 0, second: 1});

  if ( parsedDate.day > (parsedDate.daysInMonth / 2)) {
    return resetDate.plus({ months: 1 }).toJSDate();
  }

  return resetDate.toJSDate();
};

function nameOfClosestMatch(seriesAndValue, values, value) {
  let closestMatch = values.reduce((acc, obj) => {
    return Math.abs(obj - value) < Math.abs(acc - value) ? obj : acc;
  });

  return Object.keys(seriesAndValue.filter((item) => Object.values(item)[0] === closestMatch)[0])[0];
}

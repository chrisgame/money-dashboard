import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import d3 from 'd3';
import { DateTime } from 'luxon';
import { capitalize } from '@ember/string';
import { guidFor } from '@ember/object/internals';

export default class LineChartComponent extends Component {
  get chartId() {
    return `${guidFor(this)}-chart`;
  }

  @action
  drawChart(element, [elementHeight, elementWidth, data]) {
    const color = this.args.color;
    const { formatValue, formatValueForAxis } = this.args;
    const margin = ({top: 20, right: 0, bottom: 30, left: 20});
    const height = elementHeight;
    const width = elementWidth;
    const yTickGutter = 50;
    const dataPointDotRadius = 6;
    const legendWidth = 200;
    const defaultLegendOffset = 50;
    const legendChartOffset = 10;
    const legendTextPadding = 5;
    const legendChartBarStroke = 2;
		const legend = d3.select('#legend');

    if (!elementHeight || !elementWidth) {
      return;
    }

    const svg = d3.select(`#${this.chartId}`).append('svg')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleUtc()
      .domain(d3.extent(data.dates))
      .range([margin.left, width - margin.right - yTickGutter - legendWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
      .range([height - margin.bottom, margin.top]);

    const legendX = d3.scaleLinear()
      .domain([0, d3.max(data.series, d => d3.max(d.values))])
      .range([width - legendWidth + legendChartOffset - margin.right, width - margin.right - legendChartBarStroke]);

    const legendY = d3.scaleBand()
      .domain(data.series.map(item => item.name))
      .range([margin.top, height - margin.bottom]);

    const line = d3.line()
      .defined(d => !isNaN(d))
      .x((d,i) => x(data.dates[i]))
      .y(d => y(d));

    const xAxis = g => g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const yAxis = g => g
      .attr('transform', `translate(${width - yTickGutter - legendWidth},0)`)
      .call(d3.axisRight(y).tickFormat(value => (formatValueForAxis(value))))
      .call(g => g.select('.domain').remove());

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    const path = svg.append('g')
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
      .selectAll('path')
      .data(data.series)
      .join('path')
        .attr('stroke', d => color(d.name))
        .attr('d', d => line(d.values));

    const alphabetisedDataSeries = data.series.sort((a, b) => a.name.localeCompare(b.name));
    legendX.domain([0, d3.max(alphabetisedDataSeries, d => d3.max(d.values))]);
    legendY.domain(alphabetisedDataSeries.map(item => item.name));

    const defaultLegendDots = svg.append('g')
      .selectAll('circle')
      .data(data.series)
      .join('circle')
      .attr('cx', legendX(0) + defaultLegendOffset)
      .attr('cy', d => legendY(d.name) + legendY.bandwidth() / 2)
      .attr('r', dataPointDotRadius)
      .style('fill', (d) => color(d.name));

    const defaultLegendText = svg.append('g')
      .selectAll('text')
      .data(data.series)
      .join('text')
      .attr('x', legendX(0) + legendTextPadding + dataPointDotRadius + defaultLegendOffset)
      .attr('y', d => legendY(d.name) + legendY.bandwidth() / 2 + legendTextPadding)
      .text((d) => formatText(d.name));

    const legendChartBars = svg.append('g')
      .selectAll('rect')
      .data(data.series)
      .join('rect');

    const legendChartText = svg.append('g')
      .selectAll('text')
      .data(data.series)
      .join('text');

		const dataPointLine = svg.append('line');
		const dataPointDots = svg.append('g')
      .selectAll('circle')
      .data(data.series)
      .join('circle');

    const mouseOverLineChartBox = svg.append('rect')
        .attr('width', width - margin.right - yTickGutter - legendWidth)
        .attr('height', height)
        .attr('opacity', 0)
        .on('mousemove', () => {
          let valueAtMousePosition = y.invert(d3.mouse(mouseOverLineChartBox.node())[1]).toFixed(0);
					let dateAtMousePosition = x.invert(d3.mouse(mouseOverLineChartBox.node())[0]);
          let roundedDateAtMousePosition = nearestMonthTo(dateAtMousePosition);
					let index = data.dates.findIndex(date => DateTime.fromJSDate(date).toFormat('yyyy-MM') === DateTime.fromJSDate(roundedDateAtMousePosition).toFormat('yyyy-MM'));

          path.attr("stroke", d => {
            let seriesAndValue = data.series.map((item) => ({[item.name]: item.values[index]}));
            let isOnDataPointLine = approximateDateMatch(dateAtMousePosition, roundedDateAtMousePosition);

            return colorGivenMousePosition(seriesAndValue, valueAtMousePosition, isOnDataPointLine, color, d);
          });

          let sortedDataSeries = data.series.sort((a, b) => byValueAtIndex(a, b, index));
          legendX.domain([0, d3.max(sortedDataSeries, d => d3.max(d.values))]);
          legendY.domain(sortedDataSeries.map(item => item.name));

					dataPointLine.attr('stroke', 'black')
						.attr('x1', x(roundedDateAtMousePosition))
						.attr('x2', x(roundedDateAtMousePosition))
						.attr('y1', margin.top)
						.attr('y2', height - margin.bottom);

          dataPointDots.attr('r', dataPointDotRadius)
            .style('display', 'block')
            .attr('fill', d => color(d.name))
            .attr('stroke', 'white')
            .attr('cx', () => x(roundedDateAtMousePosition))
            .attr('cy', d => y(d.values[index]));

          if (defaultLegendText) defaultLegendText.style('display', 'none');
          if (defaultLegendDots) defaultLegendDots.style('display', 'none');

          legendChartBars.style('display', 'block')
            .attr('stroke', d => color(d.name))
            .attr('stroke-width', legendChartBarStroke)
            .attr('stroke-opacity', 1)
            .attr('fill', d => color(d.name))
            .attr('fill-opacity', 0.7)
            .attr('x', legendX(0))
            .attr('y', d => legendY(d.name))
            .attr('height', legendY.bandwidth() - legendChartBarStroke)
            .attr('width', d => legendX(d.values[index]) - legendX(0));

          legendChartText.style('display', 'block')
              .attr('x', legendX(0) + legendTextPadding)
              .attr('y', d => legendY(d.name) + legendY.bandwidth() / 2 + legendTextPadding)
              .text((d) => {
                let value = d.values[index];
                return value ? `${formatText(d.name)}: ${formatValue(value)}` : '';
              });
				})
        .on('mouseout', () => {
          if (dataPointLine) dataPointLine.attr('stroke', 'none');
          if (dataPointDots) dataPointDots.style('display', 'none');
          if (legendChartBars) legendChartBars.style('display', 'none');
          if (legendChartText) legendChartText.style('display', 'none');
          if (defaultLegendText) defaultLegendText.style('display', 'block');
          if (defaultLegendDots) defaultLegendDots.style('display', 'block');
          if (path) path.attr('stroke', d => color(d.name));
				});
  }
}

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

function formatText(text) {
  return capitalize(text).replaceAll('_', ' ');
}

function byValueAtIndex(a, b, index) {
  let aValue = a.values[index];
  let bValue = b.values[index];

  return bValue - aValue;
}

function colorGivenMousePosition(seriesAndValue, value, onDataPointLine, colorScale, d) {
  let values = seriesAndValue.map((item) => Object.values(item)[0]);
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);

  if (value > maxValue || value < minValue || !onDataPointLine) {
    return colorScale(d.name);
  }

  let closestMatch = values.reduce((acc, obj) => {
    return Math.abs(obj - value) < Math.abs(acc - value) ? obj : acc;
  });

  let name  = Object.keys(seriesAndValue.filter((item) => Object.values(item)[0] === closestMatch)[0])[0];

  return name === d.name ? colorScale(name) : '#ddd';
}

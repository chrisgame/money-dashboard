import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import d3 from 'd3';
import { DateTime } from 'luxon';
import { capitalize } from '@ember/string';

export default class LineChartComponent extends Component {
  @action
  drawChart(element, [elementHeight, elementWidth, data]) {
    const color = this.args.color;
    const margin = ({top: 20, right: 0, bottom: 30, left: 40});
    const height = elementHeight;
    const width = elementWidth;
		const tooltip = d3.select('#tooltip');

    if (!elementHeight || !elementWidth) {
      return;
    }
    const svg = d3.select(element);

    const x = d3.scaleUtc()
      .domain(d3.extent(data.dates))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .defined(d => !isNaN(d))
      .x((d,i) => x(data.dates[i]))
      .y(d => y(d));

    const xAxis = g => g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const yAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select('.domain').remove())
      .call(g => g.select('.tick:last-of-type text').clone()
        .attr('x', 3)
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .text(data.y));

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

		const tooltipLine = svg.append('line');
  	const tipBox = svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('opacity', 0)
        .on('mousemove', () => {
					let dateAtMousePosition = x.invert(d3.mouse(tipBox.node())[0]);
          let roundedDateAtMousePosition = nearestMonthTo(dateAtMousePosition);
					let index = data.dates.findIndex(date => DateTime.fromJSDate(date).toFormat('yyyy-MM') === DateTime.fromJSDate(roundedDateAtMousePosition).toFormat('yyyy-MM'));

					tooltipLine.attr('stroke', 'black')
						.attr('x1', x(roundedDateAtMousePosition))
						.attr('x2', x(roundedDateAtMousePosition))
						.attr('y1', margin.top)
						.attr('y2', height - margin.bottom);

          let tooltipX = x(roundedDateAtMousePosition) + 20;
          let tooltipY = y(d3.mouse(tipBox.node())[0]);

					tooltip
						.style('display', 'block')
            .style('left', `${tooltipX}px`)
            .style('top', `${tooltipY}px`)
            .selectAll('div')
            .html(() => {
              let totals = data.series.reduce((acc, obj) => {
                let value = obj.values[index];
                if (value > 0) {
                  acc.push({ name: capitalize(obj.name.replace('_', ' ')), value: obj.values[index]});
                }

                return acc;
              }, []).sort((a, b) => (b.value - a.value));

              return totals.map((total) => {
                return `<div>${total.name}: ${total.value}</div>`;
              }).join('');
            });
				})
        .on('mouseout', () => {
          if (tooltip) tooltip.style('display', 'none');
          if (tooltipLine) tooltipLine.attr('stroke', 'none');
				});
  }
}

function nearestMonthTo(date) {
  let parsedDate = DateTime.fromJSDate(date);
  let resetDate = parsedDate.set({ day: 1, hour: 0, minute: 0, second: 1});

  if ( parsedDate.day > (parsedDate.daysInMonth / 2)) {
    return resetDate.plus({ months: 1 }).toJSDate();
  }

  return resetDate.toJSDate();
};

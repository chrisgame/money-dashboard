import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import d3 from 'd3';

export default class LineChartComponent extends Component {
  @action
  drawChart(element, [elementHeight, elementWidth, data]) {
    const color = this.args.color;
    const margin = ({top: 20, right: 0, bottom: 30, left: 40});
    const height = elementHeight;
    const width = elementWidth;

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
        .style('mix-blend-mode', 'multiply')
        .attr('stroke', d => color(d.name))
        .attr('d', d => line(d.values));
  }
}

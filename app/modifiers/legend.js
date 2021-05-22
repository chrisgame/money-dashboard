import { modifier } from 'ember-modifier';
import d3 from 'd3';
import { guidFor } from '@ember/object/internals';

export default modifier((element, [], { data, dimentions, formatLabel, color, dataPointDotRadius = 6, legendOffset = 50, legendTextPadding = 5 }) => {
    const id = `legend-${guidFor(element)}`;

    document.getElementById(id)?.remove();

    const svg = d3.select(element);

    const legendX = d3.scaleLinear()
      .domain([0, d3.max(data.series, d => d3.max(d.values))])
      .range([dimentions.legendXStart, dimentions.legendXEnd]);

    const legendY = d3.scaleBand()
      .domain(data.series.map(item => item.name))
      .range([dimentions.margin.top, dimentions.height - dimentions.margin.bottom]);

    const legendDots = svg.append('g')
      .selectAll('circle')
      .data(data.series)
      .join('circle')
      .attr('cx', legendX(0) + legendOffset)
      .attr('cy', d => legendY(d.name) + legendY.bandwidth() / 2)
      .attr('r', dataPointDotRadius)
      .style('fill', (d) => color(d.name));

    const legendText = svg.append('g')
      .selectAll('text')
      .data(data.series)
      .join('text')
      .attr('x', legendX(0) + legendTextPadding + dataPointDotRadius + legendOffset)
      .attr('y', d => legendY(d.name) + legendY.bandwidth() / 2 + legendTextPadding)
      .text((d) => formatLabel(d.name));


  return () =>  {
    /* Cleanup when the modifier is torn down */
    document.getElementById(id)?.remove();
  };
});

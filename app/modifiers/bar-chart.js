import { modifier } from 'ember-modifier';
import d3 from 'd3';
import { DateTime } from 'luxon';
import { guidFor } from '@ember/object/internals';

export default modifier((element, [], { data, dimentions, formatLegendLabel, formatValue, y, x, color, barStroke, textPadding }) => {
    const id = `bar-chart-${guidFor(element)}`;

    document.getElementById(id)?.remove();

    const svg = d3.select(element).append('svg')
      .attr('id', id)
      .attr('width', dimentions.legendWidth)
      .attr('height', dimentions.height);

    const bars = svg.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', x(0))
      .attr('y', d => y(d.name) + y.bandwidth() / 2)
      .style('stroke', d => color(d.name))
      .attr('stroke-width', barStroke)
      .attr('stroke-opacity', 1)
      .attr('fill', d => color(d.name))
      .attr('fill-opacity', 0.7)
      .attr('x', x(0))
      .attr('y', d => y(d.name))
      .attr('height', y.bandwidth() - barStroke)
      .attr('width', d => x(d.value) - x(0));

    const text = svg.append('g')
      .selectAll('text')
      .data(data)
      .join('text')
      .attr('x', x(0) + textPadding)
      .attr('y', d => y(d.name) + y.bandwidth() / 2 + textPadding)
      .text((d) => {
        let value = d.value;
        return value ? `${formatLegendLabel(d.name)}: ${formatValue(value)}` : '';
      });

  return () =>  {
    /* Cleanup when the modifier is torn down */
    document.getElementById(id)?.remove();
  };
});

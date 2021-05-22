import { modifier } from 'ember-modifier';
import d3 from 'd3';
import { guidFor } from '@ember/object/internals';

export default modifier((element, [], { data, dimentions, formatLabel, color, x, y, dataPointDotRadius = 6, legendTextPadding = 5 }) => {
    const id = `legend-${guidFor(element)}`;

    document.getElementById(id)?.remove();

    const svg = d3.select(element);

    const legendDots = svg.append('g')
      .selectAll('circle')
      .data(data.series)
      .join('circle')
      .attr('cx', x(0))
      .attr('cy', d => y(d.name) + y.bandwidth() / 2)
      .attr('r', dataPointDotRadius)
      .style('fill', (d) => color(d.name));

    const legendText = svg.append('g')
      .selectAll('text')
      .data(data.series)
      .join('text')
      .attr('x', x(0) + legendTextPadding + dataPointDotRadius)
      .attr('y', d => y(d.name) + y.bandwidth() / 2 + legendTextPadding)
      .text((d) => formatLabel(d.name));


  return () =>  {
    /* Cleanup when the modifier is torn down */
    document.getElementById(id)?.remove();
  };
});

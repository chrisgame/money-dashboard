import { modifier } from 'ember-modifier';
import d3 from 'd3';
import { guidFor } from '@ember/object/internals';

export default modifier((element, [], { data, x, y, color, strokeWidth = 2 }) => {
    const id = `paths-${guidFor(element)}`;

    document.getElementById(id)?.remove();

    const svg = d3.select(element);

    const line = d3.line()
      .defined(d => !isNaN(d))
      .x((d,i) => x(data.dates[i]))
      .y(d => y(d));

    const path = svg.append('g')
        .attr('id', id)
        .attr('fill', 'none')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
      .selectAll('path')
      .data(data.series)
      .join('path')
        .attr('stroke-width', typeof strokeWidth === 'function' ? d => strokeWidth(d.name) : strokeWidth)
        .attr('stroke', d => color(d.name))
        .attr('d', d => line(d.values));

  return () =>  {
    /* Cleanup when the modifier is torn down */
    document.getElementById(id)?.remove();
  };
});

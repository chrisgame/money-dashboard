import { modifier } from 'ember-modifier';
import d3 from 'd3';
import { guidFor } from '@ember/object/internals';

export default modifier((element, [], { data, width, rangeStart, rangeEnd, formatTickLabel, y}) => {
    const id = `y-axis-${guidFor(element)}`;

    document.getElementById(id)?.remove();

    if (!rangeStart || !rangeEnd || !width) {
      return;
    }

    const svg = d3.select(element);

    const yAxis = g => g
      .attr('transform', `translate(${width},0)`)
      .call(d3.axisRight(y).tickFormat(value => (formatTickLabel(value))))
      .call(g => g.select('.domain').remove());

    svg.append('g')
      .attr('id', id)
      .call(yAxis);

  return () =>  {
    /* Cleanup when the modifier is torn down */
    document.getElementById(id)?.remove();
  };
});

import { modifier } from 'ember-modifier';
import d3 from 'd3';
import { guidFor } from '@ember/object/internals';
import { DateTime } from 'luxon';

export default modifier((element, [], { data, dimentions, x, y, text }) => {
    const id = `legend-text-${guidFor(element)}`;

    document.getElementById(id)?.remove();

    const svg = d3.select(element);

    svg.append('g')
      .attr('id', id)
      .append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .style('display', 'block')
      .text(text);


  return () =>  {
    /* Cleanup when the modifier is torn down */
    document.getElementById(id)?.remove();
  };
});

import { modifier } from 'ember-modifier';
import d3 from 'd3';
import { guidFor } from '@ember/object/internals';

export default modifier((element, [], { data, height, rangeStart, rangeEnd, x}) => {
    const id = `x-axis-${guidFor(element)}`;

    document.getElementById(id)?.remove();

    if (!rangeStart || !rangeEnd || !height) {
      return;
    }

    const svg = d3.select(element);

    const xAxis = g => g
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(rangeEnd / 80).tickSizeOuter(0));

    svg.append('g')
      .attr('id', id)
      .call(xAxis);

  return () =>  {
    /* Cleanup when the modifier is torn down */
    document.getElementById(id)?.remove();
  };
});

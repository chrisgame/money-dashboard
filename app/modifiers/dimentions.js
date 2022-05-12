import { modifier } from 'ember-modifier';
import d3 from 'd3';
import { guidFor } from '@ember/object/internals';

export default modifier((element, [], { width, height }) => {
    const id = `${guidFor(element)}`;

    const svg = d3.select(element)
      .attr('id', id)
      .attr('width', width)
      .attr('height', height);

  return () =>  {
    /* Cleanup when the modifier is torn down */
    document.getElementById(id)?.remove();
  };
});

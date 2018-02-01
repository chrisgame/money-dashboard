import Component from '@ember/component';
import d3 from 'd3';

export default Component.extend({
  tagName: 'div',

  data: null,
  color: null,

  didRender() {
    let width = this.element.clientWidth;
    let height = width;
    let radius = Math.min(width, height) / 2;
    //let color = d3.schemeCategory20c();
    let root = this.get('data');

    if (root.height) {
      let svg = d3.select(this.element).append('svg')
          .attr('width', width)
          .attr('height', height)
        .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height * .52 + ')');

      var partition = d3.partition()
          .size([2 * Math.PI, radius * radius]);

      var arc = d3.arc()
          .startAngle(function(d) { debugger; return d.x0; })
          .endAngle(function(d) { return d.x1; })
          .innerRadius(function(d) { return Math.sqrt(d.y0); })
          .outerRadius(function(d) { return Math.sqrt(d.y1); });

      var path = svg.selectAll('path')
          .data(partition(root).descendants())
          .enter().append('path')
          .attr('display', function(d) { return d.depth ? null : 'none'; }) // hide inner ring
          .attr('d', arc)
          .style('stroke', '#fff')
          //.style('fill', function(d) { return color((d.children ? d : d.parent).name); })
          .style('fill', 'red')
          .style('fill-rule', 'evenodd');
    }
  }
});

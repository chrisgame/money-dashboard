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
    let root = this.get('data');

    let svg = d3.select(this.element).append('svg')
        .attr('width', width)
        .attr('height', height)
      .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height * .52 + ')');

    var partition = d3.partition(root)
        .size([2 * Math.PI, radius * radius]);

    var arc = d3.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x + d.dx; })
        .innerRadius(function(d) { return Math.sqrt(d.y); })
        .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    var path = svg.datum(root).selectAll('path')
        .data(partition)
        .enter().append('path')
        .attr('display', function(d) { return d.depth ? null : 'none'; }) // hide inner ring
        .attr('d', arc)
        .style('stroke', '#fff')
        .style('fill', function(d) { return color((d.children ? d : d.parent).name); })
        .style('fill-rule', 'evenodd');
  }
});

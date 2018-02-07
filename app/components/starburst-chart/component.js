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
    let color = d3.scaleOrdinal(d3.schemeCategory20);
    let root = this.get('data');

    if (root.height) {

      let chartCenter = d3.select('#chart-center')
        .style('position', 'absolute')
        .style('top', `${radius - radius/6}px`)
        .style('left', `${radius/2 + 10}px`)
        .style('width', `${radius}px`)
        .style('height', `${radius/2 - radius/10}px`)
        .style('text-align', 'center')
        .style('font-size', '32px')

      let svg = d3.select(this.element).append('svg')
          .attr('width', width)
          .attr('height', height)
        .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height * .5 + ')');

      var partition = d3.partition(root.sum((d) => { return Math.abs(d.value) }))
          .size([2 * Math.PI, radius * radius]);

      var arc = d3.arc()
          .startAngle(function(d) { return d.x0; })
          .endAngle(function(d) { return d.x1; })
          .innerRadius(function(d) { return Math.sqrt(d.y0); })
          .outerRadius(function(d) { return Math.sqrt(d.y1); });

      var path = svg.selectAll('path')
          .data(partition(root).descendants())
          .enter().append('path')
          .attr('display', function(d) { return d.depth ? null : 'none'; }) // hide inner ring
          .attr('d', arc)
          .style('stroke', '#fff')
          .style('fill', function(d) { return color((d.children ? d : d.parent).data.name); })
          .style('fill-rule', 'evenodd')
          .on('mouseover', function(d) {
            svg.selectAll('path')
              .style('opacity', 0.5);

            let ancestors = d.ancestors().reverse();
            ancestors.shift();

            svg.selectAll('path')
              .filter(function(node) {
                return (ancestors.indexOf(node) >= 0);
              })
              .style('opacity', 1);

            let centerHtml = '';

            if (d.data.nodeType === 'group') {
              centerHtml = centerHtml.concat(`<div>${d.data.payee}</div>`);
              centerHtml = centerHtml.concat(`<div>£${d.data.total}</div>`);
            } else if (d.data.nodeType === 'transaction') {
              centerHtml = centerHtml.concat(`<div>${d.data.name}</div>`);
              centerHtml = centerHtml.concat(`<div>£${d.data.value}</div>`);
            }

            chartCenter
              .html(centerHtml)
              .style('visibility', 'visible');
          })
          .on('mouseleave', function(d) {
            svg.selectAll('path')
              .style('opacity', 1);

            chartCenter
              .style('visibility', 'hidden');
          });
    }
  }
});

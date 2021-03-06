import Component from '@ember/component';
import d3 from 'd3';

export default Component.extend({
  tagName: 'div',

  data: null,
  color: null,

  didRender() {
    let width = Math.min(window.innerWidth, window.innerHeight) - 20;
    let height = width;
    let radius = Math.min(width, height) / 2 -4;
    let color = this.color;
    let root = this.data;

    if (root.height) {

      let chartCenter = d3.select('#chart-center')
        .style('position', 'absolute')
        .style('top', `${radius - radius/6}px`)
        .style('left', `${radius/2 + 10}px`)
        .style('width', `${radius}px`)
        .style('height', `${radius/2 - radius/10}px`)
        .style('text-align', 'center')
        .style('font-family', 'helvetica')
        .style('font-size', '32px');

      d3.select('svg').remove();

      let svg = d3.select(this.element).append('svg')
          .attr('width', width)
          .attr('height', height)
        .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height * .5 + ')');

      var partition = d3.partition(root.sum((d) => { return Math.abs(d.value) }))
          .size([2 * Math.PI, radius * radius]);

      var arc = d3.arc()
          .startAngle(d => { return d.x0; })
          .endAngle(d => { return d.x1; })
          .innerRadius(d => { return Math.sqrt(d.y0); })
          .outerRadius(d => { return Math.sqrt(d.y1); })
          .padAngle(() => { return 0.001; });

      var path = svg.selectAll('path')
          .data(partition(root).descendants(), d => { return d.id; })
        .enter().append('path')
          .attr('display', d => { return d.depth ? null : 'none'; }) // hide inner ring
          .attr('d', arc)
          .style('stroke', d => { return color((d.children ? d : d.parent).data.name); })
          .style('stroke-width', '1px')
          .style('fill', d => { return color((d.children ? d : d.parent).data.name); })
          .style('fill-opacity', '0.6')
          .each(function(d) {
            this._currentAngle = {
              x0: d.x0,
              x1: d.x1,
              y0: d.y0,
              y1: d.y1
            };
          })
        .on('mouseover', d => {
          svg.selectAll('path')
            .style('opacity', 0.3);

          let ancestors = d.ancestors().reverse();
          ancestors.shift();

          svg.selectAll('path')
            .filter(node => {
              return (ancestors.indexOf(node) >= 0);
            })
            .style('opacity', 1);

          svg.selectAll('path')
            .filter(node => {
              if (!d.children || root.children.length === 1)
                return false;
              else {
                return (ancestors.indexOf(node) >= 0 || ancestors[0].children.indexOf(node) >=0);
              }
            })
            .style('stroke-width', '2px')
            .style('stroke-dasharray', '10,10');

          let centerHtml = '';

          if (d.data.nodeType === 'group') {
            centerHtml = centerHtml.concat(`<div>${d.data.name}</div>`);
            centerHtml = centerHtml.concat(`<div>£${d.data.total}</div>`);
          } else if (d.data.nodeType === 'transaction') {
            centerHtml = centerHtml.concat(`<div>${d.data.name}</div>`);
            centerHtml = centerHtml.concat(`<div>£${d.data.value}</div>`);
          }

          chartCenter
            .html(centerHtml)
            .style('visibility', 'visible');
        })
        .on('mouseleave', () => {
          svg.selectAll('path')
            .style('opacity', 1)
            .style('stroke-width', '1px')
            .style('stroke-dasharray', '0');

          chartCenter
            .style('visibility', 'hidden');
        });

      d3.selectAll('path').on('click', d => {
        //prune the node and it's children from the hierarchy
        if (d.depth > 1) {
          //children can't be pruned individually
          return;
        }

        if (root.children.length === 1) {
          //if this is the last child it's not allowed to be deleted
          //this would make an ugly visual state!
          return;
        }

        let childToRemove = root.children.findIndex(child => {
          return child.data === d.data;
        });
        root.children.splice(childToRemove, 1);

        partition = d3.partition(root.sum(d => { return Math.abs(d.value) }))
          .size([2 * Math.PI, radius * radius]);

        let pathsWithNewData = path
          .data(partition(root).descendants(), d => { return d.id; });

        pathsWithNewData
          .transition()
            .duration(500)
            .attrTween("d", function(a) {
              let endAngle = {
                x0: a.x0,
                x1: a.x1,
                y0: a.y0,
                y1: a.y1
              };

              var i = d3.interpolate(this._currentAngle, endAngle);
              this._currentAngle = i(0);
              return t => {
                return arc(i(t));
              };
            });

        pathsWithNewData
          .exit()
          .transition()
            .duration(250)
            .style('opacity', 0)
          .remove();
      });
    }
  }
});

import Component from '@glimmer/component';
import d3 from 'd3';

export default class LineChartComponent extends Component {
  get dimentions() {
    let margin = {top: 20, right: 0, bottom: 30, left: 20};
    let width = this.args.width;
    let legendWidth = 200;
    let legendXStart = width - legendWidth - margin.right;
    let legendXEnd = width - margin.right;

    return {
      width,
      height: this.args.height,
      margin,
      yTickGutter: 50,
      legendWidth,
      legendXStart,
      legendXEnd
    };
  }

  get xAxis() {
    let { height, width, margin, yTickGutter, legendWidth } = this.dimentions;

    return {
      height: height - margin.bottom,
      rangeStart: margin.left,
      rangeEnd: width - margin.right - yTickGutter - legendWidth
    };
  }

  get x() {
    return d3.scaleUtc()
      .domain(d3.extent(this.args.data.dates))
      .range([this.xAxis.rangeStart, this.xAxis.rangeEnd]);
  }

  get yAxis() {
    let { height, width, margin, yTickGutter, legendWidth } = this.dimentions;

    return {
      width: width - yTickGutter - legendWidth,
      rangeStart: height - margin.bottom,
      rangeEnd: margin.top,
      formatTickLabel: this.args.formatValueForAxis
    };
  }

  get y(){
    return d3.scaleLinear()
      .domain([0, d3.max(this.args.data.series, d => d3.max(d.values))]).nice()
      .range([this.yAxis.rangeStart, this.yAxis.rangeEnd]);
  }

///
  get options() {
    return {
      formatLegendLabel: this.args.formatLegendLabel,
      formatValue: this.args.formatValue,
      formatValueForAxis: this.args.formatValueForAxis,
      color: this.args.color,
      onDataPointClick: this.args.onDataPointClick,
    };
  }
}

import Component from '@glimmer/component';
import d3 from 'd3';
import { DateTime } from 'luxon';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LineChartComponent extends Component {
  @tracked currentDate = undefined;
  @tracked currentDataPoint = undefined;
  @tracked pathsColorFunction = undefined;
  @tracked strokeWidthFunction = undefined;

  get pathsColor() {
    return this.pathsColorFunction || this.options.color;
  }

  get strokeWidth() {
    return this.strokeWidthFunction || 2;
  }

  get dimentions() {
    let margin = {top: 20, right: 0, bottom: 30, left: 30};
    let width = this.args.width;
    let yTickGutter = 55;
    let legendWidth = 200;
    let legendXStart = width - legendWidth - margin.right;
    let legendXEnd = width - margin.right;
    let chartWidth = width - legendWidth;
    let staticLegendOffset = 50;
    let legendBarTitleX = (legendXEnd - legendXStart) / 2;
    let legendBarTitleY = 20;

    return {
      width,
      height: this.args.height,
      margin,
      yTickGutter,
      chartWidth,
      legendWidth,
      staticLegendOffset,
      legendBarTitleX,
      legendBarTitleY
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

  get staticLegendX() {
    return d3.scaleLinear()
      .domain([0, d3.max(this.args.data.series, d => d3.max(d.values))])
      .range([this.dimentions.staticLegendOffset, this.dimentions.legendWidth]);
  }

  get staticLegendY() {
    return d3.scaleBand()
      .domain(this.args.data.series.map(item => item.name))
      .range([this.dimentions.margin.top, this.dimentions.height - this.dimentions.margin.bottom]);
  }

  get barChartLegendX() {
    if (this.currentDataPoint) {
      let { legendBarStroke } = this.options;

      return d3.scaleLinear()
        .domain([0, d3.max(this.currentDataPoint, d => d.value)])
        .range([legendBarStroke, this.dimentions.legendWidth - legendBarStroke]);
    }
  }

  get barChartLegendY() {
    if (this.currentDataPoint) {
      return d3.scaleBand()
        .domain(this.currentDataPoint.map(item => item.name))
        .range([this.dimentions.margin.top + this.dimentions.legendBarTitleY, this.dimentions.height - this.dimentions.margin.bottom]);
    }
  }

  get barChartTitleText() {
    if (this.currentDate) {
      return DateTime.fromJSDate(this.currentDate).toFormat('MMMM yyyy');
    }
  }

  get options() {
    return {
      formatLegendLabel: this.args.formatLegendLabel,
      formatValue: this.args.formatValue,
      formatValueForAxis: this.args.formatValueForAxis,
      color: this.args.color,
      legendBarStroke: this.args.legendBarStroke || 2,
      legendTextPadding: this.args.legendTextPadding || 4,
      onDataPointClick: this.args.onDataPointClick,
    };
  }

  @action
  mouseEnterDataPoint(dataPoint, date) {
    this.currentDate = date;
    this.currentDataPoint = dataPoint.map(obj => {
      return {
        name: Object.keys(obj)[0],
        value: Object.values(obj)[0],
      };
    }).sort((a, b) => b.value - a.value);
  }

  @action
  mouseExitDataPoint() {
    this.currentDate = undefined;
    this.currentDataPoint = undefined;
  }

  @action
  mouseEnterDataPointLine(series) {
    this.pathsColorFunction = (d) => {
      return series === d ? this.options.color(series) : '#ddd';
    };

    this.strokeWidthFunction = (d) => {
      return series === d ? 4 : 2;
    };
  }

  @action
  mouseExitDataPointLine() {
    this.pathsColorFunction = undefined;
    this.strokeWidthFunction = undefined;
  }
}

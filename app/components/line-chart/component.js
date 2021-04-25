import Component from '@glimmer/component';

export default class LineChartComponent extends Component {
  get dimentions() {
    return {
      width: this.args.width,
      height: this.args.height,
    };
  }

  get options() {
    return {
      formatValue: this.args.formatValue,
      formatValueForAxis: this.args.formatValueForAxis,
      color: this.args.color,
      onDataPointClick: this.args.onDataPointClick,
    };
  }
}

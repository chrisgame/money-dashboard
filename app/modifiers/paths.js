import Modifier from 'ember-modifier';
import d3 from 'd3';
import { guidFor } from '@ember/object/internals';
import { registerDestructor } from '@ember/destroyable';

function cleanup(instance) {
	document.getElementById(instance.id)?.remove();
}

export default class PathsModifier extends Modifier {
	data = undefined;
	x = undefined;
	y = undefined;
	color = undefined;
	strokeWidth = undefined;
	lastData = undefined;
	lastX = undefined;
	lastY = undefined;
	lastColor = undefined;
	lastStrokeWidth = undefined;
	id = undefined;
	svg = undefined;
	path = undefined;
	line = undefined;

  constructor(owner, args) {
		super(owner, args);

    this.id = `paths-${guidFor(this)}`;

		registerDestructor(this, cleanup);
	}

	didReceiveArguments() {
		let {data, x, y, color, strokeWidth = 2} = this.args.named;

		this.data = data;
		this.x = x;
		this.y = y;
		this.color = color;
		this.strokeWidth = strokeWidth;

    if (this.isOnlyStylingUpdate) {
			this.updateExistingPathsStyles();
    }
		else if (this.isFullUpdate) {
			this.drawNewPaths();
		};

		this.lastData = data;
		this.lastX = x;
		this.lastY = y;
		this.lastColor = color;
		this.lastStrokeWidth = strokeWidth;
  };

	drawNewPaths() {
    document.getElementById(this.id)?.remove();

    this.svg = d3.select(this.element);

    this.line = d3.line()
      .defined(d => !isNaN(d))
      .x((d,i) => this.x(this.data.dates[i]))
      .y(d => this.y(d));

    this.path = this.svg.append('g')
        .attr('id', this.id)
        .attr('fill', 'none')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round');

		this.path
      .selectAll('path')
      .data(this.data.series)
      .join('path')
        .attr('stroke-width', typeof this.strokeWidth === 'function' ? d => this.strokeWidth(d.name) : this.strokeWidth)
        .attr('stroke', d => this.color(d.name))
        .attr('d', d => this.line(d.values));
	};

  updateExistingPathsStyles() {
		this.path
      .selectAll('path')
      .data(this.data.series)
      .join('path')
        .attr('stroke-width', typeof this.strokeWidth === 'function' ? d => this.strokeWidth(d.name) : this.strokeWidth)
        .attr('stroke', d => this.color(d.name))
        .attr('d', d => this.line(d.values));
	};

	get isOnlyStylingUpdate() {
		if (
			this.lastData === undefined ||
			this.lastX === undefined ||
			this.lastY === undefined
		) {
			return false;
		};

		return (
			this.lastData === this.data &&
			this.lastX === this.x &&
			this.lastY === this.y
		) &&
		this.lastColor !== this.color ||
		this.lastStrokeWidth !== this.strokeWidth
	}

	get isFullUpdate() {
		let isNoUpdate =
			this.lastData === this.data &&
			this.lastX === this.x &&
			this.lastY === this.y &&
			this.lastColor === this.color &&
			this.lastStrokeWidth === this.strokeWidth;

		return !isNoUpdate;
	}
};

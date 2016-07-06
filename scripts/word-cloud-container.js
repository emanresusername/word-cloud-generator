class WordCloudContainer {
  constructor(width, height) {
    let d3div = this.d3div = d3.select('body')
          .append('div')
          .style('position', 'fixed')
          .style('visibility', 'hidden');
    this.d3svg = d3div
      .append('svg')
      .attr("width", width)
      .attr("height", height);
  }

  get svg() {
    return this.d3svg.node();
  }

  get width() {
    return this.d3svg.attr("width");
  }

  get height() {
    return this.d3svg.attr("width");
  }

  cleanup() {
    this.d3div.remove();
  }
}

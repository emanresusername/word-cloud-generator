class WordCloudContainer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    let d3div = this.d3div = d3.select('body')
          .append('div')
          .style('position', 'fixed')
          .style('visibility', 'hidden');
    this.svg = d3div
      .append('svg')
      .attr("width", width)
      .attr("height", height)
      .node();
  }

  cleanup() {
    this.d3div.remove();
  }
}

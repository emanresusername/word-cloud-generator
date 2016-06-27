class WordCloudContainer {
  constructor(width, height) {
    let container = this.d3container = d3.select("body").insert("div", ':first-child');
    this.svg = container.append("svg")
      .attr('viewbox', `0 0 ${width} ${height}`)
      .attr("width", '100%')
      .attr("height", '100%')
      .node();
    container.append("button")
          .text("Open in Tab")
          .on('click', () => {
            this.openTabWithSvg();
          });
  }

  // http://stackoverflow.com/a/23589931
  openTabWithSvg() {
    let serializer = new XMLSerializer();
    let svg_blob = new Blob([serializer.serializeToString(this.svg)],
                            {'type': "image/svg+xml"});
    let url = URL.createObjectURL(svg_blob);

    let svg_win = window.open(url, "svg_win");
  }
}

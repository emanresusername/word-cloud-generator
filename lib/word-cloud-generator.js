const CONTAINER = new WordCloudContainer(500, 500);

class WordCloudGenerator {
  constructor(options) {
    this.options = options;
    this.fill = d3.scale.category20();
    let svg = CONTAINER.svg;
    let {width, height} = svg.getBoundingClientRect();
    this.width = width;
    this.height = height;
    let d3svg = this.d3svg = d3.select(svg);
    d3svg.select("g").remove(); // there can be only one
    this.d3g = d3svg.append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  }

  getFontScale(minCount, maxCount) {
    let {minFontSize, maxFontSize} = this.options;
    return d3.scale.linear().domain([minCount, maxCount]).range([minFontSize, maxFontSize]);
  }

  draw(wordCounts) {
    this.d3g.selectAll("text").remove(); // clear the old words
    this.d3g.selectAll("text")
      .data(wordCounts)
      .enter().append("text")
      .style("font-size", d => {
        return d.size + "px";
      })
      .style("font-family", "Impact")
      .style("fill", (d, i) => this.fill(i))
      .style("cursor", "default")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(d => d.text)
      .append("title").text(d => d.count);
  }

  getWordCounts(words) {
    return Object.values(words.reduce((map, word) => {
      if (map.hasOwnProperty(word)) {
        ++map[word].count;
      } else {
        map[word] = {
          text: word,
          count: 1
        };
      }
      return map;
    }, {}));
  }

  getLayout(wordCounts) {
    let counts = wordCounts.map(wordCount => wordCount.count).sort();
    let fontScale = this.getFontScale(counts[0], counts[counts.length - 1]);
    return D3Cloud()
      .size([this.width, this.height])
      .words(wordCounts)
      .padding(2)
      .rotate(() => 0)
      .font("Impact")
      .fontSize(d =>  {
        return fontScale(d.count);
      })
      .on("end", this.draw.bind(this))
      .timeInterval(10);
  }

  generateWordCloud(words) {
    let wordCounts = this.getWordCounts(words);
    let layout = this.getLayout(wordCounts);
    layout.start();
  }
}

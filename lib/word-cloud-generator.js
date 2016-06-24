const width = 500;
const height = 500;
const d3svg = d3.select("body").insert("svg", ':first-child')
        .attr("width", width)
        .attr("height", height);
const d3g = d3svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
const fill = d3.scale.category20();
const minFontSize = 10;
const maxFontSize = 20;
const fontScale = d3.scale.linear().range([minFontSize, maxFontSize]);

class WordCloudGenerator {
  draw(layoutWords) {
    d3g.selectAll("text").remove(); // clear the old words
    d3g.selectAll("text")
      .data(layoutWords)
      .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .style("cursor", "default")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(d => d.text)
      .append("title").text(d => d.count);
  }

  getWordCounts(words) {
    return words.reduce((map, word) => {
      if (map.hasOwnProperty(word)) {
        ++map[word];
      } else {
        map[word] = 1;
      }
      return map;
    }, {});
  }

  getLayoutWords(wordCounts) {
    let layoutWords = [];
    for(let key in wordCounts) {
      if (wordCounts.hasOwnProperty(key)) {
        let count = wordCounts[key];
        layoutWords.push({
          text: key,
          size: count,
          count: count
        });
      }
    }
    return layoutWords;
  }

  getLayout(wordCounts, options) {
    return D3Cloud()
      .size([500, 500])
      .words(this.getLayoutWords(wordCounts))
      .padding(2)
      .rotate(() => 0)
      .font("Impact")
      .fontSize(d =>  fontScale(d.size) )
      .on("end", this.draw)
      .timeInterval(10);
  }

  generateWordCloud(words, options) {
    let wordCounts = this.getWordCounts(words);
    let layout = this.getLayout(wordCounts, options);
    layout.start();
  }
}

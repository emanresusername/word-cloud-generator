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
    d3g.selectAll("text")
      .data(layoutWords)
      .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }

  getPhrases(phraseSize, words) {
    switch (phraseSize) {
    case 1:
      return words;
    default:
      let stopIndex = words.length - phraseSize;
      let phrases = [];
      for (let i = 0; i <= stopIndex; ++i) {
        phrases.push(words.slice(i, i + phraseSize).join(' '));
      }
      return phrases;
    }
  }

  getPhraseCounts(phrases) {
    return phrases.reduce((map, phrase) => {
      if (map.hasOwnProperty(phrase)) {
        ++map[phrase];
      } else {
        map[phrase] = 1;
      }
      return map;
    }, {});
  }

  getLayoutWords(phraseCounts) {
    let layoutWords = [];
    for(let key in phraseCounts) {
      if (phraseCounts.hasOwnProperty(key)) {
        layoutWords.push({
          text: key,
          size: phraseCounts[key]
        });
      }
    }
    return layoutWords;
  }

  getLayout(phraseCounts, options) {
    return D3Cloud()
      .size([500, 500])
      .words(this.getLayoutWords(phraseCounts))
      .padding(2)
      .rotate(() => 0)
      .font("Impact")
      .fontSize(d =>  fontScale(d.size) )
      .on("end", this.draw)
      .timeInterval(10);
  }

  generateWordCloud(words, options) {
    let phrases = this.getPhrases(options.phraseSize, words);
    let phraseCounts = this.getPhraseCounts(phrases);
    let layout = this.getLayout(phraseCounts, options);
    layout.start();
  }
}

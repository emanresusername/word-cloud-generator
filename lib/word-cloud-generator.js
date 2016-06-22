let fill = d3.scale.category20();

function draw(words) { // NOTE: a word = {text: "", size: #}
  // TODO: use options
  let width = 500;
  let height = 500;
  d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .selectAll("text")
    .data(words)
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

class WordCloudGenerator {
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
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .timeInterval(10);
  }

  generateWordCloud(words, options) {
    let phrases = this.getPhrases(options.phraseSize, words);
    let phraseCounts = this.getPhraseCounts(phrases);
    let layout = this.getLayout(phraseCounts, options);
    layout.start();
  }
}

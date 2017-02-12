package my.will.be.done.wordcloud

import scala.scalajs.js
import org.scalajs.dom.raw.Node

import org.scalajs.d3v4.{d3selection, d3scale}
import my.will.be.done.d3

class Wordcloud(conf: Conf) {
  def draw(container: Node, wordCounts: js.Array[d3.WordCount]): Unit = {
    val colorScheme = d3scale
      .scaleOrdinal(d3scale.schemeCategory20c)
      .domain(wordCounts.map(_.text))

    d3selection
      .select(container)
      .append("svg")
      .attr("width", conf.width)
      .attr("height", conf.height)
      .append("g")
      .attr("transform", s"translate(${conf.width / 2},${conf.height / 2})")
      .selectAll("text")
      .data(wordCounts)
      .enter()
      .append("text")
      .attr("font-size", { wordCount ⇒
        wordCount.size.toString ++ "px"
      })
      .attr("font-family", { wordCount ⇒
        wordCount.font.get
      })
      .attr("fill", { wordCount ⇒
        colorScheme(wordCount.text)
      })
      .attr("cursor", "default")
      .attr("text-anchor", "middle")
      .attr("transform", { wordCount ⇒
        s"translate(${wordCount.x},${wordCount.y})rotate(${wordCount.rotate})"
      })
      .text(_.text)
      .append("title")
      .text(_.count.toString)
  }

  def layout(wordCountData: WordCountData): d3.CloudLayout = {
    val fontScale = d3scale
      .scaleLinear()
      .domain(wordCountData.countDomain)
      .range(js.Array(conf.minFontSize, conf.maxFontSize))

    new d3.CloudLayout()
      .words(wordCountData.toJs)
      .size(js.Array(conf.width, conf.height))
      .timeInterval(10)
      .padding(2)
      .rotate(() ⇒ conf.randomRotation)
      .font(conf.font)
      .fontSize(wordCount ⇒ fontScale(wordCount.count))
      .spiral(conf.spiral.name)
  }
}

package my.will.be.done.wordcloud

import my.will.be.done.d3.WordCount
import scala.scalajs.js

case class WordCountData(wordCounts: Seq[WordCount]) {
  def countDomain: js.Array[Double] = {
    val (minCount, maxCount) =
      wordCounts.foldLeft(Int.MaxValue → Int.MinValue) {
        case ((min, max), current) ⇒
          val count = current.count
          (min min count, max max count)
      }
    js.Array(minCount, maxCount)
  }

  def toJs: js.Array[WordCount] = {
    js.Array(wordCounts: _*)
  }
}

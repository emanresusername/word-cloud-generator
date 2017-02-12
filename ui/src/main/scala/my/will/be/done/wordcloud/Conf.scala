package my.will.be.done.wordcloud

import scala.util.matching.Regex
import my.will.be.done.d3.WordCount
import scala.util.Random
import my.will.be.done.d3.Spiral
import my.will.be.done.js.facade.Stemmer

case class Conf(
    width: Int,
    height: Int,
    minFontSize: Int,
    maxFontSize: Int,
    wordRegex: Regex,
    stem: Boolean,
    stopwords: Iterable[String],
    phraseSize: Int,
    font: String,
    rotateFrom: Int,
    rotateTo: Int,
    rotateOrientations: Int,
    spiral: Spiral
) {
  def randomRotation(): Int = {
    val rotationRange = rotateFrom to rotateTo
    val rotations     = rotationRange.by(rotationRange.length / rotateOrientations)
    rotations(Random.nextInt(rotations.length))
  }

  type ModifyStage = PartialFunction[String, String]

  val stemStage: ModifyStage = {
    case word if stem ⇒ Stemmer(word)
  }

  def modifyWord(word: String): String = {
    Seq(stemStage).foldLeft(word) {
      case (modified, modifyStage) ⇒
        modifyStage applyOrElse (modified, identity[String])
    }
  }

  lazy val uppercaseStopwords = stopwords.map(_.toUpperCase).toSet

  def words(text: String): Iterator[String] = {
    (for {
      word ← wordRegex.findAllIn(text.toUpperCase)
      if !uppercaseStopwords(word)
      modified = modifyWord(word)
    } yield {
      modified
    }).sliding(phraseSize).map(_.mkString(" "))
  }

  def wordCountData(text: String): WordCountData = {
    WordCountData(
      for {
        (word, count) ← words(text).toSeq
          .groupBy(identity)
          .mapValues(_.size)
          .toSeq
      } yield {
        new WordCount(word, count)
      }
    )
  }
}

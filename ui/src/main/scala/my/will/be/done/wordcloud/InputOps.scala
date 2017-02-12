package my.will.be.done.wordcloud

import scala.language.higherKinds

trait InputOps[V] {
  def toString(value: V): String = value.toString
  def fromString(value: String): V
}

object InputOps {
  implicit case object IntInputOps extends InputOps[Int] {
    def fromString(value: String): Int = value.toInt
  }
  implicit case object LongInputOps extends InputOps[Long] {
    def fromString(value: String): Long = value.toLong
  }
  implicit case object DoubleInputOps extends InputOps[Double] {
    def fromString(value: String): Double = value.toDouble
  }
  implicit case object ShortInputOps extends InputOps[Short] {
    def fromString(value: String): Short = value.toShort
  }
  implicit case object FloatInputOps extends InputOps[Float] {
    def fromString(value: String): Float = value.toFloat
  }
  implicit case object StringInputOps extends InputOps[String] {
    def fromString(value: String): String = value
  }
  implicit case object BooleanInputOps extends InputOps[Boolean] {
    def fromString(value: String): Boolean = value.toBoolean
  }

  class IterableInputDelimiter(val delimiter: String) {
    lazy val delimiterRegex = delimiter.r
  }

  object IterableInputDelimiter {
    case object Comma      extends IterableInputDelimiter(",")
    case object CommaSpace extends IterableInputDelimiter(", ")
    case object Newline    extends IterableInputDelimiter("\n")
  }

  implicit def iterableInputOps[V, I[V] <: Iterable[V]](
      implicit inputOps: InputOps[V],
      delimiter: IterableInputDelimiter = IterableInputDelimiter.CommaSpace)
  // TODO: InputOps[I[V]] = new InputOps[I[V]] {
    : InputOps[Iterable[V]] = new InputOps[Iterable[V]] {
    override def toString(value: Iterable[V]): String =
      value.map(inputOps.toString).mkString(delimiter.delimiter)
    def fromString(value: String): Iterable[V] = {
      delimiter.delimiterRegex.split(value).map(inputOps.fromString).toIterable
    }
  }
}

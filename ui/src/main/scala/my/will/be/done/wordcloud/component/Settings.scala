package my.will.be.done.wordcloud.component

import com.thoughtworks.binding.{Binding, dom}, Binding.Var
import org.scalajs.dom.{window, raw}
import my.will.be.done.wordcloud.{InputOps, Conf}
import my.will.be.done.js.facade.Stopwords
import my.will.be.done.d3.Spiral
import scala.scalajs.js

class Settings {
  val width              = Var(500)
  val height             = Var(500)
  val minFontSize        = Var(10)
  val maxFontSize        = Var(50)
  val wordRegex          = Var("[\\w\\-]+")
  val stem               = Var(true)
  val stopwords          = Var(Stopwords.en.toIterable)
  val phraseSize         = Var(1)
  val font               = Var("Impact")
  val rotateFrom         = Var(-30)
  val rotateTo           = Var(30)
  val rotateOrientations = Var(10)
  val spiral             = Var(Spiral.Archimedean: Spiral)

  val descriptionText = Var(
    "Hover over the ?'s to show setting descriptions here")

  implicit case object SpiralInputOps extends InputOps[Spiral] {
    import Spiral._
    override def toString(value: Spiral): String = value.name
    def fromString(value: String): Spiral = value match {
      case Archimedean.name ⇒
        Archimedean
      case Rectangular.name ⇒
        Rectangular
    }
  }

  @dom
  def conf: Binding[Conf] = {
    Conf(
      width = width.bind,
      height = height.bind,
      minFontSize = minFontSize.bind,
      maxFontSize = maxFontSize.bind,
      wordRegex = wordRegex.bind.r,
      stem = stem.bind,
      stopwords = stopwords.bind,
      phraseSize = phraseSize.bind,
      font = font.bind,
      rotateFrom = rotateFrom.bind,
      rotateTo = rotateTo.bind,
      rotateOrientations = rotateOrientations.bind,
      spiral = spiral.bind
    )
  }

  @dom
  def settingInput[V](value: Var[V])(
      implicit inputOps: InputOps[V]): Binding[raw.HTMLInputElement] = {
    <input class={UiStyles.settingInput.htmlClass} onchange={event: raw.Event ⇒
      event.currentTarget match {
        case input: raw.HTMLInputElement ⇒
          val inputValue = input.value
          util.Try {
            inputOps.fromString(inputValue)
          } match {
            case util.Failure(cause) ⇒
              window.console.error(js.Error(cause.getMessage))
            case util.Success(parsedValue) ⇒
              value := parsedValue
          }
      }
    } value={inputOps.toString(value.bind)}></input>
  }

  @dom
  def settingNode[V](label: String, description: String, value: Var[V])(
      implicit inputOps: InputOps[V]): Binding[raw.Node] = {
    <div class={UiStyles.settingNode.htmlClass}>
      <div class={UiStyles.showDescription.htmlClass} onmouseover={event: raw.Event ⇒
        descriptionText := description
      }>?</div>
      <div class={UiStyles.settingLabel.htmlClass}>{label}: </div>
      {settingInput(value).bind}
    </div>
  }

  @dom
  def node: Binding[raw.Node] = {
    <div>
      {
        settingNode(
          label = "Width",
          description = "Width of wordcloud in pixels",
          value = width
        ).bind
      }
      {
        settingNode(
          label = "Height",
          description = "Height of wordcloud in pixels",
          value = height
        ).bind
      }
      {
        settingNode(
          label = "Min Font Size",
          description = "Font size in pixels of the word that appears the least",
          value = minFontSize
        ).bind
      }
      {
        settingNode(
          label = "Max Font Size",
          description = "Font size in pixels of the word that appears the most",
          value = maxFontSize
        ).bind
      }
      {
        settingNode(
          label = "Word Regex",
          description = "<a target='_blank' href='http://www.regexr.com/'>Regular expression</a> to extract individual words from text to generate the wordcloud",
          value = wordRegex
        ).bind
      }
      {
        settingNode(
          label = "Stem",
          description = "Use <a target='_blank' href='http://wooorm.com/stemmer/'>stems</a> of the input words for the wordcloud",
          value = stem
        ).bind
      }
      {
        settingNode(
          label = "Stopwords",
          description = "<a target='_blank' href='http://en.wikipedia.org/wiki/Stop_words'>Stop words</a> to filter out of the wordcloud",
          value = stopwords
        ).bind
      }
      {
        settingNode(
          label = "Phrase Size",
          description = "Wordcloud will contains groups of the specified size of adjacent words",
          value = phraseSize
        ).bind
      }
      {
        settingNode(
          label = "Font",
          description = "Font of the words in the wordcloud",
          value = font
        ).bind
      }
      {
        settingNode(
          label = "Rotate From",
          description = "The maximum number of degrees to the left to rotate a word in the wordcloud",
          value = rotateFrom
        ).bind
      }
      {
        settingNode(
          label = "Rotate To",
          description = "The maximum number of degrees to the right to rotate a word in the wordcloud",
          value = rotateTo
        ).bind
      }
      {
        settingNode(
          label = "Rotate Orientations",
          description = "The number of different possible angles the words in the wordcloud could be rotated to",
          value = rotateOrientations
        ).bind
      }
      {
        settingNode(
          label = "Spiral",
          description = "<a target='_blank' href='https://github.com/jasondavies/d3-cloud#spiral'>Type of spiral used for positioning words</a>",
          value = spiral
        ).bind
      }
      {
        val div = (<div class={UiStyles.description.htmlClass}></div>)
        div.innerHTML = descriptionText.bind
        div
      }
    </div>
  }
}

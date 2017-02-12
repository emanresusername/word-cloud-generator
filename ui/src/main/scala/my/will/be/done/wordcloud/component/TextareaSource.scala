package my.will.be.done.wordcloud.component

import org.scalajs.dom.raw.{Node, Event, HTMLTextAreaElement}
import com.thoughtworks.binding.Binding
import com.thoughtworks.binding.Binding.Var
import com.thoughtworks.binding.dom

trait TextareaSource extends TextSource {
  val label = "Textarea"
  @dom
  def node(text: Var[String]): Binding[Node] = {
    val textarea: HTMLTextAreaElement = (<textarea></textarea>)
    textarea.rows = 7
    textarea.cols = 70
    textarea.onchange = { event: Event ⇒
      event.currentTarget match {
        case `textarea` ⇒
          text := textarea.value
      }
    }
    textarea
  }
}

case object TextareaSource extends TextareaSource

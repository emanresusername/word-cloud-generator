package my.will.be.done.wordcloud

import scala.scalajs.js
import org.scalajs.dom.{document, window}
import com.thoughtworks.binding.{Binding, dom}, Binding.Var
import org.scalajs.dom.raw.{Event, Node}
import my.will.be.done.wordcloud.component._

object Messager extends js.JSApp {
  @dom
  def textNode(text: Var[String], selectedClass: String): Binding[Node] = {
    <div class={selectedClass}>{text.bind}</div>
  }

  @dom
  def render(textMessager: TextMessager): Binding[Node] = {
    val text = Var("")
    <div>
      {
        new Ui(FileSource, TextareaSource).textSourcesNode(text).bind
      }
      {
        textMessager.controlPanel.bind
      }
      {
        textNode(text, textMessager.selectedClass).bind
      }
    </div>
  }

  def main(): Unit = {
    window.onload = { event: Event ⇒
      // assuming the window with this script will be opened by the word cloud generator window
      val textMessager = new WindowTextMessager(window.opener)
      textMessager.appendStyles(document.head)
      Ui.appendStyles(document.head)
      dom.render(document.body, render(textMessager))
    }
  }
}

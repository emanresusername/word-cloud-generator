package my.will.be.done.wordcloud

import my.will.be.done.wordcloud.component.TextMessager
import my.will.be.done.wordcloud.component.MessageSource.TextMessage
import org.scalajs.dom.document
import com.thoughtworks.binding.dom
import chrome.runtime.Runtime
import my.will.be.done.wordcloud.component.CssSettings._

object WebextTextMessager extends TextMessager {
  import scala.scalajs.js
  val noop = js.Any.fromFunction1 { _: js.Object ⇒
    }
  def sendText(): Unit = {
    Runtime.sendMessage(
      message = new TextMessage(selectedText),
      // TODO: runtime error if responseCallback not supplied
      responseCallback = noop
    )
  }

  def apply(): Unit = {
    appendStyles(document.head)
    val controlPanel = document.createElement("div")
    document.body.appendChild(controlPanel)
    dom.render(controlPanel, this.controlPanel)
  }
}

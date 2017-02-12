package my.will.be.done.wordcloud.component

import org.scalajs.dom.raw
import scala.scalajs.js
import scala.scalajs.js.annotation.ScalaJSDefined
import com.thoughtworks.binding.{Binding, dom}, Binding.Var
import MessageSource._

trait MessageSource extends TextSource {
  val label            = "Message"
  val textMessageEvent = Var(Option.empty[TextMessageEvent])

  def listenForTextMessages(): Unit

  @dom
  def node(text: Var[String]): Binding[raw.Node] = {
    listenForTextMessages()
    textMessageEvent.bind match {
      case None ⇒
        <div>listening for messages</div>
      case Some(textMessageEvent) ⇒
        text := textMessageEvent.text
        textMessageEvent.origin.toOption match {
          case Some(origin) ⇒
            <div>From {origin}</div>
          case None ⇒
            new raw.Comment()
        }
    }
  }
}

object MessageSource {
  @ScalaJSDefined
  class TextMessage(val text: String) extends js.Object

  object TextMessage {
    def unapply(jsObject: js.Object): Option[String] = {
      // TODO: better way to do pattern matching after prototype chain lost
      jsObject.asInstanceOf[js.Dictionary[String]].get("text")
    }
  }

  @ScalaJSDefined
  class TextMessageEvent(val text: String, val origin: js.UndefOr[String])
      extends js.Object

  object TextMessageEvent {
    def unapply(jsObject: js.Object): Option[(String, js.UndefOr[String])] = {
      // TODO: better way to do pattern matching after prototype chain lost
      val dictionary = jsObject.asInstanceOf[js.Dictionary[String]]
      for {
        origin ← dictionary.get("origin")
        text   ← dictionary.get("text")
      } yield {
        text → origin
      }
    }
  }
}

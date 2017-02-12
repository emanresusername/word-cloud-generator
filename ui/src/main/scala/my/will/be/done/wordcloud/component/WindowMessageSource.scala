package my.will.be.done.wordcloud.component

import org.scalajs.dom.{raw, window}
import MessageSource._

case object WindowMessageSource extends MessageSource {
  val receiveMessage = { event: raw.Event ⇒
    textMessageEvent := getTextMessageEvent(event)
  }

  def listenForTextMessages(): Unit = {
    window.addEventListener("message", receiveMessage)
  }

  def getTextMessageEvent(event: raw.Event): Option[TextMessageEvent] = {
    event match {
      case messageEvent: raw.MessageEvent ⇒
        messageEvent.data match {
          case TextMessage(text) ⇒
            Option(
              new TextMessageEvent(text, messageEvent.origin)
            )
          case _ ⇒
            None
        }
      case _ ⇒
        None
    }
  }
}

package my.will.be.done.wordcloud

import my.will.be.done.wordcloud.component.MessageSource
import my.will.be.done.wordcloud.component.MessageSource._
import chrome.runtime.Runtime
import scala.concurrent.Future

case object WebextMessageSource extends MessageSource {
  def listenForTextMessages(): Unit = {
    Runtime.onMessage.listen {
      case message ⇒
        message.value match {
          case Some(TextMessageEvent(text, origin)) ⇒
            textMessageEvent := Option(
              new TextMessageEvent(text, origin)
            )
            // NOTE: needed to keep the port open or error thrown in backgroundPage
            message.response(Future.unit, Unit)
        }
    }
  }
}

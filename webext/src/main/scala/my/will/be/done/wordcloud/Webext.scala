package my.will.be.done.wordcloud

import scala.scalajs.js
import chrome.runtime.Runtime
import org.scalajs.dom.window
import scala.scalajs.concurrent.JSExecutionContext.Implicits.queue
import scala.concurrent.Future
import scala.util.{Success, Failure}

object Webext extends js.JSApp {
  def main(): Unit = {
    Future { Runtime }.flatMap(_.getBackgroundPage) onComplete {
      case Success(backgroundPage) if window == backgroundPage ⇒
        Background()
      case Success(_) ⇒
        Wordclouds()
      case Failure(cause) ⇒
        // TODO: different projects for background/content/injected scripts
        if (cause.getMessage.contains("getBackgroundPage")) {
          WebextTextMessager()
        } else {
          throw cause
        }
    }
  }
}

package my.will.be.done.wordcloud

import scala.scalajs.js
import org.scalajs.dom.document
import my.will.be.done.wordcloud.component.{Ui, WindowMessageSource}

object Standalone extends js.JSApp {
  def main(): Unit = {
    Ui(uiContainer = document.body,
       stylesContainer = document.head,
       messageSource = WindowMessageSource)
  }
}

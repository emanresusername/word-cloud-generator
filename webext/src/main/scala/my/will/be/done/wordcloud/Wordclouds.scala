package my.will.be.done.wordcloud

import org.scalajs.dom.document
import my.will.be.done.wordcloud.component.Ui

object Wordclouds {
  def apply(): Unit = {
    Ui(uiContainer = document.body,
       stylesContainer = document.head,
       messageSource = WebextMessageSource)
  }
}

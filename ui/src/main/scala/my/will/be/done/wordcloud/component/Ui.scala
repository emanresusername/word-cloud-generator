package my.will.be.done.wordcloud.component

import com.thoughtworks.binding.dom
import org.scalajs.dom.raw.{Node, Event, HTMLStyleElement}
import com.thoughtworks.binding.Binding.{Constants, Var}
import com.thoughtworks.binding.Binding
import CssSettings._

class Ui(textSources: TextSource*) {
  @dom
  def textSourcesNode(text: Var[String]): Binding[Node] = {
    val textSource = Var[TextSource](textSources.head)
    <div class={UiStyles.textSources.htmlClass}>
      <div class={UiStyles.title.htmlClass}>Text Source</div>
      <div class={UiStyles.tabBar.htmlClass}>{
        Constants(textSources:_*).map { source ⇒
          val style = if(textSource.bind == source) {
            UiStyles.selectedTab
          }
          else {
            UiStyles.unselectedTab
          }
          <div class={style.htmlClass} onclick={event: Event ⇒ textSource := source}>{
            source.label
          }</div>
        }
      }</div>
      <div class={UiStyles.textSource.htmlClass}>{
        textSource.bind.node(text).bind
      }</div>
    </div>
  }

  @dom
  def wordcloudAndSettings: Binding[Node] = {
    val text     = Var("")
    val settings = new Settings
    <div class={UiStyles.wordcloudsAndSettings.htmlClass}>
      <div class={UiStyles.settingsContainer.htmlClass}>
        { settings.node.bind }
        { textSourcesNode(text).bind }
      </div>
      <div class={UiStyles.wordcloudsContainer.htmlClass}>{
        text.bind.trim → settings.conf.bind match {
          case ("", _) ⇒
            <!---->
          case (text, conf) ⇒
            <div>
              { WordcloudComponent(conf, text).bind }
            </div>
        }
      }</div>
    </div>
  }
}

object Ui {
  @deprecated("TODO: find cross-browser solution", "always")
  def isFirefox: Boolean = {
    import scala.scalajs.js
    js.Dynamic.global
      .asInstanceOf[js.Dictionary[js.Any]]
      // https://stackoverflow.com/a/9851769/5886125
      .get("InstallTrigger")
      .isDefined
  }

  def appendStyles(container: Node): Unit = {
    container.appendChild(UiStyles.render[HTMLStyleElement])
  }

  def apply(uiContainer: ⇒ Node,
            stylesContainer: ⇒ Node,
            messageSource: MessageSource): Unit = {
    def init = {
      appendStyles(stylesContainer)
      dom.render(
        uiContainer,
        new Ui(messageSource, FileSource, TextareaSource).wordcloudAndSettings)
    }
    if (isFirefox) {
      org.scalajs.dom.window.onload = { _ ⇒
        init
      }
    } else {
      init
    }
  }
}

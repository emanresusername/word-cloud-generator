package my.will.be.done.wordcloud

import scala.scalajs.js
import chrome.windows.bindings.{UpdateOptions, CreateOptions}
import chrome.windows.bindings.Window.CreateType.{NORMAL, PANEL}
import chrome.runtime.Runtime
import chrome.windows.Windows
import chrome.browserAction.BrowserAction
import org.scalajs.dom.window, window.console
import scala.util.{Success, Failure}
import chrome.tabs.Tabs
import chrome.tabs.bindings.{CodeInjectionOptions, Tab}
import com.thoughtworks.binding.Binding.Var
import scala.concurrent.Future
import scala.scalajs.concurrent.JSExecutionContext.Implicits.queue
import my.will.be.done.wordcloud.component.MessageSource._
import my.will.be.done.wordcloud.component.Ui.isFirefox
import java.util.concurrent.ConcurrentHashMap
import scala.collection.JavaConverters._

object Background {
  val WordcloudHtmlPath = "html/wordcloud.html"
  def wordcloudWindowOptions: CreateOptions = {
    val width  = 1000
    val height = 1000
    val options = CreateOptions(
      url = js.Array(WordcloudHtmlPath),
      width = width,
      height = height,
      `type` = (if (isFirefox) {
                  // TODO: other types stay permanently on top
                  NORMAL
                } else {
                  PANEL
                })
    ).asInstanceOf[js.Dictionary[_]]

    if (isFirefox) {
      // TODO: `focused` isn't supported in firefox
      options -= "focused"
    }
    options.asInstanceOf[CreateOptions]
  }

  val wordcloudsTab = Var(Option.empty[Tab])
  val messagerTabs  = new ConcurrentHashMap[Int, String].asScala
  def createWordcloudWindow: Future[Tab] = {
    for {
      windowOption ← Windows.create(wordcloudWindowOptions)
      window = windowOption.get
      tabs   = window.tabs.get
      tab    = tabs(0)
    } yield {
      wordcloudsTab := Option(tab)
      tab
    }
  }

  def messagerTabMatches(tabId: Int, url: String): Boolean = {
    messagerTabs.get(tabId).contains(url)
  }

  def isWordcloudTab(tabId: Int): Boolean = {
    wordcloudsTab.get.exists(_.id.contains(tabId))
  }

  def listenForMessages(): Unit = {
    Runtime.onMessage.listen {
      case message ⇒
        val sender = message.sender
        for {
          senderTab    ← sender.tab
          senderTabId  ← senderTab.id
          senderTabUrl ← senderTab.url
        } {
          message.value match {
            case Some(TextMessage(text))
                if messagerTabMatches(senderTabId, senderTabUrl) ⇒
              wordcloudsTab.get
                .fold(createWordcloudWindow)(Future.successful)
                .onComplete {
                  case Success(tab) ⇒
                    val tabId = tab.id.get
                    Tabs
                      .sendMessage(
                        tabId = tabId,
                        message = new TextMessageEvent(text, senderTabUrl)
                      )
                      .onComplete {
                        case Success(_) ⇒
                          Windows.update(tab.windowId,
                                         UpdateOptions(focused = true))
                        case Failure(cause) ⇒
                          console.error("couldn't send text message")
                          cause.printStackTrace
                      }
                  case Failure(cause) ⇒
                    console.error("couldn't get wordcloud tab")
                    cause.printStackTrace
                }
          }
        }
    }
  }

  def listenForBrowserAction(): Unit = {
    BrowserAction.onClicked.addListener { tab ⇒
      wordcloudsTab.get match {
        case None ⇒
          createWordcloudWindow
        case _ ⇒
      }

      for {
        tabId  ← tab.id
        newUrl ← tab.url
        if !messagerTabMatches(tabId, newUrl)
      } {
        Tabs
          .executeScript(tabId, CodeInjectionOptions(file = "main.js"))
          .onComplete {
            case Success(_) ⇒
              messagerTabs.update(tabId, newUrl)
            case Failure(cause) ⇒
              console.error("couldn't inject script")
              cause.printStackTrace
          }
      }
    }
  }

  def listenForTabRemove(): Unit = {
    Tabs.onRemoved.listen {
      case (tabId, _) ⇒
        if (isWordcloudTab(tabId)) {
          wordcloudsTab := None
        } else {
          messagerTabs.remove(tabId)
        }
    }
  }

  def listenForTabUpdate(): Unit = {
    Tabs.onUpdated.listen {
      case (tabId, changeInfo, tab) ⇒
        // TODO: how to distinguish if reloading/changing location or just clicking to different #fragment on same page
        if (changeInfo.status.contains(Tab.StatusValues.COMPLETE)) {
          if (isWordcloudTab(tabId)) {
            if (!tab.url.contains(Runtime.getURL(WordcloudHtmlPath))) {
              wordcloudsTab := None
            }
          } else {
            messagerTabs.remove(tabId)
          }
        }
    }
  }

  def apply(): Unit = {
    listenForMessages()
    listenForBrowserAction()
    listenForTabRemove()
    listenForTabUpdate()
  }
}

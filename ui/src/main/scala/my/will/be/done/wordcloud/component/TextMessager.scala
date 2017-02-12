package my.will.be.done.wordcloud.component

import org.scalajs.dom.{document, raw}
import com.thoughtworks.binding.{Binding, dom}, Binding.Var
import my.will.be.done.wordcloud.component.MessageSource.TextMessage
import scala.scalajs.js
import CssSettings._

trait TextMessager extends SelectionStyles {
  val selectionEnabled = Var(false)

  val selectableTargetElement = { event: raw.Event ⇒
    PartialFunction.condOpt(event.target) {
      case element: raw.Element if isSelectable(element) ⇒
        element
    }
  }

  def isSelectable(node: raw.Node): Boolean = {
    selectionEnabled.get && !Iterator
      .iterate(node)(_.parentNode)
      .takeWhile(_ != null)
      .exists(PartialFunction.cond(_) {
        case element: raw.Element ⇒
          element.classList.contains(unselectableClass)
      })
  }

  def toggleNodeClass(node: raw.Node,
                      `class`: String,
                      force: Option[Boolean] = None): Option[Boolean] = {
    PartialFunction.condOpt(node) {
      case element: raw.Element ⇒
        val classList = element.classList
        force.fold(classList.toggle(`class`))(classList.toggle(`class`, _))
    }
  }

  val clickTargetElement: js.Function1[raw.Event, _] = { event ⇒
    selectableTargetElement(event).map { node ⇒
      event.stopPropagation()
      toggleNodeClass(node, selectedClass)
    }
  }

  val mouseoverTargetElement: js.Function1[raw.Event, _] = { event ⇒
    selectableTargetElement(event).map { node ⇒
      event.stopPropagation()
      toggleNodeClass(node, mouseoveredClass, Option(true))
    }
  }

  val mouseoutTargetElement: js.Function1[raw.Event, _] = { event ⇒
    selectableTargetElement(event).map { node ⇒
      event.stopPropagation()
      toggleNodeClass(node, mouseoveredClass, Option(false))
    }
  }

  val eventListeners = Seq(
    "click"     → clickTargetElement,
    "mouseover" → mouseoverTargetElement,
    "mouseout"  → mouseoutTargetElement
  )

  def selectedNodes: Seq[raw.Node] = {
    val domList = document.getElementsByClassName(selectedClass)
    for {
      index ← 0 until domList.length
      node = domList(index)
    } yield {
      node
    }
  }

  def selectedText: String = {
    selectedNodes.map(_.textContent).mkString("\n")
  }

  def clearSelected(): Unit = {
    for {
      node ← selectedNodes
    } {
      toggleNodeClass(node, selectedClass, Option(false))
    }
  }

  def addEventListeners(): Unit = {
    for {
      (event, listener) ← eventListeners
    } {
      document.addEventListener(event, listener, true)
    }
  }

  def removeEventListeners(): Unit = {
    for {
      (event, listener) ← eventListeners
    } {
      document.removeEventListener(event, listener, true)
    }
  }

  @dom
  def enableButton: Binding[raw.Node] = {
    <div class={TextMessagerStyles.enableButton.htmlClass} onclick={event: raw.Event ⇒
      addEventListeners
      selectionEnabled := true
    }>Enable</div>
  }

  @dom
  def disableButton: Binding[raw.Node] = {
    <div class={TextMessagerStyles.disableButton.htmlClass} onclick={event: raw.Event ⇒
      removeEventListeners
      selectionEnabled := false
    }>Disable</div>
  }

  def sendText(): Unit

  @dom
  def sendTextButton: Binding[raw.Node] = {
    <div class={TextMessagerStyles.sendTextButton.htmlClass} onclick={event: raw.Event ⇒ sendText()}>Send Text</div>
  }

  @dom
  def clearSelectedButton: Binding[raw.Node] = {
    <div class={TextMessagerStyles.clearSelectionButton.htmlClass} onclick={event: raw.Event ⇒
      clearSelected()
    }>Clear Selection</div>
  }

  def changeCssSelector(selector: String) = { event: raw.Event ⇒
    clearSelected()
    val nodeList = document.querySelectorAll(selector)
    for {
      i ← 0 until nodeList.length
      node = nodeList(i)
      if isSelectable(node)
    } {
      toggleNodeClass(node, selectedClass, Option(true))
    }
  }

  @dom
  def selectorOrClick(useCssSelector: Var[Boolean]): Binding[raw.Node] = {
    val cssSelector = Var("")
    val input       = (<input></input>)
    input.onchange = { event: raw.Event ⇒
      cssSelector := input.value
    }
    if (useCssSelector.bind) {
      <div class={TextMessagerStyles.flexZone.htmlClass}>
        <label>Css Selector: </label>
        {input}
        <div class={TextMessagerStyles.roundButton.htmlClass} onclick={changeCssSelector(cssSelector.bind)}>Apply Selector</div>
      </div>
    } else {
      <div>click to select elements</div>
    }
  }

  @dom
  def controlPanel: Binding[raw.Node] = {
    val hidden = Var(false)
    if (hidden.bind) {
      val classes = Seq(
        unselectableClass,
        TextMessagerStyles.flexControlPanel.htmlClass
      )
      <div class={classes.mkString(" ")}>
        <div class={TextMessagerStyles.showButton.htmlClass} onclick={event: raw.Event ⇒ hidden := false}>
        Show
        </div>
      </div>
    } else {
      val classes = Seq(
        unselectableClass,
        TextMessagerStyles.controlPanel.htmlClass
      )
      val useCssSelector = Var(false)
      <div class={classes.mkString(" ")}>
        <div class={TextMessagerStyles.flexZone.htmlClass}>
          <div onclick={event: raw.Event ⇒ hidden := true} class={TextMessagerStyles.hideButton.htmlClass}>Hide</div>
          {
            if(selectionEnabled.bind) {
              disableButton.bind
            } else {
              enableButton.bind
            }
          }
          {clearSelectedButton.bind}
          {sendTextButton.bind}
        </div>
        <div class={TextMessagerStyles.flexZone.htmlClass}>
          <div class={TextMessagerStyles.roundButton.htmlClass} onclick={event: raw.Event ⇒ useCssSelector := !useCssSelector.get}>{
            if (useCssSelector.bind) {
              "Use Mouse"
            } else {
              "Use Css Selector"
            }
          }</div>
          {selectorOrClick(useCssSelector).bind}
        </div>
      </div>
    }
  }

  def appendStyles(container: raw.Node): Unit = {
    container.appendChild(render[raw.HTMLStyleElement])
    container.appendChild(TextMessagerStyles.render[raw.HTMLStyleElement])
  }
}

class WindowTextMessager(messagee: raw.Window) extends TextMessager {
  def sendText(): Unit = {
    messagee.postMessage(new TextMessage(selectedText), "*")
  }
}

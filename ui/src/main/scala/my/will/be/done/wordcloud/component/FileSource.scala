package my.will.be.done.wordcloud.component

import org.scalajs.dom.raw.{Node, HTMLInputElement, FileReader, Event}
import com.thoughtworks.binding.Binding
import com.thoughtworks.binding.Binding.Var
import com.thoughtworks.binding.dom

trait FileSource extends TextSource {
  val label = "File"

  @dom
  def node(text: Var[String]): Binding[Node] = {
    val input: HTMLInputElement = (<input type="file"></input>)
    input.onchange = { event: Event ⇒
      event.currentTarget match {
        case `input` ⇒
          val fileReader = new FileReader()
          fileReader.onload = { event ⇒
            event.target match {
              case `fileReader` ⇒
                text := fileReader.result.asInstanceOf[String]
            }
          }
          fileReader.readAsText(input.files(0))
      }
    }
    input
  }
}

case object FileSource extends FileSource

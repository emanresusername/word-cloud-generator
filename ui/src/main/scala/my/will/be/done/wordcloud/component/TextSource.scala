package my.will.be.done.wordcloud.component

import com.thoughtworks.binding.Binding
import com.thoughtworks.binding.Binding.Var
import org.scalajs.dom.raw.Node

trait TextSource {
  val label: String
  def node(text: Var[String]): Binding[Node]
}

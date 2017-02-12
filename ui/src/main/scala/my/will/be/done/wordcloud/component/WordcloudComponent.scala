package my.will.be.done.wordcloud.component

import scala.scalajs.js
import my.will.be.done.wordcloud.{Conf, Wordcloud}
import my.will.be.done.d3
import org.scalajs.dom.raw.{Node, Event}
import com.thoughtworks.binding.Binding
import com.thoughtworks.binding.Binding.Var
import my.will.be.done.js.NodeSaver
import com.thoughtworks.binding.dom
import org.scalajs.dom.document
import org.scalajs.d3v4.d3selection

object WordcloudComponent {
  def saveSvg(container: Node): Event ⇒ Unit = {
    { event: Event ⇒
      d3selection.select(container).select("svg").node match {
        case node: Node ⇒
          NodeSaver(node = node,
                    name = "wordcloud.svg",
                    `type` = "application/svg+xml")
      }
    }
  }

  @dom
  def apply(conf: Conf, text: String): Binding[Node] = {
    val wordCountData = conf.wordCountData(text)
    val total         = wordCountData.wordCounts.length
    val placed        = Var(0)
    val allPlaced     = Var(false)
    val wordcloud     = new Wordcloud(conf)
    val container     = document.createElement("div")
    wordcloud
      .layout(wordCountData)
      .on("end", { wordCounts: js.Array[d3.WordCount] ⇒
        wordcloud.draw(container, wordCounts)
        allPlaced := true
      })
      .on("word", { wordCount: d3.WordCount ⇒
        placed := placed.get + 1
      })
      .start()
    <div>
      {
        if(allPlaced.bind) {
          <div>
            <div class={UiStyles.downloadButton.htmlClass} onclick={saveSvg(container)}>
              Download SVG
            </div>
            {container}
          </div>
        } else {
          <div>Generating: {placed.bind.toString} / {total.toString}</div>
        }
      }
    </div>
  }
}

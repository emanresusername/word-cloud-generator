package my.will.be.done.wordcloud.component

import CssSettings._

trait SelectionStyles extends StyleSheet.Standalone {
  import dsl._

  private[this] val uuid = java.util.UUID.randomUUID.toString
  private[this] def uuidClass(prefix: String): String = {
    s"$prefix-$uuid"
  }
  val selectedClass            = uuidClass("selected")
  val mouseoveredClass         = uuidClass("hovered")
  val unselectableClass        = uuidClass("unselectable")
  val selectedClassSelector    = s".$selectedClass"
  val mouseoveredClassSelector = s".$mouseoveredClass"

  object BorderStyles extends StyleSheet.Inline {
    import dsl._
    val borderStyle = style(
      borderRadius(6.pt, 8.pt),
      boxShadow := "2px 2px 3px 4px #aaa"
    )
  }
  import BorderStyles.borderStyle

  selectedClassSelector - (
    borderStyle,
    border(3.pt, c"#66f", solid)
  )

  mouseoveredClassSelector - (
    borderStyle,
    border(3.pt, c"#6f6", solid),
    cursor.pointer
  )

  (selectedClassSelector ++ mouseoveredClassSelector) - (
    borderColor(c"#f66")
  )
}

package my.will.be.done.wordcloud.component

import CssSettings._

object TextMessagerStyles extends StyleSheet.Inline {
  import dsl._

  val roundButton = style(
    borderRadius(15.px),
    padding(5.px),
    margin(1.px),
    cursor.pointer,
    flex := "auto",
    borderStyle.outset,
    borderWidth(2.px),
    borderColor.gray,
    textAlign.center
  )

  val disableButton = style(
    roundButton,
    backgroundColor(c"#d88")
  )

  val clearSelectionButton = style(
    roundButton,
    backgroundColor(c"#dd8")
  )

  val enableButton = style(
    roundButton,
    backgroundColor(c"#8d8")
  )

  val sendTextButton = style(
    roundButton,
    backgroundColor(c"#88d")
  )

  val hideButton = style(
    roundButton,
    backgroundColor.orangered,
    color.white
  )

  val floatRightTop = style(
    position.fixed,
    top(0.px),
    right(0.px)
  )

  val showButton = style(
    hideButton,
    floatRightTop,
    opacity(0.25)
  )

  val flexZone = style(
    display.flex,
    flex := "auto"
  )

  val flexControlPanel = style(
    flexZone,
    floatRightTop
  )

  val controlPanel = style(
    flexControlPanel,
    borderStyle.inset,
    borderColor.gray,
    borderWidth(2.px),
    padding(5.px),
    borderRadius(5.px),
    backgroundColor.white,
    flexDirection.column,
    zIndex(9999999)
  )
}

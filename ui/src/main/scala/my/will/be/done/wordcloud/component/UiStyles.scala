package my.will.be.done.wordcloud.component

import CssSettings._

object UiStyles extends StyleSheet.Inline {
  import dsl._

  val wordcloudsAndSettings = style(
    display.flex,
    width(100.vw),
    height(100.vh)
  )

  val settingsContainer = style(
    flex := "3",
    backgroundColor(rgba(240, 240, 240, 0.75))
  )

  val wordcloudsContainer = style(
    flex := "5",
    borderLeftColor.black,
    borderLeftStyle.solid,
    borderLeftWidth(1.px)
  )

  val downloadButton = style(
    TextMessagerStyles.roundButton
  )

  val settingNode = style(
    display.flex,
    justifyContent.flexStart,
    borderTopColor.black,
    borderTopWidth(1.px),
    paddingTop(2.px),
    borderTopStyle.solid
  )

  val settingLabel = style(
    flex := "5",
    fontStyle.italic,
    paddingRight(4.px)
  )

  val settingInput = style(
    flex := "10",
    borderRadius(5.px, 5.px, 5.px, 0.px),
    borderLeftColor.black,
    borderLeftWidth(1.px),
    paddingRight(5.px)
  )

  val showDescription = style(
    flex := "1",
    borderRadius(10.px),
    borderColor.silver,
    borderStyle.double,
    borderWidth(1.px),
    textAlign.center,
    marginRight(5.px),
    cursor.help
  )

  val description = style(
    borderStyle.inset,
    borderColor.white,
    padding(5.px),
    margin(5.px)
  )

  val title = style(
    fontSize(2.em),
    fontStyle.italic
  )

  private[this] val tab = style(
    flexBasis := 30.px,
    borderRadius(5.px, 5.px, 0.px, 0.px),
    borderColor.white,
    borderWidth(2.px),
    padding(5.px),
    textAlign.center,
    cursor.pointer
  )

  val unselectedTab = style(
    tab,
    borderStyle.outset,
    backgroundColor.gray,
    color.white,
    &.hover(
      borderStyle.inset
    )
  )

  val selectedTab = style(
    tab,
    borderStyle.inset,
    backgroundColor.white,
    color.black
  )

  val tabBar = style(
    display.flex,
    borderBottomColor.white,
    borderBottomWidth(1.px),
    borderBottomStyle.solid,
    justifyContent.flexStart,
    paddingRight(5.px)
  )

  val textSources = style(
    borderLeftWidth(1.px),
    borderLeftColor.gray,
    borderLeftStyle.solid,
    margin(10.px),
    padding(5.px)
  )

  val textSource = style(
    borderLeftWidth(1.px),
    borderLeftColor.gray,
    borderLeftStyle.solid,
    paddingTop(2.px),
    marginLeft(2.px),
    paddingLeft(2.px),
    backgroundColor.white
  )
}

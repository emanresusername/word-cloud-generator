lazy val commonSettings = Seq(
  organization := "my.will.be.done",
  licenses += ("MPL", url("https://www.mozilla.org/en-US/MPL/2.0/")),
  version := "0.3.0",
  scalaVersion in ThisBuild := "2.12.2",
  scalacOptions ++= Seq("-deprecation", "-feature", "-Xlint"),
  useYarn := true,
  version in webpack := "2.6.1",
  resolvers += "jitpack" at "https://jitpack.io"
)

lazy val scalamacrosSettings = Seq(
  addCompilerPlugin(
    "org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)
)

val bindingVersion = "10.0.2"
lazy val ui = project
  .settings(commonSettings)
  .settings(scalamacrosSettings)
  .settings(
    libraryDependencies ++= {
      val facadeVersion = "0.0.4"

      Seq(
        "com.github.japgolly.scalacss"      %%% "core"             % "0.5.3",
        "com.thoughtworks.binding"          %%% "dom"              % bindingVersion,
        "com.github.emanresusername.facade" %%% "js-nodesaver"     % facadeVersion,
        "com.github.emanresusername.facade" %%% "facade-stemmer"   % facadeVersion,
        "com.github.emanresusername.facade" %%% "facade-stopwords" % facadeVersion,
        "com.github.emanresusername.facade" %%% "facade-d3-cloud"  % facadeVersion,
        "com.github.fdietze"                % "scala-js-d3v4"      % "44eed59"
      )
    }
  )
  .enablePlugins(ScalaJSBundlerPlugin)

lazy val standalone = project
  .settings(commonSettings)
  .enablePlugins(ScalaJSBundlerPlugin)
  .dependsOn(ui)

lazy val messager = project
  .settings(commonSettings)
  .settings(scalamacrosSettings)
  .enablePlugins(ScalaJSBundlerPlugin)
  .dependsOn(ui)

import chrome._
import chrome.permissions.Permission
import chrome.permissions.Permission.API
import net.lullabyte.{Chrome, ChromeSbtPlugin}

lazy val webext = project
  .settings(commonSettings)
  .settings(
    relativeSourceMaps := true,
    skip in packageJSDependencies := false,
    libraryDependencies ++= {
      Seq(
        "net.lullabyte" %%% "scala-js-chrome" % "0.5.0"
      )
    },
    fastOptJsLib := Attributed.blank(
      (webpack in (Compile, fastOptJS)).value.head),
    fullOptJsLib := Attributed.blank(
      (webpack in (Compile, fullOptJS)).value.head),
    chromeManifest := new ExtensionManifest {
      val name    = "Word Cloud Generator"
      val version = Keys.version.value
      override val description =
        Some("Generate word cloud visualizations of web pages, text files, or other arbitary text inputs")
      val background = Background(
        scripts = Chrome.defaultScripts
      )
      override val defaultLocale = Some("en")
      override val icons = Chrome.icons(
        "icons",
        "wordcloud.png",
        Set(32, 48, 64, 96)
      )
      override val browserAction = Option(
        BrowserAction(
          icon = icons,
          title = Option(name)
        ))
      override val permissions = Set[Permission](
        API.ActiveTab,
        API.Tabs
      )
    }
  )
  .enablePlugins(ChromeSbtPlugin, ScalaJSBundlerPlugin)
  .dependsOn(ui)

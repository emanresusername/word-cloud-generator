lazy val root = project.in(file(".")).dependsOn(scalaJsChromePlugin)

lazy val scalaJsChromePlugin = ProjectRef(
  build = uri(
    "https://github.com/emanresusername/scala-js-chrome.git#scala-js-bundler"),
  project = "plugin"
)

Seq(
  "com.geirsson"  % "sbt-scalafmt"        % "0.6.8",
  "org.scala-js"  % "sbt-scalajs"         % "0.6.17",
  "ch.epfl.scala" % "sbt-scalajs-bundler" % "0.6.0"
).map(addSbtPlugin)

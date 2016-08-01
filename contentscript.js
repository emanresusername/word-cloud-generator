let panelUI;

// Create the panel ui iframe and inject it in the current page
function initPanel() {
  let container = document.createElement("div");
  container.setAttribute("style", "position: fixed; top: 0; left: 0; z-index: 10000; width: 475px; height: 390px; resize: both; overflow: auto; margin: 0; padding: 0;");
  container.isWordCloudContainer = true;
  document.body.appendChild(container);

  let iframe = document.createElement("iframe");
  iframe.setAttribute("src", chrome.runtime.getURL("popup/word-cloud-config.html"));
  iframe.setAttribute("style", "width: 100%; height: 100%");
  container.appendChild(iframe);

  return panelUI = {
    container, visible: true
  };
}

function serializeSvg(svg) {
  let serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
}

function togglePanel(panelUI) {
  if (panelUI.visible) {
    panelUI.visible = false;
    panelUI.container.style["display"] = "none";
  } else {
    panelUI.visible = true;
    panelUI.container.style["display"] = "block";
  }
}

function sendSvgBlob(svg) {
  chrome.runtime.sendMessage({
    type: 'svgBlob',
    svgBlob: serializeSvg(svg)
  });
}

// Handle messages from the add-on background page (only in top level iframes)
if (window.parent == window) {
  chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg == "toggle-in-page-panel") {
      if (panelUI) {
        togglePanel(panelUI);
      } else {
        panelUI = initPanel();
      }
    } else {
      let {generatorOptions, words} = msg;
      if(generatorOptions && words) {
        let container = new WordCloudContainer(
          generatorOptions.svgWidth,
          generatorOptions.svgHeight
        );
        new WordCloudGenerator(container, generatorOptions).generateWordCloud(
          words,
          () => {
            // TODO: using sendResponse here didn't work if the generator took too long
            sendSvgBlob(container.svg);
            container.cleanup();
          }
        );
      }
      return true; // or the other contentscript listeners can't sendReponses
    }
  });
}

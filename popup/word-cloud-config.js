function getOptions() {
  return {
    wordOptions: {
      minWordSize: Number(document.getElementById('minWordSizeInput').value),
      ignoreWords: document.getElementById('filterWordsTextarea').value.trim().split(/\W+/),
      phraseSize: Number(document.getElementById('phraseSizeInput').value)
    },
    generatorOptions: {
      minFontSize: Number(document.getElementById('minFontSizeInput').value),
      maxFontSize: Number(document.getElementById('maxFontSizeInput').value),
      svgWidth: Number(document.getElementById('svgWidth').value),
      svgHeight: Number(document.getElementById('svgHeight').value)
    }
  };
}

document.addEventListener("click", function(e) {
  if (e.target.id != "generateButton") {
    return;
  }

  chrome.tabs.executeScript(null, {
    file: "/word-cloud-helper.js"
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {
      options: getOptions(),
      selector: 'body>:not(svg)'
    }, (svgBlob) => {
      let url = URL.createObjectURL(svgBlob);
      chrome.tabs.create({url, index: tab.index});
      window.close();
    });
  });
});

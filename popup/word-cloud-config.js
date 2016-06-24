function getOptions() {
  return {
    wordOptions: {
      minWordSize: Number(document.getElementById('minWordSizeInput').value),
      ignoreWords: document.getElementById('filterWordsTextarea').value.trim().split(/\W+/)
    },
    generatorOptions: {
      phraseSize: Number(document.getElementById('phraseSizeInput').value)
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
    chrome.tabs.sendMessage(tabs[0].id, {
      options: getOptions(),
      selector: 'body>:not(svg)'
    });
  });
});

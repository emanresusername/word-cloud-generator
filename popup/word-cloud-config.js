function getOptions() {
  return {
    phraseSize: Number(document.querySelector('input[name="phrase-size"]').value)
  };
}

function getWords() {
  return "a a a b b c d d d d".split(/\s+/);
}

document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("generate-button")) {
    return;
  }

  chrome.tabs.executeScript(null, {
    file: "/word-cloud-generator.js"
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      options: getOptions(),
      words: getWords()
    });
  });
});

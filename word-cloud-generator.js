function generateWordCloud(request, sender, sendResposne) {
  try {
    let {words, options} = request;
    new WordCloudGenerator().generateWordCloud(words, options);
  } catch(err) {
    console.error(err);
  } finally {
    chrome.runtime.onMessage.removeListener(generateWordCloud);
  }
}

chrome.runtime.onMessage.addListener(generateWordCloud);

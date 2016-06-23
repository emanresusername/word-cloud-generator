function cleanTextContent(elem) {
  return elem.textContent.trim().replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
}

function getWords(selector) {
  let words = [];
  let selection = document.querySelectorAll(selector);
  for(let i = 0; i < selection.length; ++i) {
    words = words.concat(cleanTextContent(selection.item(i)).split(/\s+/));
  }
  return words;
}

function generateWordCloud(request, sender, sendResposne) {
  try {
    let {selector, options} = request;
    let words = getWords(selector);
    console.debug({words, options});
    new WordCloudGenerator().generateWordCloud(words, options);
  } catch(err) {
    console.error(err);
  } finally {
    chrome.runtime.onMessage.removeListener(generateWordCloud);
  }
}

chrome.runtime.onMessage.addListener(generateWordCloud);

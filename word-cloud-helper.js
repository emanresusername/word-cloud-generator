function cleanTextContent(elem) {
  return elem.textContent.trim()
    .replace(/,/g, ' ')
    .replace(/[^a-zA-Z0-9\s\-]/g, '')
    .toUpperCase();
}

function getWords(selector) {
  let words = [];
  let selection = document.querySelectorAll(selector);
  for(let i = 0; i < selection.length; ++i) {
    words = words.concat(cleanTextContent(selection.item(i)).split(/\s+/));
  }
  return words;
}

function filterWords(words, ignoreWords, minWordSize) {
  let regex = RegExp(`^(?:${ignoreWords.join('|')})$`, 'i');
  console.debug({regex});
  return words.filter(word => word.length >= minWordSize && !regex.test(word));
}

function generateWordCloud(request, sender, sendResposne) {
  try {
    let {selector, options:{wordOptions, generatorOptions}} = request;
    let words = getWords(selector);
    let filteredWords = filterWords(words, wordOptions.ignoreWords, wordOptions.minWordSize);
    console.debug({filteredWords, words, wordOptions, generatorOptions});
    new WordCloudGenerator().generateWordCloud(filteredWords, generatorOptions);
  } catch(err) {
    console.error(err);
  } finally {
    chrome.runtime.onMessage.removeListener(generateWordCloud);
  }
}

chrome.runtime.onMessage.addListener(generateWordCloud);

function cleanTextContent(elem) {
  return elem.textContent.trim()
    .replace(/,/g, ' ')
    .replace(/[^a-zA-Z0-9\s\-]/g, '')
    .toUpperCase();
}

function getPhrases(words, options) {
  let {phraseSize} = options;
  switch (phraseSize) {
  case 1:
    return words;
  default:
    let stopIndex = words.length - phraseSize;
    let phrases = [];
    for (let i = 0; i <= stopIndex; ++i) {
      phrases.push(words.slice(i, i + phraseSize).join(' '));
    }
    return phrases;
  }
}

function getWords(selector) {
  let words = [];
  let selection = document.querySelectorAll(selector);
  for(let i = 0; i < selection.length; ++i) {
    words = words.concat(cleanTextContent(selection.item(i)).split(/\s+/));
  }
  return words;
}

function filterWords(words, options) {
  let {ignoreWords, minWordSize} = options;
  let regex = RegExp(`^(?:${ignoreWords.join('|')})$`, 'i');
  console.debug({regex});
  return words.filter(word => word.length >= minWordSize && !regex.test(word));
}

function generateWordCloud(request, sender, sendResposne) {
  try {
    let {selector, options:{wordOptions, generatorOptions}} = request;
    let words = getWords(selector);
    let filteredWords = filterWords(words, wordOptions, wordOptions);
    let phrases = getPhrases(filteredWords, wordOptions);
    console.debug({filteredWords, words, phrases, wordOptions, generatorOptions});
    new WordCloudGenerator(generatorOptions).generateWordCloud(phrases);
  } catch(err) {
    console.error(err);
  } finally {
    chrome.runtime.onMessage.removeListener(generateWordCloud);
  }
}

chrome.runtime.onMessage.addListener(generateWordCloud);

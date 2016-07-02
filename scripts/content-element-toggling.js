const CONSIDERING_CLASS = "under-consideration";
const TOGGLED_CLASS = "toggled-content";

function toggleElement(event) {
  let classes = event.target.classList;
  if(classes.contains(TOGGLED_CLASS)) {
    classes.remove(TOGGLED_CLASS);
  } else {
    classes.add(TOGGLED_CLASS);
  }
  event.preventDefault();
  event.stopPropagation();
  return false;
}

function considerElement(event) {
  event.target.classList.add(CONSIDERING_CLASS);
}

function leaveElement(event) {
  event.target.classList.remove(CONSIDERING_CLASS);
}

function startElementSelection() {
  document.addEventListener('click', toggleElement);
  document.addEventListener('mouseover', considerElement);
  document.addEventListener('mouseout', leaveElement);
}

function stopElementSelection() {
  document.removeEventListener('click', toggleElement);
  document.removeEventListener('mouseover', considerElement);
  document.removeEventListener('mouseout', leaveElement);
}

function clearSelection() {
  // NOTE: htmlcollections are live and this one changes as you remove the classes
  let liveToggled = document.getElementsByClassName(TOGGLED_CLASS);
  // AMO didn't like es6 for-comprehensions :(
  let toggled = [];
  for (let i = 0; i < liveToggled.length; ++i) {
    toggled.push(liveToggled.item(i));
  }
  toggled.forEach(elem => {
    elem.classList.remove(TOGGLED_CLASS);
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  switch(msg) {
  case 'start-element-selection':
    return startElementSelection();
  case 'stop-element-selection':
    return stopElementSelection();
  case 'clear-selection':
    return clearSelection();
  default:
    return true; // move on to next listener;
  }
});

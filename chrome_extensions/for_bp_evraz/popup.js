// Update the relevant fields with the new data.
const setDOMInfo = info => {
/*
  document.getElementById('phone').innerText = info.phone;
  document.getElementById('giid').innerText = info.giid;
  document.getElementById('agentid').innerText = info.agentid;
*/
};

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'DOMInfo'},
        // ...also specifying a callback to be called 
        //    from the receiving end (content script).
        setDOMInfo);
  });
  
});


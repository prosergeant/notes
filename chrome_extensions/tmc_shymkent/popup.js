// Update the relevant fields with the new data.
const setDOMInfo = info => {
  document.getElementById('total').textContent = info.total;
  document.getElementById('inputs').textContent = info.inputs;
  document.getElementById('buttons').textContent = info.buttons;
  document.getElementById('fio').innerText = info.fio;
  document.getElementById('iin').innerText = info.iin;
  document.getElementById('birth').innerText = info.birth;
  document.getElementById('passport').innerText = info.passport;
  
  document.getElementById('nation').innerText = info.nation;
  document.getElementById('phone').innerText = info.phone;
  document.getElementById('soc_status').innerText = info.soc_status;
  document.getElementById('life_status').innerText = info.life_status;
  document.getElementById('edu').innerText = info.edu;
  document.getElementById('lgot').innerText = info.lgot;
  document.getElementById('blood').innerText = info.blood;
  document.getElementById('factor').innerText = info.factor;
  document.getElementById('date_deter').innerText = info.date_deter;
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
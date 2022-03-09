// Inform the background page that 
// this tab should have a page-action.
chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction',
});

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    // Collect the necessary data. 
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`.)
	
    var domInfo = {
      total: document.querySelectorAll('*').length,
      inputs: document.querySelectorAll('input').length,
      buttons: document.querySelectorAll('button').length,
	  fio: document.getElementById('txtPersonFIO').value,
	  iin: parseInt(getElementByXpath("//html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[2]/div[1]/form[1]/div[1]/div[1]/div[4]/label[2]").textContent),
	  birth: document.getElementById('PassportDataBirthDate').value,
	  passport: document.getElementsByName('PassportDataCitizenship_input')[0].value,
	  nation: document.getElementsByClassName('k-dropdown-wrap k-state-disabled')[1].firstElementChild.value,
	  phone: document.getElementById('PassportDataPhoneNumber').value,
	  soc_status: document.getElementsByName('PassportDataSocType_input')[0].value,
	  life_status: document.getElementsByName('PassportDataMaritalStatus_input')[0].value,
	  edu: document.getElementsByName('PassportDataPersonEducation_input')[0].value,
	  lgot: document.getElementsByName('PassportDataBenefits_input')[0].value,
	  blood: document.getElementsByName('PassportDataBloodGroups_input')[0].value,
	  factor: document.getElementsByName('PassportDataRh_input')[0].value,
	  date_deter: document.getElementById('PassportDataDetermineDate').value
    };

    // Directly respond to the sender (popup), 
    // through the specified callback.
    response(domInfo);
	
	//$.get("https://eu.cloudcall.kz/test-damu/?phone=" + domInfo.phone + "&iin=" + domInfo.iin + "&fio=" + domInfo.fio, function (data) {
    //    console.log(data)
	//});
	
	//window.open("https://eu.cloudcall.kz/test-damu/?phone=" + domInfo.phone + "&iin=" + domInfo.iin + "&fio=" + domInfo.fio, '_blank').focus();
	window.open("http://91.201.215.27:1234/form/?phone=" + domInfo.phone + "&iin=" + domInfo.iin + "&fio=" + domInfo.fio + "&birth=" + domInfo.birth + "&passport=" + domInfo.passport + "&nation=" + domInfo.nation + "&soc_status=" + domInfo.soc_status + "&life_status=" + domInfo.life_status + "&edu=" + domInfo.edu + "&lgot=" + domInfo.lgot + "&blood=" + domInfo.blood + "&factor=" + "'" + domInfo.factor + "'" + "&date_deter=" + domInfo.date_deter, '_blank').focus();
  }
});






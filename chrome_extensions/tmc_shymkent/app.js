

function test() {
	$.get("https://google.com", function (data) {
        console.log(data)
	});
}

//setInterval(test, 1000)
/*
console.log('connected')

function shmest() {
	console.log('shmesh')
}

$(document).ready(function() {
	console.log('doc ready')
	
	$('#id_btn_send').onclick = function() {console.log('doc test')};
	
} )
*/
/*
function test2(){
	const wws = document.getElementById('txtPersonFIO')
	console.log('fioooo',wws.value)
}

//setInterval(test2, 1000);



document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('id_btn_send');
    // onClick's logic below:
    link.addEventListener('click', function() {
        //console.log('xxx', fio);
		test2();
    });
});
*/

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log(firstHref);
    }
  }
);

var g_fio = '';

function test2(){
	const wws = document.getElementById('txtPersonFIO')
	g_fio = wws.value
	console.log('fioooo',g_fio)
	
}

setInterval(test2, 1000);

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('id_btn_send');
    // onClick's logic below:
    link.addEventListener('click', function() {
        console.log('g_fio', g_fio)
    });
});
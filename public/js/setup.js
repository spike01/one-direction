doneBtn = $("#done");
doneBtn.hide();

new ShareButton();

$("share-button").hide();
$("#label").hide();

if(window.geo) {
  $("#retry").hide();
}

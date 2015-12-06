

//doneBtn = $("#done");
//doneBtn.hide();

//$("#label").hide();

//if(window.geo) {
  //$("#retry").hide();
//}

// Above is handled in setup.js, but shown here so we don't have to flick
// through files


function init() {
  require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/dijit/LocateButton",
  "esri/toolbars/draw",
  "esri/Color",
  "esri/graphic",

  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",

  "dijit/registry",

  "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
  "dijit/form/Button", "dijit/WidgetSet",
  "dojo/domReady!"],
  everythingElse)
}

function everythingElse(Map, FeatureLayer, LocateButton, Draw, Color, Graphic,
                        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
                        registry) {

  var map = new Map("map", {
    zoom: 15,
    basemap: "topo"
  });


  navigator.geolocation.getCurrentPosition(function(position) { map.centerAndZoom([position.coords.longitude, position.coords.latitude], 15) });

  map.on("load", createToolbar);
  map.on("load", drawData);

  navigator.geolocation.getCurrentPosition(function(position) {
    map.centerAndZoom([position.coords.longitude, position.coords.latitude], 15)
  });

  var color = new Color([51,105,232]);
  var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, color, 7);

  geoLocate = new LocateButton({
    map: map,
    scale: 12000
  }, "LocateButton");
  geoLocate.startup();

  drawBtn = $("#draw");
  drawBtn.on("click", activateTool);

  doneBtn.on("click", function() {
    toolbar.deactivate();
    map.showZoomSlider();
    $("share-button").show();
    $("#copy").show();
    $("#label").show();
    $("#done").hide();
    sendEvent();
  })

  function activateTool() {
    if(window.geo) {
      $("#saywhat").val("");
      reset();
    }
    $("#retry").show();
    toolbar.activate(Draw["FREEHAND_POLYLINE"]);
    map.hideZoomSlider();
    drawBtn.hide();
    doneBtn.show();
  }

  var lines = []

  function createToolbar() {
    toolbar = new Draw(map);
    toolbar.on("draw-end", addLine);
  }

  function addLine(evt) {
    lines.push(evt.geometry);
    addToMap(evt);
    toolbar.activate(Draw["FREEHAND_POLYLINE"]);
    map.hideZoomSlider();
  }

   function sendEvent(){
     console.log(getMessage())
     var payload = {
       lines: lines,
       message: getMessage()
     }
     $.post("/save", JSON.stringify(payload), function(response) {
       var url = "http://snapmap-techcrunch.herokuapp.com/" + JSON.parse(response).key
       $("#share").attr("value", url);
       new ShareButton({
         url: url,
         title: "Maps - in a snap!",
         description: "Maps - in a snap!"
      });
    });
   }

  function getMessage() {
    return $("#saywhat").val();
  }

  function addToMap(evt) {
    var graphic = new Graphic(evt.geometry, lineSymbol);
    map.graphics.add(graphic);
  }

  function drawData() {
    if(window.geo) {
      $("#saywhat").val(geo.message)
      geo.lines.forEach(function(line) {
        var graphic = new Graphic({geometry: line});
        graphic.symbol = lineSymbol;
        map.graphics.add(graphic);
      })
    }
  }

  $("#retry").click(reset)

  function reset() {
    lines = [];
    map.graphics.clear();
    $("#draw").show();
    $("share-button").hide();
    $("#label").hide();
    $("#retry").hide();
    $("#done").hide()
  }
};

new Clipboard('#copy');

init();

$(function() {
  $("#saywhat").emojiPicker();
})

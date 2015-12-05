window.test_geo = null;

function init() {
  require([
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/dijit/LocateButton",
  "esri/toolbars/draw",
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

function everythingElse(Map, FeatureLayer, LocateButton, Draw, Graphic,
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

  geoLocate = new LocateButton({
    map: map,
    scale: 12000
  }, "LocateButton");
  geoLocate.startup();

  drawBtn = $("#draw");
  drawBtn.on("click", activateTool);

  function activateTool() {
    drawBtn.hide();
    toolbar.activate(Draw["FREEHAND_POLYLINE"]);
    map.hideZoomSlider();
  }

  function createToolbar(themap) {
    toolbar = new Draw(map);
    toolbar.on("draw-end", addAndSend);
  }

  function addAndSend(evt) {
    addToMap(evt);
    sendEvent(evt);
  }

   function sendEvent(evt){
     $.post("/save", JSON.stringify(evt.geometry), function(response) {
      $("#share").attr("value", "http://techcrunch-one-direction.com/" + JSON.parse(response).key);
      $("#link").modal();
      new ShareButton({
        url: JSON.parse(response).key
      })
    });
   }

  function addToMap(evt) {
    var symbol;
    toolbar.deactivate();
    map.showZoomSlider();
    symbol = new SimpleLineSymbol();
    var graphic = new Graphic(evt.geometry, symbol);
    map.graphics.add(graphic);
  }

  function drawData() {
    if(window.geo) {
      var symbol;
      symbol = new SimpleLineSymbol();
      var graphic = new Graphic({geometry: geo}, symbol);
      graphic.symbol = new SimpleLineSymbol();
      map.graphics.add(graphic);
    }
  }

  $("#retry").click(function() {
    $.modal.close();
    map.graphics.clear();
    $("#draw").show();
  })
};


init();

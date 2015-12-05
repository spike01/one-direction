require(["esri/map",
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
           "dojo/domReady!"], function(Map, FeatureLayer, LocateButton, Draw, Graphic,
                                       SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, registry) {
             var map = new Map("map", {
               zoom: 15,
               basemap: "topo"
             });

             navigator.geolocation.getCurrentPosition(function(position) { map.centerAndZoom([position.coords.longitude, position.coords.latitude], 15) });

             map.on("load", createToolbar);
             map.on("load", drawData);

             var layerDefinition = {
                   "geometryType": "esriGeometryPolygon",
                   "fields": [{
                           "name": "BUFF_DIST",
                           "type": "esriFieldTypeInteger",
                           "alias": "Buffer Distance"
                                       }]
                     }
             var featureCollection = {
                   layerDefinition: layerDefinition,
                   featureSet: null
                 }
             var routeLayer = new FeatureLayer(featureCollection, {
                showLabels: true
             })
             map.addLayer(routeLayer)

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
               toolbar.activate(Draw["FREEHAND_POLYLINE"]);
               map.hideZoomSlider();
             }

             function createToolbar(themap) {
               toolbar = new Draw(map);
               toolbar.on("draw-end", addAndSend);
             }

             function addAndSend(evt) {
               addToMap(evt)
               $.post("/save", JSON.stringify(evt.geometry), function(response) {
                  $("#link").text("http://techcrunch-one-direction.com/" + JSON.parse(response).key);
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
               console.log(geo)
               symbol = new SimpleLineSymbol();
               var graphic = new Graphic(geo, symbol);
               routeLayer.applyEdits([graphic])
               map.addLayer(routeLayer)
             }
           }
         });

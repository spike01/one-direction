require(["esri/map",
         "esri/dijit/LocateButton",
         "esri/toolbars/draw",
         "esri/graphic",

         "esri/symbols/SimpleMarkerSymbol",
         "esri/symbols/SimpleLineSymbol",
         "esri/symbols/SimpleFillSymbol",

         "dojo/parser", "dijit/registry",

         "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
         "dijit/form/Button", "dijit/WidgetSet",
         "dojo/domReady!"], function(Map, LocateButton, Draw, Graphic,
                                     SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, parser, registry) {
           var coords;
           navigator.geolocation.getCurrentPosition(function(position) { coords =[position.coords.latitude, position.coords.longitude]});

           parser.parse();

           var map = new Map("map", {
             center: coords,
             zoom: 20,
             basemap: "topo"
           });

           map.on("load", createToolbar);

           geoLocate = new LocateButton({
             map: map,
             scale: 12000
           }, "LocateButton");
           geoLocate.startup();

           // loop through all dijits, connect onClick event
           // listeners for buttons to activate drawing tools
           registry.forEach(function(d) {
             // d is a reference to a dijit
             // could be a layout container or a button
             if ( d.declaredClass === "dijit.form.Button" ) {
               d.on("click", activateTool);
             }
           });

           function activateTool() {
             var tool = this.label.toUpperCase().replace(/ /g, "_");
             toolbar.activate(Draw[tool]);
             map.hideZoomSlider();
           }

           function createToolbar(themap) {
             toolbar = new Draw(map);
             toolbar.on("draw-end", addToMap);
           }

           function addToMap(evt) {
             var symbol;
             toolbar.deactivate();
             map.showZoomSlider();
             switch (evt.geometry.type) {
             case "point":
             case "multipoint":
               symbol = new SimpleMarkerSymbol();
               break;
             case "polyline":
               symbol = new SimpleLineSymbol();
               break;
             default:
               symbol = new SimpleFillSymbol();
               break;
             }
             var graphic = new Graphic(evt.geometry, symbol);
             map.graphics.add(graphic);
           }
         });

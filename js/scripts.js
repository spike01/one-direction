require(["esri/map",
         "esri/dijit/LocateButton",
         "dojo/domReady!"], function(Map, LocateButton) {
           var map = new Map("map", {
             center: [-118, 34.5],
             zoom: 8,
             basemap: "topo"
           });

           geoLocate = new LocateButton({
             map: map
           }, "LocateButton");
           geoLocate.startup();
});

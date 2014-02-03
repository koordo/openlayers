var layerListeners = {
    featureclick: function(e) {
        log(e.object.name + " says: " + e.feature.id + " clicked.");
        return false;
    },
    nofeatureclick: function(e) {
        log(e.object.name + " says: No feature clicked.");
    }
};

var style = new OpenLayers.StyleMap({
    'default': OpenLayers.Util.applyDefaults(
        {label: "${l}", pointRadius: 10},
        OpenLayers.Feature.Vector.style["default"]
    ),
    'select': OpenLayers.Util.applyDefaults(
        {pointRadius: 10},
        OpenLayers.Feature.Vector.style.select
    )
});

var sldXml = '<?xml version="1.0" encoding="iso-8859-1"?><StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">  <NamedLayer>    <Name>Layer</Name>    <UserStyle>      <Name>default</Name>      <Title>default</Title>      <Abstract></Abstract>      <FeatureTypeStyle>        <Rule>          <Title>Title</Title>          <PointSymbolizer>            <Graphic>              <ExternalGraphic>                <OnlineResource xlink:type="simple" xlink:href="img/check-round-green.png" />                <Format>image/png</Format>              </ExternalGraphic>              <Size>                <ogc:Literal>20</ogc:Literal>              </Size>            </Graphic>          </PointSymbolizer>        </Rule>      </FeatureTypeStyle>    </UserStyle>    <UserStyle>      <Name>select</Name>      <Title>select</Title>      <Abstract></Abstract>      <FeatureTypeStyle>        <Rule>          <Title>Title</Title>          <PointSymbolizer>            <Graphic>              <ExternalGraphic>                <OnlineResource xlink:type="simple" xlink:href="img/check-round-green.png" />                <Format>image/png</Format>              </ExternalGraphic>              <Size>                <ogc:Literal>31</ogc:Literal>              </Size>            </Graphic>          </PointSymbolizer>        </Rule>      </FeatureTypeStyle>    </UserStyle>   </NamedLayer></StyledLayerDescriptor>';
var sld = new OpenLayers.Format.SLD().read(sldXml);
var styleMapSld = new OpenLayers.StyleMap({
	'default': GetLayerStyle(sld, 'default'),
	'select': GetLayerStyle(sld, 'select')
});
			
var layer1 = new OpenLayers.Layer.Vector("Layer 1", {
    styleMap: style,
	eventListeners: layerListeners
});
layer1.addFeatures([
    new OpenLayers.Feature.Vector(OpenLayers.Geometry.fromWKT("POINT(-1 -1)"), {l:1}),
    new OpenLayers.Feature.Vector(OpenLayers.Geometry.fromWKT("POINT(1 1)"), {l:1})
]);
var layer2 = new OpenLayers.Layer.Vector("Layer 2", {
    //styleMap: style,
	styleMap: styleMapSld,
    eventListeners: layerListeners
});
layer2.addFeatures([
    new OpenLayers.Feature.Vector(OpenLayers.Geometry.fromWKT("POINT(-1 1)"), {l:2}),
    new OpenLayers.Feature.Vector(OpenLayers.Geometry.fromWKT("POINT(1 -1)"), {l:2})
]);

var map = new OpenLayers.Map({
    div: "map",
    allOverlays: true,
    layers: [layer1, layer2],
    zoom: 6,
    center: [0, 0],
    eventListeners: {
        featureover: function(e) {
            e.feature.renderIntent = "select";
            e.feature.layer.drawFeature(e.feature);
            log("Map says: Pointer entered " + e.feature.id + " on " + e.feature.layer.name);
        },
        featureout: function(e) {
            e.feature.renderIntent = "default";
            e.feature.layer.drawFeature(e.feature);
            log("Map says: Pointer left " + e.feature.id + " on " + e.feature.layer.name);
        },
        featureclick: function(e) {
            log("Map says: " + e.feature.id + " clicked on " + e.feature.layer.name);
        }
    }
});

function log(msg) {
    if (!log.timer) {
        result.innerHTML = "";
        log.timer = window.setTimeout(function() {delete log.timer;}, 100);
    }
    result.innerHTML += msg + "<br>";
}

/* Gets the layer style from sld. */
function GetLayerStyle (sld, styleName) {
	for (var layerName in sld.namedLayers) {
		if (layerName) {
			var styles = sld.namedLayers[layerName].userStyles;

			var style;
			for (var i = 0; i < styles.length; ++i) {
				style = styles[i];
				if (style.name == styleName) {
					return style;
				}
			}
			return sld.namedLayers[layerName].userStyles[0];
		}
	}
	return null;
};
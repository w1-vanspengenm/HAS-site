var landenData;
var kaart;
var oms;
var taal = "EN";
var grayGroupLayer;
var osmGray;
var bluemarble;
var satellietLayer;
var studentenBAcluster;
var studentenDVcluster;
var studentenFDcluster;
var studentenGMDcluster;
var studentenHBMcluster;
var studentenIFAcluster;
var studentenMKcluster;
var studentenPVcluster;
var studentenTAcluster;
var studentenTBcluster;
var studentenVMcluster;
var studentenBAaantal = 0;
var studentenDVaantal = 0;
var studentenFDaantal = 0;
var studentenGMDaantal = 0;
var studentenHBMaantal = 0;
var studentenIFAaantal = 0;
var studentenMKaantal = 0;
var studentenPVaantal = 0;
var studentenTAaantal = 0;
var studentenTBaantal = 0;
var studentenVMaantal = 0;
var medewerkersAantal = 0;
var studieAantal = 0;
var medewerkersLayer;
var studieLayer;
var popupOffset = new L.Point(0,-20);


var mapOptions = {
  zoomAnimation: true,
  zoomAnimationTreshold: 5,
  zoomControl: false,
  center: [0, 0],
  zoom: 2,
  minZoom: 2
};

var panOptions = {
    animate: true,
    duration: 2.0,
    easeLinearity: 0.000001
};

var zoomOptions = {
    animate: true
};

var panZoomOptions = {
    reset: false,
    pan: panOptions,
    zoom: zoomOptions,
    animate: true
};

$(document).ready(function ()
{
    var serviceName = { url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:tbl_Landen&outputFormat=application%2Fjson' };
    $.ajax(
    {
        url: 'geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data)
    {
        landenData = data;
        initMap();

    })
    .error(function ()
    {
        alert("Landen json niet opgehaald");
    });
});
function showLegenda()
{
    $('#legendamenu').hide();
    $('#legenda').show();
}

function hideLegenda()
{
    $('#legendamenu').show();
    $('#legenda').hide();
}

function showFilter()
{
    $('#filtermenu').hide();
    $('#filter').show();
}

function hideFilter()
{
    $('#filtermenu').show();
    $('#filter').hide();
}

function switchAchtergrond(radio)
{
    if (radio.checked && radio.id == "satelliet")
    {
        kaart.removeLayer(grayGroupLayer);
//        kaart.removeLayer(osmGray);
//        kaart.addLayer(bluemarble);
        kaart.addLayer(satellietLayer);
    }
    if (radio.checked && radio.id == "grijs")
    {
//        kaart.removeLayer(bluemarble);
        kaart.removeLayer(satellietLayer);
        kaart.addLayer(grayGroupLayer);
//        kaart.addLayer(osmGray);
    }
}

function geenStages(checkb)
{
    switch(taal)
    {
        case "NL":
            BootstrapDialog.alert("Voor deze opleiding zijn op dit moment geen studenten in het buitenland");
            break;
        case "EN":
            BootstrapDialog.alert("For this study program no students are abroad at this moment");
            break;
    }
    $("#"+checkb.id).attr('checked', false);
}

function geenMedewerkers()
{
    switch(taal)
    {
        case "NL":
            BootstrapDialog.alert("Op dit moment zijn er geen medewerkers in het buitenland");
            break;
        case "EN":
            BootstrapDialog.alert("At this moment no staff is abroad");
            break;
    }
}

function geenStudie()
{
    switch(taal)
    {
        case "NL":
            BootstrapDialog.alert("Op dit moment geen studenten die in het buitenland studeren");
            break;
        case "EN":
            BootstrapDialog.alert("At this moment no students follow a study program abroad");
            break;
    }
}



function switchMarkers(checkb)
{
    switch(checkb.id)
    {
        case 'ba':
            if (checkb.checked) { kaart.addLayer(studentenBAcluster); }
            else { kaart.removeLayer(studentenBAcluster); }
            break;
        case 'dv':
            if (checkb.checked) { kaart.addLayer(studentenDVcluster); }
            else { kaart.removeLayer(studentenDVcluster); }
            break;
        case 'fd':
            if (checkb.checked) { kaart.addLayer(studentenFDcluster); }
            else { kaart.removeLayer(studentenFDcluster); }
            break;
        case 'gmd':
            if (checkb.checked) { kaart.addLayer(studentenGMDcluster); }
            else { kaart.removeLayer(studentenGMDcluster); }
            break;
        case 'hbm':
            if (checkb.checked) { kaart.addLayer(studentenHBMcluster); }
            else { kaart.removeLayer(studentenHBMcluster); }
            break;
        case 'ifa':
            if (checkb.checked) { kaart.addLayer(studentenIFAcluster); }
            else { kaart.removeLayer(studentenIFAcluster); }
            break;
        case 'mk':
            if (checkb.checked) { kaart.addLayer(studentenMKcluster); }
            else { kaart.removeLayer(studentenMKcluster); }
            break;
        case 'pv':
            if (checkb.checked) { kaart.addLayer(studentenPVcluster); }
            else { kaart.removeLayer(studentenPVcluster); }
            break;
        case 'ta':
            if (checkb.checked) { kaart.addLayer(studentenTAcluster); }
            else { kaart.removeLayer(studentenTAcluster); }
            break;
        case 'tb':
            if (checkb.checked) { kaart.addLayer(studentenTBcluster); }
            else { kaart.removeLayer(studentenTBcluster); }
            break;
        case 'vm':
            if (checkb.checked) { kaart.addLayer(studentenVMcluster); }
            else { kaart.removeLayer(studentenVMcluster); }
            break;
        case 'medewerkers':
            if (checkb.checked) { kaart.addLayer(medewerkersLayer); }
            else { kaart.removeLayer(medewerkersLayer); }
            break;
        case 'studie':
            if (checkb.checked) { kaart.addLayer(studieLayer); }
            else { kaart.removeLayer(studieLayer); }
            break;
    }
}


function initMap()
{
    console.log(landenData);
    //initialiseren van de kaart
    kaart = new L.Map('kaart', mapOptions);
    oms = new OverlappingMarkerSpiderfier(kaart, {
        keepSpiderfied: true
    });
    var popup = new L.Popup({
        offset: popupOffset
    });
    oms.addListener('click', function(marker) {
        popup.setContent(marker.desc);
        popup.setLatLng(marker.getLatLng());
        kaart.openPopup(popup);
    });
    kaart.addControl(L.control.zoom({position: 'topright'}));

    kaart.on('contextmenu', function(){
        showFilter();
    });

    // Gebruik Open Street Map als kaart-laag
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data &copy; OpenStreetMap contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 16, attribution: osmAttrib});
    osmGray = new L.TileLayer.Grayscale(osmUrl, {minZoom: 1, maxZoom: 16, attribution: osmAttrib});

    // start the map in 0, 0
    kaart.setView([0, 0], 2, panZoomOptions);


    var Esri_WorldGrayCanvas = L.esri.basemapLayer("Gray");
    var Esri_WorldGrayCanvasLabels = L.esri.basemapLayer("GrayLabels");

    grayGroupLayer = new L.LayerGroup([Esri_WorldGrayCanvas, Esri_WorldGrayCanvasLabels]);
    kaart.addLayer(grayGroupLayer);
//    kaart.addLayer(osmGray);


//    kaart.addLayer(Esri_WorldGrayCanvas);

    bluemarble = new L.TileLayer.WMS("http://maps.opengeo.org/geowebcache/service/wms", {
        layers: 'bluemarble',
        attribution: "&copy; NASA Blue Marble",
        minZoom: 2,
        maxZoom: 16
    });

//    satellietLayer = new L.Google("SATELLITE", {crs: L.CRS.EPSG3395} );   // 4352
    satellietLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });


    //collectie van alle iconen die een standaard grootte meekrijgen
    var LeafIcon = L.Icon.extend({
        options : {
            iconSize : [32, 32]
        }
    });

        //eigen  iconen, bij de iconUrl kun je eventueel een andere icoon meegeven
    var stageIcon = new LeafIcon({
        iconUrl : 'images/Stage.png',
        iconSize : [32, 32],
        iconAnchor : [15, 32]
    });

    var medewerkerIcon = new LeafIcon({
        iconUrl : 'images/Medewerker.png',
        iconSize : [32, 32],
        iconAnchor : [15, 32]
    });

    var studentIcon = new LeafIcon({
        iconUrl : 'images/Studie.png',
        iconSize : [32, 32],
        iconAnchor : [15, 32]
    });


    //code die er voor zorgt dat hij automatisch naar de laag zoomt als je een laag inschakelt
    kaart.on('overlayadd', function(laagevent) {
//        kaart.fitBounds(laagevent.layer.getBounds());
    });

    medewerkersLayer = new L.FeatureGroup();
    studieLayer = new L.FeatureGroup();




    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenBAcluster = new L.FeatureGroup();
    // studentenBAcluster = new L.MarkerClusterGroup({
        // spiderfyOnMaxZoom : true,
        // showCoverageOnHover : false
    // });


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenDVcluster = new L.FeatureGroup();
    // studentenDVcluster = new L.MarkerClusterGroup({
        // spiderfyOnMaxZoom : true,
        // showCoverageOnHover : false
    // });



    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenFDcluster = new L.FeatureGroup();
    // studentenFDcluster = new L.MarkerClusterGroup({
        // spiderfyOnMaxZoom : true,
        // showCoverageOnHover : false
    // });


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenGMDcluster = new L.FeatureGroup();
    // studentenGMDcluster = new L.MarkerClusterGroup({
        // spiderfyOnMaxZoom : true,
        // showCoverageOnHover : false
    // });


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenHBMcluster = new L.FeatureGroup();
    // studentenHBMcluster = new L.MarkerClusterGroup({
        // spiderfyOnMaxZoom : true,
        // showCoverageOnHover : false
    // });


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenIFAcluster = new L.FeatureGroup();
    // studentenIFAcluster = new L.MarkerClusterGroup({
        // spiderfyOnMaxZoom : true,
        // showCoverageOnHover : false
    // });
//

    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenMKcluster = new L.FeatureGroup();
    // studentenMKcluster = new L.MarkerClusterGroup({
        // spiderfyOnMaxZoom : true,
        // showCoverageOnHover : false
    // });


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenPVcluster = new L.FeatureGroup();
    // studentenPVcluster = new L.MarkerClusterGroup({
        // spiderfyOnMaxZoom : true,
        // showCoverageOnHover : false
    // });


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenTAcluster = new L.FeatureGroup();
    // studentenTAcluster = new L.MarkerClusterGroup({
        // spiderfyOnMaxZoom : true,
        // showCoverageOnHover : false
    // });


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenTBcluster = new L.FeatureGroup();
    // studentenTBcluster = new L.MarkerClusterGroup({
        // spiderfyOnMaxZoom : true,
        // showCoverageOnHover : false
    // });


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenVMcluster = new L.FeatureGroup();
    // studentenVMcluster = new L.MarkerClusterGroup({
        // spiderfyOnMaxZoom : true,
        // showCoverageOnHover : false
    // });



    $.each(medewerkers.features, function(i, medewerker) {
       var marker = new L.Marker([medewerker.geometry.coordinates[1], medewerker.geometry.coordinates[0]], {
            icon : medewerkerIcon
        }).bindPopup(medewerker.properties.medewerkernaam+"<br>"+medewerker.properties.bezoeklocatie+"<br>"+medewerker.properties.bezoekplaats+"<br>"+medewerker.properties.bezoekland, { offset: popupOffset });
        medewerkersLayer.addLayer(marker);
        oms.addMarker(marker);
        medewerkersAantal++;
    });


    $.each(studenten.features, function(i, student) {
       var marker = new L.Marker([student.geometry.coordinates[1], student.geometry.coordinates[0]], {
            icon : studentIcon
        }).bindPopup(student.properties.opleiding+"<br>"+student.properties.studentnaam+"<br>"+student.properties.instituutnaam+"<br>"+student.properties.instituutplaats+"<br>"+student.properties.instituutland, { offset: popupOffset });
        switch (student.properties.opleiding)
        {
            case 'BA':
                studentenBAcluster.addLayer(marker);
                studentenBAaantal++;
                break;
            case 'DV':
                studentenDVcluster.addLayer(marker);
                studentenDVaantal++;
                break;
            case 'FD':
                studentenFDcluster.addLayer(marker);
                studentenFDaantal++;
                break;
            case 'GM':
                studentenGMDcluster.addLayer(marker);
                studentenGMDaantal++;
                break;
            case 'HBM':
                studentenHBMcluster.addLayer(marker);
                studentenHBMaantal++;
                break;
            case 'IFA':
                studentenIFAcluster.addLayer(marker);
                studentenIFAaantal++;
                break;
            case 'MK':
                studentenMKcluster.addLayer(marker);
                studentenMKaantal++;
                break;
            case 'PV':
                studentenPVcluster.addLayer(marker);
                studentenPVaantal++;
                break;
            case 'TA':
                studentenTAcluster.addLayer(marker);
                studentenTAaantal++;
                break;
            case 'TB':
                studentenTBcluster.addLayer(marker);
                studentenTBaantal++;
                break;
            case 'VM':
                studentenVMcluster.addLayer(marker);
                studentenVMaantal++;
                break;

        }
//        studieLayer.addLayer(marker);
        oms.addMarker(marker);
//        studieAantal++;
    });

    var serviceName = {url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:huidige%20stages&outputFormat=application%2Fjson'};
    //Lezen geoJSON alle studenten
    $.ajax(
    {
        url: 'geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data)
    {
        $.each(data.features, function (i, stages)
        {
            console.log(stages);
            var marker = new L.Marker([stages.properties.Latitude, stages.properties.Longitude], {
                icon: stageIcon
            }).bindPopup(stages.properties.Voornaam + " " + stages.properties.Achternaam + "<br>" + stages.properties.Instelling_naam + "<br>" + stages.properties.Plaats + "<br>" + stages.properties.Landcode + "<br>" + stages.properties.Opleidingscode, { offset: popupOffset });
            switch (stages.properties.Opleidingscode)
            {
                case 'BA':
                    studentenBAcluster.addLayer(marker);
                    studentenBAaantal++;
                    break;
                case 'DV':
                    studentenDVcluster.addLayer(marker);
                    studentenDVaantal++;
                    break;
                case 'FD':
                    studentenFDcluster.addLayer(marker);
                    studentenFDaantal++;
                    break;
                case 'GM':
                    studentenGMDcluster.addLayer(marker);
                    studentenGMDaantal++;
                    break;
                case 'HBM':
                    studentenHBMcluster.addLayer(marker);
                    studentenHBMaantal++;
                    break;
                case 'IFA':
                    studentenIFAcluster.addLayer(marker);
                    studentenIFAantal++;
                    break;
                case 'MK':
                    studentenMKcluster.addLayer(marker);
                    studentenMKaantal++;
                    break;
                case 'PV':
                    studentenPVcluster.addLayer(marker);
                    studentenPVaantal++;
                    break;
                case 'TA':
                    studentenTAcluster.addLayer(marker);
                    studentenTAaantal++;
                    break;
                case 'TB':
                    studentenTBcluster.addLayer(marker);
                    studentenTBaantal++;
                    break;
                case 'VM':
                    studentenVMcluster.addLayer(marker);
                    studentenVMaantal++;
                    break;

            }
            oms.addMarker(marker);
            makeMenu();
        });
    })
    .error(function ()
    {
        alert("er gaat iets fout");
    });

    kaart.addLayer(studentenBAcluster);
    kaart.addLayer(studentenDVcluster);
    kaart.addLayer(studentenFDcluster);
    kaart.addLayer(studentenGMDcluster);
    kaart.addLayer(studentenHBMcluster);
    kaart.addLayer(studentenIFAcluster);
    kaart.addLayer(studentenMKcluster);
    kaart.addLayer(studentenPVcluster);
    kaart.addLayer(studentenTAcluster);
    kaart.addLayer(studentenTBcluster);
    kaart.addLayer(studentenVMcluster);
    kaart.addLayer(medewerkersLayer);
    kaart.addLayer(studieLayer);



    //de basemaps die komen te staan in het menu rechtsbovenin waar je uit kan kiezen
    var baseMap = {
         "Grijze achtergrondkaart": grayGroupLayer,
         "Sateliet achtergrond": bluemarble
    };

    //de layers die je aan en uit kan zetten in het menu rechtsonderin
    var categorien = {
        "Stages" : {
            "BA" : studentenBAcluster,
            "DV" : studentenDVcluster,
            "FD" : studentenFDcluster,
            "HBM" : studentenHBMcluster,
            "MK" : studentenMKcluster,
            "PV" : studentenPVcluster,
            "TA" : studentenTAcluster,
            "TB" : studentenTBcluster,
            "VM" : studentenVMcluster

        }
    };
    var zoekLayer = new L.LayerGroup();
    zoekLayer.addLayer(studentenBAcluster);

//    L.control.groupedLayers(baseMap, categorien, {position: 'topleft'}).addTo(kaart);

    //hier wordt de schaalbalk toegevoegd
//    L.control.scale().addTo(kaart);
}

function initZoom()
{
    kaart.setZoom(2);
}
function makeMenu ()
{

    switch (taal)
    {
        case "NL":
            $('#kaart').append('<div id="legendamenu" onclick="showLegenda()"><h4><i class="glyphicon glyphicon-chevron-left"></i> Legenda</h4></div>');
            $('#kaart').append('<div id="legenda" onclick="hideLegenda()"><h4> <i class="glyphicon glyphicon-remove-circle"></i> Legenda</h4><ul><li><img src="images\\Stage.png" /> Stages</li><li><img src="images\\Medewerker.png" /> Medewerkers</li><li><img src="images\\Studie.png" /> Studie</li></ul></div>');
            hideLegenda();
            var filterTekst = '<div id="filter" ><h4>Filter <span onclick="hideFilter()"><i class="glyphicon glyphicon-remove-circle"></i></span></h4>';
            filterTekst += '<ul><li><h4>Achtergrondkaarten</h4><ul>';
            filterTekst += '<li><input type="radio" name="achtergrond" id="grijs" onclick="switchAchtergrond(this)" checked="checked" /> <label for="grijs">Grijze achtergrondkaart</label></li>';
            filterTekst += '<li><input type="radio" name="achtergrond" id="satelliet" onclick="switchAchtergrond(this)" /> <label for="satelliet">Satelliet beelden</label></li>';
            filterTekst += '</ul></li><li><h4>Opleidingen</h4><ul>';
            if (studentenBAaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="ba" onclick="switchMarkers(this)" checked="checked" />Bedrijskunde en Agribusiness</li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="ba" onclick="geenStages(this)" /> <label for="ba" class="filterinactive">Bedrijskunde en Agribusiness</label></li>';
            }
            if (studentenDVaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="dv" onclick="switchMarkers(this)" checked="checked" /> <label for="dv">Dier- en Veehouderij</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="dv" onclick="geenStages(this)" /> <label for="dv" class="filterinactive">Dier- en Veehouderij</label></li>';
            }
            if (studentenFDaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="fd" onclick="switchMarkers(this)" checked="checked" /> <label for="fd">Food Design</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="fd" onclick="geenStages(this)" /> <label for="fd" class="filterinactive">Food Design</label></li>';
            }
            if (studentenGMDaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="gmd" onclick="switchMarkers(this)" checked="checked" /> <label for="gmd">Geo Media &amp; Design</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="gmd" onclick="geenStages(this)" /> <label for="gmd" class="filterinactive">Geo Media & Design</label></li>';
            }
            if (studentenHBMaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="hbm" onclick="switchMarkers(this)" checked="checked" /> <label for="hbm">Horticulture &amp; Business Management</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="hbm" onclick="geenStages(this)" /> <label for="hbm" class="filterinactive">Horticulture &amp; Business Management</label></li>';
            }
            if (studentenIFAaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="ifa" onclick="switchMarkers(this)" checked="checked" /> <label for="ifa">International Food &amp; Agribusiness</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="ifa" onclick="geenStages(this)" /> <label for="ifa" class="filterinactive">International Food &amp; Agribusiness</label></li>';
            }
            if (studentenMKaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="mk" onclick="switchMarkers(this)" checked="checked" /> <label for="mk">Milieukunde</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="mk" onclick="geenStages(this)" /> <label for="mk" class="filterinactive">Milieukunde</label></li>';
            }
            if (studentenPVaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="pv" onclick="switchMarkers(this)" checked="checked" /> <label for="pv">Plattelandsvernieuwing</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="pv" onclick="geenStages(this)" /> <label for="pv" class="filterinactive">Plattelandsvernieuwing</label></li>';
            }
            if (studentenTAaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="ta" onclick="switchMarkers(this)" checked="checked" /> <label for="ta">Tuin- en Akkerbouw</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="ta" onclick="geenStages(this)" /> <label for="ta" class="filterinactive">Tuin- en Akkerbouw</label></li>';
            }
            if (studentenTBaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="tb" onclick="switchMarkers(this)" checked="checked" /> <label for="tb">Toegepaste Biologie</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="tb" onclick="geenStages(this)" /> <label for="tb" class="filterinactive">Toegepaste Biologie</label></li>';
            }
            if (studentenVMaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="vm" onclick="switchMarkers(this)" checked="checked" /> <label for="vm">Voedingsmiddelen Technologie</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="vm" onclick="geenStages(this)" /> <label for="vm" class="filterinactive">Voedingsmiddelen Technologie</label></li>';
            }
            filterTekst += '</ul>';

            filterTekst += '<li><h4>Medewerkers</h4><ul>';
            if (medewerkersAantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="medewerkers" onclick="switchMarkers(this)" checked="checked" /> <label for="medewerkers">Medewerkers</li></ul>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="medewerkers" onclick="geenMedewerkers() class="filterinactive" /> <label for="medewerkers">Medewerkers</li></ul>';
            }
            filterTekst += '</ul></div>';
            $('#kaart').append('<div id="filtermenu" onclick="showFilter()"><h4>Filter <i class="glyphicon glyphicon-chevron-right"></i></h4></div>');
            $('#kaart').append(filterTekst);
            hideFilter();
            break;
        case "EN":
            $('#kaart').append('<div id="legendamenu" onclick="showLegenda()"><h4><i class="glyphicon glyphicon-chevron-left"></i> Legend</h4></div>');
            $('#kaart').append('<div id="legenda" onclick="hideLegenda()"><h4> <i class="glyphicon glyphicon-remove-circle"></i> Legend</h4><ul><li><img src="images\\Stage.png" /> Traineeships</li><li><img src="images\\Medewerker.png" /> Staff</li><li><img src="images\\Studie.png" /> Study</li></ul></div>');
            hideLegenda();
            var filterTekst = '<div id="filter" ><h4>Filter <span onclick="hideFilter()"><i class="glyphicon glyphicon-remove-circle"></i></span></h4>';
            filterTekst += '<ul><li><h4>Type of map</h4><ul>';
            filterTekst += '<li><input type="radio" name="achtergrond" id="grijs" onclick="switchAchtergrond(this)" checked="checked" /> <label for="grijs">Grey background</label></li>';
            filterTekst += '<li><input type="radio" name="achtergrond" id="satelliet" onclick="switchAchtergrond(this)" /> <label for="satelliet">Satellite views</label></li>';
            filterTekst += '</ul></li><li><h4>Study Programmes</h4><ul>';
            if (studentenBAaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="ba" onclick="switchMarkers(this)" checked="checked" /> <label for="ba">Business Administration &amp; Agribusiness</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="ba" onclick="geenStages(this)" /> <label for="ba" class="filterinactive">Business Administration &amp; Agribusiness</label></li>';
            }
            if (studentenDVaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="dv" onclick="switchMarkers(this)" checked="checked" /> <label for="dv">Animal Husbandry &amp; Animal Care</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="dv" onclick="geenStages(this)" /> <label for="dv" class="filterinactive">Animal Husbandry &amp; Animal Care</label></li>';
            }
            if (studentenFDaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="fd" onclick="switchMarkers(this)" checked="checked" /> <label for="fd">Food Design</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="fd" onclick="geenStages(this)" /> <label for="fd" class="filterinactive">Food Design</label></li>';
            }
            if (studentenGMDaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="gmd" onclick="switchMarkers(this)" checked="checked" /> <label for="gmd">Geo Media &amp; Design</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="gmd" onclick="geenStages(this)" /> <label for="gmd" class="filterinactive">Geo Media & Design</label></li>';
            }
            if (studentenHBMaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="hbm" onclick="switchMarkers(this)" checked="checked" /> <label for="hbm">Horticulture &amp; Business Management</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="hbm" onclick="geenStages(this)" /> <label for="hbm" class="filterinactive">Horticulture &amp; Business Management</label></li>';
            }
            if (studentenIFAaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="ifa" onclick="switchMarkers(this)" checked="checked" /> <label for="ifa">International Food &amp; Agribusiness</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="ifa" onclick="geenStages(this)" /> <label for="ifa" class="filterinactive">International Food &amp; Agribusiness</label></li>';
            }
            if (studentenMKaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="mk" onclick="switchMarkers(this)" checked="checked" /> <label for="mk">Environmental Studies</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="mk" onclick="geenStages(this)" /> <label for="mk" class="filterinactive">Environmental Studies</label></li>';
            }
            if (studentenPVaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="pv" onclick="switchMarkers(this)" checked="checked" /> <label for="pv">Garden & Landscape Management + Landscape Design + Urban & Rural Development</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="pv" onclick="geenStages(this)" /> <label for="pv" class="filterinactive">Garden & Landscape Management + Landscape Design + Urban & Rural Development</label></li>';
            }
            if (studentenTAaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="ta" onclick="switchMarkers(this)" checked="checked" /> <label for="ta">Horticulture & Arable Farming</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="ta" onclick="geenStages(this)" /> <label for="ta" class="filterinactive">Horticulture & Arable Farming</label></li>';
            }
            if (studentenTBaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="tb" onclick="switchMarkers(this)" checked="checked" /> <label for="tb">Applied Biology</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="tb" onclick="geenStages(this)" /> <label for="tb" class="filterinactive">Applied Biology</label></li>';
            }
            if (studentenVMaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="vm" onclick="switchMarkers(this)" checked="checked" /> <label for="vm">Food Technology</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="vm" onclick="geenStages(this)" /> <label for="vm" class="filterinactive">Food Technology</label></li>';
            }
            filterTekst += '</ul>';

            filterTekst += '<li><h4>Staff</h4><ul>';
            if (medewerkersAantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="medewerkers" onclick="switchMarkers(this)" checked="checked" /> <label for="medewerkers">Staff</li></ul>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="medewerkers" onclick="geenMedewerkers()" class="filterinactive" /> <label for="medewerkers">Staff</li></ul>';
            }
            filterTekst += '</ul></div>';
            $('#kaart').append('<div id="filtermenu" onclick="showFilter()"><h4>Filter <i class="glyphicon glyphicon-chevron-right"></i></h4></div>');
            $('#kaart').append(filterTekst);
            hideFilter();
            break;
    }
}
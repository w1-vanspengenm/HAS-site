var landenData;
var opleidingData;
var serviceName;
var kaart;
var oms;
var taal;
var grayGroupLayer;
var satellietLayer;
var studentenBAcluster;
var studentenDVcluster;
var studentenFIcluster;
var studentenGMcluster;
var studentenHBMcluster;
var studentenIFcluster;
var studentenMKcluster;
var studentenPVcluster;
var studentenTAcluster;
var studentenTBcluster;
var studentenVMcluster;
var studentenBAaantal = 0;
var studentenDVaantal = 0;
var studentenFIaantal = 0;
var studentenGMaantal = 0;
var studentenHBMaantal = 0;
var studentenIFaantal = 0;
var studentenMKaantal = 0;
var studentenMLaantal = 0;
var studentenTAaantal = 0;
var studentenTBaantal = 0;
var studentenVMaantal = 0;
//var medewerkersAantal = 0;
//var medewerkersLayer;
var popupOffset = new L.Point(0,-20);


var mapOptions = {
  zoomAnimation: true,
  zoomAnimationTreshold: 5,
  zoomControl: false,
  center: [0,0],
  zoom: 2,
  minZoom: 2,
  worldCopyJump:true
};

var zoomOptions = {
    animate: true
};

$(document).ready(function ()
{
    serviceName = { url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:tbl_Landen&outputFormat=application%2Fjson' };
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
        serviceName = { url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:tbl_Opleidingen&outputFormat=application%2Fjson' };
        $.ajax(
        {
            url: 'geoproxy.php',
            dataType: 'json',
            method: 'post',
            data: serviceName
        })
        .done(function (data)
        {
            opleidingData = data;
            initMap();
        })
        .fail(function ()
        {
            alert("Opleidingen json niet opgehaald");
        });
    })
    .fail(function ()
    {
        alert("Landen json niet opgehaald");
    });

});

function getLandNaam(landcode)
{
    var landnaam;
    $.each(landenData.features, function (i, landen)
    {
        if ("tbl_Landen." + landcode == landen.id)
        {
            switch (taal)
            {
                case "NL":
                    landnaam = landen.properties.Landnaam_nl_html
                    break;
                case "EN":
                    landnaam = landen.properties.Landnaam_en_html
                    break;
            }
            return false; // stop each
        }
    });
    return landnaam;
}

function getOpleidingNaam(opleidingcode)
{
    var opleidingnaam;
    $.each(opleidingData.features, function (i, opleidingen)
    {
        if ("tbl_Opleidingen." + opleidingcode == opleidingen.id)
        {
            switch (taal)
            {
                case "NL":
                    opleidingnaam = opleidingen.properties.Opleidingsnaam_nl
                    break;
                case "EN":
                    opleidingnaam = opleidingen.properties.Opleidingsnaam_en
                    break;
            }
            return false; // stop each
        }
    });
    return opleidingnaam;
}

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
        kaart.addLayer(satellietLayer);
    }
    if (radio.checked && radio.id == "grijs")
    {
        kaart.removeLayer(satellietLayer);
        kaart.addLayer(grayGroupLayer);
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

//function geenMedewerkers()
//{
//    switch(taal)
//    {
//        case "NL":
//            BootstrapDialog.alert("Op dit moment zijn er geen medewerkers in het buitenland");
//            break;
//        case "EN":
//            BootstrapDialog.alert("At this moment no staff is abroad");
//            break;
//    }
//}

function switchMarkers(checkb)
{
    switch(checkb.id)
    {
        case 'BA':
            if (checkb.checked) { kaart.addLayer(studentenBAcluster); }
            else { kaart.removeLayer(studentenBAcluster); }
            break;
        case 'DV':
            if (checkb.checked) { kaart.addLayer(studentenDVcluster); }
            else { kaart.removeLayer(studentenDVcluster); }
            break;
        case 'FI':
            if (checkb.checked) { kaart.addLayer(studentenFIcluster); }
            else { kaart.removeLayer(studentenFIcluster); }
            break;
        case 'GM':
            if (checkb.checked) { kaart.addLayer(studentenGMcluster); }
            else { kaart.removeLayer(studentenGMcluster); }
            break;
        case 'HBM':
            if (checkb.checked) { kaart.addLayer(studentenHBMcluster); }
            else { kaart.removeLayer(studentenHBMcluster); }
            break;
        case 'IF':
            if (checkb.checked) { kaart.addLayer(studentenIFcluster); }
            else { kaart.removeLayer(studentenIFcluster); }
            break;
        case 'MK':
            if (checkb.checked) { kaart.addLayer(studentenMKcluster); }
            else { kaart.removeLayer(studentenMKcluster); }
            break;
        case 'ML':
            if (checkb.checked) { kaart.addLayer(studentenMLcluster); }
            else { kaart.removeLayer(studentenMLcluster); }
            break;
        case 'TA':
            if (checkb.checked) { kaart.addLayer(studentenTAcluster); }
            else { kaart.removeLayer(studentenTAcluster); }
            break;
        case 'TB':
            if (checkb.checked) { kaart.addLayer(studentenTBcluster); }
            else { kaart.removeLayer(studentenTBcluster); }
            break;
        case 'VM':
            if (checkb.checked) { kaart.addLayer(studentenVMcluster); }
            else { kaart.removeLayer(studentenVMcluster); }
            break;
        //case 'medewerkers':
        //    if (checkb.checked) { kaart.addLayer(medewerkersLayer); }
        //    else { kaart.removeLayer(medewerkersLayer); }
        //    break;
    }
}


function initMap()
{
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


    var Esri_WorldGrayCanvas = L.esri.basemapLayer("Gray");
    var Esri_WorldGrayCanvasLabels = L.esri.basemapLayer("GrayLabels");

    grayGroupLayer = new L.LayerGroup([Esri_WorldGrayCanvas, Esri_WorldGrayCanvasLabels]);
    kaart.addLayer(grayGroupLayer);

  

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

    //var medewerkerIcon = new LeafIcon({
    //    iconUrl : 'images/Medewerker.png',
    //    iconSize : [32, 32],
    //    iconAnchor : [15, 32]
    //});

    var studentIcon = new LeafIcon({
        iconUrl : 'images/Studie.png',
        iconSize : [32, 32],
        iconAnchor : [15, 32]
    });
    //medewerkersLayer = new L.FeatureGroup();




    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenBAcluster = new L.FeatureGroup();


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenDVcluster = new L.FeatureGroup();



    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenFIcluster = new L.FeatureGroup();


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenGMcluster = new L.FeatureGroup();


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenHBMcluster = new L.FeatureGroup();


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenIFcluster = new L.FeatureGroup();

    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenMKcluster = new L.FeatureGroup();


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenMLcluster = new L.FeatureGroup();


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenTAcluster = new L.FeatureGroup();

    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenTBcluster = new L.FeatureGroup();


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenVMcluster = new L.FeatureGroup();


    //serviceName = {url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:Actuele%20medewerkers%20in%20het%20buitenland&outputFormat=application%2Fjson'};
    ////Lezen JSON alle medewerkers
    //$.ajax(
    //{
    //    url: 'geoproxy.php',
    //    dataType: 'json',
    //    method: 'post',
    //    data: serviceName
    //})
    //.done(function (data)
    //{
    //    $.each(data.features, function (i, medewerker)
    //    {
    //        var marker = new L.Marker([medewerker.properties.Latitude, medewerker.properties.Longitude], {
    //            icon: medewerkerIcon
    //        }).bindPopup(medewerker.properties.Voornaam + " " + medewerker.properties.Achternaam + "<br>" + medewerker.properties.Omschrijving + "<br>" + medewerker.properties.Plaats + "<br>" + getLandNaam(medewerker.properties.Landcode), { offset: popupOffset });
    //        medewerkersLayer.addLayer(marker);
    //        oms.addMarker(marker);
    //        medewerkersAantal++;
    //    });
    //})
    //.fail(function ()
    //{
    //    alert("fout opgetreden bij laden van medewerkers uit database")
    //});

    
    serviceName = {url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:Studies%20in%20het%20buitenland&outputFormat=application%2Fjson'};
    //Lezen JSON alle studies in het buitenland
    $.ajax(
    {
        url: 'geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data)
    {
        $.each(data.features, function (i, student)
        {
            var marker = new L.Marker([student.properties.Latitude, student.properties.Longitude], {
                icon: studentIcon
            }).bindPopup(student.properties.Voornaam + " " + student.properties.Achternaam + "<br>" + student.properties.Instelling_naam + "<br>" + student.properties.Plaats + "<br>" + getLandNaam(student.properties.Landcode) + "<br>" + getOpleidingNaam(student.properties.Opleidingscode), { offset: popupOffset });
            switch (student.properties.Opleidingscode)
            {
                case 'BA':
                    studentenBAcluster.addLayer(marker);
                    studentenBAaantal++;
                    break;
                case 'DV':
                    studentenDVcluster.addLayer(marker);
                    studentenDVaantal++;
                    break;
                case 'FI':
                    studentenFIcluster.addLayer(marker);
                    studentenFIaantal++;
                    break;
                case 'GM':
                    studentenGMcluster.addLayer(marker);
                    studentenGMaantal++;
                    break;
                case 'HBM':
                    studentenHBMcluster.addLayer(marker);
                    studentenHBMaantal++;
                    break;
                case 'IF':
                    studentenIFcluster.addLayer(marker);
                    studentenIFaantal++;
                    break;
                case 'MK':
                    studentenMKcluster.addLayer(marker);
                    studentenMKaantal++;
                    break;
                case 'ML':
                    studentenMLcluster.addLayer(marker);
                    studentenMLaantal++;
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
        });
    })
     .fail(function ()
     {
         alert("Fout opgetreden bij laden buitenlandse studies");
     });
    
    serviceName = {url: 'http://localhost:8080/geoserver/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:huidige%20stages&outputFormat=application%2Fjson'};
    //Lezen JSON alle stages
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
            var marker = new L.Marker([stages.properties.Latitude, stages.properties.Longitude], {
                icon: stageIcon
            }).bindPopup(stages.properties.Voornaam + " " + stages.properties.Achternaam + "<br>" + stages.properties.Instelling_naam + "<br>" + stages.properties.Plaats + "<br>" + getLandNaam(stages.properties.Landcode) + "<br>" + getOpleidingNaam(stages.properties.Opleidingscode), { offset: popupOffset });
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
                case 'FI':
                    studentenFIcluster.addLayer(marker);
                    studentenFIaantal++;
                    break;
                case 'GM':
                    studentenGMcluster.addLayer(marker);
                    studentenGMaantal++;
                    break;
                case 'HBM':
                    studentenHBMcluster.addLayer(marker);
                    studentenHBMaantal++;
                    break;
                case 'IF':
                    studentenIFcluster.addLayer(marker);
                    studentenIFaantal++;
                    break;
                case 'MK':
                    studentenMKcluster.addLayer(marker);
                    studentenMKaantal++;
                    break;
                case 'ML':
                    studentenMLcluster.addLayer(marker);
                    studentenMLaantal++;
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
        });
        makeMenu();
    })
    .fail(function ()
    {
        alert("fout opgetreden bij laden van stages uit database");
    });

    kaart.addLayer(studentenBAcluster);
    kaart.addLayer(studentenDVcluster);
    kaart.addLayer(studentenFIcluster);
    kaart.addLayer(studentenGMcluster);
    kaart.addLayer(studentenHBMcluster);
    kaart.addLayer(studentenIFcluster);
    kaart.addLayer(studentenMKcluster);
    kaart.addLayer(studentenMLcluster);
    kaart.addLayer(studentenTAcluster);
    kaart.addLayer(studentenTBcluster);
    kaart.addLayer(studentenVMcluster);
    //kaart.addLayer(medewerkersLayer);


    //de layers die je aan en uit kan zetten in het menu rechtsonderin
    var categorien = {
        "Stages" : {
            "BA" : studentenBAcluster,
            "DV" : studentenDVcluster,
            "FI" : studentenFIcluster,
            "HBM" : studentenHBMcluster,
            "MK" : studentenMKcluster,
            "ML" : studentenMLcluster,
            "TA" : studentenTAcluster,
            "TB" : studentenTBcluster,
            "VM" : studentenVMcluster

        }
    };
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
            $('#kaart').append('<div id="legenda" onclick="hideLegenda()"><h4><i class="glyphicon glyphicon-remove-circle"></i> Legenda</h4><ul><li><img src="images\\Stage.png" /> Stages</li><li><img src="images\\Studie.png" /> Studie</li></ul></div>');
            hideLegenda();
            var filterTekst = '<div id="filter" ><h4>Filter <span onclick="hideFilter()"><i class="glyphicon glyphicon-remove-circle"></i></span></h4>';
            filterTekst += '<ul><li><h4>Achtergrondkaarten</h4><ul>';
            filterTekst += '<li><input type="radio" name="achtergrond" id="grijs" onclick="switchAchtergrond(this)" checked="checked" /> <label for="grijs">Grijze achtergrondkaart</label></li>';
            filterTekst += '<li><input type="radio" name="achtergrond" id="satelliet" onclick="switchAchtergrond(this)" /> <label for="satelliet">Satelliet beelden</label></li>';
            filterTekst += '</ul></li><li><h4>Opleidingen</h4><ul>';
            if (studentenBAaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="BA" onclick="switchMarkers(this)" checked="checked" />Bedrijskunde en Agribusiness</li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="BA" onclick="geenStages(this)" /> <label for="BA" class="filterinactive">Bedrijskunde en Agribusiness</label></li>';
            }
            if (studentenDVaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="DV" onclick="switchMarkers(this)" checked="checked" /> <label for="DV">Dier- en Veehouderij</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="DV" onclick="geenStages(this)" /> <label for="DV" class="filterinactive">Dier- en Veehouderij</label></li>';
            }
            if (studentenFIaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="FI" onclick="switchMarkers(this)" checked="checked" /> <label for="FI">Food Innovation</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="FI" onclick="geenStages(this)" /> <label for="FI" class="filterinactive">Food Innovation</label></li>';
            }
            if (studentenGMaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="GM" onclick="switchMarkers(this)" checked="checked" /> <label for="GM">Geo Media &amp; Design</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="GM" onclick="geenStages(this)" /> <label for="GM" class="filterinactive">Geo Media & Design</label></li>';
            }
            if (studentenHBMaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="HBM" onclick="switchMarkers(this)" checked="checked" /> <label for="HBM">Horticulture &amp; Business Management</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="HBM" onclick="geenStages(this)" /> <label for="HBM" class="filterinactive">Horticulture &amp; Business Management</label></li>';
            }
            if (studentenIFaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="IF" onclick="switchMarkers(this)" checked="checked" /> <label for="IF">International Food &amp; Agribusiness</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="IF" onclick="geenStages(this)" /> <label for="IF" class="filterinactive">International Food &amp; Agribusiness</label></li>';
            }
            if (studentenMKaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="MK" onclick="switchMarkers(this)" checked="checked" /> <label for="MK">Milieukunde</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="MK" onclick="geenStages(this)" /> <label for="MK" class="filterinactive">Milieukunde</label></li>';
            }
            if (studentenMLaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="ML" onclick="switchMarkers(this)" checked="checked" /> <label for="ML">Management van de Leefomgeving</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="ML" onclick="geenStages(this)" /> <label for="ML" class="filterinactive">Management van de Leefomgeving</label></li>';
            }
            if (studentenTAaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="TA" onclick="switchMarkers(this)" checked="checked" /> <label for="TA">Tuin- en Akkerbouw</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="TA" onclick="geenStages(this)" /> <label for="TA" class="filterinactive">Tuin- en Akkerbouw</label></li>';
            }
            if (studentenTBaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="TB" onclick="switchMarkers(this)" checked="checked" /> <label for="TB">Toegepaste Biologie</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="TB" onclick="geenStages(this)" /> <label for="TB" class="filterinactive">Toegepaste Biologie</label></li>';
            }
            if (studentenVMaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="VM" onclick="switchMarkers(this)" checked="checked" /> <label for="VM">Voedingsmiddelen Technologie</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="VM" onclick="geenStages(this)" /> <label for="VM" class="filterinactive">Voedingsmiddelen Technologie</label></li>';
            }
            filterTekst += '</ul>';

            //filterTekst += '<li><h4>Medewerkers</h4><ul>';
            //if (medewerkersAantal > 0)
            //{
            //    filterTekst += '<li><input type="checkbox" id="medewerkers" onclick="switchMarkers(this)" checked="checked" /> <label for="medewerkers">Medewerkers</li></ul>';
            //}
            //else
            //{
            //    filterTekst += '<li><input type="checkbox" id="medewerkers" onclick="geenMedewerkers() class="filterinactive" /> <label for="medewerkers">Medewerkers</li></ul>';
            //}
            filterTekst += '</ul></div>';
            $('#kaart').append('<div id="filtermenu" onclick="showFilter()"><h4>Filter <i class="glyphicon glyphicon-chevron-right"></i></h4></div>');
            $('#kaart').append(filterTekst);
            hideFilter();
            break;
        case "EN":
            $('#kaart').append('<div id="legendamenu" onclick="showLegenda()"><h4><i class="glyphicon glyphicon-chevron-left"></i> Legend</h4></div>');
            $('#kaart').append('<div id="legenda" onclick="hideLegenda()"><h4> <i class="glyphicon glyphicon-remove-circle"></i> Legend</h4><ul><li><img src="images\\Stage.png" /> Traineeships</li><li><img src="images\\Studie.png" /> Study</li></ul></div>');
            hideLegenda();
            var filterTekst = '<div id="filter" ><h4>Filter <span onclick="hideFilter()"><i class="glyphicon glyphicon-remove-circle"></i></span></h4>';
            filterTekst += '<ul><li><h4>Type of map</h4><ul>';
            filterTekst += '<li><input type="radio" name="achtergrond" id="grijs" onclick="switchAchtergrond(this)" checked="checked" /> <label for="grijs">Grey background</label></li>';
            filterTekst += '<li><input type="radio" name="achtergrond" id="satelliet" onclick="switchAchtergrond(this)" /> <label for="satelliet">Satellite views</label></li>';
            filterTekst += '</ul></li><li><h4>Study Programmes</h4><ul>';
            if (studentenBAaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="BA" onclick="switchMarkers(this)" checked="checked" /> <label for="BA">Business Administration &amp; Agribusiness</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="BA" onclick="geenStages(this)" /> <label for="BA" class="filterinactive">Business Administration &amp; Agribusiness</label></li>';
            }
            if (studentenDVaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="DV" onclick="switchMarkers(this)" checked="checked" /> <label for="DV">Animal Husbandry &amp; Animal Care</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="DV" onclick="geenStages(this)" /> <label for="DV" class="filterinactive">Animal Husbandry &amp; Animal Care</label></li>';
            }
            if (studentenFIaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="FI" onclick="switchMarkers(this)" checked="checked" /> <label for="FI">Food Innovation</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="FI" onclick="geenStages(this)" /> <label for="FI" class="filterinactive">Food Innovation</label></li>';
            }
            if (studentenGMaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="GM" onclick="switchMarkers(this)" checked="checked" /> <label for="GM">Geo Media &amp; Design</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="GM" onclick="geenStages(this)" /> <label for="GM" class="filterinactive">Geo Media & Design</label></li>';
            }
            if (studentenHBMaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="HBM" onclick="switchMarkers(this)" checked="checked" /> <label for="HBM">Horticulture &amp; Business Management</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="HBM" onclick="geenStages(this)" /> <label for="HBM" class="filterinactive">Horticulture &amp; Business Management</label></li>';
            }
            if (studentenIFaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="IF" onclick="switchMarkers(this)" checked="checked" /> <label for="IF">International Food &amp; Agribusiness</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="IF" onclick="geenStages(this)" /> <label for="IF" class="filterinactive">International Food &amp; Agribusiness</label></li>';
            }
            if (studentenMKaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="MK" onclick="switchMarkers(this)" checked="checked" /> <label for="MK">Environmental Studies</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="MK" onclick="geenStages(this)" /> <label for="MK" class="filterinactive">Environmental Studies</label></li>';
            }
            if (studentenMLaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="ML" onclick="switchMarkers(this)" checked="checked" /> <label for="ML">Spatial and Environmental Planning</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="ML" onclick="geenStages(this)" /> <label for="ML" class="filterinactive">Spatial and Environmental Planning</label></li>';
            }
            if (studentenTAaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="TA" onclick="switchMarkers(this)" checked="checked" /> <label for="TA">Horticulture & Arable Farming</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="TA" onclick="geenStages(this)" /> <label for="TA" class="filterinactive">Horticulture & Arable Farming</label></li>';
            }
            if (studentenTBaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="TB" onclick="switchMarkers(this)" checked="checked" /> <label for="TB">Applied Biology</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="TB" onclick="geenStages(this)" /> <label for="TB" class="filterinactive">Applied Biology</label></li>';
            }
            if (studentenVMaantal > 0)
            {
                filterTekst += '<li><input type="checkbox" id="VM" onclick="switchMarkers(this)" checked="checked" /> <label for="VM">Food Technology</label></li>';
            }
            else
            {
                filterTekst += '<li><input type="checkbox" id="VM" onclick="geenStages(this)" /> <label for="VM" class="filterinactive">Food Technology</label></li>';
            }
            filterTekst += '</ul>';

            //filterTekst += '<li><h4>Staff</h4><ul>';
            //if (medewerkersAantal > 0)
            //{
            //    filterTekst += '<li><input type="checkbox" id="medewerkers" onclick="switchMarkers(this)" checked="checked" /> <label for="medewerkers">Staff</li></ul>';
            //}
            //else
            //{
            //    filterTekst += '<li><input type="checkbox" id="medewerkers" onclick="geenMedewerkers()" class="filterinactive" /> <label for="medewerkers">Staff</li></ul>';
            //}
            filterTekst += '</ul></div>';
            $('#kaart').append('<div id="filtermenu" onclick="showFilter()"><h4>Filter <i class="glyphicon glyphicon-chevron-right"></i></h4></div>');
            $('#kaart').append(filterTekst);
            hideFilter();
            break;
    }
}
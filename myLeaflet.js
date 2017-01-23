var landenData;
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

    var studentIcon = new LeafIcon({
        iconUrl : 'images/Studie.png',
        iconSize : [32, 32],
        iconAnchor : [15, 32]
    });
var geoserver = 'http://localhost:8080/geoserver';
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
var studentenBVcluster;
var studentenFVcluster;
var studentenIVcluster;
var studentenTVcluster;
var studentenClustersNu = [];
var studentenBVaantal=0;
var studentenFVaantal=0;
var studentenIVaantal=0;
var studentenTVaantal=0;
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
var plaatsen;
var studentAantallenArray;

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

$(document).ready(function () {
    serviceName = { url: geoserver+'/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:tbl_Landen&outputFormat=application%2Fjson' };
    $.ajax(
    {
        url: 'geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data) {
        landenData = data;
        serviceName = { url: geoserver+'/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:Opleidingen&outputFormat=application%2Fjson' };
        $.ajax(
        {
            url: 'geoproxy.php',
            dataType: 'json',
            method: 'post',
            data: serviceName
        })
        .done(function (data) {
            opleidingData = data;
            serviceName = { url: geoserver+'/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:Unieke%20plaatsen&outputFormat=application%2Fjson' };
            $.ajax(
            {
                url: 'geoproxy.php',
                dataType: 'json',
                method: 'post',
                data: serviceName
            })
            .done(function (data) {
                plaatsen = data;
                initMap();
            })
            .fail(function () {
                if(taal=="NL")
                {
                BootstrapDialog.alert('plaatsen json niet opgehaald uit database');
                }
                else if(taal=="EN")
                {
                BootstrapDialog.alert('places json not retrieved from database');
                }
            });
        })
        .fail(function () {
            if(taal=="NL")
            {
            BootstrapDialog.alert("Opleidingen json niet opgehaald uit database");
            }
            else if(taal=="EN")
            {
            BootstrapDialog.alert("Study Programmes json not retrieved from database");    
            }
        });
    })
    .fail(function () {
        if(taal=="NL")
        {
        BootstrapDialog.alert("Landen json niet opgehaald uit database");
        }
        else if(taal=="EN")
        {
        BootstrapDialog.alert("Countries json not retrieved from database");
        }
    });

});
function kaartReset() // haalt alle markers weg
    {
    studentenBAcluster.clearLayers();
    studentenBVcluster.clearLayers();
    studentenDVcluster.clearLayers();
    studentenFIcluster.clearLayers();
    studentenFVcluster.clearLayers();
    studentenGMcluster.clearLayers();
    studentenHBMcluster.clearLayers();
    studentenIFcluster.clearLayers();
    studentenMKcluster.clearLayers();
    studentenMLcluster.clearLayers();
    studentenTAcluster.clearLayers();
    studentenTBcluster.clearLayers();
    studentenTVcluster.clearLayers();
    studentenVMcluster.clearLayers();
    studentenIVcluster.clearLayers();
    studentenBVaantal=0;
    studentenFVaantal=0;
    studentenIVaantal=0;
    studentenTVaantal=0;
    studentenBAaantal = 0;
    studentenDVaantal = 0;
    studentenFIaantal = 0;
    studentenGMaantal = 0;
    studentenHBMaantal = 0;
    studentenIFaantal = 0;
    studentenMKaantal = 0;
    studentenMLaantal = 0;
    studentenTAaantal = 0;
    studentenTBaantal = 0;
    studentenVMaantal = 0;
    }

    function menuReset() // reset alle opleiding filters in het filtermenu
    {
        $("#opl").empty();
        if (taal == "NL") {
            $("#opl").append("<h4>Opleidingen</h4>");
            $.each(plaatsen.features, function (i, plaats) {
                $('#opl').append('<ul><li id="' + plaats.properties.Afkorting_plaats + '" onclick="$(this).children().slideToggle()"><i class="glyphicon glyphicon-chevron-right"></i>' + plaats.properties.Plaats + '</li></ul>');
                $.each(opleidingData.features, function (i, opleiding) {
                    if (opleiding.properties.Plaats == plaats.properties.Plaats) {
                        if (studentAantallenArray[i] > 0) {
                            $("#" + plaats.properties.Afkorting_plaats).append('<li class="subfilter"><input type="checkbox" id="' + opleiding.properties.Opledingscode + '" onclick="switchMarkers(this)" checked="checked" /> <label for="' + opleiding.properties.Opledingscode + '">' + opleiding.properties.Opleidingsnaam_nl + '</label></li>');
                        }
                        else {
                            $("#" + plaats.properties.Afkorting_plaats).append('<li class="subfilter"><input type="checkbox" id="' + opleiding.properties.Opledingscode + '" onclick="geenStages(this)" /> <label for="' + opleiding.properties.Opledingscode + '" class="filterinactive">' + opleiding.properties.Opleidingsnaam_nl + '</label></li>');
                        }
                    }
                });
            })
        }
        else if (taal == "EN") {
            $("#opl").append("<h4>Study Programmes</h4>");
            $.each(plaatsen.features, function (i, plaats) {
                $('#opl').append('<ul><li id="' + plaats.properties.Afkorting_plaats + '" onclick="$(this).children().slideToggle()"><i class="glyphicon glyphicon-chevron-right"></i>' + plaats.properties.Plaats + '</li></ul>');
            $.each(opleidingData.features, function (i, opleiding) {
                if (opleiding.properties.Plaats == plaats.properties.Plaats) {
                    if (studentAantallenArray[i] > 0) {
                        $("#"+plaats.properties.Afkorting_plaats).append('<li class="subfilter"><input type="checkbox" id="' + opleiding.properties.Opledingscode + '" onclick="switchMarkers(this)" checked="checked" /> <label for="' + opleiding.properties.Opledingscode + '">' + opleiding.properties.Opleidingsnaam_en + '</label></li>');
                    }
                    else {
                        $("#"+plaats.properties.Afkorting_plaats).append('<li class="subfilter"><input type="checkbox" id="' + opleiding.properties.Opledingscode + '" onclick="geenStages(this)" /> <label for="' + opleiding.properties.Opledingscode + '" class="filterinactive">' + opleiding.properties.Opleidingsnaam_en + '</label></li>');
                    }
                }
            });
            })
        }
    }

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
        if ( opleidingcode == opleidingen.properties.Opledingscode)
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

function hideCustomDatumFilter()
{
    $("#dialogoverlay").fadeOut("Slow");
    $("#datumCustomForm").fadeOut("Slow");
}

function showLegenda()
{
    $('#legendamenu').fadeOut();
    $('#legenda').fadeIn();
}

function hideLegenda()
{
    $('#legendamenu').fadeIn();
    $('#legenda').fadeOut();
}

function showFilter()
{
    $('#filtermenu').fadeOut();
    $('#filter').fadeIn();
}

function hideFilter()
{
    $('#filtermenu').fadeIn();
    $('#filter').fadeOut();
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
        case 'BV':
            if (checkb.checked) { kaart.addLayer(studentenBVcluster); }
            else { kaart.removeLayer(studentenBVcluster); }
            break;
        case 'DV':
            if (checkb.checked) { kaart.addLayer(studentenDVcluster); }
            else { kaart.removeLayer(studentenDVcluster); }
            break;
        case 'FI':
            if (checkb.checked) { kaart.addLayer(studentenFIcluster); }
            else { kaart.removeLayer(studentenFIcluster); }
            break;
        case 'FV':
            if (checkb.checked) { kaart.addLayer(studentenFVcluster); }
            else { kaart.removeLayer(studentenFVcluster); }
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
        case 'TV':
            if (checkb.checked) { kaart.addLayer(studentenTVcluster); }
            else { kaart.removeLayer(studentenTVcluster); }
            break;
        case 'VM':
            if (checkb.checked) { kaart.addLayer(studentenVMcluster); }
            else { kaart.removeLayer(studentenVMcluster); }
            break;
        case 'IV':
            if (checkb.checked) { kaart.addLayer(studentenIVcluster); }
            else { kaart.removeLayer(studentenIVcluster); }
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

    kaart.on('contextmenu', function () {
        if ($("#filtermenu").css('display')=='block') {
            showFilter();
        }
        else {
            hideFilter();
        }
    });


    var Esri_WorldGrayCanvas = L.esri.basemapLayer("Gray");
    var Esri_WorldGrayCanvasLabels = L.esri.basemapLayer("GrayLabels");

    grayGroupLayer = new L.LayerGroup([Esri_WorldGrayCanvas, Esri_WorldGrayCanvasLabels]);
    kaart.addLayer(grayGroupLayer);

  

//    satellietLayer = new L.Google("SATELLITE", {crs: L.CRS.EPSG3395} );   // 4352
    satellietLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });


    //medewerkersLayer = new L.FeatureGroup();


    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenBVcluster = new L.FeatureGroup();


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

    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenTVcluster = new L.FeatureGroup();

    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenIVcluster = new L.FeatureGroup();

    //code die de markers clustert wanneer ze te dichtbij elkaar komen te staan
    studentenFVcluster = new L.FeatureGroup();

    //serviceName = {url: geoserver+'/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:Actuele%20medewerkers%20in%20het%20buitenland&outputFormat=application%2Fjson'};
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
    //        }).bindPopup(medewerker.properties.Voornaam + " " + medewerker.properties.Tussenvoegsel+" "+ medewerker.properties.Achternaam + "<br>" + medewerker.properties.Omschrijving + "<br>" + medewerker.properties.Plaats + "<br>" + getLandNaam(medewerker.properties.Landcode), { offset: popupOffset });
    //        medewerkersLayer.addLayer(marker);
    //        oms.addMarker(marker);
    //        medewerkersAantal++;
    //    });
    //})
    //.fail(function ()
    //{
    //    alert("fout opgetreden bij laden van medewerkers uit database")
    //});

    
    serviceName = {url: geoserver+'/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:Studies%20in%20het%20buitenland&outputFormat=application%2Fjson'};
    //Lezen JSON alle studies in het buitenland
    $.ajax(
    {
        url: 'geoproxy.php',
        dataType: 'json',
        method: 'post',
        async : false,
        timeout: 5000,
        data: serviceName
    })
    .done(function (data) {
        $.each(data.features, function (i, student) {
            var marker = new L.Marker([student.properties.Latitude, student.properties.Longitude], {
                icon: studentIcon
            }).bindPopup(student.properties.Voornaam + " " + student.properties.Tussenvoegsel + " " + student.properties.Achternaam + "<br>" + student.properties.Instelling_naam + "<br>" + student.properties.Plaats + "<br>" + getLandNaam(student.properties.Landcode) + "<br>" + getOpleidingNaam(student.properties.Opleidingscode), { offset: popupOffset });
            switch (student.properties.Opleidingscode) {
                case 'BA':
                    studentenBAcluster.addLayer(marker);
                    studentenBAaantal++;
                    break;
                case 'BV':
                    studentenBVcluster.addLayer(marker);
                    studentenBVaantal++;
                    break;
                case 'DV':
                    studentenDVcluster.addLayer(marker);
                    studentenDVaantal++;
                    break;
                case 'FI':
                    studentenFIcluster.addLayer(marker);
                    studentenFIaantal++;
                    break;
                case 'FV':
                    studentenFVcluster.addLayer(marker);
                    studentenFVaantal++;
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
                case 'TV':
                    studentenTVcluster.addLayer(marker);
                    studentenTVaantal++;
                    break;
                case 'VM':
                    studentenVMcluster.addLayer(marker);
                    studentenVMaantal++;
                    break;
                case 'IV':
                    studentenIVcluster.addLayer(marker);
                    studentenIVaantal++;
                    break;
            }
            oms.addMarker(marker);
        });
    })
     .fail(function () {
         if(taal=="NL")
         {
         BootstrapDialog.alert("Fout opgetreden bij laden studies in het buitenland");
         }
         else if(taal=="En")
         {
         BootstrapDialog.alert("Error occurred while loading minors abroad");
         }
     });
    
    serviceName = {url: geoserver+'/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:huidige%20stages&outputFormat=application%2Fjson'};
    //Lezen JSON alle stages
    $.ajax(
    {
        url: 'geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data) {
        $.each(data.features, function (i, stages) {
            var marker = new L.Marker([stages.properties.Latitude, stages.properties.Longitude], {
                icon: stageIcon
            }).bindPopup(stages.properties.Voornaam + " " + stages.properties.Tussenvoegsel+ " " + stages.properties.Achternaam + "<br>" + stages.properties.Instelling_naam + "<br>" + stages.properties.Plaats + "<br>" + getLandNaam(stages.properties.Landcode) + "<br>" + getOpleidingNaam(stages.properties.Opleidingscode), { offset: popupOffset });
            switch (stages.properties.Opleidingscode) {
                case 'BA':
                    studentenBAcluster.addLayer(marker);
                    studentenBAaantal++;
                    break;
                case 'BV':
                    studentenBVcluster.addLayer(marker);
                    studentenBVaantal++;
                    break;
                case 'DV':
                    studentenDVcluster.addLayer(marker);
                    studentenDVaantal++;
                    break;
                case 'FI':
                    studentenFIcluster.addLayer(marker);
                    studentenFIaantal++;
                    break;
                case 'FV':
                    studentenFVcluster(marker);
                    studentenFVaantal++;
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
                case 'TV':
                    studentenTVcluster.addLayer(marker);
                    studentenTVaantal++;
                    break;
                case 'VM':
                    studentenVMcluster.addLayer(marker);
                    studentenVMaantal++;
                    break;
                case 'IV':
                    studentenIVcluster.addLayer(marker);
                    studentenIVaantal++;
                    break;

            }
            oms.addMarker(marker);
        });
        studentAantallenArray = [studentenBAaantal, studentenBVaantal, studentenDVaantal, studentenFIaantal, studentenFVaantal, studentenGMaantal, studentenHBMaantal, studentenIFaantal, studentenIVaantal, studentenMKaantal, studentenMLaantal, studentenTAaantal, studentenTBaantal, studentenTVaantal, studentenVMaantal];
        console.log(studentAantallenArray);
        makeMenu();
    })
    .fail(function () {
        if(taal=="NL")
        {
        BootstrapDialog.alert("Fout opgetreden bij laden van stages uit database");
        }
        else if(taal=="EN")
        {
         BootstrapDialog.alert("Error occurred while loading internships from database");
        }
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
    kaart.addLayer(studentenIVcluster);
    kaart.addLayer(studentenBVcluster);
    kaart.addLayer(studentenTVcluster);
    kaart.addLayer(studentenFVcluster);
    //kaart.addLayer(medewerkersLayer);


    //de layers die je aan en uit kan zetten in het menu rechtsonderin
    var categorien = {
        "Stages" : {
            "BA" : studentenBAcluster,
            "BV": studentenBVcluster,
            "DV" : studentenDVcluster,
            "FI" : studentenFIcluster,
            "FV": studentenFVcluster,
            "HBM" : studentenHBMcluster,
            "MK" : studentenMKcluster,
            "ML" : studentenMLcluster,
            "TA" : studentenTAcluster,
            "TB" : studentenTBcluster,
            "TV": studentenTVcluster,
            "VM" : studentenVMcluster,
            "IV": studentenIVcluster

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
            filterTekst += '</ul></li><li id="opl" ><h4>Opleidingen</h4>';
            filterTekst += '</div> </ul>';
            $('#kaart').append('<div id="filtermenu" onclick="showFilter()"><h4>Filter <i class="glyphicon glyphicon-chevron-right"></i></h4></div>');
            $('#kaart').append(filterTekst);
            $.each(plaatsen.features, function (i, plaats) {
                $('#opl').append('<ul><li id="' + plaats.properties.Afkorting_plaats + '" onclick="$(this).children().slideToggle()"><i class="glyphicon glyphicon-chevron-right"></i>' + plaats.properties.Plaats + '</li></ul>');
            $.each(opleidingData.features, function (i, opleiding) {
                if (opleiding.properties.Plaats == plaats.properties.Plaats) {
                    if (studentAantallenArray[i] > 0) {
                        $("#"+plaats.properties.Afkorting_plaats).append('<li class="subfilter"><input type="checkbox" id="' + opleiding.properties.Opledingscode + '" onclick="switchMarkers(this)" checked="checked" /> <label for="' + opleiding.properties.Opledingscode + '">' + opleiding.properties.Opleidingsnaam_nl + '</label></li>');
                    }
                    else {
                        $("#"+plaats.properties.Afkorting_plaats).append('<li class="subfilter"><input type="checkbox" id="' + opleiding.properties.Opledingscode + '" onclick="geenStages(this)" /> <label for="' + opleiding.properties.Opledingscode + '" class="filterinactive">' + opleiding.properties.Opleidingsnaam_nl + '</label></li>');
                    }
                }
            });
            })
            $("#filter").append('<div id="filterdatums"><h4>Filter datum</h4><input type="radio" name="formToggle" id="andereDamums" onclick="formToggle(this)"/> <label for="andereDamums">Andere datums</label><br><input type="radio" id="nu" name="formToggle" checked onclick="formToggle(this)" /><label for="nu">Nu</label></div>');
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
            filterTekst += '</ul></li><li id="opl"><h4>Study Programmes</h4><ul>';
            filterTekst += '</ul></div>';
            $('#kaart').append('<div id="filtermenu" onclick="showFilter()"><h4>Filter <i class="glyphicon glyphicon-chevron-right"></i></h4></div>');
            $('#kaart').append(filterTekst);
            $.each(plaatsen.features, function (i, plaats) {
                $('#opl').append('<ul><li id="' + plaats.properties.Afkorting_plaats + '" onclick="$(this).children().slideToggle()"><i class="glyphicon glyphicon-chevron-right"></i>' + plaats.properties.Plaats + '</li></ul>');
            $.each(opleidingData.features, function (i, opleiding) {
                if (opleiding.properties.Plaats == plaats.properties.Plaats) {
                    if (studentAantallenArray[i] > 0) {
                        $("#"+plaats.properties.Afkorting_plaats).append('<li class="subfilter"><input type="checkbox" id="' + opleiding.properties.Opledingscode + '" onclick="switchMarkers(this)" checked="checked" /> <label for="' + opleiding.properties.Opledingscode + '">' + opleiding.properties.Opleidingsnaam_en + '</label></li>');
                    }
                    else {
                        $("#"+plaats.properties.Afkorting_plaats).append('<li class="subfilter"><input type="checkbox" id="' + opleiding.properties.Opledingscode + '" onclick="geenStages(this)" /> <label for="' + opleiding.properties.Opledingscode + '" class="filterinactive">' + opleiding.properties.Opleidingsnaam_en + '</label></li>');
                    }
                }
            });
            })
            $("#filter").append('<div id="filterdatums"><h4>Filter date</h4><input type="radio" name="formToggle" id="andereDamums" onclick="formToggle(this)"/> <label for="andereDamums">Other dates</label><br><input type="radio" id="nu" name="formToggle" checked onclick="formToggle(this)" /><label for="nu">Now</label></div>');
            hideFilter();
            break;
    }
}
function formToggle(radio)
{
var posleftDatumForm = (window.innerWidth / 2) - 300 + 'px';
var postopDatumForm = window.innerHeight / 2 + 'px';

    if (radio.checked && radio.id == "andereDamums")
    {
        $("#dialogoverlay").fadeIn("Slow");
        $("#dialogoverlay").css("height", window.innerHeight);
        $("#datumCustomForm").css("left", posleftDatumForm);
        $("#datumCustomForm").css("top", postopDatumForm);
        $("#datumCustomForm").fadeIn("slow");
    }
    if (radio.checked && radio.id == "nu")
    {
        nu();
    }
}
function aangepasteDatumFilter()
{
    var start=$("#start").val();
    var end = $("#end").val();
    if(start>end)
    {
        if(taal=="NL")
        {
        BootstrapDialog.alert("Begindatum moet vóór einddatum liggen");
        return false;
        }
        else if(taal=="EN")
        {
        BootstrapDialog.alert("Start date must be before end date");
        return false;
        }
    }
    else if(start=='' || end=='')
    {
        if(taal=="NL")
        {
        BootstrapDialog.alert("Vul beide velden in");
        return false;
        }
        else if(taal=="EN")
        {
        BootstrapDialog.alert("Fill out both field");
        return false;
        }
    }
    kaartReset();
    serviceName = {url: geoserver+"/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:Studies%20aangepaste%20datums&viewparams=start:"+start+";end:"+end+"&outputFormat=application%2Fjson"};
    //Lezen JSON alle studies in het buitenland
    $.ajax(
    {
        url: 'geoproxy.php',
        dataType: 'json',
        method: 'post',
        async : false,
        timeout: 5000,
        data: serviceName
    })
    .done(function (data) {
        $.each(data.features, function (i, student) {
            var marker = new L.Marker([student.properties.Latitude, student.properties.Longitude], {
                icon: studentIcon
            }).bindPopup(student.properties.Voornaam + " " + student.properties.Tussenvoegsel + " " + student.properties.Achternaam + "<br>" + student.properties.Instelling_naam + "<br>" + student.properties.Plaats + "<br>" + getLandNaam(student.properties.Landcode) + "<br>" + getOpleidingNaam(student.properties.Opleidingscode), { offset: popupOffset });
            switch (student.properties.Opleidingscode) {
                case 'BA':
                    studentenBAcluster.addLayer(marker);
                    studentenBAaantal++;
                    break;
                case 'BV':
                    studentenBVcluster.addLayer(marker);
                    studentenBVaantal++;
                    break;
                case 'DV':
                    studentenDVcluster.addLayer(marker);
                    studentenDVaantal++;
                    break;
                case 'FI':
                    studentenFIcluster.addLayer(marker);
                    studentenFIaantal++;
                    break;
                case 'FV':
                    studentenFVcluster.addLayer(marker);
                    studentenFVaantal++;
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
                case 'TV':
                    studentenTVcluster.addLayer(marker);
                    studentenTVaantal++;
                    break;
                case 'VM':
                    studentenVMcluster.addLayer(marker);
                    studentenVMaantal++;
                    break;
                case 'IV':
                    studentenIVcluster.addLayer(marker);
                    studentenIVaantal++;
                    break;
            }
            oms.addMarker(marker);
        });
    })
     .fail(function () {
         if(taal=="NL")
         {
         BootstrapDialog.alert("Fout opgetreden bij laden studies in het buitenland");
         }
         else if(taal=="EN")
         {
         BootstrapDialog.alert("Error occurred while loading minors abroad");
         }
     });
    
    serviceName = {url: geoserver+"/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:aangepaste%20datums%20stage&viewparams=start:"+start+";end:"+end+"&outputFormat=application%2Fjson"};
    //Lezen JSON alle stages
    $.ajax(
    {
        url: 'geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data) {
        $.each(data.features, function (i, stages) {
            var marker = new L.Marker([stages.properties.Latitude, stages.properties.Longitude], {
                icon: stageIcon
            }).bindPopup(stages.properties.Voornaam + " " + stages.properties.Tussenvoegsel+ " " + stages.properties.Achternaam + "<br>" + stages.properties.Instelling_naam + "<br>" + stages.properties.Plaats + "<br>" + getLandNaam(stages.properties.Landcode) + "<br>" + getOpleidingNaam(stages.properties.Opleidingscode), { offset: popupOffset });
            switch (stages.properties.Opleidingscode) {
                case 'BA':
                    studentenBAcluster.addLayer(marker);
                    studentenBAaantal++;
                    break;
                case 'BV':
                    studentenBVcluster.addLayer(marker);
                    studentenBVaantal++;
                    break;
                case 'DV':
                    studentenDVcluster.addLayer(marker);
                    studentenDVaantal++;
                    break;
                case 'FI':
                    studentenFIcluster.addLayer(marker);
                    studentenFIaantal++;
                    break;
                case 'FV':
                    studentenFVcluster(marker);
                    studentenFVaantal++;
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
                case 'TV':
                    studentenTVcluster.addLayer(marker);
                    studentenTVaantal++;
                    break;
                case 'VM':
                    studentenVMcluster.addLayer(marker);
                    studentenVMaantal++;
                    break;
                case 'IV':
                    studentenIVcluster.addLayer(marker);
                    studentenIVaantal++;
                    break;

            }
            oms.addMarker(marker);
        });
        studentAantallenArray = [studentenBAaantal, studentenBVaantal, studentenDVaantal, studentenFIaantal, studentenFVaantal, studentenGMaantal, studentenHBMaantal, studentenIFaantal, studentenIVaantal, studentenMKaantal, studentenMLaantal, studentenTAaantal, studentenTBaantal, studentenTVaantal, studentenVMaantal];
        menuReset();
    })
    .fail(function () {
       if(taal=="NL")
        {
        BootstrapDialog.alert("Fout opgetreden bij laden van stages uit database");
        }
        else if(taal=="EN")
        {
         BootstrapDialog.alert("Error occurred while loading internships from database");
        }
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
    kaart.addLayer(studentenIVcluster);
    kaart.addLayer(studentenBVcluster);
    kaart.addLayer(studentenTVcluster);
    kaart.addLayer(studentenFVcluster);
    //kaart.addLayer(medewerkersLayer);
    hideCustomDatumFilter();
}
function nu()
{
    kaartReset();
        serviceName = {url: geoserver+'/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:Studies%20in%20het%20buitenland&outputFormat=application%2Fjson'};
    //Lezen JSON alle studies in het buitenland
    $.ajax(
    {
        url: 'geoproxy.php',
        dataType: 'json',
        method: 'post',
        async : false,
        timeout: 5000,
        data: serviceName
    })
    .done(function (data) {
        $.each(data.features, function (i, student) {
            var marker = new L.Marker([student.properties.Latitude, student.properties.Longitude], {
                icon: studentIcon
            }).bindPopup(student.properties.Voornaam + " " + student.properties.Tussenvoegsel + " " + student.properties.Achternaam + "<br>" + student.properties.Instelling_naam + "<br>" + student.properties.Plaats + "<br>" + getLandNaam(student.properties.Landcode) + "<br>" + getOpleidingNaam(student.properties.Opleidingscode), { offset: popupOffset });
            switch (student.properties.Opleidingscode) {
                case 'BA':
                    studentenBAcluster.addLayer(marker);
                    studentenBAaantal++;
                    break;
                case 'BV':
                    studentenBVcluster.addLayer(marker);
                    studentenBVaantal++;
                    break;
                case 'DV':
                    studentenDVcluster.addLayer(marker);
                    studentenDVaantal++;
                    break;
                case 'FI':
                    studentenFIcluster.addLayer(marker);
                    studentenFIaantal++;
                    break;
                case 'FV':
                    studentenFVcluster.addLayer(marker);
                    studentenFVaantal++;
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
                case 'TV':
                    studentenTVcluster.addLayer(marker);
                    studentenTVaantal++;
                    break;
                case 'VM':
                    studentenVMcluster.addLayer(marker);
                    studentenVMaantal++;
                    break;
                case 'IV':
                    studentenIVcluster.addLayer(marker);
                    studentenIVaantal++;
                    break;
            }
            oms.addMarker(marker);
        });
    })
     .fail(function () {
         if(taal=="NL")
         {
         BootstrapDialog.alert("Fout opgetreden bij laden studies in het buitenland");
         }
         else if(taal=="EN")
         {
         BootstrapDialog.alert("Error occurred while loading minors abroad");
         }
     });
    
    serviceName = {url: geoserver+'/Internationale-kaart/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Internationale-kaart:huidige%20stages&outputFormat=application%2Fjson'};
    //Lezen JSON alle stages
    $.ajax(
    {
        url: 'geoproxy.php',
        dataType: 'json',
        method: 'post',
        data: serviceName
    })
    .done(function (data) {
        $.each(data.features, function (i, stages) {
            var marker = new L.Marker([stages.properties.Latitude, stages.properties.Longitude], {
                icon: stageIcon
            }).bindPopup(stages.properties.Voornaam + " " + stages.properties.Tussenvoegsel+ " " + stages.properties.Achternaam + "<br>" + stages.properties.Instelling_naam + "<br>" + stages.properties.Plaats + "<br>" + getLandNaam(stages.properties.Landcode) + "<br>" + getOpleidingNaam(stages.properties.Opleidingscode), { offset: popupOffset });
            switch (stages.properties.Opleidingscode) {
                case 'BA':
                    studentenBAcluster.addLayer(marker);
                    studentenBAaantal++;
                    break;
                case 'BV':
                    studentenBVcluster.addLayer(marker);
                    studentenBVaantal++;
                    break;
                case 'DV':
                    studentenDVcluster.addLayer(marker);
                    studentenDVaantal++;
                    break;
                case 'FI':
                    studentenFIcluster.addLayer(marker);
                    studentenFIaantal++;
                    break;
                case 'FV':
                    studentenFVcluster(marker);
                    studentenFVaantal++;
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
                case 'TV':
                    studentenTVcluster.addLayer(marker);
                    studentenTVaantal++;
                    break;
                case 'VM':
                    studentenVMcluster.addLayer(marker);
                    studentenVMaantal++;
                    break;
                case 'IV':
                    studentenIVcluster.addLayer(marker);
                    studentenIVaantal++;
                    break;

            }
            oms.addMarker(marker);
        });
        studentAantallenArray = [studentenBAaantal, studentenBVaantal, studentenDVaantal, studentenFIaantal, studentenFVaantal, studentenGMaantal, studentenHBMaantal, studentenIFaantal, studentenIVaantal, studentenMKaantal, studentenMLaantal, studentenTAaantal, studentenTBaantal, studentenTVaantal, studentenVMaantal];
        menuReset();
    })
    .fail(function () {
        if(taal=="NL")
        {
        BootstrapDialog.alert("Fout opgetreden bij laden van stages uit database");
        }
        else if(taal=="EN")
        {
         BootstrapDialog.alert("Error occurred while loading internships from database");
        }
    });
}
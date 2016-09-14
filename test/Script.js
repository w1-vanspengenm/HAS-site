$(document).ready(function ()
{
    $.ajax(
    {
        url: 'geoproxy.php',
        dataType: 'json'
    })
    .done(function (data)
    {
        $.each(data.features, function (i, student)
        {
            var output = student.properties.Voornaam + " " + student.properties.Achternaam + "<br>";
            $("#content").append(output);
        })
    })
    .error(function ()
    {
            alert("er ging iets fout");
     })

});

/*    $.each(stages.features, function(i, student) {
       var marker = new L.Marker([student.geometry.coordinates[1], student.geometry.coordinates[0]], {
            icon : stageIcon
        }).bindPopup(student.properties.studentnaam+"<br>"+student.properties.bedrijfnaam+"<br>"+student.properties.bedrijfplaats+"<br>"+student.properties.bedrijfland+"<br>"+student.properties.opleiding, { offset: popupOffset });
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
    });*/
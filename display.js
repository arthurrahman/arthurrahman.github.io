function removeLoginButton() {
    $("#loginButton").hide();
    $("#loginNav").show();
}

function setMainDisplayPage(name, surName, email) {
    var loginName = '<span class="glyphicon glyphicon-user"></span> '+name+' '+surName+' <b class="caret"></b>  ';
    $("#loginUsername").text("");
    $("#loginUsername").wrapInner(loginName);
    removeLoginButton();
    $("#mainLogo").css("display", "none");
    $("#contentBody").css("text-align", "left");
    $("#m-content-data2").css("display", "inherit");
}

function setMainDisplayPageData(displayData) {
    $("#content-header b").text("Welcome back "+displayData.displayName);
    buildAndSetDriveInformationData(displayData);
}

function buildAndSetDriveInformationData(displayData) {
    var dataString = "";
    dataString += "<dt>Display Name:</dt>";
    dataString += "<dd>"+displayData.displayName+"</dd>";
    dataString += "<dt>Drive type:</dt>";
    dataString += "<dd>"+displayData.driveType+"</dd>";
    dataString += "<dt>Drive Space Used:</dt>";
    var percentage = getPercentage(displayData.used, displayData.total);
    dataString += '<dd><div class="progress"><div class="progress-bar" role="progressbar" style="width:'+ percentage+'%;">'+displayData.used+'</div></div></dd>';
    dataString += "<dt>Drive Space Total:</dt>";
    dataString += '<dd><div class="progress"><div class="progress-bar" role="progressbar" style="width: 100%;">'+displayData.total+'</div></div></dd>';
    dataString += "<dt>Drive Space Remaining:</dt>";
    percentage = getPercentage(displayData.remaining, displayData.total);
    dataString += '<dd><div class="progress progress-bar-striped active"><div class="progress-bar" role="progressbar" style="width: '+ percentage+'%;">'+displayData.remaining+'</div></div></dd>';
    $('#driveInfo').append(dataString);
}

function getPercentage(num1, num2) {
    var val1, val2;
    if(num1[1] == "GB") {
        val1 = num1[0] * 1000;
    } else {
        val1 = num1[0];
    }

    if(num2[1] == "GB") {
        val2 = num2[0] * 1000;
    } else {
        val2 = num2[0];
    }

    var result = val1 / val2;
    result = Math.round( result * 100 );
    return result;
}

function setBreadcrumbHeader(path, name) {
    var olObj ="";
    if(name =="Home")
        olObj = '<li class="active"><a style="cursor: pointer;" onClick="gotoPath2(\'/drive'+path+'\',\''+name+ '\', this.parentNode )">'+name+'</a></li>';
    else
        olObj = '<li class="active"><a style="cursor: pointer;" onClick="gotoPath2(\''+path+'\',\''+name+ '\', this.parentNode )">'+name+'</a></li>';
        
    $('#drivePathHeader').append(olObj);
}

function setBreadcrumbHeader2(path, name, element) {
    var ol = document.getElementById("drivePathHeader");
    var items = ol.getElementsByTagName("li");
    var counter = $( "#drivePathHeader li" ).index(element);
    //var li_ = element.parentNode;
    for (var i = 1; i < items.length; ++i) {
        console.log("the text right now is = "+items[i].innerText);
    }
    counter +=1;

    // delete li elements
    $("#drivePathHeader li").slice(counter).remove();
    var liObj = '<li class="active"><a onClick="gotoPath2(\''+path+'\',\''+name+ '\')">'+name+'</a></li>';
    //$('#drivePathHeader').append(liObj);
}

function setTableHeaderEntry() {
    var tableHeader = '<tr><th>Name</th><th>Subfolders</th><th>Created</th><th>Created by</th><th width="50px"></th></tr>';
    $('#oneDriveTable').append(tableHeader);
}

function deleteTableEntries() {
    $("#oneDriveTable").find("tr:gt(0)").remove();
}

function setTableEntry(name, dateCreated, modifiedBy, folderCount, path) {
    var tableEntry = '<tr>';
    tableEntry += '<td>';
    tableEntry += checkFileType(name, folderCount, path);
    tableEntry += name;
    tableEntry += ' </a></td>';

    if(folderCount >= 0)
        tableEntry += '<td>'+folderCount+'</td>';
    else
        tableEntry += '<td>---</td>';
    
    tableEntry += '<td>'+dateCreated+'</td>';
    tableEntry += '<td>'+modifiedBy+'</td>';
    tableEntry += '<td><button class="btn btn-danger" onclick="deleteObject()"><span class="glyphicon glyphicon-trash"> </span></button></td></tr>';

    $('#oneDriveTable').append(tableEntry);
}

function checkFileType(name, folderCount, path) {
    var span ="";
    if(folderCount >= 0) {
        span += '<span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span><a onclick="gotoPath(\''+path+'/'+name+':\', \''+name+'\')" style="margin-left: 5px" href="#"> '
    } else {
        console.log("in the else yeah!");
        var filetype = name.split(".");

        switch(filetype[filetype.length-1]) {
            case "jpg":
                span +=  '<span class="glyphicon glyphicon-picture" aria-hidden="true"></span><a style="margin-left: 5px" href="#"> ';
                break;
            case "png":
                span +=  '<span class="glyphicon glyphicon-picture" aria-hidden="true"></span><a style="margin-left: 5px" href="#"> ';
                break;
            case "dat":
                span +=  '<span class="glyphicon glyphicon-file" aria-hidden="true"></span><a style="margin-left: 5px" href="#"> ';
                break;
            default:
                span +=  '<span class="glyphicon glyphicon-file" aria-hidden="true"></span><a style="margin-left: 5px" href="#"> ';
                break;
        }
    }

    return span;
}
function onAuthCallback() {
  var authInfo = getAuthInfoFromUrl();
  var token = authInfo["access_token"];
  var expires = authInfo["expires_in"];

  // save infos to cookie
  saveToCookie(token, expires);
  //---------------------------

  window.opener.onAuthenticated(token, window);
}

function getAuthInfoFromUrl() {
  if (window.location.hash) {
    var authResponse = window.location.hash.substring(1);
    var authInfo = JSON.parse(
      '{' + authResponse.replace(/([^=]+)=([^&]+)&?/g, '"$1":"$2",').slice(0, -1) + '}',
      function (key, value) { return key === "" ? value : decodeURIComponent(value); });
    return authInfo;
  }
  else {
    alert("failed to receive auth token");
  }
}

function saveToCookie(token, e_time) {
  var date = new Date();
  date.setTime(date.getTime() + e_time * 1000);
  var cookie = "oDriveToken=" + token + "; path=/; expires=" + date.toUTCString();

  if (document.location.protocol.toLowerCase() == "https") {
    cookie = cookie + ";secure";
  }
  document.cookie = cookie;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getDriveData(token) {
  var baseUrl = "https://graph.microsoft.com/v1.0/me";

  $.ajax({
    url: baseUrl,
    dataType: 'json',
    headers: { "Authorization": "Bearer " + token },
    accept: "application/json;odata.metadata=none",
    success: function (data) {
      if (data) {
        setMainDisplayPage(data.givenName, data.surname, data.userPrincipalName);
        getDriveHomeData(token);
      }
    }
  });
}

function getDriveData2(token) {
  var baseUrl = "https://graph.microsoft.com/v1.0/me";

  $.ajax({
    url: baseUrl,
    dataType: 'json',
    headers: { "Authorization": "Bearer " + token },
    accept: "application/json;odata.metadata=none",
    success: function (data) {
      if (data) {
        setMainDisplayPage(data.givenName, data.surname, data.userPrincipalName);
        getDriveFolderStructureData(token);
      }
    }
  });
}

function getDriveFolderStructureData(token) {
  var baseUrl = "https://graph.microsoft.com/v1.0/me/drive/root/children";

  $.ajax({
    url: baseUrl,
    dataType: 'json',
    headers: { "Authorization": "Bearer " + token },
    accept: "application/json;odata.metadata=none",
    success: function (data) {
      parseDriveFolderHomeData(data);
    }
  });
}

function getDriveFolderStructureData2(token, path) {
  var baseUrl = "https://graph.microsoft.com/v1.0/me"+path+"/children";

  $.ajax({
    url: baseUrl,
    dataType: 'json',
    headers: { "Authorization": "Bearer " + token },
    accept: "application/json;odata.metadata=none",
    success: function (data) {
      parseDriveFolderHomeData2(data);
    }
  });
}

function getDriveHomeData(token) {
  var baseUrl = "https://graph.microsoft.com/v1.0/me";
  baseUrl += "/drive";
  var displayData = {};

  $.ajax({
    url: baseUrl,
    dataType: 'json',
    headers: { "Authorization": "Bearer " + token },
    accept: "application/json;odata.metadata=none",
    success: function (data) {
      displayData.displayName = data.owner.user.displayName;
      displayData.driveType = data.driveType;
      displayData.total = formatBytes(data.quota.total);
      displayData.remaining = formatBytes(data.quota.remaining);
      displayData.used = formatBytes(data.quota.used);
      setMainDisplayPageData(displayData);
    }
  });
}

function createNewFolder(path, name, token) {
  var baseUrl = "https://graph.microsoft.com/v1.0"+path+"/children";
  var data = {
      "name": name,
      "folder": { }
    };
  //var baseUrl2 = "https://graph.microsoft.com/v1.0/drive/root/children";
  console.log("before ajax");
  $.ajax({
    type: "POST",
    url: baseUrl,
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    headers: { "Authorization": "Bearer " + token },
    accept: "application/json;odata.metadata=none",
    success: function (data) {
      getDriveFolderStructureData2(token, path);
    }
  });
}

function formatBytes(bytes, decimals) {
  var result = [];
  if (bytes == 0) return '0 Byte';
  var k = 1000;
  var dm = decimals + 1 || 3;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));

  result.push(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)));
  result.push(sizes[i]);

  return result;
}

function deleteCookie() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  location.reload();
}

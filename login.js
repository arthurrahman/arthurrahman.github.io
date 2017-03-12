function signInToOneDrive() {
  // Register your own application at https://apps.dev.microsoft.com
  // and set the "clientId" and "redirectUri" variables accordingly.
  var appInfo = {
    "clientId": "7c74f427-22d1-4f94-8d18-708909b47890",
    "redirectUri": "https://arthurrahman.github.io/oDriveCallback.html",
    "scopes": "user.read files.read files.read.all sites.read.all files.readwrite.all",
    "authServiceUri": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
  }
  provideAppInfo(appInfo);
  // use Microsoft Graph v1.0
  var baseUrl = getQueryVariable("baseUrl")
  msGraphApiRoot = (baseUrl) ? baseUrl : "https://graph.microsoft.com/v1.0/me";

  challengeForAuth();
  saveToCookie({ "apiRoot": msGraphApiRoot, "signedin": true });
  return false;
}

function onAuthCallback() {
  var authInfo = getAuthInfoFromUrl();
  var token = authInfo["access_token"];
  var expires = authInfo["expires_in"];
  console.log(expires);
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
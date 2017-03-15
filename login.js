
function onAuthCallback() {
  var authInfo = getAuthInfoFromUrl();
  var token = authInfo["access_token"];
  var expires = authInfo["expires_in"];
  console.log(expires);

  // save infos to cookie

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
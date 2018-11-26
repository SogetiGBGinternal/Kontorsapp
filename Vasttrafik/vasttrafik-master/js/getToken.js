

var token;
function getToken(device_id, callback) {


    var http = new XMLHttpRequest();
    var url = "https://pweb/tokenGenerator.php?device=" + device_id;
    http.open("GET", url, true);
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            token = String(http.responseText);
            callback();
        }
    };
    http.send();

}



<?php
/**
// CORS enablement and other headers
header("Access-Control-Allow-Origin: *");
header("Content-type: application/json");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection");

// note that if you are using this proxy for a single credential
// you can just hardcode the client id and secret below instead of passing them

//$client_id     = $_POST["client_id"];
//$client_secret = $_POST["client_secret"];
$auth_string   = "Gl3oRfh6dkJsGA1AfykbfMd7nTga:_YiyDWXZBXfAaQ4hn0NwJ8fA8eUa";
$request       = "https://api.vasttrafik.se/token?grant_type=client_credentials";
$ch            = curl_init($request);
curl_setopt_array($ch, array(
        CURLOPT_POST           => TRUE,
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_SSL_VERIFYPEER => FALSE,
        CURLOPT_USERPWD        => $auth_string,
        CURLOPT_HTTPHEADER     => array(
            'Content-type: application/x-www-form-urlencoded',
        )
    ));
$response = curl_exec($ch);
curl_close($ch);

// Check for errors
if ($response === FALSE) {
    die(curl_error($ch));
    echo 'An error occurred';
} else {
  echo $response;
}
**/

$device = htmlspecialchars($_GET["device"]);
//Change params to your key and secret
$keySecret = base64_encode("Gl3oRfh6dkJsGA1AfykbfMd7nTga:_YiyDWXZBXfAaQ4hn0NwJ8fA8eUa");

// create a new cURL resource
$ch = curl_init();

// set URL and other appropriate options
curl_setopt($ch, CURLOPT_URL, "https://api.vasttrafik.se/token");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// set the post
curl_setopt($ch,CURLOPT_POST,true);
curl_setopt($ch,CURLOPT_POSTFIELDS, "grant_type=client_credentials&scope=device_" . $device);
curl_setopt($ch,CURLOPT_HTTPHEADER,array("Content-type: application/x-www-form-urlencoded",
                                            "Authorization: Basic " . $keySecret));

// grab URL and pass it to the browser
$result = curl_exec($ch);
$jsonObj = json_decode($result);
$key = "access_token";
echo (String) ($jsonObj->$key);
// close cURL resource, and free up system resources
curl_close($ch);
?>

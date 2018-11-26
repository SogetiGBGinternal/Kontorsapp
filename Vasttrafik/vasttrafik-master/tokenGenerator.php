<?php

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

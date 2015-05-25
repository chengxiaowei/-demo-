<?php

function response_result($error, $msg, $data) {
    $result = array(
        "error" => $error,
        "data" => $data,
        "msg" => $msg,
        "ver" => "1.0"
    );
    return json_encode($result);
}

function handle_post() {
    $foo = isset($_POST["foo"]) ? $_POST["foo"] : NULL;
    $error_code = "0";
    $data = array("foo" => $foo);
    $msg = "post data success";
    echo response_result($error_code, $msg, $data);
}

function handle_jsonp() {
    $foo = isset($_POST["foo"]) ? $_POST["foo"] : NULL;
    $error_code = "0";
    $data = array("foo" => $foo);
    $msg = "post data to jsonp success";
    $callback = @$_GET["callback"];
    $result = response_result($error_code, $msg, $data);
    header("Content-Type:application/javascript; charset=utf-8");
    echo "${callback}(${result})";
}

$type = isset($_GET["t"]) ? $_GET["t"] : NULL;
$wait = isset($_GET["delay"]) ? $_GET["delay"] : 0;
sleep($wait);

switch ($type) {
case "post":
    handle_post();
    break;
case "jsonp":
    handle_jsonp();
    break;
}


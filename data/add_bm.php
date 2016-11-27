<?php
header('Content-Type:text/plain');
$content = file_get_contents('php://input');
$content = json_decode($content);
$bookmarks = json_encode($content->bookmarks);
if($content->hash===''){
    $hash = getRandomString(6);
}else{
    $hash = $content->hash;
}
$conn = mysqli_connect('122.10.113.142','cmingvip_root','cMing1001','cmingvip_webmarker',3306);
mysqli_query($conn,'SET NAMES UTF8');
file_put_contents("bms/$hash.txt",$bookmarks);
$src = $hash.'.txt';
$sql = "SELECT * FROM bms WHERE hash='$hash'";
$search = mysqli_query($conn,$sql);
if($search === false){
    echo 'erro';
}else{
    $searchRow = mysqli_fetch_assoc($search);
    if($searchRow === null){
        $sql = "INSERT INTO bms VALUES(NULL,'$hash','$src')";
        $result = mysqli_query($conn,$sql);
        if($result){
            echo $hash;
        }else{
            echo -1;
        }
    }else{
        echo $hash;
    }
}
function getRandomString($len, $chars=null){
    if (is_null($chars)){
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    }
    mt_srand(10000000*(double)microtime());
    for ($i = 0, $str = '', $lc = strlen($chars)-1; $i < $len; $i++){
        $str .= $chars[mt_rand(0, $lc)];
    }
    return $str;
}

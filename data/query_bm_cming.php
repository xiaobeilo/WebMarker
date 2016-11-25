<?php
header('Content-Type:text/plain');
$hash = file_get_contents('php://input');
$conn = mysqli_connect('122.10.113.142','cmingvip_root','cMing1001','cmingvip_webmarker',3306);
mysqli_query($conn,'SET NAMES UTF8');
mysqli_query($conn,'USE bms');
$sql = "SELECT * FROM bms WHERE hash='$hash'";
$result = mysqli_query($conn,$sql);
if($result === false){
    echo 'erro';
}else{
    $row = mysqli_fetch_assoc($result);
    if($row === null){
        echo '1';
    }else{
        echo '-1';
    }
}

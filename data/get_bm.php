<?php
header('Content-Type:text/plain');
$content = file_get_contents('php://input');
$hash = json_decode($content)->hash;
$conn = mysqli_connect('127.0.0.1','root','','webmarker',3306);
mysqli_query($conn,'SET NAMES UTF8');
mysqli_query($conn,'USE bms');
$sql = "SELECT * FROM bms WHERE hash='$hash'";
$result = mysqli_query($conn,$sql);
if($result === false){
    echo 'error';
}else{
    $row = mysqli_fetch_assoc($result);
    if($row === null){
       $bm_file = fopen('bms/qiugongzuoa.txt',"r") or die("Unable to open file!");
       echo fread($bm_file,filesize('bms/qiugongzuoa.txt'));
       fclose($bm_file);
    }else{
        $bm_file = fopen('bms/'.$row['src'],"r") or die("Unable to open file!");
        echo fread($bm_file,filesize('bms/'.$row['src']));
        fclose($bm_file);
    }
}
<?php

  header("Content-Type:application/x-www-form-urlencoded");

  function validateEmail($e){
    $pattern = "/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+.[a-zA-Z]{2,4}/";
    return preg_match($pattern,$e);
  }

  //validate that the dates selected are valid
  function validateDate($d,$dd){
    $pat = "/[-\\\]/";
    $splitArray1 = preg_split($pat,$d);
    $splitArray2 = preg_split($pat,$dd);
    $year1 = (int)$splitArray1[0];
    $month1 = (int)$splitArray1[1];
    $day1 = (int)$splitArray1[2];
    $year2 = (int)$splitArray2[0];
    $month2 = (int)$splitArray2[1];
    $day2 = (int)$splitArray2[2];

    $toReturn = true;

    if($year2 < $year1){
      $toReturn = false;
    }else{
      if($month2 < $month1){
        if($year1 == $year2){
          $toReturn = false;
        }
      }else if($month2 == $month1
                && $year2 == $year1){
        if($day2 < $day1){
          $toReturn = false;
        }
      }
    }

    return $toReturn;
  }

  session_start();

  $currentDate = new DateTime();
  $currentString = $currentDate->format(DateTime::ATOM);

  $roomData = json_decode(file_get_contents("hbadmin/roomdata.json"),true);

  $sentData = json_decode(file_get_contents("php://input"),true);

  $room = strtolower($sentData["room"]);

  $email = $sentData["email"];

//make the room type agree with the json roomdata
  if(strpos($room," ") !== false){
    $room = preg_replace("/\s/","-",$room);
  }

  if(strpos($room,"triple") !== false){
    $room = "triple";
  }

  if(strpos($room,"family") !== false){
    if(strpos($room,"superior") == false){
      $room = "family";
    }
  }

  //store room type in session for later grabs
  $_SESSION["roomtype"] = $room;

  //check if room is available
  $available = "false";
  $cost;
  foreach($roomData["hotel"]["roomTypes"] as $key => $val){
    if($key == $room){
      if($val["available"] > 0){
        $available = "true";
        $cost = $val["cost"];
      }
    }
  }

  $datesStr = preg_replace("/[\[\]\"]/","",$sentData["dates"]);
  $datesArray = explode(",",$datesStr);

  //validate dates
  $validDate = 1;
  for($d = 0; $d < count($datesArray); $d++){
    $validDate = validateDate($currentString,$datesArray[$d]);
  }

  //validate email
  $validEmail = validateEmail($email);

  if($available == "true" && ($validDate==1)
      && ($validEmail==1)){

    $totalCost = $cost * count($datesArray);
    $totalCost = $totalCost + ($totalCost*0.17);

    $_SESSION["valid"] = "true";

    echo    "Room available!|"
          . "Total cost (+17% tax): |$"
          . $totalCost;
  }else{
    $_SESSION["valid"] = "false";
    echo "";
  }

 ?>

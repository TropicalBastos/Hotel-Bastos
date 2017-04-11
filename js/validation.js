var email = document.getElementById("email");
var first = document.getElementById("firstname");
var last = document.getElementById("lastname");

function checkEmail(){
  var eString = email.value;
  var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  if(!pattern.test(eString)){
    document.getElementById("email-error").style.display = "block";
    return false;
  }else{
    document.getElementById("email-error").style.display = "none";
    return true;
  }
}
function checkName(n,el){
  var name = n;
  var pattern = /[0-9?\-+)(!"£$%^&*@\/\\~`}{\[\]]+/g;
  if(pattern.test(name) || name.length < 1){
    el.style.display = "block";
    return false;
  }else{
    el.style.display = "none";
    return true;
  }
}

function formatDate(date){
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();

  if(month < 10){
    month = "0" + month;
  }

  if(day < 10){
    day = "0" + day;
  }

  var dateObject = {
    year: year,
    month: month,
    day: day
  }

  return dateObject;
}

function checkDates(){
  var valid = true;
  var current = formatDate(new Date());
  var selected = calendar.getSelectedAsDates();

  if(selected.length < 1) valid = false;

  var convert = [];
  for(var i = 0; i < selected.length; i++){
    convert.push(formatDate(selected[i]));
  }

  for(var date in convert){
    var day = parseInt(convert[date].day);
    var month = parseInt(convert[date].month);
    var year = parseInt(convert[date].year);

    if(year < parseInt(current.year)){
      valid = false;
    }else{
      if(month < parseInt(current.month)){
        if(year == parseInt(current.year)){
          valid = false;
        }
      }else if(month == parseInt(current.month)
                && year == parseInt(current.year)){
        if(day < parseInt(current.day)){
          valid = false;
        }
      }
    }
  }

  if(!valid){
    document.getElementById("date-error").style.display = "block";
    return false;
  }else{
    document.getElementById("date-error").style.display = "none";
    return true;
  }
}

function checkAll(){
  var e = checkEmail();
  var f = checkName(first.value,document.getElementById("first-error"));
  var l = checkName(last.value,document.getElementById("last-error"));
  var d = checkDates();
  var select = document.getElementById("select");
  var sValue = select.options[select.selectedIndex].value;

  if(e && f && l && d){
    var datesToReserve = calendar.getSelectedAsDates();

    var dataToSend = {
      dates: JSON.stringify(datesToReserve),
      name: first.value + " " + last.value,
      email: email.value,
      room: sValue
    }

    var xhr = new XMLHttpRequest();
    var method = "POST";
    var url = "availability.php";
    xhr.open(method,url);
    xhr.onreadystatechange = function(){

      var res = xhr.responseText;
      var av = document.getElementById("availability");
      var co = document.getElementById("context");
      var cost = document.getElementById("cost");

      if(res.length > 0){
        //split up the data
        var dataArray = res.split("|");

        av.textContent = dataArray[0];
        co.textContent = dataArray[1];
        cost.textContent = dataArray[2];

        document.getElementById("popup-button").style.display = "block";

      }else{
        av.textContent = "Error with validation!";
        co.textContent = "";
        cost.textContent = "Please check you have filled everything correctly";

        document.getElementById("popup-button").style.display = "none";
      }

      document.getElementById("reserve-popup")
              .classList.add("popped");
      dBack.style["z-index"] = "3";
    }
    xhr.send(JSON.stringify(dataToSend));
  }
}

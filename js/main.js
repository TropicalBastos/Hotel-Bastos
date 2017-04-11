/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', 'js/particles.json', function() {
  console.log('callback - particles.js config loaded');
});

//move the background in a 3d style effect
var background = document.getElementsByClassName("background")[0];
var dBack = document.getElementsByClassName("darkBackground")[0];
var initialHeight = dBack.offsetHeight;

var closeButtonTop = null;

var prevPosX = 0;
var prevPosY = 0;
var posY = -50;
var posX = 0;

/**Constrain the parallax effect so that it doesnt show the end of the image**/
function posConstrain(p){
  if(p > 0){return 0;}
  else if(p < -150){return -150;}
  else return p;
}

function backgroundMouseListener(e){
  var mouseX = e.pageX;
  var mouseY = e.pageY;

  //move up
  if(prevPosY<mouseY){
    posY = posY-1;
    posY = posConstrain(posY);
    background.style["transform"] = "translate("+posX+"px,"+posY+"px)";
  }

  //move down
  if(prevPosY>mouseY){
    posY = posY+1;
    posY = posConstrain(posY);
    background.style["transform"] = "translate("+posX+"px,"+posY+"px)";
  }

  //move left
  if(prevPosX>mouseX){
    posX = posX+1;
    posX = posConstrain(posX);
    background.style["transform"] = "translate("+posX+"px,"+posY+"px)";
  }

  //move right
  if(prevPosX<mouseX){
    posX = posX-1;
    posX = posConstrain(posX);
    background.style["transform"] = "translate("+posX+"px,"+posY+"px)";
  }

  prevPosX = mouseX;
  prevPosY = mouseY;
}

document.addEventListener("mousemove",backgroundMouseListener);

//open form when user clicks reserve
var menuOpened = false;
function clickReserveHandler(e){
  if(!menuOpened){
    var form = document.getElementsByClassName("formex")[0];
    var dark = document.getElementsByClassName("darkBackground")[0];
    var par = document.getElementById("particles-js");
    var bubbles = document.getElementsByClassName("bubble-review");
    var close = document.getElementsByClassName("close-button")[1];
    var mainWrapper = document.getElementsByClassName("mainWrapper")[0];

    mainWrapper.classList.remove("underliner");
    mainWrapper.style["cursor"] = "default";
    form.classList.add("open");
    dark.classList.add("fadein");
    par.style["z-index"] = 0;
    close.classList.add("entered-close");
    closeButtonTop = (close.offsetTop - (close.offsetWidth)+3)
    close.style.top = closeButtonTop + "px";

    for(var b = 0;b < bubbles.length; b++){
      bubbles[b].style["z-index"] = 0;
    }

    darkAdjust();

    document.body.scrollTop = close.offsetTop;

    menuOpened = true;
  }
}

var mainWrapper = document.getElementsByClassName("mainWrapper")[0];
mainWrapper.addEventListener("click",clickReserveHandler);

function getDocHeight(){
  var body = document.body,
      html = document.documentElement;

  var height = Math.max( body.scrollHeight,
                         body.offsetHeight,
                         html.clientHeight,
                         html.scrollHeight,
                         html.offsetHeight );

  return height;
}

//adjust darkened background
function darkAdjust(){
  var d = document.getElementsByClassName("darkBackground")[0];
  height = getDocHeight();
  d.style.height = (height+100)+"px";
}

//button effect on mouse down
function buttonEffectDown(e){
  var b = e.target;
  b.style["font-size"] = 16 + "px";
  b.style["transform"] = "scale(0.9,0.9)";
}
function buttonEffectUp(e){
  var b = e.target;
  b.style["font-size"] = 25 + "px";
  b.style["transform"] = "scale(1,1)";
}

//get the second indexed reserve button since thats the one we're looking for
var reserve = document.getElementsByClassName("reserve-button")[1];
reserve.addEventListener("mousedown",buttonEffectDown);
reserve.addEventListener("mouseup",buttonEffectUp);


//position close button
function positionClose(){
  var button = document.getElementsByClassName("close-button")[1];
  var right = (mainWrapper.offsetLeft + mainWrapper.offsetWidth)
              -button.offsetWidth;
  var top = mainWrapper.offsetTop;
  button.style.left = right + "px";
  button.style.top = top + "px";
  if(menuOpened){
    button.style.top = closeButtonTop + "px";
  }
}
positionClose();
window.addEventListener("resize",positionClose);

//add functionality to the close button
var closeButton = document.getElementsByClassName("close-button")[1];

function closeDown(e){
  e.target.style["transform"] = "scale(0.5,0.5)";
}

function closeUp(e){
  e.target.style["transform"] = "scale(1,1)";
}

function closeMenu(){
  var form = document.getElementsByClassName("formex")[0];
  var dark = document.getElementsByClassName("darkBackground")[0];
  var par = document.getElementById("particles-js");
  var bubbles = document.getElementsByClassName("bubble-review");
  var close = document.getElementsByClassName("close-button")[1];

  mainWrapper.classList.add("underliner");
  mainWrapper.style["cursor"] = "pointer";
  form.classList.remove("open");
  dark.classList.remove("fadein");
  dark.style.height = initialHeight + "px";
  par.style["z-index"] = 1;
  close.classList.remove("entered-close");
  closeButtonTop = (close.offsetTop + (close.offsetWidth)-3)
  close.style.top = closeButtonTop + "px";

  for(var b = 0;b < bubbles.length; b++){
    bubbles[b].style["z-index"] = 3;
  }

  menuOpened = false;
}

closeButton.addEventListener("mousedown",closeDown);
closeButton.addEventListener("mouseup",closeUp);
closeButton.addEventListener("click",closeMenu);

//when user clicks reserve - validation
reserve.addEventListener("click",validate);
function validate(){
  checkAll();
  darkAdjust();

  //scroll window to the pop up if the device is smaller so as to have it in view
  if(window.innerWidth < 800){
    var close = document.getElementsByClassName("close-button")[1];
    document.body.scrollTop = close.offsetTop;
  }
}

//close button functionality for popup

function goBack(e){
  document.getElementById("reserve-popup")
          .classList.remove("popped");
  dBack.style["z-index"] = "2";
}

var closePop = document.getElementById("popup-close");
closePop.addEventListener("click",goBack);

//instantiate calendar object
var calendar = new Kalendae('calendar',{mode:"multiple"});

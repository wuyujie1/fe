const maxFlyerIndex = 5;

var currShowing = 0;
const buttons = document.querySelectorAll("button.button, button.buttonActive");
const slideContainer = document.querySelector(".imgSlider");
const prevButton = document.querySelector(".leftBtn");
const nextButton = document.querySelector(".rightBtn");
const buttonContainer = document.querySelector(".bottomButtonsContainer");
const pauseButton = document.querySelector(".fa");

NodeList.prototype.indexOf = Array.prototype.indexOf;

// Page changing ---------------------------------------------------------------------------
function adjustOffset(animated){
    if (animated){
        window.requestAnimationFrame(aniFrame);

    } else {
        const offset = - currShowing * slideContainer.offsetWidth;
        slideContainer.style.transform = 'translateX(' + offset + 'px)';
    }
}

function adjustCurrShowing(increment){
    currShowing += increment;
    if (currShowing < 0) {
        currShowing = maxFlyerIndex;
    } else if (currShowing > maxFlyerIndex) {
        currShowing = 0;
    }

    adjustOffset(1);
}
//---------------------------------------------------------------------------

// Animation ---------------------------------------------------------------------------
function aniFrame(){
    var offset = - currShowing * slideContainer.offsetWidth;
    let style = window.getComputedStyle(slideContainer);
    let matrix = new WebKitCSSMatrix(style.transform);
    let currTranslateX = matrix.m41;

    const aniDuration = 100;
    const stepSize = (offset - currTranslateX) / aniDuration;

    slideContainer.style.transform = 'translateX(' + (currTranslateX + stepSize) + 'px)';

    if (offset !== currTranslateX){
        window.requestAnimationFrame(aniFrame);
    }
}
//---------------------------------------------------------------------------


// Buttons and listeners ---------------------------------------------------------------------------
function prevPage(){
    buttons[currShowing].className = 'button';
    adjustCurrShowing(-1);
    buttons[currShowing].className = 'buttonActive';
}
prevButton.addEventListener("click", prevPage);

function nextPage(){
    buttons[currShowing].className = 'button';
    adjustCurrShowing(1);
    buttons[currShowing].className = 'buttonActive';
}
nextButton.addEventListener("click", nextPage);

function buttonListener(){
    let index = buttons.indexOf(event.target);
    if (0 <= index && index <= maxFlyerIndex) {
        buttons[currShowing].className = 'button';
        event.target.className = 'buttonActive';
        currShowing = index;
        adjustOffset(1);
    }
}

buttonContainer.addEventListener("click", buttonListener)

var autoPlayInterval = setInterval(nextPage, 5000);
function pauseButtonListener(){
    if (pauseButton.id === "unpaused"){
        pauseButton.id = "paused";
        pauseButton.innerHTML = "&#xf04c;";

        autoPlayInterval = setInterval(nextPage, 5000);
    } else {
        pauseButton.id = "unpaused";
        pauseButton.innerHTML = "&#xf04b;";
        clearInterval(autoPlayInterval);
    }
}
pauseButton.addEventListener("click", pauseButtonListener);
//---------------------------------------------------------------------------

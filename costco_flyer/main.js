const max_flyer_index = 5;

var curr_showing = 0;
const buttons = document.querySelectorAll("button.button, button.button_active");
const slide_container = document.querySelector(".img_scroll_lst");
const prev_button = document.querySelector(".left_btn");
const next_button = document.querySelector(".right_btn");
const button_container = document.querySelector(".bottom_buttons_container");
const pause_button = document.querySelector(".fa");

NodeList.prototype.indexOf = Array.prototype.indexOf;


function adjust_offset(animated){
    if (animated){
        window.requestAnimationFrame(ani_frame);

    } else {
        const offset = - curr_showing * slide_container.offsetWidth;
        slide_container.style.transform = 'translateX(' + offset + 'px)';
    }

}

function ani_frame(){
    var offset = - curr_showing * slide_container.offsetWidth;
    let style = window.getComputedStyle(slide_container);
    let matrix = new WebKitCSSMatrix(style.transform);
    let curr_translateX = matrix.m41;

    const ani_duration = 100;
    const stepSize = (offset - curr_translateX) / ani_duration;

    slide_container.style.transform = 'translateX(' + (curr_translateX + stepSize) + 'px)';

    if (offset !== curr_translateX){
        window.requestAnimationFrame(ani_frame);
    }

}

function adjust_curr_showing(increment){
    curr_showing += increment;
    if (curr_showing < 0) {
        curr_showing = max_flyer_index;
    } else if (curr_showing > max_flyer_index) {
        curr_showing = 0;
    }

    adjust_offset(1);
}

function prev_page(){
    buttons[curr_showing].className = 'button';
    adjust_curr_showing(-1);
    buttons[curr_showing].className = 'button_active';
}
prev_button.addEventListener("click", prev_page);

function next_page(){
    buttons[curr_showing].className = 'button';
    adjust_curr_showing(1);
    buttons[curr_showing].className = 'button_active';
}
next_button.addEventListener("click", next_page);

function button_listener(){
    let index = buttons.indexOf(event.target);
    if (0 <= index && index <= max_flyer_index) {
        buttons[curr_showing].className = 'button';
        event.target.className = 'button_active';
        curr_showing = index;
        adjust_offset(1);
    }
}

button_container.addEventListener("click", button_listener)

var autoPlayInterval = setInterval(next_page, 5000);
function pause_button_listener(){
    if (pause_button.id === "unpaused"){
        pause_button.id = "paused";
        pause_button.innerHTML = "&#xf04c;";

        autoPlayInterval = setInterval(next_page, 5000);
    } else {
        pause_button.id = "unpaused";
        pause_button.innerHTML = "&#xf04b;";
        clearInterval(autoPlayInterval);
    }
}
pause_button.addEventListener("click", pause_button_listener);
NodeList.prototype.indexOf = Array.prototype.indexOf

// Specify index of the image that are currently displaying, default set to index 0.
let currShowing = 0
// List of image source files.
let imgSourcePaths = ["resources/d-hero-230529-clothing-en.avif",
    "resources/d-hero-230529-coupons-en.avif", "resources/d-hero-230529-travel-en.avif",
    "resources/d-hero-230529-whey-isolate-en.avif", "resources/d-hero-230530-samsung-home-event-en.avif",
    "resources/d-hero-230601-appliances-en.avif"]
// Specify maximum number of images that are allowed.
const maxFlyerIndex = imgSourcePaths.length - 1

// Element which renders currently displayed image.
const centerScreenContainer = document.querySelector(".centerScreenContainer")
// Previous image button.
const prevButton = document.querySelector(".leftBtn")
// Next image button.
const nextButton = document.querySelector(".rightBtn")
// Element which contains the navigation bar (located underneath the image).
const naviBarContainer = document.querySelector(".naviBarContainer")
// Pause and Play button.
const pauseButton = document.querySelector(".fa")
// Desired delay for auto play functionality.
let timeout = 5000
// Initialize auto play interval.
let autoPlayInterval = setInterval(nextPage, timeout)

// Helper function to switch (from imgSourcePaths) a new image for rendering.
function adjustCurrShowing(desiredImgIndex){
    let navBar = document.querySelectorAll(".navBarEntry")
    navBar[currShowing].style.borderColor = "gray"

    let flyerImgContainer = document.querySelector(".flyerImgContainer")
    currShowing = desiredImgIndex
    if (currShowing < 0) {
        currShowing = maxFlyerIndex
    } else if (currShowing > maxFlyerIndex) {
        currShowing = 0
    }

    flyerImgContainer.style.opacity = "0"

    flyerImgContainer.src = imgSourcePaths[currShowing];

    requestAnimationFrame(animationFrameDisplay)

    flyerImgContainer.onmouseover = function(){
        clearInterval(autoPlayInterval)
    }
    flyerImgContainer.onmouseleave = function(){
        if (pauseButton.id === "paused") {
            autoPlayInterval = setInterval(nextPage, timeout)
        }
    }

    navBar[currShowing].style.borderColor = "red"
}

// Image changing animation (fade in effect)
function animationFrameDisplay() {
    let flyerImgContainer = document.querySelector(".flyerImgContainer")
    if (flyerImgContainer.style.opacity !== "1") {
        flyerImgContainer.style.opacity = (Number(flyerImgContainer.style.opacity) + 0.005).toString()
        requestAnimationFrame(animationFrameDisplay)
    }
}

// Previous image button listener.
function prevPage(){
    adjustCurrShowing(currShowing - 1)
}
prevButton.addEventListener("click", prevPage)

// Next image button listener.
function nextPage(){
    adjustCurrShowing(currShowing + 1)
}
nextButton.addEventListener("click", nextPage)

// Initialize main section of the flyer (image container).
function initImgContainer(){
    const imgContainer = document.createElement("img")
    imgContainer.className = "flyerImgContainer"
    centerScreenContainer.insertBefore(imgContainer, nextButton)
    adjustCurrShowing(currShowing)
}

// Dynamically generating navigation bar (depending on number of images).
function initNaviBar(){
    for (let i = 0; i <= maxFlyerIndex; i++){
        const barEntry = document.createElement("img")
        barEntry.src = imgSourcePaths[i]
        barEntry.className = "navBarEntry"
        barEntry.addEventListener("click", () => {
            adjustCurrShowing(i)
        })
        barEntry.onmouseover = function(){
            barEntry.style.width = "240px"
        }
        barEntry.onmouseleave = function(){
            barEntry.style.width = "200px"
        }

        naviBarContainer.insertBefore(barEntry, pauseButton)
    }
}

// Pause button listener. Pause to stop auto play, unpause to resume.
pauseButton.addEventListener("click", () => {
    if (pauseButton.id === "unpaused"){
        pauseButton.id = "paused"
        pauseButton.innerHTML = "&#xf04c;"
        autoPlayInterval = setInterval(nextPage, timeout)
    } else {
        pauseButton.id = "unpaused"
        pauseButton.innerHTML = "&#xf04b;"
        clearInterval(autoPlayInterval)
    }
})

// Call all initializers.
function initialization(){
    initNaviBar()
    initImgContainer()
}
initialization()
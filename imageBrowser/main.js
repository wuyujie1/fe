// Locate imageBrowserContainer element in HTML.
const imageContainer = document.querySelector(".imageBrowserContainer")
// Locate searchBarInputBox element in HTML.
const inputBox = document.querySelector(".searchBarInputBox")
// Locate searchBtn element in HTML.
const searchBtn = document.querySelector(".searchBtn")
// Locate leftBtn element in HTML.
const leftBtn = document.querySelector(".leftBtn")
// Locate rightBtn element in HTML.
const rightBtn = document.querySelector(".rightBtn")
// Locate searchResultContainer element in HTML.
const searchResults = document.querySelector(".searchResultContainer")
// Variable holds the current page number for API call.
let pageNum = 1
// Variable holds the maximum page number for current search.
let currSearchMaxPage = 1

// Helper function to switch (from imgSourcePaths) a new image for rendering.
function adjustCurrShowing(index){
    const imageList = document.querySelectorAll(".searchEntry")
    if (index < imageList.length){
        imageContainer.style.backgroundImage = "url(" + imageList[index].src + ")"}
}

// Clean images that are currently displaying when switching to another page.
function cleanCurrPage(){
    const imageList = document.querySelectorAll(".searchEntry")
    for (let i = 0; i < imageList.length; i++) {
        imageList[i].remove();
    }
}

// Async function to request data from the server.
async function getData(query){
    const fetchURL = "https://api.unsplash.com/search/photos?page=" + pageNum.toString() + "&query=" + query + "&client_id=JyL04GY33kzOvM5XrcJCNIHVz7SYScaiA8trI8_DHnM"

    try {
        let response = await fetch(fetchURL)
        let data = await response.json()
        for (let i = 0; i < data.results.length; i++) {
            const searchEntry = document.createElement("img")
            searchEntry.src = data.results[i].urls.regular;
            searchEntry.className = "searchEntry"

            searchEntry.addEventListener("click", () => {
                adjustCurrShowing(i)
            })

            searchResults.append(searchEntry)
        }
        adjustCurrShowing(0)
        return await data.total_pages
    }
    catch (error) {
        console.log(error)
    }
}
// Event listener for search button.
async function searchBtnListener() {
    pageNum = 1
    cleanCurrPage()

    let value = inputBox.value
    if (value !== ""){
        currSearchMaxPage = await getData(value)
    }
}
searchBtn.addEventListener("click", searchBtnListener)

// Bind "enter" key (when input box is focused) with the search button.
inputBox.addEventListener("keypress", (e)=>{
    if (e.key === "Enter") {
        searchBtnListener()
    }
})

// Switch to previous page.
async function prevPageBtnListener(){
    if (pageNum > 1){
        pageNum -= 1
        cleanCurrPage()
        let value = inputBox.value
        getData(value)
    }
}
leftBtn.addEventListener("click", prevPageBtnListener)

// Switch to the next page.
async function nextPageBtnListener(){
    if (pageNum < currSearchMaxPage){
        pageNum += 1
        cleanCurrPage()
        let value = inputBox.value
        getData(value)
    }

}
rightBtn.addEventListener("click", nextPageBtnListener)

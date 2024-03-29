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
// Locate thumbnailContainer element in HTML
const thumbnailContainer = document.querySelector(".thumbnailContainer")
// Variable holds the current page number for API call.
let pageNum = 1
// Variable holds the maximum page number for current search.
let currSearchMaxPage = 1
// Variable holds the current query.
let currSearch = ""

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
    const fetchURL = "https://api.unsplash.com/search/photos?page=" + pageNum.toString() + "&query=" + query + "&per_page=9&client_id=JyL04GY33kzOvM5XrcJCNIHVz7SYScaiA8trI8_DHnM"

    try {
        let response = await fetch(fetchURL)
        if (response.ok) {
            console.log(response)
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
        return Promise.reject(response)
    }
    catch (error) {
        console.log(error)
    }
}
// Event listener for search button.
async function searchBtnListener(value= null, log = true) {
    pageNum = 1
    cleanCurrPage()

    if (value === null) {value = inputBox.value}
    if (value !== ""){
        currSearch = value
        currSearchMaxPage = await getData(value)
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory"))
        const currValueIndex = searchHistory.indexOf(value)
        if (currValueIndex === -1){
            searchHistory.pop()
            searchHistory.unshift(value)
        } else {
            searchHistory.splice(currValueIndex, 1)
            searchHistory.unshift(value)
        }
        if (log) {
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
            deleteSearchHistory()
        }


    }
}
searchBtn.addEventListener("click", searchBtnListener)

// Bind "return" key (when input box is focused) with the search button.
inputBox.addEventListener("keypress", (e)=>{
    if (e.key === "Enter") {
        searchBtnListener()
        inputBox.blur()
    }
})

// Switch to previous page.
async function prevPageBtnListener(){
    if (pageNum > 1){
        pageNum -= 1
        cleanCurrPage()
        let value = inputBox.value
        getData(value)
        deleteSearchHistory()
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
        deleteSearchHistory()
    }

}
rightBtn.addEventListener("click", nextPageBtnListener)

// Create search history container when input box is clicked.
function genSearchHistory(){
    const historyContainer = document.querySelector(".searchHistoryContainer")
    if (historyContainer === null) {
        const searchHistoryContainer = document.createElement("div")
        searchHistoryContainer.className = "searchHistoryContainer"
        searchHistoryContainer.style.position = "relative"
        searchHistoryContainer.style.top = "-395px"
        searchHistoryContainer.style.height = "0"
        imageContainer.insertBefore(searchHistoryContainer, thumbnailContainer)

        const searchHistoryBox = document.createElement("ul")
        searchHistoryBox.className = "searchHistoryBox"
        searchHistoryContainer.append(searchHistoryBox)

        genSearchEntries(inputBox.value)
    }
}

function genSearchEntries(keyword){
    const searchHistoryBox = document.querySelector(".searchHistoryBox")
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory"))
    for (let i = 0; i < 10; i++){
        if (searchHistory[i] !== null && searchHistory[i].includes(keyword)){
            const searchHistoryEntry = document.createElement("li")
            searchHistoryEntry.innerHTML = searchHistory[i]
            searchHistoryEntry.style.paddingLeft = "5px"
            searchHistoryEntry.style.paddingTop = "5px"
            searchHistoryEntry.style.cursor = "pointer"

            searchHistoryEntry.addEventListener("click", () => {
                inputBox.value = searchHistory[i]
                searchBtnListener()
            })

            searchHistoryBox.append(searchHistoryEntry)
        }
    }
}

// Event listener for input box, catching if a key is pressed.
function onInputBoxKeyDown(){
    // Update search history box
    if (document.querySelector(".searchHistoryBox") !== null) {
        document.querySelectorAll('li').forEach(el => el.remove());
        let keyword = inputBox.value
        if (event.key !== "Backspace") {
            keyword += event.key
        } else {
            keyword = keyword.slice(0, -1);
        }
        genSearchEntries(keyword)

        const searchHistory = document.querySelectorAll('li')
        if (searchHistory.length !== 0) {
            if (searchHistory[0].innerHTML !== currSearch) {
                searchBtnListener(searchHistory[0].innerHTML, false)
            }
        }
    }


}
inputBox.addEventListener("keydown", onInputBoxKeyDown)


// Event listener for the input box (toggle search history)
inputBox.addEventListener("click", (e)=>{
    genSearchHistory()
})

// Create event listener for the rest of the HTML body (to delete search history)
function deleteSearchHistory() {
    const searchHistoryContainer = document.querySelector(".searchHistoryContainer")
    if (searchHistoryContainer !== null){
        searchHistoryContainer.remove()
    }
}
document.addEventListener("click", function(event) {
    if (event.target !== inputBox) {
        deleteSearchHistory()
    }
})

// Initialize local storage for search history.
function initStorage() {
    if (localStorage.getItem("initialized") !== "True"){
        let historyLst = [null, null, null, null, null, null, null, null, null, null]
        localStorage.setItem("searchHistory", JSON.stringify(historyLst))
        localStorage.setItem("initialized", "True")
    }
}
initStorage()

// Hard reset
// let historyLst = [null, null, null, null, null, null, null, null, null, null]
// localStorage.setItem("searchHistory", JSON.stringify(historyLst))


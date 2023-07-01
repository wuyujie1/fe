import './App.css'
import {useState, useEffect, useRef} from 'react'
import ProgressBar from "@ramonak/react-progress-bar";
import {render} from "@testing-library/react";

function SearchResultContainer({renderingList, searchEntryOnClick}) {
    const resultList = renderingList.map(img => <img key={img.id} className="searchEntry" onClick={() => {searchEntryOnClick(img.urls.regular)}} src={img.urls.regular}></img>)

    return (
        <div className="searchResultContainer">
            {resultList}
        </div>
    )
}

function ThumbnailContainer({maxPageNum, currPageNum, setCurrPageNum, renderingList, searchEntryOnClick}) {

    function handleLeftBtn() {
        if (currPageNum > 1){
            setCurrPageNum(currPageNum - 1)
        }
    }

    function handleRightBtn() {
        if (currPageNum < maxPageNum){
            setCurrPageNum(currPageNum + 1)
        }
    }

    function LeftBtn() {
        if (currPageNum === 1) {
            return null
        } else {
            return <button className="leftBtn"  type="button" onClick={handleLeftBtn}>&#10094;</button>
        }
    }

    function RightBtn() {
        if (currPageNum === maxPageNum) {
            return null
        } else {
            return <button className="rightBtn"  type="button" onClick={handleRightBtn}>&#10095;</button>
        }
    }

    function PageNumberIndex() {

        const indexList = []
        for (let i = Math.max(currPageNum - 2, 1); i <= Math.min(currPageNum + 2, maxPageNum); i++) {
            if (i === currPageNum) {
                indexList.push(
                    <li key={i} className="currPageIndexButton" onClick={() => {setCurrPageNum(i)}}>{i}</li>
                )
            } else {
                indexList.push(
                    <li key={i} className="pageIndexButtons" onClick={() => {setCurrPageNum(i)}}>{i}</li>
                )
            }

        }

        return (
            <ul className="pageNumberContainer">
                {indexList}
            </ul>
        )
    }

    return (
        <div className="naviBarContainer">
            <div className="thumbnailContainer">
                <LeftBtn/>
                <SearchResultContainer renderingList={renderingList} searchEntryOnClick={searchEntryOnClick}/>
                <RightBtn/>
            </div>
            <PageNumberIndex/>
        </div>

    )
}

function SearchBarInputBox({inputBoxValue, inputBoxOnChange, searchBarInputBoxIsFocused}) {

    return (
        <input value={inputBoxValue} onFocus={() => searchBarInputBoxIsFocused(true)} type="text" placeholder="Input Key Words ..." className="searchBarInputBox" onChange={(e) => inputBoxOnChange(e.target.value)}></input>
    )
}

function SearchBtn({searchBtnOnClick}) {
    return (
        <button className="searchBtn" onClick={searchBtnOnClick}>Search</button>
    )
}

function SearchBarContainer({inputBoxValue, displayHistory, searchBarInputBoxIsFocused, deleteSearchHistory, inputBoxOnChange, searchBtnOnClick}) {

    function SearchHistory() {
        function SearchButtonLi({entry}) {

            return (
                <div>
                    <li className="searchHistoryEntry" onClick={() => inputBoxOnChange(entry)}>{entry}</li>
                    <span className="deleteBtn" onClick={() => deleteSearchHistory(entry)}>X</span>
                </div>
            )
        }


        if (!displayHistory) {
            return null
        }

        const searchHistoryList = JSON.parse(localStorage.getItem("searchHistory")).map(entry => entry === null ? null : <SearchButtonLi key={entry} entry={entry}/>)

        return (
            <ul className={"searchHistoryBox"} onClick={e => {e.stopPropagation()}}>
                {searchHistoryList}
            </ul>
        )
    }


    return (
        <div >
            <div className="searchBarContainer" onClick={e => {e.stopPropagation()}}>
                <SearchBarInputBox inputBoxValue={inputBoxValue} inputBoxOnChange={inputBoxOnChange} searchBarInputBoxIsFocused={searchBarInputBoxIsFocused}/>
                <SearchBtn searchBtnOnClick={searchBtnOnClick}/>
            </div>
            <div className="searchHistoryContainer">
                <SearchHistory/>
            </div>
        </div>

    )
}

function ImageBrowserContainer() {
    const [currPageNum, setCurrPageNum] = useState(1)
    const [maxPageNum, setMaxPageNum] = useState(1)
    const [inputBoxValue, setInputBoxValue] = useState("")

    const [renderingList, setRenderingList] = useState([])
    const [renderingURL, setRenderingURL] = useState("")

    const [searchHistory, setSearchHistory] = useState(JSON.parse(localStorage.getItem("searchHistory")))
    const [displayHistory, setDisplayHistory] = useState(false)

    const [progressCounter, setProgressCounter] = useState(0)

    function deleteSearchHistory(keyword) {
        const currValueIndex = searchHistory.indexOf(keyword)
        let searchHistoryTmp = [...searchHistory]
        searchHistoryTmp.splice(currValueIndex, 1)
        searchHistoryTmp.push(null)
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryTmp))
        setSearchHistory(searchHistoryTmp)
    }

    function searchBarInputBoxIsFocused (bool) {
        setDisplayHistory(bool)
    }

    async function search() {
        const fetchURL = "https://api.unsplash.com/search/photos?page=" + currPageNum.toString() + "&query=" + inputBoxValue + "&client_id=JyL04GY33kzOvM5XrcJCNIHVz7SYScaiA8trI8_DHnM"

        try {
            if (inputBoxValue !== ""){
                let response = await fetch(fetchURL)
                if (response.ok) {
                    let data = await response.json()

                    let totalPages = await data.total_pages
                    setMaxPageNum(totalPages)
                    setRenderingList(data.results)

                    const currValueIndex = searchHistory.indexOf(inputBoxValue)
                    if (currValueIndex === -1){
                        searchHistory.pop()
                        searchHistory.unshift(inputBoxValue)
                    } else {
                        searchHistory.splice(currValueIndex, 1)
                        searchHistory.unshift(inputBoxValue)
                    }
                    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
                    setDisplayHistory(false)
                }
            }
        }
        catch (error) {
            console.log(error)
        }
    }


    function inputBoxOnChange(newInput) {
        setInputBoxValue(newInput)
    }

    async function searchBtnOnClick(){
        search()
    }

    function searchEntryOnClick(url) {
        setRenderingURL(url)
    }


    useEffect(() => {
        if (renderingList.length > 0) {
            setRenderingURL(renderingList[0].urls.regular)
        } else {
            setRenderingURL("")
        }
    }, [renderingList])

    useEffect( () => {
        const timeout = setTimeout(() => {
            setProgressCounter(0)
            const annoFcn = async() => {await search()}
            annoFcn()
            }, 800)
        return () => {
            clearTimeout(timeout)
        }
    }, [inputBoxValue])

    useEffect(() => {
        progressCounter < 100 && setTimeout(() => setProgressCounter(progressCounter + (100 - progressCounter) / 15 + 2), 10);
    }, [progressCounter]);

    useEffect(() => {
        const annoFcn = async() => {await search()}
        annoFcn()
    }, [currPageNum])

    return (
        <div className="imageBrowserContainer" style={{backgroundImage: "url(" + renderingURL + ")"}} onClick={() => setDisplayHistory(false)}>
            <ProgressBar height={"3px"} borderRadius={"0"} className="progressBar" isLabelVisible={false} bgColor={"#2a9df4"} completed={progressCounter} transitionDuration={"0s"}/>
            <SearchBarContainer inputBoxValue={inputBoxValue} displayHistory={displayHistory} searchBarInputBoxIsFocused={searchBarInputBoxIsFocused} deleteSearchHistory={deleteSearchHistory} inputBoxOnChange={inputBoxOnChange} searchBtnOnClick={searchBtnOnClick}/>
            <ThumbnailContainer maxPageNum={maxPageNum} currPageNum={currPageNum} setCurrPageNum={setCurrPageNum} renderingList={renderingList} searchEntryOnClick={searchEntryOnClick}/>
        </div>
    )
}

function MainSection() {
    return (
        <section>
            <ImageBrowserContainer/>
        </section>
    )
}

export default function App() {
    return (
        <MainSection />
    )
}

function initStorage() {
    if (localStorage.getItem("initialized") !== "True"){
        let historyLst = [null, null, null, null, null, null, null, null, null, null]
        localStorage.setItem("searchHistory", JSON.stringify(historyLst))
        localStorage.setItem("initialized", "True")
    }
}
// initStorage()

import './App.css'
import {useEffect, useState} from 'react'
import {connect, Provider} from 'react-redux'
import store from './redux/store'
import {
    setCurrPage,
    setDisplayHistory,
    setInputBoxValue,
    setMaxPageNum,
    setRenderingList,
    setRenderingURL,
    setSearchHistory
} from "./redux/appStates";

import ProgressBar from "@ramonak/react-progress-bar";

const mapStateToProps = state => {
    return {
        currPageNum: state.currPageNum,
        maxPageNum: state.maxPageNum,
        inputBoxValue: state.inputBoxValue,
        renderingList: state.renderingList,
        renderingURL: state.renderingURL,
        searchHistory: state.searchHistory,
        displayHistory: state.displayHistory
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrPageNum: (newPageNum) => dispatch(setCurrPage(newPageNum)),
        setMaxPageNum: (newMaxPageNum) => dispatch(setMaxPageNum(newMaxPageNum)),
        setInputBoxValue: (newValue) => dispatch(setInputBoxValue(newValue)),
        setRenderingList: (newList) => dispatch(setRenderingList(newList)),
        setRenderingURL: (newURL) => dispatch(setRenderingURL(newURL)),
        setSearchHistory: (newList) => dispatch(setSearchHistory(newList)),
        setDisplayHistory: (bool) => dispatch(setDisplayHistory(bool))
    }
}

function SearchResultContainer(props) {
    const resultList = props.renderingList.map(img => <img key={img.id} className="searchEntry" onClick={() => {
        props.setRenderingURL(img.urls.regular)
    }} src={img.urls.regular}></img>)

    return (
        <div className="searchResultContainer">
            {resultList}
        </div>
    )
}

const ConnectedSearchResultContainer = connect(mapStateToProps, mapDispatchToProps)(SearchResultContainer)

function ThumbnailContainer(props) {

    function handleLeftBtn() {

        if (props.currPageNum > 1) {
            props.setCurrPageNum(props.currPageNum - 1)
        }
    }

    function handleRightBtn() {
        if (props.currPageNum < props.maxPageNum) {
            props.setCurrPageNum(props.currPageNum + 1)
        }
    }

    function LeftBtn(props) {
        if (props.currPageNum === 1) {
            return null
        } else {
            return <button className="leftBtn" type="button" onClick={handleLeftBtn}>&#10094;</button>
        }
    }

    const ConnectedLeftBtn = connect(mapStateToProps, mapDispatchToProps)(LeftBtn)


    function RightBtn(props) {
        if (props.currPageNum === props.maxPageNum) {
            return null
        } else {
            return <button className="rightBtn" type="button" onClick={handleRightBtn}>&#10095;</button>
        }
    }

    const ConnectedRightBtn = connect(mapStateToProps, mapDispatchToProps)(RightBtn)


    function PageNumberIndex(props) {

        const indexList = []
        for (let i = Math.max(props.currPageNum - 2, 1); i <= Math.min(props.currPageNum + 2, props.maxPageNum); i++) {
            if (i === props.currPageNum) {
                indexList.push(
                    <li key={i} className="currPageIndexButton" onClick={() => {
                        props.setCurrPageNum(i)
                    }}>{i}</li>
                )
            } else {
                indexList.push(
                    <li key={i} className="pageIndexButtons" onClick={() => {
                        props.setCurrPageNum(i)
                    }}>{i}</li>
                )
            }

        }

        return (
            <ul className="pageNumberContainer">
                {indexList}
            </ul>
        )
    }

    const ConnectedPageNumberIndex = connect(mapStateToProps, mapDispatchToProps)(PageNumberIndex)


    return (
        <div className="naviBarContainer">
            <div className="thumbnailContainer">
                <ConnectedLeftBtn/>
                <ConnectedSearchResultContainer searchEntryOnClick={props.searchEntryOnClick}/>
                <ConnectedRightBtn/>
            </div>
            <ConnectedPageNumberIndex/>
        </div>

    )
}

const ConnectedThumbnailContainer = connect(mapStateToProps, mapDispatchToProps)(ThumbnailContainer)


function SearchBarInputBox(props) {

    return (
        <input value={props.inputBoxValue} onFocus={() => props.setDisplayHistory(true)} type="text"
               placeholder="Input Key Words ..." className="searchBarInputBox"
               onChange={(e) => props.setInputBoxValue(e.target.value)}></input>
    )
}

const ConnectedSearchBarInputBox = connect(mapStateToProps, mapDispatchToProps)(SearchBarInputBox)


function SearchBtn({searchBtnOnClick}) {
    return (
        <button className="searchBtn" onClick={searchBtnOnClick}>Search</button>
    )
}

function SearchButtonLi(props) {
    function deleteSearchHistory(keyword) {
        const currValueIndex = props.searchHistory.indexOf(keyword)
        let searchHistoryTmp = [...props.searchHistory]
        searchHistoryTmp.splice(currValueIndex, 1)
        searchHistoryTmp.push(null)
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryTmp))
        props.setSearchHistory(searchHistoryTmp)
    }


    return (
        <div>
            <li className="searchHistoryEntry" onClick={() => {
                props.setInputBoxValue(props.entry)
            }}>{props.entry}</li>
            <span className="deleteBtn" onClick={() => deleteSearchHistory(props.entry)}>X</span>
        </div>
    )
}

const ConnectedSearchButtonLi = connect(mapStateToProps, mapDispatchToProps)(SearchButtonLi)

function SearchHistory(props) {
    if (!props.displayHistory) {
        return null
    }

    const searchHistoryList = JSON.parse(localStorage.getItem("searchHistory")).map(entry => entry === null ? null :
        <ConnectedSearchButtonLi key={entry} entry={entry}/>)

    return (
        <ul className={"searchHistoryBox"} onClick={e => {
            e.stopPropagation()
        }}>
            {searchHistoryList}
        </ul>
    )
}

const ConnectedSearchHistory = connect(mapStateToProps, mapDispatchToProps)(SearchHistory)

function SearchBarContainer(props) {

    return (
        <div>
            <div className="searchBarContainer" onClick={e => {
                e.stopPropagation()
            }}>
                <ConnectedSearchBarInputBox/>
                <SearchBtn searchBtnOnClick={props.searchBtnOnClick}/>
            </div>
            <div className="searchHistoryContainer">
                <ConnectedSearchHistory/>
            </div>
        </div>

    )
}

const ConnectedSearchBarContainer = connect(mapStateToProps, mapDispatchToProps)(SearchBarContainer)


function ImageBrowserContainer(props) {
    const [progressCounter, setProgressCounter] = useState(0)

    async function search() {
        const fetchURL = "https://api.unsplash.com/search/photos?page=" + props.currPageNum.toString() + "&query=" + props.inputBoxValue + "&client_id=JyL04GY33kzOvM5XrcJCNIHVz7SYScaiA8trI8_DHnM"

        try {
            if (props.inputBoxValue !== "") {
                let response = await fetch(fetchURL)
                if (response.ok) {
                    let data = await response.json()

                    let totalPages = await data.total_pages
                    props.setMaxPageNum(totalPages)
                    props.setRenderingList(data.results)

                    const currValueIndex = props.searchHistory.indexOf(props.inputBoxValue)
                    if (currValueIndex === -1) {
                        props.searchHistory.pop()
                        props.searchHistory.unshift(props.inputBoxValue)
                    } else {
                        props.searchHistory.splice(currValueIndex, 1)
                        props.searchHistory.unshift(props.inputBoxValue)
                    }
                    localStorage.setItem("searchHistory", JSON.stringify(props.searchHistory))
                    props.setDisplayHistory(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function searchBtnOnClick() {
        search()
    }


    useEffect(() => {
        if (props.renderingList.length > 0) {
            props.setRenderingURL(props.renderingList[0].urls.regular)
        } else {
            props.setRenderingURL("")
        }
    }, [props.renderingList])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setProgressCounter(0)
            const annoFcn = async () => {
                await search()
            }
            annoFcn()
        }, 800)
        return () => {
            clearTimeout(timeout)
        }
    }, [props.inputBoxValue])

    useEffect(() => {
        progressCounter < 100 && setTimeout(() => setProgressCounter(progressCounter + (100 - progressCounter) / 15 + 2), 10);
    }, [progressCounter]);

    useEffect(() => {
        const annoFcn = async () => {
            await search()
        }
        annoFcn()
    }, [props.currPageNum])

    return (
        <div className="imageBrowserContainer" style={{backgroundImage: "url(" + props.renderingURL + ")"}}
             onClick={() => props.setDisplayHistory(false)}>
            <ProgressBar height={"3px"} borderRadius={"0"} className="progressBar" isLabelVisible={false}
                         bgColor={"#2a9df4"} completed={progressCounter} transitionDuration={"0s"}/>
            <ConnectedSearchBarContainer searchBtnOnClick={searchBtnOnClick}/>
            <ConnectedThumbnailContainer/>
        </div>
    )
}

const ConnectedImageBrowserContainer = connect(mapStateToProps, mapDispatchToProps)(ImageBrowserContainer)

function MainSection() {
    return (
        <section>
            <Provider store={store}>
                <ConnectedImageBrowserContainer/>
            </Provider>
        </section>
    )
}

export default function App() {
    return (
        <MainSection/>
    )
}

function initStorage() {
    if (localStorage.getItem("initialized") !== "True") {
        let historyLst = [null, null, null, null, null, null, null, null, null, null]
        localStorage.setItem("searchHistory", JSON.stringify(historyLst))
        localStorage.setItem("initialized", "True")
    }
}

// initStorage()

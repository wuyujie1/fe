import './App.css'
import {useEffect, useState} from 'react'
import {connect, Provider} from 'react-redux'
import store from './redux/store'
import {
    setCurrPage, setDisplayFontOptions,
    setDisplayHistory,
    setInputBoxValue,
    setMaxPageNum,
    setRenderingList,
    setRenderingURL,
    setSearchHistory, setSelectedImages
} from "./redux/appStates";

import ProgressBar from "@ramonak/react-progress-bar";
import jsPDF from "jspdf";

const mapStateToProps = state => {
    return {
        currPageNum: state.currPageNum,
        maxPageNum: state.maxPageNum,
        inputBoxValue: state.inputBoxValue,
        renderingList: state.renderingList,
        renderingURL: state.renderingURL,
        searchHistory: state.searchHistory,
        displayHistory: state.displayHistory,
        selectedImages: state.selectedImages,
        displayFontOptions: state.displayFontOptions
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
        setDisplayHistory: (bool) => dispatch(setDisplayHistory(bool)),
        setSelectedImages: (newList) => dispatch(setSelectedImages(newList)),
        setDisplayFontOptions: (bool) => dispatch(setDisplayFontOptions(bool))
    }
}

function SearchResultContainer(props) {
    function SearchResult (props) {
        function onchange(e){
            let selectedImagesTemp = [...props.selectedImages]
            if (e.target.checked) {
                selectedImagesTemp.push(props.img.urls.regular)
            } else {
                const currValueIndex = selectedImagesTemp.indexOf(props.img.urls.regular)
                selectedImagesTemp.splice(currValueIndex, 1)
            }
            props.setSelectedImages(selectedImagesTemp)
        }

        function check() {
            return props.selectedImages.indexOf(props.img.urls.regular) !== -1
        }
        return (
            <span>
                <img className="searchEntry" onClick={() => {props.setRenderingURL(props.img.urls.regular)}} src={props.img.urls.regular}></img>
                <input className="searchEntryCheckBox" type={"checkbox"} checked={check()} onChange={(e) => onchange(e)}></input>
            </span>
        )
    }
    const ConnectedSearchResult = connect(mapStateToProps, mapDispatchToProps)(SearchResult)

    const resultList = props.renderingList.map(img => <ConnectedSearchResult key={img.urls.regular} img={img}></ConnectedSearchResult>)

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

function SelectedPDFImagesContainer (props) {
    const [currFont, setCurrFont] = useState("Courier")

    function PDFEntry(props){
        const [opacity, setOpacity] = useState(1)

        function deleteOnClick () {
            let selectedImagesTemp = [...props.selectedImages]
            const currValueIndex = selectedImagesTemp.indexOf(props.url)
            selectedImagesTemp.splice(currValueIndex, 1)
            props.setSelectedImages(selectedImagesTemp)
        }

        return (
            <span>
                <img className="PDFEntry" src={props.url} style={{opacity: opacity}}></img>
                <button className="hoverDelete" type="button" onClick={deleteOnClick} onMouseOver={() => {setOpacity(0.5)}} onMouseOut={() => setOpacity(1)}>x</button>
            </span>
        )
    }

    function compileBtnOnClick () {
        let usrInput = window.prompt("Please enter a title!")

        const doc = new jsPDF('l', 'mm', [1855, 1118]);
        doc.deletePage(1);

        props.selectedImages.forEach((image) => {
            doc.addPage();
            doc.addImage(
                image,
                "JPEG",
                0,
                0,
                1855,
                1118
            );
            doc.setFontSize(100)
            doc.setFont(currFont);
            doc.setTextColor(255,255,255);
            doc.text(usrInput, 80, 100)
        });

        console.log(doc.getFontList())

        const pdfURL = doc.output("bloburl");
        window.open(pdfURL, "_blank");
    }

    const ConnectedPDFEntry = connect(mapStateToProps, mapDispatchToProps)(PDFEntry)

    if (props.selectedImages.length === 0) {
        return null
    }

    const resultList = props.selectedImages.map(img => <ConnectedPDFEntry key={img} url={img}></ConnectedPDFEntry>)

    function FontSelector(props) {
        let pdf = new jsPDF()
        let fontList = []
        if (props.displayFontOptions) {
            function fontEntryOnClick (fontListKey) {
                setCurrFont(fontListKey)
                props.setDisplayFontOptions(false)
            }

            let i = 0;
            for (let fontListKey in pdf.getFontList()) {
                if (i % 2 === 1){
                    fontList.push(<li className="fontEntry" key={fontListKey} onClick={() => {fontEntryOnClick(fontListKey)}}>{fontListKey}</li>)
                }
                i++
            }
        }
        function downArrowOnClick (e) {
            e.stopPropagation()
            if (props.displayFontOptions) {
                props.setDisplayFontOptions(false)
            } else {
                props.setDisplayFontOptions(true)
            }
        }

        function DownArrow(props) {
            if (props.displayFontOptions) {
                return (
                    <button className="downArrow" onClick={(e) => {downArrowOnClick(e)}}>&#8679;</button>
                )
            } else {
                return (
                    <button className="downArrow" onClick={(e) => {downArrowOnClick(e)}}>&#8681;</button>
                )
            }
        }
        const ConnectedDownArrow = connect(mapStateToProps, mapDispatchToProps)(DownArrow)

        return (
            <div className="fontSelector">
                <button className="currFont">{currFont}</button>
                <ConnectedDownArrow/>
                <ul className="dropdownContent">
                    {fontList}
                </ul>
            </div>

        )

    }
    const ConnectedFontSelector = connect(mapStateToProps, mapDispatchToProps)(FontSelector)



    return (
        <div className="PDFGeneratorSection">
            <div className="Btns">
                <button className="PDFResetBtn" type={"button"} onClick={() => {props.setSelectedImages([])}}>RESET</button>
                <button className="PDFCompileBtn" type={"button"} onClick={compileBtnOnClick}>Generate PDF</button>
                <ConnectedFontSelector></ConnectedFontSelector>
            </div>
            <ul style={{backgroundColor: "rgba(80, 80, 80, 0.3)"}}>
                {resultList}
            </ul>
        </div>
    )
}
const ConnectedSelectedPDFImagesContainer = connect(mapStateToProps, mapDispatchToProps)(SelectedPDFImagesContainer)


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

    function bodyOnClick() {
        props.setDisplayHistory(false)
        props.setDisplayFontOptions(false)
    }

    return (
        <div>
            <div className="imageBrowserContainer" style={{backgroundImage: "url(" + props.renderingURL + ")"}}
                 onClick={bodyOnClick}>
                <ProgressBar height={"3px"} borderRadius={"0"} className="progressBar" isLabelVisible={false}
                             bgColor={"#2a9df4"} completed={progressCounter} transitionDuration={"0s"}/>
                <ConnectedSearchBarContainer searchBtnOnClick={searchBtnOnClick}/>
                <ConnectedThumbnailContainer/>
            </div>
            <ConnectedSelectedPDFImagesContainer/>
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

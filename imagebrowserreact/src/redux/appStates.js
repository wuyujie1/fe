const SET_PAGE = "SET_PAGE"
const SET_MAX_PAGE = "SET_MAX_PAGE"
const SET_INPUT_BOX_VALUE = "SET_INPUT_BOX_VALUE"
const SET_RENDERING_LIST = "SET_RENDERING_LIST"
const SET_RENDERING_URL = "SET_RENDERING_URL"
const SET_SEARCH_HISTORY = "SET_SEARCH_HISTORY"
const SET_DISPLAY_HISTORY = "SET_DISPLAY_HISTORY"

export const setCurrPage = (newPageNum) => {
    return {
        type: SET_PAGE,
        newPage: newPageNum
    }
}

export const setMaxPageNum = (newMaxPageNum) => {
    return {
        type: SET_MAX_PAGE,
        newMaxPage: newMaxPageNum
    }
}

export const setInputBoxValue = (newValue) => {
    return {
        type: SET_INPUT_BOX_VALUE,
        newInputBoxValue: newValue
    }
}

export const setRenderingList = (newRenderingList) => {
    return {
        type: SET_RENDERING_LIST,
        newRenderingList: newRenderingList
    }
}

export const setRenderingURL = (newRenderingURL) => {
    return {
        type: SET_RENDERING_URL,
        newRenderingURL: newRenderingURL
    }
}

export const setSearchHistory = (newHistoryList) => {
    return {
        type: SET_SEARCH_HISTORY,
        newHistoryList: newHistoryList
    }
}

export const setDisplayHistory = (bool) => {
    return {
        type: SET_DISPLAY_HISTORY,
        displayHistory: bool
    }
}

const initialState = {
    currPageNum: 1,
    maxPageNum: 1,
    inputBoxValue: "",
    renderingList: [],
    renderingURL: "",
    searchHistory: JSON.parse(localStorage.getItem("searchHistory")),
    displayHistory: false
}
const appStateReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PAGE: return {
            ...state,
            currPageNum: action.newPage
        }
        case SET_MAX_PAGE: return {
            ...state,
            maxPageNum: action.newMaxPage
        }
        case SET_INPUT_BOX_VALUE: return {
            ...state,
            inputBoxValue: action.newInputBoxValue,
            currPageNum: 1
        }
        case SET_RENDERING_LIST: return {
            ...state,
            renderingList: action.newRenderingList
        }
        case SET_RENDERING_URL: return {
            ...state,
            renderingURL: action.newRenderingURL
        }
        case SET_SEARCH_HISTORY: return {
            ...state,
            searchHistory: action.newHistoryList
        }
        case SET_DISPLAY_HISTORY: return {
            ...state,
            displayHistory: action.displayHistory
        }
        default: return state
    }
}
export default appStateReducer
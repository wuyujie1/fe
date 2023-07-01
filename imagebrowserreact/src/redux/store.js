import {createStore} from 'redux'
import appStateReducer from "./appStates";

const store = createStore(appStateReducer)

export default store
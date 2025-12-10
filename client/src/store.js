import { configureStore, combineReducers } from '@reduxjs/toolkit'
import prodSlice from './redux/slices/prodSlice'

const reducer = combineReducers({
     prodSlice: prodSlice
})



const store = configureStore({reducer})


export default store;  

//----------------> react app main.jsx
// store slice -(state + action creator + reducer(bank employee))

// dispatch 
// action-customer
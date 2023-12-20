// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiEndpoint } from '../../../../@core/auth/jwt/jwtDefaultConfig'

// ** Axios Imports
import axios from 'axios'

export const getAllData = createAsyncThunk('appCollections/getAllData', async () => {
  const response = await axios.get(`${apiEndpoint}/api/collections`)
  console.log(response.data)
  return response.data
})

export const getData = createAsyncThunk('appCollections/getData', async params => {
  const response = await axios.get(`${apiEndpoint}/api/collections/data?perPage=${params.perPage}&page=${params.page}`)
  console.log(response)
  return {
    params,
    data: response.data.data,
    totalPages: response.data.last_page
  }
})

export const getCollection = createAsyncThunk('appCollections/getCollection', async id => {
  const response = await axios.get(`${apiEndpoint}/api/collections/${id}`)
  console.log(response)
  return response.data
})

export const updateCollection = createAsyncThunk('appCollections/updateCollection', async ({id, collection}, { dispatch, getState }) => {
  console.log(collection)
  const formData = new FormData()
  for (const key in collection) {
    if (collection.hasOwnProperty(key)) {
      formData.append(key, collection[key])
    }
  }
  console.log(formData)
  await axios.post(`${apiEndpoint}/api/collections/update/${id}`, formData)
  await dispatch(getCollection(id))
  await dispatch(getData(getState().collections.params))
  await dispatch(getAllData())
  return collection 
})

export const addCollection = createAsyncThunk('appCollections/addCollection', async (collection, { dispatch, getState }) => {
  console.log(collection)
  const formData = new FormData()
  for (const key in collection) {
    if (collection.hasOwnProperty(key)) {
      formData.append(key, collection[key])
    }
  }
  console.log(formData)
  await axios.post(`${apiEndpoint}/api/collections/`, formData)
  await dispatch(getData(getState().collections.params))
  await dispatch(getAllData())
  return collection 
})

export const deleteCollection = createAsyncThunk('appCollections/deleteCollection', async (id, { dispatch, getState }) => {
  await axios.delete(`${apiEndpoint}/api/collections/delete/${id}`)
  await dispatch(getData(getState().users.params))
  await dispatch(getAllData())
  return id
})

export const appCollectionsSlice = createSlice({
  name: 'appCollections',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selectedCollection: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllData.fulfilled, (state, action) => {
        state.allData = action.payload
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.total = action.payload.totalPages
      })
      .addCase(getCollection.fulfilled, (state, action) => {
        state.selectedCollection = action.payload
      })
  }
})

export default appCollectionsSlice.reducer

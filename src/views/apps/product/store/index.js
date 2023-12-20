// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiEndpoint } from '../../../../@core/auth/jwt/jwtDefaultConfig'

// ** Axios Imports
import axios from 'axios'

export const getAllData = createAsyncThunk('appProducts/getAllData', async () => {
  const response = await axios.get(`${apiEndpoint}/api/products`)
  console.log(response.data)
  return response.data
})

export const getData = createAsyncThunk('appProducts/getData', async params => {
  const response = await axios.get(`${apiEndpoint}/api/products/data?perPage=${params.perPage}&page=${params.page}`)
  console.log(response)
  return {
    params,
    data: response.data.data,
    totalPages: response.data.last_page
  }
})

export const getProduct = createAsyncThunk('appProducts/getproduct', async id => {
  const response = await axios.get(`${apiEndpoint}/api/products/${id}`)
  console.log(response)
  return response.data
})

export const updateProduct = createAsyncThunk('appProducts/updateproduct', async ({id, product}, { dispatch, getState }) => {
  console.log(product)
  const formData = new FormData()
  for (const key in product) {
    if (product.hasOwnProperty(key)) {
      if (key === 'image') {
        console.log(product.image)
        product.image.forEach((file) => {
          console.log(file)
          formData.append('image[]', file)
        })
      } else {
        formData.append(key, product[key])
      }
    }
  }
  console.log(formData)
  await axios.post(`${apiEndpoint}/api/products/update/${id}`, formData)
  await dispatch(getproduct(id))
  await dispatch(getData(getState().products.params))
  await dispatch(getAllData())
  return product 
})

export const addProduct = createAsyncThunk('appProducts/addProduct', async (product, { dispatch, getState }) => {
  console.log(product)
  const formData = new FormData()
  for (const key in product) {
    if (product.hasOwnProperty(key)) {
      if (key === 'image') {
        console.log(product.image)
        product.image.forEach((file) => {
          console.log(file)
          formData.append('image[]', file)
        })
      } else {
        formData.append(key, product[key])
      }
    }
  }
  console.log(formData)
  await axios.post(`${apiEndpoint}/api/products/`, formData)
  await dispatch(getData(getState().products.params))
  await dispatch(getAllData())
  return product 
})

export const deleteProduct = createAsyncThunk('appProducts/deleteproduct', async (id, { dispatch, getState }) => {
  await axios.delete(`${apiEndpoint}/api/products/delete/${id}`)
  await dispatch(getData(getState().products.params))
  await dispatch(getAllData())
  return id
})

export const appProductsSlice = createSlice({
  name: 'appProducts',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selectedProduct: null
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
      .addCase(getProduct.fulfilled, (state, action) => {
        state.selectedProduct = action.payload
      })
  }
})

export default appProductsSlice.reducer

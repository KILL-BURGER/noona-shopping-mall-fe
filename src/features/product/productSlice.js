import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../utils/api";
import {showToastMessage} from "../common/uiSlice";
import {cat} from "@cloudinary/url-gen/qualifiers/focusOn";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, {rejectWithValue}) => {
    try {
      const response = await api.get('/product', {params: {...query}});
      return response.data;
    } catch (error) {
      rejectWithValue(error.error);
    }
  }
);

// 상품 생성
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, {dispatch, rejectWithValue}) => {
    try {
      const response = await api.post('/product', formData);
      dispatch(showToastMessage({message: '상품 생성 완료', status: 'success'}));
      dispatch(getProductList({page: 1}));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

// 상품 수정
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({id, ...formData}, {dispatch, rejectWithValue}) => {
    try {
      const response = await api.put(`/product/${id}`, formData);
      dispatch(getProductList({page: 1}));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

// 상품 삭제
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, {dispatch, rejectWithValue}) => {
    try {
      const response = await api.delete(`/product/${id.id}`);
      dispatch(showToastMessage({message: '상품 삭제 완료', status: 'success'}));
      dispatch(getProductList({page: 1}));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

// 상품 디테일 페이지
export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, {dispatch, rejectWithValue}) => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending, (state, action) => {
      state.loading = true;
    }).addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.success = true; // 상품 생성을 성공했다 ? -> 다이얼로그를 닫고, 실패? 실패 메시지를 다이어로그에 보여줌
    }).addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })

      .addCase(getProductList.pending, (state, action) => {
        state.loading = true;
      }).addCase(getProductList.fulfilled, (state, action) => {
      state.loading = false;
      state.productList = action.payload.data;
      state.error = '';
      state.totalPageNum = action.payload.totalPageNum;
    }).addCase(getProductList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

      .addCase(editProduct.pending, (state, action) => {
      state.loading = true;
    }).addCase(editProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.success = true;
    }).addCase(editProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    }).addCase(getProductDetail.pending, (state, action) => {
      state.loading = true;
    }).addCase(getProductDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
      state.success = true;
      state.selectedProduct = action.payload; // 데이터 저장 꼭 해주기..! 빼먹지 말자.
    }).addCase(getProductDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
  },
});

export const {setSelectedProduct, setFilteredList, clearError} =
  productSlice.actions;
export default productSlice.reducer;

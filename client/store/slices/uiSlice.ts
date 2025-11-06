import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark'

type UiState = {
  theme: ThemeMode
  isBusy: boolean
}

const initialState: UiState = {
  theme: 'light',
  isBusy: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload
    },
    setBusy(state, action: PayloadAction<boolean>) {
      state.isBusy = action.payload
    },
  },
})

export const { setTheme, setBusy } = uiSlice.actions
export default uiSlice.reducer



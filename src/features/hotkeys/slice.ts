import { createSlice } from '@reduxjs/toolkit';
import { noPayload } from '@skybrush/redux-toolkit';

type HotkeysSliceState = {
  dialogVisible: boolean;
};

const initialState: HotkeysSliceState = {
  dialogVisible: false,
};

const { actions, reducer } = createSlice({
  name: 'hotkeys',
  initialState,
  reducers: {
    showHotkeyDialog: noPayload<HotkeysSliceState>((state) => {
      state.dialogVisible = true;
    }),

    closeHotkeyDialog: noPayload<HotkeysSliceState>((state) => {
      state.dialogVisible = false;
    }),
  },
});

export const { closeHotkeyDialog, showHotkeyDialog } = actions;

export default reducer;

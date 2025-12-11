import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppStore, RootState, store } from '~/store';

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

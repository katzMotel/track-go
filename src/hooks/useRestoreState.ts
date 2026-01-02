import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { restoreFilters } from '@/store/slices/filtersSlice';
import { restoreUI } from '@/store/slices/uiSlice';
import { restoreMap } from '@/store/slices/mapSlice';
import { loadState } from '@/utils/localStorage';

export function useRestoreState() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const persistedState = loadState();
    
    if (persistedState) {
      if (persistedState.filters) {
        dispatch(restoreFilters(persistedState.filters));
      }
      if (persistedState.ui) {
        dispatch(restoreUI(persistedState.ui));
      }
      if (persistedState.map) {
        dispatch(restoreMap(persistedState.map));
      }
    }
  }, [dispatch]);
}
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import teamReducer from './features/team/teamSlice';
import themeReducer from './features/theme/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    team: teamReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
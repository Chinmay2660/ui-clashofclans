import { configureStore } from '@reduxjs/toolkit';
import { 
  playerReducer, 
  clanReducer, 
  uiReducer, 
  rankingsReducer, 
  leaguesReducer 
} from './slices';

const store = configureStore({
  reducer: {
    player: playerReducer,
    clan: clanReducer,
    ui: uiReducer,
    rankings: rankingsReducer,
    leagues: leaguesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

import { configureStore } from '@reduxjs/toolkit';
import accountInfo from './accountInfo';
import favoriteList, { getFavoriteList } from './favoriteList';
import loading from './loading';
import colorMode from './colorMode';

const store = configureStore({
	reducer: {
		accountInfo,
		favoriteList,
		loading,
		colorMode
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			thunk: {
				extraArgument: getFavoriteList
			}
		})
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;

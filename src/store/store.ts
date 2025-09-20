import { configureStore } from '@reduxjs/toolkit';
import preferenceSlice from './preferences/slice';
import classesSlice from './classes/slice';
import subscriptionSlice from './subscription/slice';
import accountSlice from './account/slice';
import attendanceSlice from './attendance/slice';
import teacherSlice from './teacher/slice';
import attendanceHistorySlice from './attendanceHistory/slice';

const store = configureStore({
	reducer: {
		preference: preferenceSlice.reducer,
		classes: classesSlice.reducer,
		subscription: subscriptionSlice.reducer,
		account: accountSlice.reducer,
		attendance: attendanceSlice.reducer,
		attendanceHistory: attendanceHistorySlice.reducer,
		teacher: teacherSlice.reducer
	},
});


export type rootState = ReturnType<typeof store.getState>;

export default store
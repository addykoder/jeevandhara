import { CaseReducer, createSlice } from '@reduxjs/toolkit';
import { getSubscriptionStatus, pending as getStatusPending, rejected as getStatusRejected, fulfilled as getStatusFulfilled } from './getSubscriptionStatus';
import { getSubscriptionHistory, pending as getHistoryPending, rejected as getHistoryRejected, fulfilled as getHistoryFulfilled } from './getSubscriptionHistory';

const initialState: stateType = {
	fetchingStatus: 'standby',
	fetchingHistory: 'standby',
	fetchHistoryMessage: '',
	fetchStatusMessage: '',
	data: {
		history: [],
		status: ''
	},
};

export interface stateType {
	fetchingStatus: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	fetchingHistory: 'standby' | 'pending' | 'rejected' | 'fulfilled';
	fetchHistoryMessage: string;
	fetchStatusMessage: string;
	data: {
		history: object[]
		status: string
	};
}

const subscriptionSlice = createSlice({
	name: 'subscription',
	initialState,
	reducers: {},
	extraReducers: builder => {
		// for fetching preferences
		builder.addCase(getSubscriptionStatus.pending, getStatusPending as CaseReducer);
		builder.addCase(getSubscriptionStatus.rejected, getStatusRejected as CaseReducer);
		builder.addCase(getSubscriptionStatus.fulfilled, getStatusFulfilled as unknown as CaseReducer);
		// for updating preferences
		builder.addCase(getSubscriptionHistory.pending, getHistoryPending as CaseReducer);
		builder.addCase(getSubscriptionHistory.rejected, getHistoryRejected as CaseReducer);
		builder.addCase(getSubscriptionHistory.fulfilled, getHistoryFulfilled as unknown as CaseReducer);
	},
});

export default subscriptionSlice;

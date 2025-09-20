import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';

type expectedAPIResponseType = { status: string; message: string; payload: object[] }

export const getSubscriptionHistory = createAsyncThunk('subscription/getHistory', fetchSubscriptionHistory);

async function fetchSubscriptionHistory() {
	try {
		const resp = await axios.get(`${serverURL}/subscription/history`);
		return resp.data;
	} catch (e) {
		console.log('some error subscription/getHistory thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.fetchingHistory = 'pending';
}

export function rejected(state: stateType) {
	state.fetchingHistory = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType}) {

	if (payload.status === 'ok') {
		state.data.history = payload.payload;
		state.fetchingHistory = 'fulfilled';
		state.fetchHistoryMessage = payload.message;

	} else {
		state.fetchingHistory = 'rejected';
		state.fetchHistoryMessage = payload.message;
	}
}

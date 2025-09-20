import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import { accountInfoType } from '../../utils/types';
import { stateType } from './slice';

type expectedAPIResponseType = { status: string; message: string; payload: accountInfoType}

export const getAccountInfo = createAsyncThunk('account/getInfo', fetchAccountInfo);

async function fetchAccountInfo() {
	try {
		const resp = await axios.post(`${serverURL}/auth/verifyLogin`);
		return resp.data;
	} catch (e) {
		console.log('some error account/getInfo thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.fetching = 'pending';
}

export function rejected(state: stateType) {
	state.fetching = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType}) {

	if (payload.status === 'ok') {
		state.data = payload.payload;
		state.fetching = 'fulfilled';
		state.fetchMessage = payload.message;

	} else {
		state.fetching = 'rejected';
		state.fetchMessage = payload.message;
	}
}

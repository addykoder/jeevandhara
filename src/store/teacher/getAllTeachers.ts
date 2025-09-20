import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';

type expectedAPIResponseType = { status: string; message: string; payload: { teachers: stateType['data'] } };

export const getAllTeachers = createAsyncThunk('teacher/getAll', fetchAllTeachers);

async function fetchAllTeachers() {
	try {
		const resp = await axios.get(`${serverURL}/teacher`);
		return resp.data;
	} catch (e) {
		console.log('some error teacher/getAll thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.fetching = 'pending';
}

export function rejected(state: stateType) {
	state.fetching = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType }) {
	if (payload.status === 'ok') {
		state.data = payload.payload.teachers;
		state.fetching = 'fulfilled';
		state.creating = 'standby'
		state.deleting = 'standby'
		state.updating = 'standby'
		state.fetchMessage = payload.message;
	} else {
		state.fetching = 'rejected';
		state.fetchMessage = payload.message;
	}
}

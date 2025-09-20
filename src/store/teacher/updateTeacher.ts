import { createAsyncThunk } from '@reduxjs/toolkit';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';
import axios from 'axios';
import { verifyTeacherDatatype } from '../../utils/types';

type expectedAPIResponseType = { status: string; message: string };

export const updateTeacher = createAsyncThunk('teacher/update', fetchUpdateTeacher);

async function fetchUpdateTeacher({ id, data }: { id: number; data: verifyTeacherDatatype }) {
	try {
		const resp = await axios.post(`${serverURL}/teacher/${id}`, data);
		return resp.data;
	} catch (e) {
		console.log('some error teacher/update thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.updating = 'pending';
}

export function rejected(state: stateType) {
	state.updating= 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType }) {
	if (payload.status === 'ok') {
		state.updating = 'fulfilled';
		state.updateMessage = payload.message;
	} else {
		state.updating = 'rejected';
		state.updateMessage = payload.message;
	}
}

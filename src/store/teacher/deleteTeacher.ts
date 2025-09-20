import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import { stateType } from './slice';

type expectedAPIResponseType = { status: string; message: string; payload: object };

export const deleteTeacher = createAsyncThunk('teacher/delete', fetchDeleteTeacher);

async function fetchDeleteTeacher(id:number) {
	try {
		const resp = await axios.delete(`${serverURL}/teacher/${id}`);
		return resp.data;
	} catch (e) {
		console.log('some error teacher/delete thunc callback function');
		return 'error';
	}
}

export function pending(state: stateType) {
	state.deleting = 'pending';
}

export function rejected(state: stateType) {
	state.deleting = 'rejected';
}

export function fulfilled(state: stateType, { payload }: { payload: expectedAPIResponseType }) {
	if (payload.status === 'ok') {
		state.deleting= 'fulfilled';
		state.deleteMessage = payload.message;
	} else {
		state.deleting = 'rejected';
		state.deleteMessage = payload.message;
	}
}

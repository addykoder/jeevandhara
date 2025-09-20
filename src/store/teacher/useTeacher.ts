import { AnyAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyTeacherDatatype } from '../../utils/types';
import { rootState } from '../store';
import { createTeacher } from './createTeacher';
import { deleteTeacher } from './deleteTeacher';
import { getAllTeachers } from './getAllTeachers';
import { stateType } from './slice';
import { updateTeacher } from './updateTeacher';

type hookReturnType = [stateType['data'], (id:number, data:verifyTeacherDatatype) => Promise<void>, (teacher: verifyTeacherDatatype) => Promise<void> , (id:number) => Promise<void>, string, string, string, string, string, string, string, string];

// custom hook for using the preference functionalities
export default function useTeacher(): hookReturnType {
	const dispatch = useDispatch();
	const { fetching, creating, updating, deleting, fetchMessage, createMessage, updateMessage, deleteMessage, data } = useSelector((state: rootState) => state.teacher);

	// initially fetching the preferences
	// only if not yet fetched
	useEffect(() => {
		if (fetching === 'standby') {
			dispatch(getAllTeachers() as unknown as AnyAction);
		}
	}, []);

	// refetching whenever the teacher is updated by the client
	useEffect(() => {
		if (updating === 'fulfilled' && fetching === 'fulfilled') {
			dispatch(getAllTeachers() as unknown as AnyAction);
		}
	}, [updating]);

	// refetching whenever the teacher is created by the client
	useEffect(() => {
		if (creating === 'fulfilled' && fetching === 'fulfilled') {
			dispatch(getAllTeachers() as unknown as AnyAction);
		}
	}, [creating]);

	// refetching whenever the teacher is deleted by the client
	useEffect(() => {
		if (deleting === 'fulfilled' && fetching === 'fulfilled') {
			dispatch(getAllTeachers() as unknown as AnyAction);
		}
	}, [deleting]);

	async function updateTeacherHandler(id:number, data: verifyTeacherDatatype) {
		dispatch(updateTeacher({id, data}) as unknown as AnyAction);
	}
	async function createTeacherHandler(teacher:verifyTeacherDatatype) {
		dispatch(createTeacher(teacher) as unknown as AnyAction);
	}
	async function deleteTeacherHandler(id:number) {
		dispatch(deleteTeacher(id) as unknown as AnyAction);
	}

	return [data, updateTeacherHandler, createTeacherHandler, deleteTeacherHandler, fetching, updating, creating, deleting, fetchMessage, updateMessage, createMessage, deleteMessage];
}

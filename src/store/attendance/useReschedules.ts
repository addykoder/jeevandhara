import { AnyAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../store';
import { getReschedules } from './getReschedules';
import { stateType } from './slice';
import { confirmReschedules } from './confirmReschedules';
import { submitAttendance } from './submitAttendance';
import { getAttendance } from './getAttendance';
import { regenerateReschedules } from './regenerateReschedules';

type hookReturnType = [stateType['data']['attendance'], stateType['data']['reschedules'], stateType['data']['notified'], () => Promise<void>, (attendance: {id:number, presentPeriods:number[]}[], day:number, preserve:boolean, preserveTill: number) => Promise<void>, string, string, string, string, string, string, string, string, number, boolean, number, ()=>Promise<void>];

// custom hook for using the reschedules functionalities
export default function useReschedules(): hookReturnType {
	const dispatch = useDispatch();
	const {
		fetchingReschedules,
		fetchingAttendance,
		confirmingReschedules,
		submittingAttendance,
		submitAttendanceMessage,
		fetchAttendanceMessage,
		confirmMessage,
		fetchReschedulesMessage,
		data,
	} = useSelector((state: rootState) => state.attendance);

	// initially fetching the reschedules
	useEffect(() => {
		// only if not already in the store
		if (fetchingReschedules === 'standby') {
			dispatch(getReschedules() as unknown as AnyAction);
		}
	}, []);

	// initially fetching the attendance
	useEffect(() => {
		// only if not already in the store
		if (fetchingAttendance === 'standby') {
			dispatch(getAttendance() as unknown as AnyAction);
		}
	}, []);

	// refetching the reschedules when attendance is submitted
	// and reschedules were already fetched
	
	useEffect(() => {
		// temporarily disabling the conditions
		// if (submittingAttendance === 'fulfilled' && fetchingReschedules === 'fulfilled') {
			
			dispatch(getReschedules() as unknown as AnyAction);
		// }
	}, [submittingAttendance]);

	// refetching the attendance when attendance is submitted
	// and attendance was already fetched
	useEffect(() => {
		if (submittingAttendance === 'fulfilled' && fetchingAttendance === 'fulfilled') {
			dispatch(getAttendance() as unknown as AnyAction);
		}
	}, [submittingAttendance]);

	async function confirmReschedulesHandler() {
		dispatch(confirmReschedules() as unknown as AnyAction);
	}

	async function submitAttendanceHandler(attendance: object[], day:number, preserve: boolean, preserveTill: number) {
		dispatch(submitAttendance({ attendance, day, preserve, preserveTill }) as unknown as AnyAction);
	}
	
	async function regenerateReschedulesHandler() {
		dispatch(regenerateReschedules() as unknown as AnyAction)
	}

	return [data.attendance, data.reschedules, data.notified, confirmReschedulesHandler, submitAttendanceHandler, fetchingReschedules, confirmingReschedules, fetchingAttendance, submittingAttendance, submitAttendanceMessage, confirmMessage, fetchAttendanceMessage, fetchReschedulesMessage, data.day, data.preserve, data.preserveTill, regenerateReschedulesHandler];
}

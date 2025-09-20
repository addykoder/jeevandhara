import { AnyAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLocalStorage from '../../hooks/useLocalStorage';
import { attendanceDatatype, reschedulesDatatype } from '../../utils/types';
import { rootState } from '../store';
import { getAttendanceHistory } from './getAttendanceHistory';

type hookReturnType = [{ date: string, attendanceHistory: { date: string, attendance:attendanceDatatype[], reschedules:reschedulesDatatype[] }[]}, string, string];

// custom hook for using the subsction Status functionalities
export default function useAttendanceHistory(): hookReturnType {
	const dispatch = useDispatch();
	const { data, fetching, fetchMessage } = useSelector((state: rootState) => state.attendanceHistory);

	const date = new Date().toISOString().slice(0, 10);
	const [savedData, setSavedData] = useLocalStorage('attendanceHistory', { date });

	useEffect(() => {
		// initially checking if history is NOT saved in localStorage
		if (savedData.date !== date || savedData.attendanceHistory === undefined) {
			// fetch history
			dispatch(getAttendanceHistory() as unknown as AnyAction);
		}
	}, []);

	useEffect(() => { 
		// when attendance history is fetched
		if (fetching === 'fulfilled') {
			setSavedData({date, attendanceHistory:data})
		}
	}, [fetching])

	return [savedData, fetching, fetchMessage];
}

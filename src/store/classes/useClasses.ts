import { AnyAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../store';
import { getClasses } from './getClasses';
import { stateType } from './slice';
import { updateClasses } from './updateClasses';

type hookReturnType = [stateType['data'], (classes: stateType['data']) => Promise<void>, string, string, string, string, ()=>void];

// custom hook for using the classes functionalities
export default function useClasses(): hookReturnType {
	const dispatch = useDispatch();
	const { fetching, updating, updateMessage, fetchMessage, data } = useSelector((state: rootState) => state.classes);

	// initially fetching the classes
	// only if data is not yet fetched
	useEffect(() => {
		if (fetching === 'standby') {
			dispatch(getClasses() as unknown as AnyAction);
		}
	}, []);

	// refetching whenever the classes are updated by the client
	// and the classes were already fetched
	useEffect(() => {
		if (updating === 'fulfilled' && fetching === 'fulfilled') {
			dispatch(getClasses() as unknown as AnyAction);
		}
	}, [updating]);

	async function updateClassesHandler(classes: stateType['data']) {
		dispatch(updateClasses(classes) as unknown as AnyAction);
	}
	function refetch() {
		dispatch(getClasses() as unknown as AnyAction);
	}

	return [data, updateClassesHandler, fetching, updating, updateMessage, fetchMessage, refetch];

}

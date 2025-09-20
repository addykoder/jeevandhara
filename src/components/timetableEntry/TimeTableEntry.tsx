import { useMemo } from 'react';
import useClasses from '../../store/classes/useClasses';
import { classesObjectType as classType, teacherTimetable } from '../../utils/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TimetableEntry({ classes, periods, timetable, setTimetable, pub }: { periods: number[]; timetable: teacherTimetable; setTimetable: any, classes?:classType[], pub?:boolean }) {


	return (
			<div className='timeTable'>
				<div className='timetable-entry'>
					<table>
						<thead style={{ opacity: '0.6' }}>
							<tr>
								<th>Day</th>
								{periods.map(p => (
									<th key={p}>{p}</th>
								))}
							</tr>
						</thead>

						<tbody>
							{Object.keys(timetable).map(day => {
								if (day === '_id') return;
								return (
									<tr key={day}>
										<td style={{ opacity: '0.6', textTransform: 'uppercase' }}>{day}</td>
										<TimetableRowEntry pub={pub} classes={classes} day={day} row={timetable[day]} setTimetable={setTimetable} />
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TimetableRowEntry({ row, day, setTimetable, classes, pub }: {pub?:boolean, row: string[]; day: string; setTimetable: any, classes?:classType[] }) {
	return (
		<>
			{row.map((item, index) => {
				return (
					<td key={`${day}-${index}`}>
						{/* the mode is selected from localstorage, means user has to manually set the localstorage to use text input */}
						<ClassSelector pub={pub} classesGiven={classes} value={item} day={day} setTimetable={setTimetable} period={index} mode={localStorage.getItem('mode') === 'text' ? 'text' : 'select'} />
					</td>
				);
			})}
		</>
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ClassSelector({pub, value, setTimetable, day, period, mode = 'select', classesGiven }: {pub?:boolean, value: string; setTimetable: any; day: string; period: number; mode?: 'select' | 'text', classesGiven?:classType[] }) {

	const classes =  classesGiven || useClasses()[0]
	const allClasses = useMemo(() =>classes.map(c => c.name), [classes])

	function updateTimetable(event: object, value?: string) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		setTimetable((timetable: any) => {
			const e = Object(event);
			const todayTimetable = [...timetable[day]];
			todayTimetable[period] = value || e.target.value;
			const toRet = { ...timetable };
			toRet[day] = todayTimetable;
			return toRet;
		});
	}
	const color = value === 'free' ? 'rgba(124, 124, 124, 0.6)' : value === 'busy' ? 'rgba(255, 125, 125, 0.5)' : 'var(--color-accent)';
	const styles = { color: color, borderColor: color };
	// if input mode is of type select
	if (mode === 'select')
		return (
			<select name='class' value={value} onChange={updateTimetable} style={{ ...styles, textTransform: 'uppercase', textAlign: 'center' }}>
				<option value='free'>Free</option>
				{/* removing the busy option to prevent misuse */}
				{!pub ?
				<option value="busy">Busy</option>:''
				}
				{allClasses.map(classN => {
					return (
						<option key={classN} value={classN} style={{ textTransform: 'uppercase' }}>
							{classN}
						</option>
					);
				})}
			</select>
		);

	// utility function for text input mode
	// parses values like 12-a, 5-c to 12a, 5c
	function parseValue(value: string) {
		if (value === 'free') return '';
		else if (value === 'busy') return 'busy';
		else {
			return value.replace('-', '');
		}
	}

	// encodes values like 5a to 5-a and '' to 'free'
	function encodeValue(value: string) {
		function split(str: string, index: number) {
			const result = [str.slice(0, index), str.slice(index)].join('-');

			return result;
		}

		if (value === 'busy' || value === 'free') return value;
		if (value.replaceAll(' ', '') === '') return 'free';
		return split(value, value.length - 1);
	}

	// return values for if mode is text
	// which is made for faster entry
	return <input type='text' value={parseValue(value)} style={{ width: '5ch' }} onChange={e => updateTimetable(e, encodeValue(e.target.value))} />;
}

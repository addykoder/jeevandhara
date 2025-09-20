import { attendanceDatatype } from '../../utils/types';
import useTeacher from '../../store/teacher/useTeacher';
import usePreference from '../../store/preferences/usePreference';
import { Box, Typography } from '@mui/material';
import theme from '../../context/theme';

export function AttendanceDisplay({ attendance, dayN}: { attendance: attendanceDatatype[] | null, dayN:number}) {
	const [{ saturdayPeriod, weekdayPeriod }] = usePreference();
	const pN = (dayN === 6 ? saturdayPeriod : weekdayPeriod) || 0;
	const periodArray: number[] = [];
	for (let i = 0; i <= pN; i++) {
		periodArray.push(i);
	}

	const [teachers] = useTeacher();

	if (teachers.length === 0)
		return (
			<Typography variant='h2' style={{ textAlign: 'center', opacity: '.5', margin: '2em 0' }}>
				No Teacher yet to be absent
			</Typography>
		);

	const mappedAttendance = attendance?.map(a => {
		const teacher = teachers.filter(t => t.id === a.id)[0];
		return { id: teacher?.id || 0, name: teacher?.name || '--', classTeacherOf: teacher?.classTeacherOf || '--', periodsAbsent: periodArray.filter(p => !a.presentPeriods.includes(p)) };
	});
	

	if (!attendance) return(
			<Typography variant='h2' style={{ textAlign: 'center', opacity: '.5', margin: '2em 0' }}>
				Attendance Not taken
			</Typography>)
	if (mappedAttendance?.length === 0)
		return (
			<Typography variant='h2' style={{ textAlign: 'center', opacity: '.5', margin: '2em 0' }}>
				No Teacher Absent
			</Typography>
		);

	return (
		<>
			<div className='teacher'>
				<div className='timeTable' style={{ width: 'max-content', marginInline: 'auto', marginBlock: '4em' }}>
					<table>
						<thead>
							<tr>
								<th>ID</th>
								<th>Name</th>
								<th>Class Teacher of</th>
								<th>Periods Absent</th>
							</tr>
						</thead>
						<tbody>
							{mappedAttendance?.map(a => {
								return (
									<tr key={a.id}>
										<td>{a.id}</td>
										<td>{a.name}</td>
										<td >{a.classTeacherOf === 'free'?'- -':a.classTeacherOf}</td>
										<td>
											{periodArray.filter(e => !a.periodsAbsent.includes(e)).length === 0
												? 'fullday'
												: a.periodsAbsent.map(period => {
														return (
															<Box
																sx={{
																	m: 1,
																	py: .2,
																	px: 1,
																	borderRadius: 1,
																	backgroundColor: theme.primary,
																	fontSize:'1.2rem',
																}}
																component='span'
																key={period}
															>
																{period}
															</Box>
														);
												})}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

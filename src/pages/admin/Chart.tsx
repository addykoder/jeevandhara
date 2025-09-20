import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Loader from '../../components/loader/Loader';
import theme from '../../context/theme';
import useAttendanceHistory from '../../store/attendanceHistory/useAttendanceHistory';

export default function Chart() {
	const [data] = useAttendanceHistory();
	const navigate = useNavigate()

	function handleClick(event:unknown, payload: unknown) {
		navigate(`/dashboard/attendance/view/${(payload as {payload:{dateString:string}}).payload.dateString}`)
	}

	if (!data.attendanceHistory) return <Loader/>

	return (
		<>
			<div className='attchart'>
				<Typography sx={{ position: 'sticky', left: 0, fontWeight: 400, fontSize: '2rem', my: 2 }}>Previous Records</Typography>
				<LineChart
					data={data.attendanceHistory.map(a => {
						const date = new Date(a.date)
						return {
							'Teachers Absent': a.attendance.length,
							name: `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })}`,
							'Periods Rescheduled': a.reschedules.length,
							dateString: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`,
						};
					})}
					width={900}
					height={300}
					margin={{ top: 5, right: 40, bottom: 5, left: 0 }}
				>
					<CartesianGrid stroke='#eeeeee44' strokeDasharray='2 4' />
					<XAxis dataKey='name' />
					<YAxis />
					<Line
						activeDot={{ onClick: handleClick }}
						type='monotone'
						isAnimationActive={false}
						strokeWidth={2}
						dataKey='Teachers Absent'
						stroke='hotpink'
					/>

					<Line
						type='monotone'
						activeDot={{ onClick: handleClick }}
						isAnimationActive={false}
						strokeWidth={3}
						dataKey='Periods Rescheduled'
						stroke={theme.primary}
					/>
					<Tooltip contentStyle={{ backgroundColor: theme.blurbg2, fontWeight: 600 }} />
				</LineChart>
			</div>
		</>
	);
}
import { Box, Container, FormControl, IconButton, InputLabel, MenuItem, Select, Typography, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usePreference from '../../store/preferences/usePreference';
import { serverURL } from '../../utils/constants';
import { attPrefDatatype, attendanceDatatype, reschedulesDatatype } from '../../utils/types';
import { AttendanceDisplay } from '../viewAttendance/AttendanceDisplay';
import ReschedulesDisplay from '../viewReschedules/ReschedulesDisplay';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { attendancePageContext } from '../../App';
import { MobileDatePicker as DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { PreferenceDisplay } from '../takeAttendance/TakeAttendance';
import { SummaryDisplay } from '../viewReschedules/ViewReschedules';
import { summaryType } from '../modifyReschedules/ModifyReschedules';

export default function DateAttendance() {
	const { date } = useParams();
	const [attendance, setAttendance] = useState<attendanceDatatype[]>([]);
	const [summary, setSummary] = useState<summaryType[]>([]);
	const [reschedules, setReschedules] = useState<reschedulesDatatype[]>([]);
	const [day, setDay] = useState(new Date().getDay());
	const [preferences, setPreferences] = useState({});
	const [grouping, setGrouping] = useState<'period' | 'class' | 'assignedTeacher' | 'absentTeacher'>('period');
	const isMobile = !useMediaQuery('(min-width:600px)');
	const [{ saturdayPeriod, weekdayPeriod }] = usePreference();
	const dayN = new Date().getDay();
	const pN = (dayN === 6 ? saturdayPeriod : weekdayPeriod) || 0;
	const periodArray: number[] = [];
	const navigate = useNavigate();
	for (let i = 1; i <= pN; i++) {
		periodArray.push(i);
	}
	const [, setAttendancePage] = useContext(attendancePageContext);
	useEffect(() => {
		setAttendancePage(`/dashboard/attendance/view/${date}`);
	});

	useEffect(() => {
		axios.get(`${serverURL}/attendance/date/${date}`)
			.then(r => {
				setAttendance(r.data.payload.attendance?.attendance || []);
				setReschedules(r.data.payload.attendance?.reschedules || []);
				setDay(r.data.payload.attendance?.day || new Date().getDay());
				setPreferences(r.data.payload.attendance?.preferences || {});
				setSummary(r.data.payload.summary || [])
				console.log(r.data.payload.summary);
				
			})
			.catch(e => console.log(e));
	}, [date]);

	// finding min and max period numbers
	let min = reschedules[0]?.periodNo || 0;
	let max = reschedules[0]?.periodNo || 0;
	for (const resc of reschedules) {
		if (resc.periodNo > max) max = resc.periodNo;
		else if (resc.periodNo < min) min = resc.periodNo;
	}

	return (
		<>
			<Container maxWidth='xl' sx={{ mb: 8 }}>
				<Box className='header' sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap' }}>
					<Box className='left' sx={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
						<IconButton size='large' onClick={() => navigate('/dashboard/attendance/view')}>
							<ArrowBackIcon />
						</IconButton>
						<Typography variant='h4' sx={{ my: 2, fontSize: '3rem' }}>
							Report Issue
						</Typography>
					</Box>
					<Box className='left' sx={{ flex: isMobile ? 1 : undefined, display: 'flex', alignItems: 'center', justifyContent: 'stretch', gap: '2em' }}>
						<DatePicker
							sx={{ flex: 1, minWidth: '100px' }}
							label='Select Date'
							onAccept={d => {
								if (d) {
									const dateString = `${d.month() + 1}-${d.date()}-${d.year()}`;
									navigate(`/dashboard/attendance/view/${dateString}`);
								}
							}}
							defaultValue={dayjs(new Date(String(date)))}
						/>
					</Box>
				</Box>

				<Typography variant='h5' sx={{ my: 2, fontSize: '2rem', fontWeight: 200, opacity: '.8' }}>
					Attendance
				</Typography>


				<AttendanceDisplay attendance={attendance} dayN = {day} />

				<Typography variant='h5' sx={{ my: 2, fontSize: '2rem', fontWeight: 200, opacity: '.8' }}>
					Preferences Used
				</Typography>
				<PreferenceDisplay preferences={preferences as attPrefDatatype} day={day} />

				<Box component='div' sx={{ mt: 20, mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2em', flexWrap: 'wrap' }}>
					<Typography component='h1' variant='h5' sx={{ fontSize: '2rem', fontWeight: 200, opacity: '.8' }}>
						Reschedules
					</Typography>

					<FormControl sx={isMobile ? { flex: 1 } : {}}>
						<InputLabel id='demo-simple-select-label'>Group By</InputLabel>
						<Select
							value={grouping}
							labelId='demo-simple-select-label'
							onChange={e => setGrouping(e.target.value as 'period' | 'class' | 'assignedTeacher' | 'absentTeacher')}
							id='demo-simple-select'
							label='Category'
						>
							<MenuItem value='period'>Periods</MenuItem>
							<MenuItem value='class'>Classes</MenuItem>
							<MenuItem value='assignedTeacher'>Absent Teachers</MenuItem>
							<MenuItem value='absentTeacher'>Assigned Teachers</MenuItem>
						</Select>
					</FormControl>
				</Box>
				
				<SummaryDisplay summary={summary}/>

				<ReschedulesDisplay grouping={grouping} periodRange={[min, max]} reschedules={reschedules} hidePreserved={false} />
			</Container>
		</>
	);
}
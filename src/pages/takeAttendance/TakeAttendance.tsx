import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendancePageContext } from '../../App';
import Loader from '../../components/loader/Loader';
import theme from '../../context/theme';
import useToast from '../../hooks/useToast';
import useReschedules from '../../store/attendance/useReschedules';
import usePreference from '../../store/preferences/usePreference';
import useTeacher from '../../store/teacher/useTeacher';
import { AttendanceDisplay } from '../viewAttendance/AttendanceDisplay';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Block } from '../account/Account';

interface attType {
	id: number;
	absentPeriods: number[];
	status: 'present' | 'absent' | 'midday';
	name: string;
	category: 'subjunior' | 'junior' | 'senior' | 'pgt';
	class: string;
}

type storedAtt = attType[];

export default function TakeAttendance() {
	const [teachers, , , , fetching, , , , , , ,] = useTeacher();
	const [searchValue, setSearchValue] = useState('');
	const [{ saturdayPeriod, weekdayPeriod }] = usePreference();
	// const dayN = new Date().getDay();
	const periodArray: number[] = [];
	const notified = useRef(true);
	const notify = useToast();
	const navigate = useNavigate();
	const [, setAttendancePage] = useContext(attendancePageContext);
	const [toUpdate, setUpdate] = useState(false);

	const [day, setDay] = useState(new Date().getDay());
	const pN = (day === 6 ? saturdayPeriod : weekdayPeriod) || 0;
	const [preserve, setPreserve] = useState(false)
	const [preserveTill, setPreserveTill] = useState(pN)
	const isSmall = !useMediaQuery('(min-width:900px)');
	const [data] = usePreference();

	useEffect(() => {
		setPreserveTill(pN)
	}, [pN])

	useEffect(() => {
		setAttendancePage('/dashboard/attendance/take');
	}, []);
	for (let i = 0; i <= pN; i++) {
		periodArray.push(i);
	}
	const [attendance, , , , submitAttendance, , , fetchingAttendance, submittingAttendance, submitAttendanceMessage] = useReschedules();

	const [att, setAtt] = useState<storedAtt>(
		teachers.map(t => {
			return { id: t.id, absentPeriods: [], status: 'present', name: t.name, category: t.category, class: t.classTeacherOf };
		})
	);

	// filling the attendance with previous attendance
	useEffect(() => {
		if (!attendance) return;
		if (fetchingAttendance !== 'fulfilled') return;

		setAtt(prev => {
			return prev.map(a => {
				const found = attendance.filter(i => i.id === a.id)[0];
				if (found) {
					return { ...a, status: found.presentPeriods.length === 0 ? 'absent' : 'midday', absentPeriods: [...periodArray].filter(p => !found.presentPeriods.includes(p)) };
				}
				return a;
			});
		});
	}, [fetchingAttendance, fetching, toUpdate]);

	// derived state
	const toSubmitAttendance = [...att]
		.filter(a => a.status !== 'present')
		.map(a => {
			if (a.status === 'midday') return { id: a.id, presentPeriods: [...periodArray].filter(p => !a.absentPeriods.includes(p)) };
			return { id: a.id, presentPeriods: [] };
		});

	useEffect(() => {
		if (fetching !== 'fulfilled') return;
		setAtt(
			teachers.map(t => {
				return { id: t.id, absentPeriods: [], status: 'present', name: t.name, category: t.category, class: t.classTeacherOf };
			})
		);
		setUpdate(true);
	}, [fetching]);

	// submitting attendance
	function handleSubmit() {
		if (!confirm('Confirm Submitting Attendance ?')) return;
		submitAttendance(toSubmitAttendance, day, preserve, preserveTill);
		notified.current = false;
	}

	useEffect(() => {
		if (submittingAttendance === 'fulfilled' && !notified.current) {
			notified.current = true;
			notify('success', 'Attendance successfully submitted');
			navigate('/dashboard/attendance/view');
		} else if (submittingAttendance === 'rejected' && !notified.current) {
			notified.current = true;
			notify('error', submitAttendanceMessage || 'Cannot submit Attendance');
		}
	}, [submittingAttendance]);

	if (fetching === 'pending' || fetchingAttendance === 'pending') return <Loader />;
	if (fetching === 'rejected') return <h1>Some error while fetching teachers</h1>;

	return (
		<>
			<Container maxWidth='xl' sx={{ mb: 12 }}>
				<Box className='header' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
					<Box className='left' sx={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
						<IconButton size='large' onClick={() => (confirm('Discard Attendance') ? navigate('/dashboard/attendance/view') : undefined)}>
							<ArrowBackIcon />
						</IconButton>
						<Typography variant='h4' sx={{ my: 2 }}>
							{attendance == null ? 'Take' : 'Retake'} Attendance
						</Typography>
					</Box>

					<Typography color='primary' variant='h5'>
						{new Date().toISOString().slice(0, 10)}
					</Typography>
				</Box>
				<Container maxWidth='lg' sx={{ p: 0 }}>
					<Box sx={{ px: '3rem', py: '1rem', backgroundColor: 'rgba(200,200,200,.05)', mb: '2rem', borderRadius: '10px' }}>
						<Box className='infoGrid' sx={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr 1fr' : '1fr 1fr 1fr', gap: 2, mt: '2rem', mb: '2rem' }}>
							<Block label='Restrict To Category' data={String(data.restrictToCategory)} />
							<Block label='Allot Related Teacher' data={String(data.allotRelatedTeacher)} />
							<Block label='Restrict To Level' data={String(data.restrictToLevel)} />
							<Block label='Half chunk Priority' data={String(data.chunkPriorityHalves)} />
							<Block label='Excluded Classes' data={String(data.excludedClasses?.join(' , ')) || '- -'} />
							<Block label='Excluded Periods' data={String(data.excludedPeriods?.join(' , ')) || '- -'} />
							<Block label="Excluded Teachers' ID" data={String(data.excludedTeachers?.join(' , ')) || '- -'} />
						</Box>

						<Box className='infoGrid' sx={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: 6, mb: '.5rem' }}>
							<Button onClick={() => navigate('/dashboard/preferences')} variant='contained' sx={{}}>
								Modify Reschedule Preferences
							</Button>

							<FormControl sx={{ flex: '1', width: '100%' }}>
								<InputLabel sx={{ width: '100%' }} id='demo-simple-select-label'>
									Select Day
								</InputLabel>
								<Select value={day} labelId='demo-simple-select-label' onChange={e => setDay(Number(e.target.value))} id='demo-simple-select' label='Select Day'>
									<MenuItem value='0'>Sunday</MenuItem>
									<MenuItem value='1'>Monday</MenuItem>
									<MenuItem value='2'>Tuesday</MenuItem>
									<MenuItem value='3'>Wednesday</MenuItem>
									<MenuItem value='4'>Thursday</MenuItem>
									<MenuItem value='5'>Friday</MenuItem>
									<MenuItem value='6'>Saturday</MenuItem>
								</Select>
							</FormControl>
						</Box>
					</Box>
					<TextField value={searchValue} fullWidth variant='filled' label='Search Teacher Name' sx={{ mb: 6 }} onChange={e => setSearchValue(e.target.value)} />
					<div className='advancedList'>
						{att.map(t =>
							// using the filtering logic for search
							t.name.toLowerCase().includes(searchValue.toLowerCase()) ? <AttendanceUnit attendance={t} setAttendance={setAtt} periodArray={periodArray} key={t.id} /> : ''
						)}
					</div>
				</Container>
				<Typography sx={{ mt: 10, opacity: 0.8 }} variant='h4'>
					Review Attendance
				</Typography>
				<AttendanceDisplay
					attendance={[...att]
						.filter(a => a.status !== 'present')
						.map(a => {
							return { ...a, presentPeriods: a.status === 'absent' ? [] : [...periodArray].filter(p => !a.absentPeriods.includes(p)) };
						})}
						dayN = {day}
				/>

				<FormControlLabel label={
						<Typography fontSize='1.2rem' fontWeight={200}>
							Preserve Previous Reschedules	
						</Typography>
					}
					control={<Checkbox onChange={e => setPreserve(e.target.checked)} checked={preserve} sx={{ scale: '1.4', mr: 0.5 }} />}
				/>

				{preserve ?
			
					<FormControl sx={{ flex: '1', minWidth: '200px' }}>
						<InputLabel id='demo-simple-select-label'>Preserve Till Period</InputLabel>
						<Select
							value={preserveTill}
							labelId='demo-simple-select-label'
							onChange={e => setPreserveTill(Number(e.target.value))}
							id='demo-simple-select'
							label='Preserve Till Period'
						>
							{periodArray.map(p => <MenuItem value={p}>{p}</MenuItem>)}
					
						</Select>
					</FormControl> : <></>}

				<Button style={{position:'sticky', bottom:'1em', boxShadow:'0 0 50px 40px #050f20'}} onClick={handleSubmit} variant='contained' fullWidth sx={{ py: 2, mt:2 }}>
					{submittingAttendance === 'pending' ? <Loader width={30} height={30} /> : 'Confirm Submit'}
				</Button>
			</Container>
		</>
	);
}

function AttendanceUnit({ periodArray, attendance, setAttendance }: { periodArray: number[]; attendance: attType; setAttendance: (setter: (prevAtt: storedAtt) => storedAtt) => void }) {
	const isMobile = useMediaQuery('(max-width:600px)');
	return (
		<div
			onClick={() => {
				setAttendance((prevAtt: storedAtt) => {
					return prevAtt.map(a => {
						if (a.id === attendance.id && attendance.status === 'present') return { ...a, status: 'absent' };
						return a;
					});
				});
			}}
			key={attendance.id}
			style={{
				backgroundColor: attendance.status === 'present' ? 'transparent' : theme.primary75,
				borderWidth: attendance.status === 'present' ? '1px' : '0',
				borderColor: 'gray',
				borderStyle: 'solid',
				borderRadius: '8px',
				paddingBlock: '1em',
				paddingInline: '1em',
				marginBlock: '2em',
			}}
		>
			<div
				onClick={() => {
					setAttendance((prevAtt: storedAtt) => {
						return prevAtt.map(a => {
							if (a.id === attendance.id && attendance.status === 'absent') return { ...a, status: 'present' };
							return a;
						});
					});
				}}
				className='display point'
				style={{ paddingInline: isMobile ? 0 : '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 100 }}
			>
				<div className='name' style={{ width: isMobile ? '100px' : '200px', fontWeight: 400 }}>
					{attendance.name}
				</div>
				<div className='category' style={{}}>
					{attendance.category}
				</div>
				<div className='class' style={{}}>
					{attendance.class === 'free' ? '- -' : attendance.class}
				</div>
			</div>

			{attendance.status !== 'present' ? (
				<div className='switch'>
					<select
						style={{ width: '100%', border: 'none', marginBlock: '.5em', backgroundColor: theme.bg, borderRadius: '5px', padding: '.5em 1em', margin: '1em 0' }}
						value={attendance.status}
						onChange={e =>
							setAttendance((prevAtt: storedAtt) => {
								return prevAtt.map(a => {
									if (a.id === attendance.id) return { ...a, status: e.target.value as attType['status'] };
									return a;
								});
							})
						}
						name=''
						id=''
					>
						<option value='present'>Present</option>
						<option value='absent'>Full-day Absent</option>
						<option value='midday'>Half-day Absent</option>
					</select>

					{/* <FormControl fullWidth sx={{ flex: isMobile ? 1 : undefined, mt: 3 }}>
									<InputLabel id='demo-simple-select-label'>Teacher status</InputLabel>
									<Select fullWidth labelId='demo-simple-select-label' id='demo-simple-select' label='Teacher status'>
										<MenuItem value='period'>Periods</MenuItem>
										<MenuItem value='class'>Classes</MenuItem>
										<MenuItem value='assignedTeacher'>Absent Teachers</MenuItem>
										<MenuItem value='absentTeacher'>Assigned Teachers</MenuItem>
									</Select>
								</FormControl> */}
				</div>
			) : (
				''
			)}

			{attendance.status === 'midday' ? (
				<div className='periodSelect'>
					<Typography color='primary'>Absent Periods</Typography>
					<div className='periodArray' style={{ marginTop: '1em', display: 'flex', gap: '1em', flexWrap: 'wrap', alignItems: 'center' }}>
						{periodArray.map(p => (
							<div
								className='point'
								style={{
									backgroundColor: attendance.absentPeriods.includes(p) ? theme.primary : 'transparent',
									padding: '.25em .7em',
									borderRadius: '5px',
								}}
								key={p}
								onClick={() => {
									// on clicking period icon
									setAttendance((prevAtt: storedAtt) => {
										return prevAtt.map(a => {
											if (a.id === attendance.id) {
												if (a.absentPeriods.includes(p)) return { ...a, absentPeriods: [...a.absentPeriods].filter(i => i !== p) };
												else return { ...a, absentPeriods: [...a.absentPeriods, p] };
											}
											return a;
										});
									});
								}}
							>
								{p}
							</div>
						))}
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
}

export function PreferenceDisplay({
	day,
	preferences,
	showDay = true,
}: {
	showDay?: boolean;
	day: number;
	preferences: { restrictToCategory: boolean; allotRelatedTeacher: boolean; restrictToLevel: boolean; excludedClasses: string[]; excludedPeriods: number[]; excludedTeachers: number[], chunkPriorityHalves:'strict'|'moderate'|'no' };
}) {
	const isSmall = !useMediaQuery('(min-width:900px)');

	return (
		<Box sx={{ px: '3rem', py: '1rem', backgroundColor: 'rgba(200,200,200,.05)', mb: '2rem', borderRadius: '10px' }}>
			<Box className='infoGrid' sx={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr 1fr' : '1fr 1fr 1fr', gap: 2, mt: '2rem', mb: '2rem' }}>
				<Block label='Restrict To Category' data={String(preferences.restrictToCategory)} />
				<Block label='Allot Related Teacher' data={String(preferences.allotRelatedTeacher)} />
				<Block label='Restrict To Level' data={String(preferences.restrictToLevel)} />
				<Block label='Half chunk Priority' data={String(preferences.chunkPriorityHalves)} />
				<Block label='Excluded Classes' data={String(preferences.excludedClasses?.join(' , ')) || '- -'} />
				<Block label='Excluded Periods' data={String(preferences.excludedPeriods?.join(' , ')) || '- -'} />
				<Block label="Excluded Teachers' ID" data={String(preferences.excludedTeachers?.join(' , ') || '- -')} />
				{showDay ? <Block label='Rescheduled for' data={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]} /> : ''}
			</Box>
		</Box>
	);
}

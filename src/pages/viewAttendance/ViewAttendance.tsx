import { Box, Button, Container, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { teacherPageContext } from '../../App';
import useTeacher from '../../store/teacher/useTeacher';
import { classesObjectType, teacherCategory, teacherTimetable } from '../../utils/types';
import { ArrowBack, SaveOutlined } from '@mui/icons-material';
import useClasses from '../../store/classes/useClasses';
import theme from '../../context/theme';
import TimeTableEntry from '../../components/timetableEntry/TimeTableEntry';
import usePreference from '../../store/preferences/usePreference';
import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import Loader from '../../components/loader/Loader';

export function createArr(n: number) {
	const a = [];
	for (let i = 0; i < n; i++) a.push('free');
	return a;
}

export function maxCL(classes: classesObjectType[], name: string) {
	if (name === '.') return Infinity;
	for (const c of classes) {
		if (c.name === name) return c.handlingLevel;
	}
	return -Infinity;
}

export default function viewAttendance() {
	const [{ saturdayPeriod, weekdayPeriod }] = usePreference();
	const isSmall = !useMediaQuery('(min-width:900px)');
	const [classes] = useClasses();
	const notify = useToast();
	const notified = useRef(true);

	const [, setTeacherPage] = useContext(teacherPageContext);
	const [, , createTeacher, , , , creating, , , , createMessage] = useTeacher();
	const [saving, setSaving] = useState(false);
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [locality, setLocality] = useState('');
	const [issue, setIssue] = useState('');

	useEffect(() => {
		if (creating === 'fulfilled' && !notified.current) {
			notify('success', 'Report issued successfully');
			notified.current = true;
			setSaving(false);
			navigate('/dashboard/admin');
		} else if (creating === 'rejected' && !notified.current) {
			notify('error', createMessage || 'Issue found in Reporting');
			notified.current = true;
			setSaving(false);
		}
	}, [creating]);

	function onAddHandler() {
	// 	setSaving(true);
	notified.current = false;
	notify("success", "Issue reported successfully");	
	// 	createTeacher({ name, category, classTeacherOf: Class, maxTeachingClass: maxClass, timeTable, messagingPreference: 'sms', phone: Number(phone), password });
	}

	const maxP = (saturdayPeriod || 0) > (weekdayPeriod || 0) ? saturdayPeriod || 0 : weekdayPeriod || 0;
	const periodArray: number[] = [];
	for (let i = 1; i <= maxP; i++) {
		periodArray.push(i);
	}

	return (
		<>
			<Container maxWidth='xl' sx={{ mb: 8 }}>
				<Box component='div' sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Box className='left' sx={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
						<IconButton size='large' onClick={() => navigate('/dashboard/teacher/view')}>
							<ArrowBack />
						</IconButton>
						<Typography variant='h4' sx={{ my: 2 }}>
							Report Issue
						</Typography>
					</Box>
					<Button onClick={onAddHandler} variant='contained' color='success' sx={{ bgcolor: '#00c400', color: 'white', mt: 3, mb: 2 }}>
						{saving ? (
							<Loader height={30} width={30} />
						) : (
							<>
								Report <SaveOutlined sx={{ ml: 1 }} />
							</>
						)}
					</Button>
				</Box>

				<Box className='addTeacher'>
					<Box className='infoGrid' sx={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: 6 }}>
						<TextField label='Name' value={name} onChange={e => setName(e.target.value)} />

						<FormControl sx={{ flex: '1', minWidth: '200px' }}>
							<InputLabel id='demo-simple-select-label'>State</InputLabel>
							<Select
								labelId='demo-simple-select-label'
								id='demo-simple-select'
								label='Category'
							>
								<MenuItem value='Select State'>Select State</MenuItem>
								<MenuItem value='Andaman and Nicobar Islands'>Andaman and Nicobar Islands</MenuItem>
								<MenuItem value='Andhra Pradesh'>Andhra Pradesh</MenuItem>
								<MenuItem value='Assam'>Assam</MenuItem>
								<MenuItem value='Bihar'>Bihar</MenuItem>
								<MenuItem value='Chandigarh'>Chandigarh</MenuItem>
								<MenuItem value='Chattisgarh'>Chattisgarh</MenuItem>
								<MenuItem value='Dadar and Nagar Haweli'>Dadar and Nagar Haweli</MenuItem>
								<MenuItem value='Daman and Diu'>Daman and Diu</MenuItem>
								<MenuItem value='Delhi'>Delhi</MenuItem>
								<MenuItem value='Goa'>Goa</MenuItem>
								<MenuItem value='Gujrat'>Gujrat</MenuItem>
								<MenuItem value='Haryana'>Haryana</MenuItem>
								<MenuItem value='Himachal Pradesh'>Himachal Pradesh</MenuItem>
								<MenuItem value='Jammu and Kashmir'>Jammu and Kashmir</MenuItem>
								<MenuItem value='Jharkhand'>Jharkhand</MenuItem>
								<MenuItem value='Karnatak'>Karnatak</MenuItem>
								<MenuItem value='Kerala'>Kerala</MenuItem>
								<MenuItem value='Ladakh'>Ladakh</MenuItem>
								<MenuItem value='Lakshadweep'>Lakshadweep</MenuItem>
								<MenuItem value='Madhya Pradesh'>Madhya Pradesh</MenuItem>
								<MenuItem value='Maharashtra'>Maharashtra</MenuItem>
								<MenuItem value='Manipur'>Manipur</MenuItem>
								<MenuItem value='Meghalaya'>Meghalaya</MenuItem>
								<MenuItem value='Mizoram'>Mizoram</MenuItem>
								<MenuItem value='Nagaland'>Nagaland</MenuItem>
								<MenuItem value='Odisha'>Odisha</MenuItem>
								<MenuItem value='Pudducherry'>Pudducherry</MenuItem>
								<MenuItem value='Punjab'>Punjab</MenuItem>
								<MenuItem value='Rajasthan'>Rajasthan</MenuItem>
								<MenuItem value='Sikkhim'>Sikkhim</MenuItem>
								<MenuItem value='Tamil Nadu'>Tamil Nadu</MenuItem>
								<MenuItem value='Telangana'>Telangana</MenuItem>
								<MenuItem value='Tripura'>Tripura</MenuItem>
								<MenuItem value='Uttar Pradesh'>Uttar Pradesh</MenuItem>
								<MenuItem value='Uttarakhand'>Uttarakhand</MenuItem>
								<MenuItem value='West Bengal'>West Bengal</MenuItem>
							</Select>
						</FormControl>

						<TextField label='Phone' type='number' value={phone} onChange={e => setPhone(e.target.value)} />
						<TextField label='Locality' type='text' value={locality} onChange={e => setLocality(e.target.value)} />
						<TextField label='Your Issue' type='text' value={issue} onChange={e => setIssue(e.target.value)} />
						
						</Box>
					</Box>
					
			</Container>
			</>
	);
}
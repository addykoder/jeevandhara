import usePreference from '../../store/preferences/usePreference';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { Button, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import getTip from './quickTips';
import { useEffect, useState } from 'react';
import theme from '../../context/theme';
import useReschedules from '../../store/attendance/useReschedules';
import CircleIcon from '@mui/icons-material/Circle';
import useClasses from '../../store/classes/useClasses';
import useAccountInfo from '../../store/account/useAccountInfo';
import EmojiIcon from '@mui/icons-material/EmojiPeopleOutlined';

export function AttendanceCard() {
	const [attendance] = useReschedules();
	const [absent, setAbsent] = useState(0);
	const [halfday, setHalfday] = useState(0);

	const [{ saturdayPeriod, weekdayPeriod }] = usePreference();
	const dayN = new Date().getDay();
	const pN = (dayN === 6 ? saturdayPeriod : weekdayPeriod) || 0;
	const periodArray: number[] = [];
	const navigate = useNavigate();

	useEffect(() => {
		for (let i = 0; i <= pN; i++) {
			periodArray.push(i);
		}
	}, [pN]);

	useEffect(() => {
		setAbsent(attendance?.length || 0);
		setHalfday(attendance?.filter(a => a.presentPeriods.length !== 0).length || 0);
	}, [attendance]);

	return (
		<div className='item attendance point' onClick={() => navigate('/dashboard/attendance/view')}>
			<Typography sx={{ fontSize: '1.2rem', opacity: 0.5, textAlign: 'center', fontWeight: 200 }}>PH - Level</Typography>
			<div className='line'>
				<img src='./public/image.png' style={{width: '450px'}}></img>
			</div>

			<div className='line'> 
				<h2 style={{textAlign:'center', margin:'auto'}}>223</h2>
			</div>
		</div>
	);
}

export function RescheduleCard() {
	const [, reschedules] = useReschedules();
	const [rescheduled, setRescheduled] = useState(0);
	const [overflown, setOverflown] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		setRescheduled(reschedules.length || 0);
		setOverflown(reschedules.filter(r => r.teacherId === undefined).length || 0);
	}, [reschedules]);

	return (
		<div className='item reschedules point' onClick={() => navigate('/dashboard/reschedules', )} style={{ backgroundColor: overflown === 0 ? '' : 'rgba(256,0,0,.5)' }}>
			<Typography sx={{ fontSize: '1.2rem', opacity: 0.5, textAlign: 'center', fontWeight: 200 }}>TDS Level</Typography>
			<div className='line'>
<img src='./public/tds.png' style={{width: '450px'}}></img>
			</div>

			<div className='line'>
				<h2 style={{textAlign:'center', margin:'auto'}}>223</h2>
			</div>
		</div>
	);
}

export function PreferenceCard() {
	const [classes] = useClasses();
	const [{ excludedClasses, excludedPeriods, excludedTeachers }] = usePreference();
	const navigate = useNavigate();
	const isSmall = useMediaQuery('(max-width:700px)');

	return (
		<div className='item preferences point' onClick={() => navigate('/dashboard/preferences')}>
			<Typography sx={{ fontSize: '1.2rem', opacity: 0.5, textAlign: 'right', fontWeight: 200 }}>Preferences</Typography>
			<div className='list'>
				<div className='line'>
					<CircleIcon color='primary' fontSize='small' />
					<Typography sx={{ fontWeight: 200, fontSize: '1.7rem' }}>
						<span style={{ fontWeight: 600 }}>{([...classes]?.filter(c => (excludedClasses || []).includes(c.name)) || []).length}</span>{' '}
						<span style={{ opacity: 0.7 }}>Classes Excluded. </span>
					</Typography>
				</div>
				<div className='line' style={{ marginRight: isSmall ? '0' : '8em' }}>
					<CircleIcon color='primary' fontSize='small' />
					<Typography sx={{ fontWeight: 200, fontSize: '1.7rem' }}>
						<span style={{ fontWeight: 600 }}>{(excludedPeriods || []).length}</span> <span style={{ opacity: 0.7 }}>Periods Excluded. </span>
					</Typography>
				</div>
				<div className='line'>
					<CircleIcon color='primary' fontSize='small' />
					<Typography sx={{ fontWeight: 200, fontSize: '1.7rem' }}>
						<span style={{ fontWeight: 600 }}>{(excludedTeachers || []).length}</span> <span style={{ opacity: 0.7 }}>Teachers Excluded. </span>
					</Typography>
				</div>
			</div>
		</div>
	);
}

export function Clock() {
	const [date, setDate] = useState(new Date());
	function tick() {
		setDate(new Date());
		setTimeout(() => {
			tick();
		}, 1000);
	}
	useEffect(() => tick(), []);

	return (
		<div className='item clock' style={{ backgroundColor: 'transparent' }}>
			<Typography sx={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 200 }}>
				{date.getHours() < 10 ? '0' + date.getHours() : date.getHours()} : {date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()} :{' '}
				{date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}
			</Typography>
			<Typography sx={{ fontSize: '1.2rem', textAlign: 'center', fontWeight: 200 }}>
				{date.getDate()} {date.toLocaleString('default', { month: 'long' })},{' '}
				<span style={{ fontWeight: 600, color: theme.primary }}>{date.toLocaleString('en-us', { weekday: 'long' })}</span>
			</Typography>
		</div>
	);
}
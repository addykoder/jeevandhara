import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import usePreference from '../../store/preferences/usePreference';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Loader from '../../components/loader/Loader';
import useToast from '../../hooks/useToast';
import useClasses from '../../store/classes/useClasses';
import theme from '../../context/theme';
import useAccountInfo from '../../store/account/useAccountInfo';

export default function Preferences() {
	const notify = useToast();
	const isBig = useMediaQuery('(min-width:900px)');
	const count = useRef(0);
	const [{ username }] = useAccountInfo();

	// to check if user has actually modified before saving
	const [isModified, setIsModified] = useState(false);
	const [saving, setSaving] = useState(false);
	const notified = useRef(true);
	const [data, updatePreferences, refetch, fetching, updating, updateMessage] = usePreference();
	
	const [classes, , fetchingClasses, , , , refetchClass] = useClasses();

	useEffect(() => {
		if (notified.current) return;

		if (updating === 'fulfilled') {
			notify('success', 'Saved Preferences');
			setSaving(false);
			setIsModified(false);
			notified.current = true;
		} else if (updating === 'rejected') {
			notify('error', updateMessage || 'Cannot Save Preferences');
			setSaving(false);
			notified.current = true;
		}
	}, [updating]);

	// refetching on rejected
	useEffect(() => {
		if (fetching === 'rejected' && ++count.current < 4) {
			refetch();
		}
		if (fetchingClasses === 'rejected' && count.current < 4) {
			refetchClass();
		}
	}, [fetching, fetchingClasses]);

	function onSaveHandler() {
		notified.current = false;
		if (!isModified) notify('info', 'Nothing modified to be saved');
		setSaving(true);

		const toSave = { excludedClasses, excludedPeriods, excludedTeachers, restrictToCategory, restrictToLevel, allotRelatedTeacher, teacherModificationAllowed, enableMessaging, weekdayPeriod, saturdayPeriod, chunkPriorityHalves };

		updatePreferences(toSave);
		count.current = 0;
	}

	const [excludedClasses, setExcludedClasses] = useState<string[]>([]);
	const [excludedTeachers, setExcludedTeachers] = useState<number[]>([]);
	const [excludedPeriods, setExcludedPeriods] = useState<number[]>([]);
	const [restrictToCategory, setRestrictToCategory] = useState(false);
	const [restrictToLevel, setRestrictToLevel] = useState(false);
	const [allotRelatedTeacher, setAllotRelatedTeacher] = useState(false);
	const [teacherModificationAllowed, setTeacherModificationAllowed] = useState(false);
	const [enableMessaging, setEnableMessaging] = useState(false);
	const [chunkPriorityHalves, setChunkPriorityHalves] = useState<'strict'|'moderate'|'no'>('no');
	const [weekdayPeriod, setWeekdayPeriod] = useState(0);
	const [saturdayPeriod, setSaturdayPeriod] = useState(0);

	useEffect(() => {
		if (fetching === 'fulfilled') {
			setExcludedClasses(data.excludedClasses as string[]);
			setExcludedTeachers(data.excludedTeachers as number[]);
			setExcludedPeriods(data.excludedPeriods as number[]);
			setRestrictToCategory(data.restrictToCategory as boolean);
			setRestrictToLevel(data.restrictToLevel as boolean);
			setAllotRelatedTeacher(data.allotRelatedTeacher as boolean);
			setTeacherModificationAllowed(data.teacherModificationAllowed as boolean);
			setEnableMessaging(data.enableMessaging as boolean);
			setChunkPriorityHalves(data.chunkPriorityHalves as 'strict'|'moderate'|'no');
			setSaturdayPeriod(data.saturdayPeriod as number);
			setWeekdayPeriod(data.weekdayPeriod as number);
		}
	}, [fetching]);

	const maxP = saturdayPeriod > weekdayPeriod ? saturdayPeriod : weekdayPeriod;
	const periodArray: number[] = [];
	for (let i = 0; i <= maxP; i++) {
		periodArray.push(i);
	}

	return (
		<>
			<Container maxWidth='xl' sx={{ mt: 0, mb: isBig ? 18 : 8 }}>
				<Box component='div' sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Typography component='h1' variant='h3'>
						Preferences
					</Typography>

					<Button onClick={onSaveHandler} variant='contained' color='success' disabled={!isModified} sx={{ bgcolor: '#00c400', color: 'white', mt: 3, mb: 2 }}>
						{saving ? (
							<Loader height={30} width={30} />
						) : (
							<>
								Save <SaveOutlinedIcon sx={{ ml: 1 }} />
							</>
						)}
					</Button>
				</Box>

				{fetching === 'fulfilled' && fetchingClasses === 'fulfilled' ? (
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: isBig ? '2em' : '3em', ml: isBig ? 8 : 0 }}>
						<CheckboxInput
							label='Restrict Teachers to same Category of Classes ?'
							checked={restrictToCategory}
							onChange={value => {
								setRestrictToCategory(value);
								setIsModified(true);
							}}
						/>
						<CheckboxInput
							label='Restrict Teachers to class handling Level specified ?'
							checked={restrictToLevel}
							onChange={value => {
								setRestrictToLevel(value);
								setIsModified(true);
							}}
						/>
						<CheckboxInput
							label='Allot Substitutions to Regular Teachers ?'
							checked={allotRelatedTeacher}
							onChange={value => {
								setAllotRelatedTeacher(value);
								setIsModified(true);
							}}
						/>
						{/* <CheckboxInput
							label='Split Teacher Priority calculation in two half chunks'
							checked={chunkPriorityHalves}
							onChange={value => {
								setChunkPriorityHalves(value);
								setIsModified(true);
							}}
						/> */}

							<FormControl sx={{ flex: '1', minWidth: '200px' }}>
								<InputLabel id='demo-simple-select-label'>Split Priority Calculation into 2 halves</InputLabel>
							<Select value={chunkPriorityHalves} onChange={e => { setChunkPriorityHalves(e.target.value as 'moderate' | 'strict' | 'no'); setIsModified(true) }} id='demo-simple-select' label='Split Priority Calculation into 2 halves'>
									<MenuItem value='no'>Never</MenuItem>
									<MenuItem value='moderate'>Moderate</MenuItem>
									<MenuItem value='strict'>Strict</MenuItem>
									
								</Select>
							</FormControl>
						{/* <CheckboxInput
							label='Enable Messaging'
							checked={enableMessaging}
							onChange={value => {
								setEnableMessaging(value);
								setIsModified(true);
							}}
						/> */}
						<Box>
							<CheckboxInput
								label='Allow online data Entry (! must be disabled after purpose)'
								checked={teacherModificationAllowed}
								onChange={value => {
									setTeacherModificationAllowed(value);
									setIsModified(true);
								}}
							/>
							{teacherModificationAllowed ? (
								<div className='link'>
									<Button
										onClick={() => {
											navigator.clipboard.writeText(window.location.origin + `/#/teacher-entry/${username}`);
											notify('info', `URL copied to clipboard, share with Teachers to start accepting entries`);
										}}
									>
										Copy Portal URL
									</Button>
									<span>{window.location.origin + `/#/teacher-entry/${username}`}</span>
								</div>
							) : (
								''
							)}
						</Box>

						<TextField
							sx={{ mt: isBig ? 16 : 8 }}
							onChange={e => {
								// not changing if is too big
								if (Number(e.target.value) > 20 || Number(e.target.value) < 0) return;
								setWeekdayPeriod(Number(e.target.value));
								setIsModified(true);
							}}
							value={weekdayPeriod}
							fullWidth
							type='number'
							label='Weekday Periods'
						/>
						<TextField
							onChange={e => {
								// not changing is overflows
								if (Number(e.target.value) > 20 || Number(e.target.value) < 0) return;
								setSaturdayPeriod(Number(e.target.value));
								setIsModified(true);
							}}
							value={saturdayPeriod}
							fullWidth
							type='number'
							label='Saturday Periods'
						/>

						<Box sx={{ mt: isBig ? 16 : 8 }} className='excludedClasses'>
							<Typography>Excluded Classes</Typography>

							<Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }} className='excludedClassesSelector'>
								{classes.map(classItem => {
									return (
										<Box
											component='span'
											key={classItem.name as string}
											className='classItem point'
											sx={{
												m: 1,
												py: 1,
												px: 2,
												borderRadius: 1,
												background: excludedClasses.includes(classItem.name as string) ? theme.primary : 'rgba(123,123,123,.5)',
											}}
											onClick={() => {
												if (excludedClasses.includes(classItem.name as string)) {
													setExcludedClasses(excludedClasses.filter(i => i !== classItem.name));
												} else {
													setExcludedClasses([...excludedClasses, classItem.name as string]);
												}
												setIsModified(true);
											}}
										>
											{classItem.name as string}
										</Box>
									);
								})}
							</Box>
						</Box>

						<Box className='excludedPeriods'>
							<Typography>Excluded Periods</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }} className='excludedClassesSelector'>
								{periodArray.map(period => {
									return (
										<Box
											className='point'
											sx={{
												m: 1,
												py: 1,
												px: 2,
												borderRadius: 1,
												background: excludedPeriods.includes(period) ? theme.primary : 'rgba(123,123,123,.5)',
											}}
											component='span'
											key={period}
											onClick={() => {
												if (excludedPeriods.includes(period)) {
													setExcludedPeriods(excludedPeriods.filter(e => e !== period));
												} else {
													setExcludedPeriods([...excludedPeriods, period]);
												}
												setIsModified(true);
											}}
										>
											{period}
										</Box>
									);
								})}
							</Box>
						</Box>

						<Box className='excludedTeachers'>
							<Typography>Excluded Teachers</Typography>

							<Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }} className='excludedClassesSelector'>
								{excludedTeachers.map(id => {
									return (
										<Box
											key={id}
											sx={{
												m: 1,
												py: 1,
												px: 2,
												borderRadius: 1,
												background: theme.primary,
											}}
											className='point'
											onClick={() => {
												setExcludedTeachers(excludedTeachers.filter(e => e !== id));
												setIsModified(true);
											}}
										>
											{id}
										</Box>
									);
								})}
							</Box>
							<TextField
								sx={{ mt: 1 }}
								label='Teacher Id'
								type='number'
								onKeyDown={e => {
									if (e.key === 'Enter') {
										if (excludedTeachers.includes(Number((e as unknown as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>).target.value)))
											return notify('warning', 'Teacher already added to excluded');

										setExcludedTeachers([
											...excludedTeachers,
											Number((e as unknown as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>).target.value),
										]);
										(e as unknown as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>).target.value = '';
										setIsModified(true);
									}
								}}
							/>
						</Box>
					</Box>
				) : (
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<Loader />
					</div>
				)}
			</Container>
		</>
	);
}

function CheckboxInput({ label, onChange, checked }: { label: string; onChange: (value: boolean) => void; checked: boolean }) {
	return (
		<FormControlLabel
			label={
				<Typography fontSize='1.2rem' fontWeight={200}>
					{label}
				</Typography>
			}
			control={<Checkbox onChange={e => onChange(e.target.checked)} checked={checked} sx={{ scale: '1.4', mr: 2 }} />}
		/>
	);
}

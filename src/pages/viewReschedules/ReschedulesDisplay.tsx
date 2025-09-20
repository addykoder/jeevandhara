import { Typography } from '@mui/material';
import { reschedulesDatatype } from '../../utils/types';

export default function ReschedulesDisplay({ reschedules, grouping, signCol, periodRange, hidePreserved }: { reschedules: reschedulesDatatype[]; grouping: 'class' | 'period' | 'assignedTeacher' | 'absentTeacher', signCol?:boolean, periodRange: [number,number], hidePreserved:boolean }) {

	signCol = signCol || false
	// console.table(reschedules)
	
	if (reschedules.length === 0) return <Typography variant='h2' style={{ textAlign: 'center', opacity: '.5', margin: '2em 0' }}>
				No Reschedules to display
			</Typography>
		
	// filtering for period range
	reschedules = reschedules.filter(resc => resc.periodNo >= periodRange[0] && resc.periodNo <= periodRange[1])
	// filtering for preserved
	reschedules = hidePreserved ? reschedules.filter(r => !r.tags?.includes('preserved')) : reschedules

	switch (grouping) {
		case 'class':
			return <ClassReschedules reschedules={reschedules} signCol={signCol} />;
			break;
		case 'period':
			return <PeriodReschedules reschedules={reschedules} signCol={signCol} />;
			break;
		case 'assignedTeacher':
			return <AssignedTeacherReschedules reschedules={reschedules} signCol={signCol}/>;
			break;
		case 'absentTeacher':
			return <AbsentTeachersReschedules reschedules={reschedules} signCol={signCol}/>;
			break;
	}
}

// creates table
function Tb({ data, signCol }: { data: { [key: string]: string }[], signCol?:boolean}) {
	const heads = Object.keys(data[0]);
	
	return (
		<div style={{ width: 'max-content', marginInline: 'auto', marginBottom: '4em' }}>
			<div className='teacher'>
				<div className='timeTable'>
					<table>
						<thead>
							<tr>
								{heads.filter(h => h!=='tags').map(h => (
									<th key={h}>{h}</th>
								))}

								{signCol?<th>Sign.</th>:''}
							</tr>
						</thead>
						<tbody>
							{data.map(o => {

								return (
									<tr style={Object.values(o).includes(undefined as unknown as string) ? {backgroundColor:'rgba(256,0,0,.4)', fontWeight:'600'} : o.tags?.includes('preserved')?{ backgroundColor: 'rgba(33,151,255,.1)'}: {}} key={JSON.stringify(o)}>
										<td>{o[heads[0]] || '- -'}</td>
										<td>{o[heads[1]] || '- -'}</td>
										<td>{o[heads[2]] || '- -'}</td>
										{signCol?<td></td>:''}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

// Grouping by class
function ClassReschedules({ reschedules, signCol }: { reschedules: reschedulesDatatype[], signCol:boolean}) {
	const classObj: { [key: string]: { 'Period': string; 'Teacher Assigned': string; 'In Place of': string; 'tags':string }[] } = {};

	for (const resc of reschedules) {
		if (!Object.keys(classObj).includes(resc.className)) {
			classObj[resc.className] = [{ 'Period': String(resc.periodNo), 'Teacher Assigned': resc.teacherName, 'In Place of': resc.for, 'tags':(resc.tags)?.join('__') || '' }];
		} else {
			classObj[resc.className].push({ 'Period': String(resc.periodNo), 'Teacher Assigned': resc.teacherName, 'In Place of': resc.for, 'tags': (resc.tags)?.join('__') || '' });
		}
	}

	return (
		<div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-evenly', flexWrap:'wrap'}}>
			{Object.keys(classObj).map(c => {
				return (
					<div className='printBlock' key={c}>
						<Typography variant='h4' sx={{ fontWeight: 100, opacity: 0.5, textAlign: 'center', mb: 2 }}>
							For Class <span style={{fontWeight: 300}}> ' {c} ' </span>
						</Typography>
						<Tb data={classObj[c]} signCol={signCol} />
					</div>
				);
			})}
		</div>
	);
}

// Grouping by period
function PeriodReschedules({ reschedules, signCol }: { reschedules: reschedulesDatatype[] , signCol:boolean}) {
	const classObj: { [key: string]: { 'Class': string; 'Teacher Assigned': string; 'In Place of': string, 'tags':string }[] } = {};

	for (const resc of reschedules) {
		if (!Object.keys(classObj).includes(String(resc.periodNo))) {
			classObj[String(resc.periodNo)] = [{ 'Class': resc.className, 'Teacher Assigned': resc.teacherName, 'In Place of': resc.for, 'tags':(resc.tags)?.join('__') || ''  }];
		} else {
			classObj[String(resc.periodNo)].push({ 'Class': resc.className, 'Teacher Assigned': resc.teacherName, 'In Place of': resc.for, 'tags':(resc.tags)?.join('__') || ''  });
		}
	}
	return (

		<div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-evenly', flexWrap:'wrap'}}>
			{Object.keys(classObj).map(c => {
				return (
					<div  className='printBlock' key={c}>
						<Typography variant='h4' sx={{ fontWeight: 100, opacity: 0.5, textAlign: 'center', mb: 2 }}>
							During Period - <span style={{fontWeight: 300}}> {c} </span>
						</Typography>
						<Tb data={classObj[c]} signCol={signCol} />
					</div>
				);
			})}
		</div>
	);
}

// Grouping by Teachers
function AbsentTeachersReschedules({ reschedules, signCol }: { reschedules: reschedulesDatatype[], signCol:boolean }) {
	const classObj: { [key: string]: { 'Period': string; 'Class': string; 'In Place of': string, tags: string }[] } = {};

	for (const resc of reschedules) {
		if (!Object.keys(classObj).includes(String(resc.teacherName))) {
			classObj[resc.teacherName] = [{ 'Period': String(resc.periodNo), 'Class': resc.className, 'In Place of': resc.for, 'tags':(resc.tags)?.join('__') || ''  }];
		} else {
			classObj[resc.teacherName].push({ 'Period': String(resc.periodNo), 'Class': resc.className, 'In Place of': resc.for, 'tags':(resc.tags)?.join('__') || ''  });
		}
	}

	return (
		<div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-evenly', flexWrap:'wrap'}}>
			{Object.keys(classObj).map(c => (
				<div className='printBlock' key={c}>
					<Typography variant='h4' sx={{ fontWeight: 100, opacity: 0.5, textAlign: 'center', mb: 2 }}>
						Assigned periods to <span style={{fontWeight: 300}}> ' {c} ' </span>
					</Typography>
					<Tb data={classObj[c]} signCol={signCol} />
				</div>
			))}
		</div>
	);
}

// Grouping the assigned Teachers
function AssignedTeacherReschedules({ reschedules, signCol }: { reschedules: reschedulesDatatype[], signCol:boolean }) {
	const classObj: { [key: string]: { 'Period': string; 'Teacher Assigned': string; 'Class': string, 'tags':string }[] } = {};

	for (const resc of reschedules) {
		if (!Object.keys(classObj).includes(resc.for)) {
			classObj[resc.for] = [{ 'Period': String(resc.periodNo), 'Teacher Assigned': resc.teacherName, 'Class': resc.className, 'tags':(resc.tags)?.join('__') || ''  }];
		} else {
			classObj[resc.for].push({ 'Period': String(resc.periodNo), 'Teacher Assigned': resc.teacherName, 'Class':resc.className, 'tags':(resc.tags)?.join('__') || ''  });
		}
	}

	return (
		<div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-evenly', flexWrap:'wrap'}}>
			{Object.keys(classObj).map(c => {
				return (
					<div className='printBlock' key={c}>
						<Typography variant='h4' sx={{ fontWeight: 100, opacity: 0.5, textAlign: 'center', mb: 2 }}>
							
							Assigned in Absence of <span style={{fontWeight: 300}}> ' {c} ' </span>
						</Typography>
						<Tb data={classObj[c]} signCol={signCol} />
					</div>
				);
			})}
		</div>
	);
}

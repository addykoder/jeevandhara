import { Container, useMediaQuery } from '@mui/material';
import Chart from './Chart';
import { AttendanceCard, Clock, PreferenceCard, RescheduleCard } from './general';
import Styles from './style';

export default function Admin() {
	const isSmall = useMediaQuery('(max-width:1200px)')
	
	return (
		<>
			<Styles isSmall={isSmall}>
				<Container maxWidth='xl' sx={{mb:18}}>
					<div className='container'>
						<Clock />
						<Chart/>
						<AttendanceCard />
						<RescheduleCard />
						{/* <PreferenceCard /> */}
					</div>
				</Container>
			</Styles>
		</>
	);
}
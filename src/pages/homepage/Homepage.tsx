import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Styles from '../viewReschedules/styles';

export default function Homepage() {
	const navigate = useNavigate();
	return (
		<>
			<Styles>
				<div className='wrapper' style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh', justifyContent: 'space-between' }}>
					<Container maxWidth='sm' sx={{ mb: 8 }}>
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', my: 6 }}>
							<img src='/icon512.png' alt='substitutor logo' style={{ aspectRatio: '1/1', width: '100px', margin: 'auto' }} />
							<Typography component='h1' variant='h2' color='primary' sx={{ fontFamily: 'cursive', textAlign: 'center', mt: 2 }}>
								Welcome to JEEVANDHARA
							</Typography>
						</Box>

						<Box sx={{ mt: 8, display: 'flex', gap: 4, alignItems: 'center', flexDirection: 'column' }}>
							<Button onClick={() => navigate('/teacher-entry')} sx={{ p: 1 }} variant='outlined' fullWidth>
								{' '}
								Teacher Entry{' '}
							</Button>
							<Button onClick={() => navigate('/reschedules')} sx={{ p: 1 }} variant='contained' fullWidth>
								{' '}
								View Reschedules{' '}
							</Button>
							<Button onClick={() => navigate('/dashboard')} sx={{ p: 1 }} variant='text' fullWidth>
								{' '}
								Open Dashboard{' '}
							</Button>
						</Box>
					</Container>
				</div>
				<div className='adityaTripathi'>
					Developed and Maintained by <a href='https://adityatripathi.com'>Aditya Tripathi</a>
				</div>
			</Styles>
		</>
	);
}

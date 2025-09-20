import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import useAccountInfo from '../../store/account/useAccountInfo';

export default function Info() {
	const navigate = useNavigate();
	const [data, fetching] = useAccountInfo();
	
	return (
		<div className='info'>
			{/* when logged in */}
			<div className="buttons">
			{fetching === 'fulfilled' && <span>{data.schoolName as unknown as string}</span>}
			</div>
			{/* when not logged */}
			{fetching === 'rejected' && (
				<div className='buttons'>
					<Button onClick={() => navigate('/login')} variant='text'>
						Log in
					</Button>
					<Button onClick={() => navigate('/signup')} variant='contained'>
						Sign up
					</Button>
				</div>
			)}
		</div>
	);
}

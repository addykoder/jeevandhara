import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TailSpin as Loader } from 'react-loader-spinner';
import useVerifyLogin from '../../hooks/useVerifyLogin';
import useLogin from '../../hooks/useLogin';
import theme from '../../context/theme';

export default function Login() {
	const [login] = useLogin();
	const [loading, setLoading] = useState(false);
		
	// if already logged in, will redirect to dashboard
	useVerifyLogin('dashboard');
	const navigate = useNavigate();

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		setLoading(true);

		await login(username, password);

		setLoading(false);
	}
	
	async function handleTestLogin() {
		setLoading(true);

		await login('test', 'testpassword');

		setLoading(false);
	}

	return (
		<>
			<Container component='main' maxWidth='sm' sx={{ mt: 4 }}>
				<Typography sx={{ color: 'primary.main' }} component='h1' variant='h4'>
					Sign in
				</Typography>
				<Box
					sx={{
						mt: 3,
						borderRadius: 2,
						px: 4,
						py: 6,
						background: theme.bgradient,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<Button onClick={handleTestLogin} fullWidth variant='outlined' sx={{ py: 1, mb: 2	 }}>
							Explore without login
						</Button>
						<TextField margin='normal' required fullWidth id='username' label='Username' name='username' autoComplete='username' autoFocus />
						<TextField margin='normal' required fullWidth name='password' label='Password' type='password' id='password' autoComplete='current-password' />

						<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
							{loading ? <Loader height={30} width={30} color='white' /> : 'Sign In'}
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href='#' variant='body2'>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link
									href='#'
									onClick={e => {
										e.preventDefault();
										navigate('/signup');
									}}
									variant='body2'
								>
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</>
	);
}

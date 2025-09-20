import { Box, Button, Container, Grid, Link, TextField, Typography, useMediaQuery } from '@mui/material';
import { Control, Controller, FieldValues, useForm } from 'react-hook-form';
import theme from '../../context/theme';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TailSpin as Loader } from 'react-loader-spinner';
import { useState } from 'react';
import { serverURL } from '../../utils/constants';
import axios from 'axios';
import useToast from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

export default function Signup() {
	const notify = useToast();
	const isLg = useMediaQuery('(min-width:900px)');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [login] = useLogin()

	const schema = yup.object().shape({
		email: yup.string().email().required(),
		password: yup.string().min(8).max(32).required(),
		adminPassword: yup.string().min(8).max(32).required(),
		token: yup.string().required(),
		phone: yup
			.string()
			.required()
			.matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Phone Number not valid'),
		schoolName: yup.string().required(),
		username: yup
			.string()
			.required()
			.matches(/^(?=[a-zA-Z0-9._]{2,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/, 'Invalid username'),
		adminName: yup.string().required(),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	async function onSubmitHandler(data: object) {
		setLoading(true);

		const response = await axios.post(`${serverURL}/auth/signup`, data).catch(() => {
			notify('error', 'Cannot connect to the server');
			setLoading(false);
		});

		if (response?.data.status === 'ok') {
			notify('success', 'Account Created : Log in to start using');
			navigate('/login');
		} else {
			notify('error', response?.data.message);
		}

		setLoading(false);
	}

	async function handleTestLogin() {
		setLoading(true);

		await login('test', 'testpassword');

		setLoading(false);
	}

	return (
		<>
			<Container maxWidth='lg' sx={{ my: 4, mb:8  }}>
				<Typography sx={{ color: 'primary.main' }} component='h1' variant='h4'>
					Create an Account
				</Typography>
				<Box
					component='form'
					onSubmit={handleSubmit(onSubmitHandler)}
					sx={{
						borderRadius: 2,
						px: isLg ? 8 : 2,
						py: isLg ? 6 : 2,
						background: theme.bgradient,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>

					<Button onClick={handleTestLogin} fullWidth variant='outlined' sx={{ py: 1, mb: 2	 }}>
						Explore without login
					</Button>
					<Link
						sx={{ mt: 3 }}
						href='#'
						onClick={e => {
							e.preventDefault();
							navigate('/login');
						}}
						variant='body2'
					>
						{'Already have an account? Log In'}
					</Link>
					<Inp control={control} error={errors?.schoolName?.message as string} name='schoolName' label='School Name' />

					<Inp control={control} error={errors?.adminName?.message as string} name='adminName' label='Admin Name' />

					<Inp control={control} error={errors?.username?.message as string} name='username' label='Username' />

					<Grid spacing={{ lg: 2, xs: 0 }} container>
						<Grid item lg={6} xs={12}>
							<Inp control={control} isPassword error={errors?.password?.message as string} name='password' label='Password' />
						</Grid>

						<Grid item xs>
							<Inp control={control} isPassword error={errors?.adminPassword?.message as string} name='adminPassword' label='Admin Password' />
						</Grid>
					</Grid>

					<Inp control={control} error={errors?.phone?.message as string} name='phone' label='Phone no.' />

					<Inp control={control} error={errors?.email?.message as string} name='email' label='Email ID' />

					<Inp control={control} name='token' error='' label='SignUp Token' />
					<span style={{ width: '100%', opacity: '.6', fontWeight: 200 }}>Don't have one ? Contact the developer... </span>

					<Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
						{loading ? <Loader height={30} width={30} color='white' /> : 'Sign up'}
					</Button>
				</Box>
			</Container>
		</>
	);
}

function Inp({ control, name, label, error, isPassword = false }: { error: string; label: string; isPassword?: boolean; name: string; control: Control<FieldValues> }) {
	const isLg = useMediaQuery('(min-width:900px)');

	return (
		<Box sx={{ my: isLg ? 1 : 0, width: '100%' }}>
			<Controller
				control={control}
				name={name}
				defaultValue=''
				render={({ field }) => (
					<TextField
						{...field}
						color={error ? 'error' : undefined}
						helperText={error}
						margin='normal'
						required
						fullWidth
						id={name}
						label={label}
						name={name}
						autoComplete={name}
						type={isPassword ? 'password' : 'text'}
						autoFocus
					/>
				)}
			/>
		</Box>
	);
}

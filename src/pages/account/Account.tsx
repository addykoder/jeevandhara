import { Box, Button, Container, TextField, Typography, useMediaQuery } from '@mui/material';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import useLogin from '../../hooks/useLogin';
import useAccountInfo from '../../store/account/useAccountInfo';
import useVerifyLogin from '../../hooks/useVerifyLogin';
import Chunk from '../../components/chunk/Chunk';
import axios from 'axios';
import { serverURL } from '../../utils/constants';
import useToast from '../../hooks/useToast';
import { useState } from 'react';
import easyinvoice, { InvoiceData } from 'easyinvoice';

export default function Account() {
	const [, logout] = useLogin();
	const [data, fetching, , refetch] = useAccountInfo();
	useVerifyLogin('login');
	const isMobile = !useMediaQuery('(min-width:600px)');
	const notify = useToast();

	async function createOrder(type: 'mon' | 'ann') {
		displayRazorpay(type);
	}

	// copied from online to load razorpay script
	function loadScript(src: string) {
		return new Promise(resolve => {
			const script = document.createElement('script');
			script.src = src;
			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};
			document.body.appendChild(script);
		});
	}

	async function displayRazorpay(type: string) {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

		if (!res) {
			alert('Payment SDK failed to load. Are you online?');
			return;
		}

		// creating a new order
		const response = await axios.post(`${serverURL}/subscription/createOrder`, { type }).catch(resp => {
			console.log(resp);
			notify('error', 'some error occurred');
		});

		if (!response) {
			alert('Server error. Are you online?');
			return;
		}
		if (response.data.status === 'error') return notify('error', response.data.message);
		// Getting the order details back
		const amount = response.data.payload.amount;
		const id = response.data.payload.orderId;
		const key = response.data.payload.payId;
		const currency = 'INR';

		const options = {
			key, // Enter the Key ID generated from the Dashboard
			amount: amount.toString(),
			currency: currency,
			name: 'Substitutor',
			description: `TXN : ${type}`,
			image: 'https://adityatripathi.com/icon192.png',
			order_id: id,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			handler: async function (response: any) {
				const data = {
					orderCreationId: id,
					razorpayPaymentId: response.razorpay_payment_id,
					razorpayOrderId: response.razorpay_order_id,
					razorpaySignature: response.razorpay_signature,
				};

				// ping checkout route
				const result = await axios.post(`${serverURL}/subscription/verifyCheckout`, data);
				if (result.data.status === 'error') return notify('error', result.data.message);
				console.log(result);
				if (result?.status === 200) {
					notify('success', 'Payment Successful');
					refetch();
				}
			},
			theme: {
				color: '#006cff',
				backdrop_color: '#050f20',
			},
		};

		// error showing because sdk loader afterwords
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const paymentObject = new (window as any).Razorpay(options);
		paymentObject.open();
	}
	const isSmall = !useMediaQuery('(min-width:900px)');

	const [currentAdminPassword, setCurrentAdminPassword] = useState('');
	const [newAdminPassword, setNewAdminPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');

	async function handleChangePassword() {
		if (!currentAdminPassword || !newAdminPassword || !newPassword) return notify('error', 'Fill all the fields');
		const result = await axios.post(`${serverURL}/changePassword`, { currentAdminPassword, newAdminPassword, newPassword });
		if (result.data.status == 'error') {
			notify('error', result.data.message);
		} else {
			notify('success', result.data.message);
			notify('info', 'logging out in 3 seconds');

			setCurrentAdminPassword('');
			setNewAdminPassword('');
			setNewPassword('');
			localStorage.clear();
			setTimeout(() => {
				logout();
			}, 3000);
		}
	}
	


	function downloadPdf(base64String: string, filename = 'Invoice.pdf') {
		// Decode the Base64 string into binary data
		const binaryString = atob(base64String);
		const binaryArray = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			binaryArray[i] = binaryString.charCodeAt(i);
		}

		// Create a Blob object from the binary data
		const blob = new Blob([binaryArray], { type: 'application/pdf' });

		// Use the same approach as before to trigger the download:

		const blobUrl = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = blobUrl;
		link.download = filename;
		link.click();
		window.URL.revokeObjectURL(blobUrl);
	}

	const expiresOn = data.subscription ? data.subscription.expiresOn[data?.subscription?.expiresOn.length - 1] : new Date();

	async function handleDownloadInvoice(type: string) {
		// const invn = Math.floor(Number(new Date(data?.subscription?.expiresOn)) / 100000);
		const exp = (new Date(expiresOn));
		const invn =  `${exp.getMonth()<9?`0${exp.getMonth()+1}`:exp.getMonth()+1}${String(exp.getFullYear()).slice(2,4)}`
		
		const ch = type==='monthly'?'M':'A'
		// const invoiceNumber = `${data?.username?.slice(0, 3).toUpperCase()}${ch}${String(invn).slice(String(invn).length - 4, String(invn).length)}-${Math.floor(Math.random() * 100)}`;
		const invoiceNumber = `#${data?.username?.slice(0, 3).toUpperCase()}${ch}${invn}`;

		const pdfData = {
			mode: data.username === 'test' ? 'development' : 'production',
			client: {
				'company': data.schoolName,
				'zip': data.adminName,
				'city': data.phone,
				'country': data.email,
			},
			sender: {
				'company': 'Substitutor',
				'zip': 'Aditya Tripathi',
				'city': '+91 ----------',
				'country': 'me@adityatripathi.com',
			},
			'images': {
				//      Logo:
				// 1.   Use a url
				logo: 'https://adityatripathi.com/icon192.png',
			},
			'bottomNotice': 'Thanks for using Substitutor.',
			'information': {
				// Invoice number
				'number': invoiceNumber,
				// Invoice data
				'date': `${new Date().getDate()} ${new Date().toLocaleString('default', { month: 'long' }).toLowerCase()}, ${new Date().getFullYear()}`,
			},

			'products': [
				{
					'quantity': '1',
					'description': `${type.toUpperCase()} Subscription`,
					'price': type === 'monthly' ? 1500 : 15999,
				},
			],
			'settings': {
				'currency': 'INR',
			},
		};

		easyinvoice.createInvoice(pdfData as unknown as InvoiceData, async function (result) {
			downloadPdf(result.pdf, `Invoice ${invoiceNumber}.pdf`);
		});
	}

	// function generatePDFfromHTML(htmlContent:string, outputPath:string) {
	// 	pdf.create(htmlContent).toFile(outputPath, (err: any, res:any) => {
	//     if (err) return console.log(err);
	//     console.log('PDF generated successfully:', res);
	//   });
	// 	}

	// 	async function generatePDF() {
	// 		generatePDFfromHTML(pdfContent(data.schoolName, invoiceNumber,'123123','Monthly Subscription', '1,500'), 'sample.pdf'

	return (
		<>
			<Container maxWidth='xl' sx={{ mt: 4, mb: 8 }}>
				<Box component='div' sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Typography component='h1' variant='h3'>
						Your Account
					</Typography>

					<Button onClick={() => logout()} variant='contained' color='error' sx={{ bgcolor: 'red', mt: 3, mb: 2 }}>
						Log out <ExitToAppOutlinedIcon sx={{ ml: 1 }} />
					</Button>
				</Box>

				<Box className='infoGrid' sx={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr 1fr' : '1fr 1fr 1fr', gap: 2 }}>
					<Block data={data.schoolName} label='School Name' fetching={fetching} />
					<Block data={data.username} label='Username' fetching={fetching} />
					<Block data={data.adminName} label='Admin Name' fetching={fetching} />
					<Block data={String(data.phone)} label='Phone' fetching={fetching} />
					<Block data={data.email} label='Email' fetching={fetching} />
				</Box>

				<hr style={{ marginTop: '4rem', marginBottom: '4rem', borderColor: 'rgba(20,20,20,.3)' }} />
				<Typography component='h1' variant='h4' sx={{ mb: '2rem' }}>
					Change Password
				</Typography>

				<form action=''>
					<Box className='infoGrid' sx={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: 2 }}>
						<TextField
							autoComplete='old-password'
							type='password'
							label='Current Admin Password'
							value={currentAdminPassword}
							onChange={e => setCurrentAdminPassword(e.target.value)}
						/>
						<TextField autoComplete='new-password' type='password' label='New Admin Password' value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} />
						<TextField autoComplete='new-password' type='password' label='New User Password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
						<Button variant='contained' onClick={() => handleChangePassword()}>
							Change Password
						</Button>
					</Box>
				</form>

				<hr style={{ marginTop: '4rem', marginBottom: '4rem', borderColor: 'rgba(20,20,20,.3)' }} />
				
			</Container>
		</>
	);
}

export function Block({ label, data, fetching = 'fulfilled' }: { label: string; data: string; fetching?: string }) {
	const isSmall = !useMediaQuery('(min-width:900px)');

	return (
		<Box sx={{ p: 1, mx: isSmall ? 0 : 1, borderRadius: 2 }} className='infoPiece'>
			<Typography color='primary' variant='h6' sx={{ fontSize: '1rem', fontWeight: 400 }}>
				{label} :
			</Typography>
			<Typography variant='h4' sx={{ fontSize: '1.5rem', fontWeight: 300 }}>
				<Chunk data={data} fetching={fetching} />
			</Typography>
		</Box>
	);
}

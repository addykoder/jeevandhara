import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAccountInfo from "../store/account/useAccountInfo";
import useToast from "./useToast";

export default function useVerifyLogin(mode:'dashboard' | 'login') {
	const [, fetching,] = useAccountInfo()	
	const navigate = useNavigate()
	const toast = useToast()

	useEffect(() => {
		if (fetching === 'fulfilled' && mode === 'dashboard') {
			toast('info', 'You are already logged in')
			navigate('/dashboard')
		}
		else if (fetching === 'rejected' && mode === 'login') {
			toast('info', 'Authentication failed, Check your Internet Connection and Reload or Try logging in again.')
			navigate('/login')
		}

	},[fetching])
}
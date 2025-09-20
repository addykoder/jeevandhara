import { useContext } from 'react';
import { toastContext } from '../App';

export default function useToast() {
	const toast = useContext(toastContext);
	const pos = toast.POSITION.TOP_RIGHT;
	const cn = 'toast-message'

	function createToast(type: 'success' | 'error' | 'warning' | 'info', message: string) {
		switch (type) {
			case 'success':
				toast.success(message, {
					position: pos,
					className: cn,
				});
				break;
			case 'error':
				toast.error(message, {
					position: pos,
					className: cn,
				});
				break;
			case 'warning':
				toast.warning(message, {
					position: pos,
					className: cn,
				});
				break;
			case 'info':
				toast.info(message, {
					position: pos,
					className: cn,
				});
				break;

			default:
				toast(message, {
					position: pos,
					className: cn,
				});
		}
	}

	return createToast;
}

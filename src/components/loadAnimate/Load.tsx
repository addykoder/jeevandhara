import { motion } from 'framer-motion';
import Sign from './Sign';

export default function Loader({onLoad, onStart}:{onLoad:()=>void, onStart:()=>void}) {
	return (
		<motion.div
			style={{position:'fixed', inset:0, zIndex:1000, backgroundColor:'rgb(5 15 32)', height:'100%', width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'2rem'}}
			animate={{
				opacity: [1, 1, 0, 0],
				translateY: [0, 0, 0, '-200%'],
				width:['100%', '100%', '100%', 0],
				height:['100%', '100%', '100%', 0]
			}}
			transition={{
				duration: 6.25,
				ease: 'easeInOut',
				times: [0, 0.9, 0.99, 1],
			}}
			onAnimationComplete={onLoad}
			onAnimationStart={onStart}
		>
			<div
				style={{background:'url("/icon512.png")', backgroundPosition:'center center', backgroundColor:'rgb(5 15 32)', backgroundSize:'contain', backgroundRepeat:'no-repeat', width:'25%', height:'25%'}}
			/>
			<Sign className='relative bottom-4' width={150} height={75} stroke={8} duration={.75} />
		</motion.div>
	);
}
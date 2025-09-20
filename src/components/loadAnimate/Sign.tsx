import { motion } from 'framer-motion';

export default function Sign(props: any) {
	function getVariant(delay: number, duration: number) {
		return {
			hidden: {
				pathLength: 0,
			},
			visible: { pathLength: 1, transition: { duration: duration * (props.duration || 1), delay: delay * (props.duration || 1), ease: 'easeInOut' } },
		};
	}
	return (
		<motion.svg {...props} viewBox='0 0 978 446' fill='none' xmlns='http://www.w3.org/2000/svg'>
			{/* A */}
			<motion.path
				stroke='white'
				strokeWidth={props.stroke}
				variants={getVariant(0, 1)}
				initial='hidden'
				animate='visible'
				d='M170.5 131.5C96.9999 26 30.4999 268 136.5 200C209.5 150 149 117.5 175 185C209 236 240 155 230 107C218.75 53 136.5 -9 44 98C-57.5001 224.5 56 398.5 223.5 239'
			/>

			{/* FLOW */}
			<motion.path
				stroke='white'
				strokeWidth={props.stroke}
				variants={getVariant(0.6, 2)}
				initial='hidden'
				animate='visible'
				d='M290.5 109.5C247.5 40.5 209.5 155 245.5 171C279 180.5 307.5 140.5 311.5 128.5C317 117 317.467 61.3863 317 44C315 -30.5 287.65 121.884 325 160.5C338.5 177.5 364.5 160 377 131.5C400.5 53 361 58 379 143.5C389.5 184 421.5 162.5 431.5 143.5C443 124 440 83.5 440 71.5C436 -10 399.5 46.5 441 143.5C466.5 186.5 511 101 503 69C498.964 63.6185 489.5 114.5 512 139.5C536.5 159.5 564.5 117 563 92C561.5 41.5 548 66 561 182.5C581.979 370.5 419 309.5 566 163.5C675 41 553.5 68 589 129C620.5 178 650 107.5 627.5 89.5C694.5 189.5 666 78.5 717 114.5'
			/>

			{/* DOT */}
			<motion.path
				stroke='white'
				strokeWidth={props.stroke}
				variants={getVariant(2.6, 0.2)}
				initial='hidden'
				animate='visible'
				d='M371.868 14.1391C357.368 41.1391 422.868 14.1391 384.368 2.13908C371.568 0.53908 368.034 13.1391 367.868 19.6391'
			/>

			{/* T - LINE */}
			<motion.path
				stroke='white'
				strokeWidth={props.stroke}
				variants={getVariant(3, 0.2)}
				initial='hidden'
				animate='visible'
				d='M407.368 59.6391L428.248 56.1901L438.23 54.5414L519.368 41.1391'
			/>
			{/* Underlining Aditya sign */}
			{/* <motion.path stroke='white' strokeWidth={props.stroke} variants={getVariant(3.5, 0.1)} initial='hidden' animate='visible' d='M301.868 231.139L473.368 212.639' />
			<motion.path stroke='white' strokeWidth={props.stroke} variants={getVariant(3.7, 0.1)} initial='hidden' animate='visible' d='M356.132 272.721L468 258.861' /> */}

			<motion.path initial='hidden' animate='visible' variants={getVariant(3.2, .2)} d='M253 247C253 247 253 247 474 224.5' stroke='white' strokeWidth={props.stroke} />
			<motion.path initial='hidden' animate='visible' variants={getVariant(3.3, .2)} d='M325 239C317.667 298.667 309 438 319 438' stroke='white' strokeWidth={props.stroke} />
			<motion.path
initial='hidden' animate='visible'
				variants={getVariant(3.5, .8)}
				d='M371.5 429C381.228 408.904 399.868 370.509 382.341 323.299C371.106 293.037 331.366 367.533 390.739 383.347C443.912 397.509 442.546 323.913 442.181 318.927C441.663 311.839 416 394.133 458 413.633C503.5 430 501 323.299 500 323.299C499 323.299 485.067 368.754 507.5 400C521.5 419.5 545 407 548.5 394'
				stroke='white'
				strokeWidth={props.stroke}
			/>
			<motion.path initial='hidden' animate='visible' variants={getVariant(4.1, .2)} d='M499.773 306.947C487.663 311.022 513.616 313.974 500.085 305.48'stroke='white' strokeWidth={props.stroke} />
			<motion.path initial='hidden' animate='visible' variants={getVariant(4.2, .2)} d='M546.226 331.001C551.224 337.655 549.631 453.078 541.889 511.798'stroke='white' strokeWidth={props.stroke} />
			<motion.path initial='hidden' animate='visible' variants={getVariant(4.4,.2)} d='M549 378C548.908 321.857 605 314.5 613 367.5C616.5 413.5 572.5 416 554.5 391'stroke='white' strokeWidth={props.stroke} />

			<motion.path
initial='hidden' animate='visible'
			variants={getVariant(4.6,.8)}
				d='M670.5 339.5C647.893 295.819 593.983 389.249 654.471 402.465C711.5 408 699.659 322.118 691.4 325.73C685 325.73 680 386.5 704 395C762.5 420 773 220.5 759.644 231.354C749 232.5 749.5 338 755.5 368.5C758.559 384.047 765.551 394.352 777 392.5'
				stroke='white'
				strokeWidth={props.stroke}
			/>
			<motion.path
initial='hidden' animate='visible'
			variants={getVariant(5.2,.8)}
				d='M724.475 327.331C753.045 320.276 802.966 333.456 821.042 285.484C842.641 222.518 796.97 203.724 796.97 330.446C796.97 469 788.978 325.433 835.973 328.698C860.461 336.547 842.774 375.47 860.386 383.736C882.872 392.582 907.508 306.621 893.514 303.099C872.506 308.066 883.5 428 942.617 367.464'
				stroke='white'
				strokeWidth={props.stroke}
			/>
			<motion.path initial='hidden' animate='visible' variants={getVariant(5.9, .2)} d='M891.026 271.889C882.334 292.749 924.64 270.466 898.88 262.448C890.392 261.593 888.467 271.238 888.566 276.167' stroke='white' strokeWidth={props.stroke} />
		</motion.svg>
	);
}

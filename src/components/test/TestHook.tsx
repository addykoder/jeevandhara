import useAttendanceHistory from "../../store/attendanceHistory/useAttendanceHistory";

export default function Test() {
	// const [classes, , fetching, updating, updateMessage, fetchMessage] = useClasses();

	// const [inp, setInp] = useState('{"preference":{"excludedClasses":[]}}');

	// const [ status, fetchingStatus, statusMessage ] = useSubscriptionStatus()
	// const [history, fetchingHistory, historyMessage] = useSubscriptionHistory()

	// const [data, fetching, message] = useAccountInfo()

	// const [attendance, reschedules, notified, confirmReschedules, submitAttendance, fetchingReschedules, confirmingReschedules, fetchingAttendance, submittingAttendance, submitAttendanceMessage, confirmMessage, fetchAttendanceMessage, fetchReschedulesMessage] = useReschedules()

	// const [id, setId] = useState(0)

	// const [data, updateTeacher, createTeacher, deleteTeacher, fetching, updating, creating, deleting, fetchMessage, updateMessage, createMessage, deleteMessage] = useTeacher()

	const [data, fetching, fetchMessage ] = useAttendanceHistory()

	return (
		<>
			fetching
			<h2>{fetching}</h2>
			fetching message
			<h2>{fetchMessage}</h2>
			history
			<h2>{JSON.stringify(data)}</h2>

			{/* fetching
			<h1>{fetching}</h1>
			All teachers
			<h1>{JSON.stringify(data)}</h1>
			fetchMessage
			<h1>{fetchMessage}</h1> */}
			..............................................
			{/* deleting
			<h1>{deleting}</h1>
			delete message
			<h1>{deleteMessage}</h1>
			<input type="number" onChange={e=>setId(Number(e.target.value))}/>
			<button onClick={()=>{deleteTeacher(id)}}>Delete Teacher</button> */}
			{/* creating
			<h1>{ creating }</h1>
			createMessage
			<h1>{createMessage}</h1>
			<button onClick={() => {
				createTeacher({
					name: 'testing', category: 'junior', classTeacherOf: '1-a', timeTable: {
				mon:['free','free','free','free','free','free','free','free',],
				tue:['free','free','free','free','free','free','free','free',],
				wed:['free','free','free','free','free','free','free','free',],
				thu:['free','free','free','free','free','free','free','free',],
				fri:['free','free','free','free','free','free','free','free',],
				sat:['free','free','free','free','free','free',],
			}})}}> create a test teacher</button> */}
			{/* updating
			<h1>{updating}</h1>
			update message
			<h1>{updateMessage}</h1>

			<input type="number" onChange={e=>setId(Number(e.target.value))}/>

			<button onClick={() => {
				updateTeacher(id, {
				name:'modified', category: 'junior', classTeacherOf: '1-a', timeTable: {
				mon:['free','free','free','free','free','free','free','free',],
				tue:['free','free','free','free','free','free','free','free',],
				wed:['free','free','free','free','free','free','free','free',],
				thu:['free','free','free','free','free','free','free','free',],
				fri:['free','free','free','free','free','free','free','free',],
				sat:['free','free','free','free','free','free',],
			}})}}> update a test teacher</button> */}



			{/* attendance
			<h2>{JSON.stringify(attendance)}</h2>
		reschedules
			<h2>{JSON.stringify(reschedules)}</h2>
			notified
			<h2>{JSON.stringify(notified)}</h2>
		mess
		fetchingAttendance
			<h2>{fetchingAttendance}</h2>
		fetching REschedules
			<h2>{fetchingReschedules}</h2>
			confirming
			<h2>{confirmingReschedules}</h2>
			fetch Attendance message
			<h2>{fetchAttendanceMessage}</h2>
			fetch Reschedule message
			<h2>{fetchReschedulesMessage}</h2>
			confirm message
			<h2>{confirmMessage}</h2>
			<button onClick={()=>confirmReschedules()}> confirm reschedules</button>
			submitting attendance
			<h2>{submittingAttendance}</h2>
			submitAtt message
			<h2>{submitAttendanceMessage}</h2>
			<button onClick={()=>submitAttendance([])}> submit Attendance</button> */}



		{/* data
			<h1>{JSON.stringify(data)}</h1>
			fetching
			<h1>{fetching}</h1>
			message
			<h1>{message}</h1> */}
		

			{/* <h1>hello world how are you</h1>
			classes
			<h2>{JSON.stringify(classes)}</h2>
			fetching
			<h2>{fetching}</h2>
			updating
			<h2>{updating}</h2>
			updateMessage
			<h2>{updateMessage}</h2>
			fetchMessage
			<h2>{fetchMessage}</h2> */}
		</>
	);
}

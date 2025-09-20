function getRandomItem(arr:JSX.Element[]) {

    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    const item = arr[randomIndex];

    return item;
}

export default function getTip() {
	return getRandomItem(tips)
}

export const tips = [
	<span>
		You can substitute Teachers to Classes where they are already a regular teacher, So that they can utilize that time to teach something or continue their respective Course. Just turn on the 'Allot Substitutions to Regular Teachers' option in the preferences and see the magic happen.
	</span>,

	<span>
		You can restrict the substitution of Teachers to their respective Categories, So that a PGT teacher won't be alloted to a junior class and junior Teachers who are more experienced in handling young children won't be alloted to higher classes. 
	</span>,

	<span>
		You can easily Notify teachers about their respective reschedules automatically just by turning on Messaging from the preferences. After the attendance will be taken and confirmed, an SMS will be automatically sent to teachers stating their daily substitution on their submitted phone numbers.
	</span>,

	<span>
		You can fill up the data of every Teacher hassle free and accurately, by Opening the 'Allow Teacher Entry Portal' from the preferences. You will get a portal link, Share it with the concerned teachers and they can themselves fill up their respective data, and the changes will be immediately reflected in the School's Database. Make sure not to share the portal link with anyone else and positively close the portal from preferences after using, Otherwise anyone unauthorized can submit spam data in the school database.
	</span>,
	<span>
		!!! WARNING. Never change the weekday and saturday period count Variables in the preferences once being initialized, This causes bugs in the application and results in inefficient Reschedules being alloted by the algorithm. It is given to just be calibrated once in the setup. 
	</span>,

	<span>
		Have an event in your School? The last 2 periods are not going to be held for the next month? No problem, just add those periods to EXCLUDED PERIODS list from preferences and substitutions on those periods will be ignored by the algorithm.
	</span>,

	<span>
		Having boards in your school, 10th and 12th classes are on preparation leave? OR Junior classes are having summer holiday while higher classes are having regular school. No worries ! just add the classes which are not having regular school to the excluded Classes list , and the substitutions in those classes will be ignored and Teachers teaching in those classes will be considered free to take substitutions in other classes. very EFFICIENT! Right?.
	</span>,

	<span>
		Facing an Error in the application ? Have a suggestion to improve the application ? Or just need guidance on using the application ? Contact Aditya Tripathi - me@adityatripathi.com for help.
	</span>,

	<span>
		!!! WARNING. Never Delete or Rename a class from the classes page if it is used in the timetables of teachers. This may cause some unexpected bugs. To Delete or Rename a class, Remove it's references from Teachers's timetables, classes Teachers Of, excluded Classes list first. 
	</span>,

	<span>
		The handling level variable in a class shows that how hard or easy is it to handle that particular class for a teacher, 1 being very easy and 50 being very hard. This information helps to substitute teachers to classes which are in the boundaries of their control. No more substitutions of unexperienced teachers in hard to handle classes which result in undisciplined behavior of classes. JUST fill in this variable as accurately as possible, You can also change it later.   
	</span>,

	<span>
		You have 4 predefined categories to group teachers on the basis of their job. 1 - Sub-Junior, 2 - Junior, 3 - Senior, 4 - PGT. select the best category a teacher/class belongs to in order to restrict the Teachers to the classes of the same category.
	</span>,

	<span>
		You can get a public link for the Reschedules page and can share it with teachers, so that they can easily view that day's reschedules on their mobile phones any number of times without any hassle.
	</span>,

	<span>
		You have a lot of options in the view reschedules page to group the rescheduled periods based of various variables, which can improve visibility and understanding. You can also print the page to get a formatted, good looking hard copy of the reschedules.
	</span>,

	<span>
		Have a sudden change in Teachers' presence, but already taken the attendance? No problem you can Retake the attendance any number of times. And the algorithm will substitute the new periods while trying the best to preserve the previous ones.
	</span>,

	<span>
		Want to explore and have a look on the older Attendance, No Problem, Substitutor preserves all the attendance taken by the school throughout the lifetime. Just click on the date input in the view attendance page and select the date of which's attendance you want to see.
	</span>


]

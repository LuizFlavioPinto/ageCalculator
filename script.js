const todayDate = new Date()
const todayYear = todayDate.getFullYear()
const todayMonth = todayDate.getMonth()
const todayDay = todayDate.getDate()

const errorMessagesArray = document.querySelectorAll('p')

const inputDivs = document.querySelectorAll('.inputsDiv div')


const inputs = document.querySelectorAll('input')
let dateInputValues = [0, 0, 0]

inputs.forEach((input, i) => {
	input.addEventListener('input', function() {
	    // Remove caracteres não numéricos
	    this.value = this.value.replace(/[^0-9]/g, '');
	    dateInputValues[i] = this.value

	    if(this.style.borderColor == 'red') noError(i)
	   
	});

})

let outputs = document.querySelectorAll('.resultOutput')


function execute (inputDay , inputMonth , inputYear ) {

	let checkedDate = validateDate(inputDay, inputMonth, inputYear)
	
	if(checkedDate.some(element => element == null) == true) return 

	let age = calculateAge(checkedDate[0], checkedDate[1], checkedDate[2])

	age = [age[2], age[1], age[0]]

	outputs.forEach( (output, i) => {
		output.innerHTML = age[i]
	})
	
}

function validateDate (inputDay, inputMonth, inputYear) {

	if (inputYear === 0) inputYear = null

	if(inputYear >= 0 && inputYear < 100) inputYear = null
	
	if(inputYear > todayYear){
		inputYear = null
		console.log('Year bigger than the current one')
	}


	if(inputMonth < 1 || inputMonth > 12) {
		inputMonth = null
		console.log('non-existent month')
	} else if (inputYear == todayYear && inputMonth > todayMonth + 1){
		// todayMonth + 1 because they start at 0 in january
		inputMonth = null
		console.log('Month bigger than the current one')
	}


	if(inputDay < 1 || inputDay > 31){
		inputDay = null
		console.log('non-existent day')
	} else if(inputDay > new Date(inputYear, inputMonth, 0).getDate()){
		console.log(`There is no day ${inputDay} on this month`)
		inputDay = null
	} else if (inputYear == todayYear && inputMonth == todayMonth + 1 && inputDay > todayDay){
		inputDay = null
		console.log('Day bigger than the current one')
	}

	let dateValueArray = [inputDay, inputMonth, inputYear]
	for(let i = 0; i < dateValueArray.length; i++){
		if(dateValueArray[i] == null){
			showError(i)
		} else {
			noError(i)
		}	
	} 
	
	return dateValueArray
	
}

function calculateAge (inputDay , inputMonth , inputYear ) {

	inputYear = parseInt(inputYear)
	inputMonth = parseInt(inputMonth)
	inputDay = parseInt(inputDay)

	let givenDate = new Date (inputYear, inputMonth - 1, inputDay)
	let givenDateToMiliseconds = givenDate.getTime()
	let todayDateToMiliseconds = todayDate.getTime()
	let miliscondsOfLife = todayDateToMiliseconds - givenDateToMiliseconds
	
	let daysOfLife = Math.floor(miliscondsOfLife/1000/60/60/24)
	let monthsOfLife = 0
	let yearsOfLife = 0


 	// Years part

	if(daysOfLife >= 365){

		for(let i = 1; i <= todayYear - inputYear; i++){
			
			if((((inputYear + i) % 4 === 0 && (inputYear + i) % 100 !== 0) || ((inputYear + i) % 400 === 0)) && daysOfLife >= 366){
				daysOfLife -= 366
				yearsOfLife++

			} else if ( !(((inputYear + i) % 4 === 0 && (inputYear + i) % 100 !== 0) || ((inputYear + i) % 400 === 0)) && daysOfLife >= 365) {
				daysOfLife -= 365
				yearsOfLife++
				
			} 

		}

	}

	// Months part

	let amountOfDaysOfTheMonths = []


	for(let i = 0; i <= 12 ; i++){
		
		amountOfDaysOfTheMonths[i] = new Date(inputYear + yearsOfLife, inputMonth+i, 0).getDate()

		if(daysOfLife >= amountOfDaysOfTheMonths[i]){

			daysOfLife -= amountOfDaysOfTheMonths[i]
			monthsOfLife++

		} else if (daysOfLife < amountOfDaysOfTheMonths[i]){

			break
		}
	}


	return [daysOfLife, monthsOfLife, yearsOfLife]

}

function noError (validDatePosition){
	errorMessagesArray[validDatePosition].classList.remove('show')
	errorMessagesArray[validDatePosition].classList.add('hidden')

	inputDivs[validDatePosition].querySelector('label').style.color = ''
	inputDivs[validDatePosition].querySelector('input').style.borderColor = ''
	
}

function showError (invalidDatePosition) {
	errorMessagesArray[invalidDatePosition].classList.add('show')
	errorMessagesArray[invalidDatePosition].classList.remove('hidden')

	inputDivs[invalidDatePosition].querySelector('label').style.color = 'red'
	inputDivs[invalidDatePosition].querySelector('input').style.borderColor = 'red'

}
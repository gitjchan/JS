





var Helpers = {
	getDay: function (date) {
		if (date === 'current') {
			date = Date.now();
		};
		var newDate = new Date(date);
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		var today = newDate.getDay();
		
		return days[today];
	},
	getDayStart: function(array) {
		var times;
		var startTimes = [];
		for (var i = 0; i < array.length; i++) {
			times = array[i].dt_txt.split(' ')[1];			
			if (times === '00:00:00') {
				startTimes.push(i);
			};
		};
		return startTimes;
	},
	getCelsius: function (num) {
		var celsius = num-273.15;
		return parseInt(celsius.toFixed());
	},
	getProperty: function(obj, day, startingIndex, property) {
		var today = this.getDay(Date.now());
		var arrayValue = [];
		var value;
		var initialValue = startingIndex;
		var hours = 7;

		initialValue += hours;

		// Current weather
		if (Array.isArray(obj) !== true) {
			switch (property) {
				case "maxTemp":
					push = this.getCelsius(obj.main.temp_max);
					value = push;
					break;
				case "minTemp":
					push = this.getCelsius(obj.main.temp_min);
					value = push;
					break;
				case "summary":
					value = '';
					push = obj.weather[0].description;
					push = this.capitalizeFirstLetter(push);
					break;
				case "icon":
					value = 0;
					push = obj.weather[0].id;
					break;	
			}

			arrayValue.push(push);

			if (property === 'summary' || property === 'icon') {
				return this.getOccurences(arrayValue);	
			} else {
				return value;
			};
		};

		// Forecast
		for (var i = initialValue; i >= startingIndex; i--) {
			if (this.getDay(obj[i].dt_txt) === day ) {
				var push;
				switch (property) {
					case "maxTemp":
						value = 0;
						value = Math.max.apply(null, arrayValue);
						push = this.getCelsius(obj[i].main.temp_max);
						break;
					case "minTemp":
						value = 0;
						value = Math.min.apply(null, arrayValue);
						push = this.getCelsius(obj[i].main.temp_min);
						break;
					case "summary":
						value = '';
						push = obj[i].weather[0].description;
						push = this.capitalizeFirstLetter(push);
						break;
					case "icon":
						value = 0;
						push = obj[i].weather[0].id;
						break;	
				}
				
				arrayValue.push(push);
				
			};
		};
		if (property === 'summary' || property === 'icon') {
			return this.getOccurences(arrayValue);	
		} else {
			return value;
		};
	},
	capitalizeFirstLetter: function (string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	},
	getOccurences: function(arr) {
		var sortedArray = arr.sort();
		var filteredArray = [];
		var occurrences = [];
		var prev;
		var highestNum;

		for (var i = 0; i < sortedArray.length; i++) {
			if (sortedArray[i] !== prev) {
				filteredArray.push(sortedArray[i]);
				occurrences.push(1);
			} else {
				occurrences[occurrences.length-1]++;
			};
			prev = sortedArray[i];
		};

		highestNum = Math.max.apply(null, occurrences);
		highestNum = occurrences.indexOf(highestNum)

		return filteredArray[highestNum];

	}
};


var App = {
	currentDay: [],
	forecast: [],
	init: function() {
		// Get inputbox
		var input = document.getElementById('searchText');
		input.focus();

		document.getElementById('filter').addEventListener('change', function(e) {
			var boxes = document.querySelectorAll('.boxes');
			var value = input.value;
			
			getCurrentWeather(value);
			getForeCast(value);
			
			input.value = '';
			
			// Everytime a search is made reset the array for new input
			App.currentDay = [];
			App.forecast = [];

			// Reponsive window
			resize(boxes);
		});
	},
	prepareData: function(response, call) {
		var city = function() {
			if (call === 'current') {
				return response.name;
			} else {
				return response.city.name;
			};
		};

		var list = function() {
			if (call === 'current') {
				return response;
			} else {
				return response.list;
			};
		};

		// Need to figure out how many days to show forecast
		// API array doesn't always start at 00:00:00
		// We have to take into consideration the number of days to calculate as day progresses
		var numForecast = Helpers.getDayStart(list()).length;
		this.extractData(list(), call, numForecast);
		// Current weather
		if (call === 'current') {
			var currentWeather = this.currentDay[0];
			var currentOutput = '';
			currentOutput +=
			`
			<div class="p-5"><h3>${currentWeather.location}</h3></div>
			<div class="card d-inline-block h-5">
				<h2>Today</h2>
				<i class="wi wi-owm-${currentWeather.id}"></i>
				<div class="card-body ">
					<h3 class="card-title">
						${currentWeather.maxTemp}&#8451 | ${currentWeather.minTemp}&#8451
					</h3>
					<h5 class="card-title">${currentWeather.summary}</h5>
				</div>
			</div>
			`	
			current.innerHTML = currentOutput;
		};
		
		// Forecast
		if (call === 'forecast') {
			var foreCastOutput = '';
			for(var i = 0; i < numForecast; i++) {
				var day = this.forecast[i].day;
				var maxTemp = this.forecast[i].maxTemp;
				var minTemp = this.forecast[i].minTemp;
				var summary = this.forecast[i].summary;
				var id = this.forecast[i].id;
				foreCastOutput += 
				`
				<div class="card d-inline-block">
					<h2>${day}</h2>
					<i class="wi wi-owm-${id}"></i>
					<div class="card-body">
						<h3 class="card-title">
							${maxTemp}&#8451; | ${minTemp}&#8451;
						</h3>
						<h5 class="card-title">${summary}</h5>
					</div>
				</div>
				`
			};	
			forecast.innerHTML = foreCastOutput;
		};
		
	},
	extractData: function(data, call, numForecast) {
		var dayStart = Helpers.getDayStart(data),
		day, dayObject, maxTemp, minTemp, summary, icon;

		if (call === 'forecast') {
			var increment = 0;
			for (var i = 0; i < numForecast; i++) {
				increment = dayStart[i];
				day = Helpers.getDay(data[increment].dt_txt.split(' '));
				maxTemp = Helpers.getProperty(data, day, increment, 'maxTemp');
				minTemp = Helpers.getProperty(data, day, increment, 'minTemp');
				summary = Helpers.getProperty(data, day, increment, 'summary');
				icon = Helpers.getProperty(data, day, increment, 'icon');
				dayObject = new NewDay(day, maxTemp, minTemp, summary, icon);

				this.forecast.push(dayObject);
			};	
		};

		if (call === 'current') {
			var location = data.name + ', ' + data.sys.country;
			day = Helpers.getDay('current');
			maxTemp = Helpers.getProperty(data, day, increment, 'maxTemp');
			minTemp = Helpers.getProperty(data, day, increment, 'minTemp');
			summary = Helpers.getProperty(data, day, increment, 'summary');
			icon = Helpers.getProperty(data, day, increment, 'icon');
			dayObject = new NewDay(day, maxTemp, minTemp, summary, icon, location);
			this.currentDay.push(dayObject);
		};	
	}
};



// Constructor function to store information for days
function NewDay(day, maxTemp, minTemp, summary, id, location) {
	this.day = day;
	this.maxTemp = maxTemp;
	this.minTemp = minTemp;
	this.summary = summary;
	this.id = id;
	this.location = location;
};

// Function to resize window when smaller than 600 width
function resize(element) {
	window.addEventListener('resize', function() {
		for (var i = 0; i < element.length; i++ ) {
			if (window.innerWidth <= 600) {
				element[i].classList.add("flex-column");	
			} else {
				element[i].classList.remove("flex-column");
			};			
		};

	})	
};

function getForeCast(location) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(xhttp.response);
			// Get data that we need to output results for forecast
			App.prepareData(response, 'forecast');

		};
	};
	xhttp.open("GET", `https://api.openweathermap.org/data/2.5/forecast?q=${location}&APPID=5c23dc0ca2987a175de9fe08f14875c7`, true);
	xhttp.send();
};

function getCurrentWeather(location) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(xhttp.response);
			// Get data that we need to output results for current day
			App.prepareData(response, 'current');

		};
	};
	xhttp.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=5c23dc0ca2987a175de9fe08f14875c7`, true);
	xhttp.send();
};

// Run App
App.init();
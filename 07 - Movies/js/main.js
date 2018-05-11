document.addEventListener("DOMContentLoaded", function() {
	
	document.getElementById("searchForm").addEventListener("submit", function(e) {
		// debugger;
		var input = document.getElementById("searchText");
		var inputText = input.value;
		getMovies(inputText);
		// Prevents default actions from happening
		e.preventDefault(); 
	})

});

function getMovies(movie) {

	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(xhttp.responseText);
			var results = response.results;
			var output = '';
			results.forEach(function(result) {
					var title = result.title;
					var poster = result.poster_path;
					var id = result.id;
					output += 
					`
					<div class="col-md-3">
						<div class="well text-center">
							<img src="https://image.tmdb.org/t/p/w500${poster}">
							<h5>${title}</h5>
							<a onclick="movieSelected('${id}')" class="btn btm-primary" href="#">Movie Details</a>
						</div>
					</div>
					`;
			});
			document.getElementById("movies").innerHTML = output;
	    }
	};
	xhttp.open("GET", `https://api.themoviedb.org/3/search/movie?api_key=98325a9d3ed3ec225e41ccc4d360c817&language=en-US&query=${movie}`, true);
	xhttp.send();

}


function movieSelected(id) {
	sessionStorage.setItem('movieId', id);
	window.location = 'movie.html';
	return;
}

function getMovie() {
	var movieId = sessionStorage.getItem('movieId');
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(xhttp.responseText);
			var poster = response.poster_path;
			var title = response.title;
			var output = '';
					output += 
					`
					<div class="row">
						<div class="col-md-4">
							<img src="https://image.tmdb.org/t/p/w500${poster}" class="thumbnail">
						</div>
						<div class="col-md-8">
							<h5>${title}</h5>
							<ul class="list-group">
								<li class="list-group-item">${response.tagline}</li>
								<li class="list-group-item">${response.overview}</li>
								<li class="list-group-item">${response.genres[0].name}</li>
								<li class="list-group-item">${response.release_date}</li>
							</ul>
						</div>
					</div>
					`;
			document.getElementById("movie").innerHTML = output;
			console.log(response);
	    }
	};
	xhttp.open("GET", `https://api.themoviedb.org/3/movie/${movieId}?api_key=98325a9d3ed3ec225e41ccc4d360c817`, true);
	xhttp.send();
};
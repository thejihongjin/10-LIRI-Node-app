// # LIRI Bot
// ### Overview
// In this assignment, you will make LIRI. LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

// ### Before You Begin
// 1. LIRI will search Spotify for songs, Bands in Town for concerts, and OMDB for movies.

// ## Submission Guide
// Create and use a standard GitHub repository. As this is a CLI App, it cannot be deployed to GitHub pages or Heroku. This time you'll need to include screenshots, a GIF, and/or a video showing us that you have the app working with no bugs. You can include these screenshots/GIFs or a link to a video in a `README.md` file.
// * Include screenshots (or a GIF/Video) of the typical user flow of your application. Make sure to include the use of Spotify, Bands in Town, and OMDB.
// * Include any other screenshots you deem necessary to help someone who has never been introduced to your application understand the purpose and function of it. This is how you will communicate to potential employers/other developers in the future what you built and why, and to show how it works.
// * Because screenshots (and well-written READMEs) are extremely important in the context of GitHub, this will be part of the grading.
// If you haven't written a markdown file yet, [click here for a rundown](https://guides.github.com/features/mastering-markdown/), or just take a look at the raw file of these instructions.






require("dotenv").config();

var keys = require("./keys.js");

var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var fs = require("fs");



// 3. To retrieve the data that will power this app, you'll need to send requests using the `axios` package to the Bands in Town, Spotify and OMDB APIs. You'll find these Node packages crucial for your assignment.
//    * [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)
//    * [Axios](https://www.npmjs.com/package/axios)
//      * You'll use Axios to grab data from the [OMDB API](http://www.omdbapi.com) and the [Bands In Town API](http://www.artists.bandsintown.com/bandsintown-api)
//    * [Moment](https://www.npmjs.com/package/moment)
//    * [DotEnv](https://www.npmjs.com/package/dotenv)



var command = process.argv[2];
var userInput = process.argv.slice(3).join("+").toLowerCase(); // remove punctuation??

var artist = "";
var song = "";
var movie = "";
var queryUrl = "";

var text = "";

// make switch case into functions?
switch (command) {
    case "concert-this": // node liri.js concert-this <artist/band name here>
        // * This will search the Bands in Town Artist Events API(`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:
        // * Name of the venue
        // * Venue location
        // * Date of the Event(use moment to format this as "MM/DD/YYYY")
		artist = userInput;
		queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
		axios.get(queryUrl).then(
			function(response) {
				console.log(response);
				//console.log("Venue name: " + response.);
				//console.log("Location: " + response.);
				//console.log("Event date: " + response.);
			}
		);
        break;

    case "spotify-this-song": // node liri.js spotify-this-song <song name here>
        // * This will show the following information about the song in your terminal / bash window
        // * Artist(s)
        // * The song's name
        // * A preview link of the song from Spotify
        // * The album that the song is from
        // * You will utilize the[node - spotify - api](https://www.npmjs.com/package/node-spotify-api) package in order to retrieve song information from the Spotify API.

		
		if (userInput !== "") {
			song = userInput;
		} else {
			song = "the+sign"; // If no song is provided then your program will default to "The Sign" by Ace of Base.
		}
		spotify.search({ type: 'track', query: song}).then(
			function(response) {
				console.log(response);
				//console.log("Artist: " + response.);
				//console.log("Song: " + response.);
				//console.log("Album: " + response.);
				//console.log("Preview: " + response.);
			}
		);
        break;

    case "movie-this": // node liri.js movie-this <movie name here>
		if (userInput !== "") {
			movie = userInput;
		} else {
			movie = "mr+nobody"; // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
		}
		
		console.log(movie);
		queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
		axios.get(queryUrl).then(
			function(response) {
				console.log("Title: " + response.data.Title);
				console.log("Release Year: " + response.data.Year);
				console.log("IMDB Rating: " + response.data.Ratings[0].Value);
				console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
				console.log("Country: " + response.data.Country);
				console.log("Language: " + response.data.Language);
				console.log("Plot: " + response.data.Plot);
				console.log("Actors: " + response.data.Actors);
			}
		);
        break;

    case "do-what-it-says": // 4. `node liri.js do-what-it-says`
        // * Using the`fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
        // * It should run`spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
        // * Edit the text in random.txt to test out the feature for movie - this and concert - this.
		fs.readFile("movies.txt", "utf8", function(err, data) {
			if (err) {
				return console.log(err);
			}

			var dataArr = data.toLowerCase().split(",");
			command = dataArr[0];
			userInput = dataArr[1].replace(" ","+"); //remove quotes?

			// * It should run`spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
		});
        break;
}


// ### BONUS
// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// * Make sure you append each command you run to the `log.txt` file. 
// * Do not overwrite your file each time you run a command.

fs.appendFile("log.txt", text, function(err) { // am I logging commands or results??
	if (err) {
		return console.log(err);
	}

	//console.log("log.txt was updated!");
});
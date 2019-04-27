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
var moment = require("moment");



// 3. To retrieve the data that will power this app, you'll need to send requests using the `axios` package to the Bands in Town, Spotify and OMDB APIs. You'll find these Node packages crucial for your assignment.
//    * [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)
//    * [Axios](https://www.npmjs.com/package/axios)
//      * You'll use Axios to grab data from the [OMDB API](http://www.omdbapi.com) and the [Bands In Town API](http://www.artists.bandsintown.com/bandsintown-api)
//    * [Moment](https://www.npmjs.com/package/moment)
//    * [DotEnv](https://www.npmjs.com/package/dotenv)



var command = process.argv[2];
var userInput = process.argv.slice(3).join(" ").toLowerCase(); // remove punctuation??

var artist = "";
var song = "";
var movie = "";
var queryUrl = "";

var text = "";

// make switch case into functions?
switch (command) {
	case "concert-this": // node liri.js concert-this <artist/band name here>
		if (userInput !== "") {
			artist = userInput.replace(" ", "%20").replace("/", "%252F").replace("?", "%253F").replace("*", "%252A").replace('"', "%27C");
			queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
			axios.get(queryUrl).then(
				function (response) {
					if (response.data.length) {
						var venue = response.data[0].venue.name;
						var location = "";
						if (response.data[0].venue.city) {
							location += response.data[0].venue.city + ", ";
						}

						if (response.data[0].venue.region) {
							location += response.data[0].venue.region + ", ";
						}

						if (response.data[0].venue.country) {
							location += response.data[0].venue.country;
						}
						var date = response.data[0].datetime;
						date = moment(date).format("dddd, MMMM D, YYYY h:mm A");
						console.log("Venue name: " + venue);
						console.log("Location: " + location);
						console.log("Event date: " + date);
					} else {
						console.log("No events for this artist.")
					}
				}
			);
		} else {
			console.log("Please input artist.");
		}
		break;

	case "spotify-this-song": // node liri.js spotify-this-song <song name here>
		if (userInput !== "") {
			song = userInput;
		} else {
			song = "the sign ace of base"; // If no song is provided then your program will default to "The Sign" by Ace of Base.
		}
		spotify.search({ type: 'track', query: song }).then(
			function (response) {
				// console.log(response.tracks.items[0]);
				console.log("Artist: " + response.tracks.items[0].artists[0].name);
				console.log("Song: " + response.tracks.items[0].name);
				console.log("Album: " + response.tracks.items[0].album.name);
				console.log("Preview: " + response.tracks.items[0].preview_url);
			}
		);
		break;

	case "movie-this": // node liri.js movie-this <movie name here>
		console.log(command);
		if (userInput !== "") {
			movie = userInput;
		} else {
			movie = "mr nobody"; // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
		}

		console.log(movie);
		queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
		axios.get(queryUrl).then(
			function (response) {
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

		console.log(command);
		fs.readFile("movies.txt", "utf8", function (err, data) {
			if (err) {
				return console.log(err);
			}

			var dataArr = data.toLowerCase().split(",");
			command = dataArr[0];
			userInput = dataArr[1].replace(" ", "+"); //remove quotes?

			// * It should run`spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
		});
		break;
}


// ### BONUS
// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
// * Make sure you append each command you run to the `log.txt` file. 
// * Do not overwrite your file each time you run a command.

fs.appendFile("log.txt", text, function (err) { // am I logging commands or results??
	if (err) {
		return console.log(err);
	}

	//console.log("log.txt was updated!");
});
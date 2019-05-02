require("dotenv").config();

var keys = require("./keys.js");

var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var fs = require("fs");
var moment = require("moment");

var command = process.argv[2];
var userInput = process.argv.slice(3).join(" ").toLowerCase();

var artist = "";
var song = "";
var movie = "";
var queryUrl = "";

if (command === "do-what-it-says") { // node liri.js do-what-it-says
	fs.readFile("random.txt", "utf8", function (err, data) {
		if (err) {
			return console.log(err);
		}

		var dataArr = data.toLowerCase().split("\"").join("").split(",");
		command = dataArr[0];
		userInput = dataArr[1];

		doUserInput(command); // * it should run spotify-this-song for "I Want it That Way," as follows the text in random.txt file
	});
} else {
	doUserInput(command);
}

function doUserInput(command) {
	switch (command) {
		case "concert-this": // node liri.js concert-this <artist/band name here>
			concertThis();
			break;

		case "spotify-this-song": // node liri.js spotify-this-song <song name here>
			spotifyThisSong();
			break;

		case "movie-this": // node liri.js movie-this <movie name here>
			movieThis();
			break;
	}
}

function concertThis() {
	if (userInput !== "") {
		artist = encodeURIComponent(userInput);
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

					var concertData = [
						"Venue name: " + venue,
						"Location: " + location,
						"Event date: " + date
					].join("\n");
					logData(concertData);
				} else {
					console.log("No events for this artist.")
				}
			}
		);
	} else {
		console.log("Please input artist.");
	}
}

function spotifyThisSong() {
	if (userInput !== "") {
		song = userInput;
	} else {
		song = "the sign ace of base"; // default song
	}
	spotify.search({ type: 'track', query: song }).then(
		function (response) {
			var spotifyData = [
				"Artist: " + response.tracks.items[0].artists[0].name,
				"Song: " + response.tracks.items[0].name,
				"Album: " + response.tracks.items[0].album.name,
				"Preview: " + response.tracks.items[0].preview_url
			].join("\n");
			logData(spotifyData);
		}
	);
}

function movieThis() {
	if (userInput !== "") {
		movie = encodeURIComponent(userInput);
	} else {
		movie = encodeURIComponent("mr.+nobody"); // default movie
	}

	queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
	axios.get(queryUrl).then(
		function (response) {
			var movieData = [
				"Title: " + response.data.Title,
				"Release Year: " + response.data.Year,
				"IMDB Rating: " + response.data.Ratings[0].Value,
				"Rotten Tomatoes Rating: " + response.data.Ratings[1].Value,
				"Country: " + response.data.Country,
				"Language: " + response.data.Language,
				"Plot: " + response.data.Plot,
				"Actors: " + response.data.Actors
			].join("\n");
			logData(movieData);
		}
	);
}

function logData(text) {
	fs.appendFile("log.txt", text, function (err) {
		if (err) {
			return console.log(err);
		}
		console.log(text);
	});
}
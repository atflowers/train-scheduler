var tName;
var dest;
var tTime;
var freq;
var nextArrival;
var minsAway;

var whistleMusic = document.createElement('audio');
whistleMusic.setAttribute('src', 'assets/music/whistle.mp3');

$(document).ready(function() {

	whistleMusic.play();
	whistleMusic.addEventListener('ended', function() {
		this.play();
	}, false);

  // Initialize Firebase
	var config = {
		apiKey: "AIzaSyAF95o7PHxBcDYCZBwQaV9VaJoLbzpGkE0",
		authDomain: "train-scheduler-e143b.firebaseapp.com",
		databaseURL: "https://train-scheduler-e143b.firebaseio.com",
		projectId: "train-scheduler-e143b",
		storageBucket: "",
		messagingSenderId: "657232389025"
	};
	firebase.initializeApp(config);

	var database = firebase.database();
	var ref = database.ref('train-scheduler');

	ref.on("value", gotData, errData);


	$("form").submit(function(event){
		event.preventDefault();
		
		data = {
			tName: $("input[name='tName']").val(),
			dest: $("input[name='dest']").val(),
			tTime: $("input[name='tTime']").val(),
			freq: $("input[name='freq']").val()
		};
		ref.push(data);
		console.log(data.name);
		ref.on("value", gotData, errData);
		this.reset();
		});
});

function gotData(data){
	console.log(data.val());
	var trains = data.val();
	var keys = Object.keys(trains);
	console.log(keys);
	$("#results").html("<table id='train-table'><tr><th>Train Name</th><th>Destination</th><th>Frequency</th><th>Next Arrival</th><th>Minutes Away</th></tr></table>");
	for (var i = 0; i < keys.length; i++) {
		var k = keys[i];
		tName = trains[k].tName;
		dest = trains[k].dest;
		freq = trains[k].freq;
		tTime = trains[k].tTime;
		// First Time (pushed back 1 year to make sure it comes before current time)
    	var firstTimeConverted = moment(tTime, "hh:mm")/*.subtract(1, "years")*/;
    	console.log(firstTimeConverted);

	    // Current Time
	    var currentTime = moment();
	    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	    // Difference between the times
	    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	    console.log("DIFFERENCE IN TIME: " + diffTime);

	    // Time apart (remainder)
	    var tRemainder = diffTime % freq;
	    console.log(tRemainder);

	    // Minute Until Train
	    minsAway = freq - tRemainder;
	    console.log("MINUTES TILL TRAIN: " + minsAway);

	    // Next Train
	    nextArrival = moment().add(minsAway, "minutes");
	    nextArrival = moment(nextArrival).format("hh:mm");
	    console.log("ARRIVAL TIME: " + nextArrival);

		// nextArrival = "";
		// minsAway = "";
		console.log(tName, dest, tTime, freq);
		$("#train-table tr:last").after("<tr><td>" + tName + "</td><td>" + dest + "</td><td>" + freq + "</td><td>" + nextArrival + "</td><td>" + minsAway + "</td></tr>");
	}
}

function errData(err){
	console.log("There is no data.");
}
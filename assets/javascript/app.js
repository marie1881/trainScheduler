// Initialize Firebase
var config = {
    apiKey: "AIzaSyB0JdNr7gJ0l7_yBQxdmWn8vPaMOQUe99w",
    authDomain: "trainscheduler-daf50.firebaseapp.com",
    databaseURL: "https://trainscheduler-daf50.firebaseio.com",
    projectId: "trainscheduler-daf50",
    storageBucket: "trainscheduler-daf50.appspot.com",
    messagingSenderId: "1062949101949",
    appId: "1:1062949101949:web:29e8c7bc8c48bb89e76c14"
};
firebase.initializeApp(config);

var database = firebase.database();

//Variable for current time
var currentTime = moment(new Date());
currentTime = moment().format('hh:mm A');

//Button for adding Trains
$("#add-train").on("click", function() {

    // Grab user input from text input field
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#train-destination-input").val().trim();
    var trainTime = $("#train-time-input").val().trim();
    var trainFrequency = parseInt($("#train-frequency-input").val().trim());


    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#train-destination-input").val("");
    $("#train-time-input").val("");
    $("#train-frequency-input").val("");

    // Prevents loading a new page
    return false;
});

// 3. Creates Firebase event for adding train to the database and a row in the html when a user adds a train
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    // Store train data into  variables
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;

    // Train time converted
    var trainTimeConverted = moment(childSnapshot.val().time, "hh:mm A");
    console.log(trainTimeConverted);
    // Difference between the times
    var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
    console.log(diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % childSnapshot.val().frequency;
    console.log(tRemainder);
    // Minutes away Until Train Arrival
    var minutesAway = childSnapshot.val().frequency - tRemainder;
    console.log(minutesAway);
    // Next Train Arrival
    var nextTrainArrival = moment().add(minutesAway, "minutes");
    var nextArrivalConverted = moment(nextTrainArrival).format("hh:mm A");
    console.log(nextArrivalConverted);
    //Add train times to train schedule
    var row = $('<tr>');
    $(row).append($('<td>').text(childSnapshot.val().name));
    $(row).append($('<td>').text(childSnapshot.val().destination));
    $(row).append($('<td>').text(childSnapshot.val().frequency));
    $(row).append($('<td>').text(nextArrivalConverted));
    $(row).append($('<td>').text(minutesAway));
    $('#table-body-train-schedule').append(row);
    // Handles any errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
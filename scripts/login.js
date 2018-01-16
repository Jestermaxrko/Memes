
var error_box = document.getElementById("error");
initFirebase();
checkUserIsSignIn();

function initFirebase(){
  var config = {
    apiKey: "AIzaSyCsIiPX2dHJCH0V40cIvyY-fuS5EEZl3zE",
    authDomain: "memesite-83ca2.firebaseapp.com",
    databaseURL: "https://memesite-83ca2.firebaseio.com",
    projectId: "memesite-83ca2",
    storageBucket: "memesite-83ca2.appspot.com",
    messagingSenderId: "284229682694"
  };
  firebase.initializeApp(config);
}

function signIn (email,password) {

	if(email.length>0 && password.length>0){
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  error_box.innerHTML = errorMessage;

		});
	}else {
		error_box.innerHTML = "Enter all fields";
	}
}

function checkUserIsSignIn(){
	firebase.auth().onAuthStateChanged(function(user) {
  		if (user) {
  			window.location.replace("index.html");
  		} 
	});
}
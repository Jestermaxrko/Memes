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


function checkUserIsSignIn(){
	firebase.auth().onAuthStateChanged(function(user) {
  		if (user) {
  			//window.location.replace("index.html");
  		} 
	});
}


function register(nickname,email,password){

	console.log(nickname);
	console.log(email);
	console.log(password);

	if(nickname && email && password ){

		firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){

			firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
		    email: email,
		    nickname: nickname,
		    uid:currentUser.uid
		 }).then(function(){
		  		window.location.replace("index.html");
		  	});
		},function(error) {
  			var errorCode = error.code;
  			var errorMessage = error.message;

  			if(errorMessage){
				document.getElementById("error").innerHTML=errorMessage;
			}
		});

	}else{
		
		document.getElementById("error").innerHTML="Enter all fields";
	}

}
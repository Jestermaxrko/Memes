
var current_user ;

initFirebase();
checkUserIsSignIn();


///////////////FIREBASE///////////////////

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

  			firebase.database().ref("/users/"+user.uid).once('value').then(function(snapshot){
				current_user = snapshot.val();
  			});
  		} 
  		else {
    		window.location.replace("login.html");
	  	}
	});
}


function uploadImage (title) {

	if(current_user){

		const ref = firebase.storage().ref();
		const file = document.querySelector('#file').files[0];
		
	
		console.log(title);
		console.log(file);

		if(title && file){

			const name = (+new Date()) + '-' + file.name;
			const metadata = { contentType: file.type };
			const task = ref.child(name).put(file, metadata);

			task.then((snapshot) => {
		     
		    var post = {
		    	name:title,
		    	rating:0,
		    	url:snapshot.downloadURL,
		    	author:current_user.uid,
		    	author_name:current_user.nickname,
		    	timestamp:(+new Date())
		    }
		  	
		  	firebase.database().ref('posts/').push(post).then(function(){

		  		window.location.replace("index.html");	

		  	});
			
			});
		}
	}
}

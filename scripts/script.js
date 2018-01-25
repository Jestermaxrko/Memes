
var current_user;
var posts = [];



$(window).scroll( function() { 
 var scrolled_val = $(document).scrollTop().valueOf();


 if(scrolled_val > 400){

 	document.getElementById("top_btn").style.display="";
 }else {

 	document.getElementById("top_btn").style.display="none";
 }

});



initFirebase();
checkUserIsSignIn();
//signIn();
//firebase functions
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



function signOut(){

	firebase.auth().signOut().then(function() {
		document.getElementById("feed").innerHTML="";
		posts=[];
		current_user=null;
	}).catch(function(error) {
	  	// An error happened.
	});
}

function checkUserIsSignIn(){
	firebase.auth().onAuthStateChanged(function(user) {

		document.getElementById("feed").innerHTML="";
		posts=[];
		current_user=null;
  		if (user) {

  			console.log("User is in");
  			document.getElementById("upload_btn").style.display = "";
  			document.getElementById("out_btn").style.display="";
  			document.getElementById("login_btn").style.display = "none";
  			document.getElementById("register_btn").style.display="none";
  			document.getElementById("notifaction").style.display ="";


  			var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  			if(!isSafari) checkSubscription();

  			//ssubscribeToNotifications();

  			firebase.database().ref("/users/"+user.uid).once('value').then(function(snapshot){
				current_user = snapshot.val();
    			getPosts();
  			});
  		} 
  		else {
    		
    		console.log("User is out");
  			document.getElementById("upload_btn").style.display = "none";
  			document.getElementById("out_btn").style.display="none";
  			document.getElementById("login_btn").style.display = "";
  			document.getElementById("register_btn").style.display="";

    		getPosts();
	  	}
	});
}

function getPosts (){
	
	firebase.database().ref('/posts').once('value').then(function(snapshot) {
  		tmp_post = snapshot.val();  	
		for(var key in tmp_post) {
			tmp_post[key].id = key;
			posts.push(tmp_post[key]);
		}

		posts.sort(compareTime);
		displayPosts();
	});
}



/////HTML Functions////////////

function displayPosts(){


	var feed = document.getElementById("feed");
	console.log("post_len : " + posts.length);

	for(var i =0; i<posts.length;i++){

		var post_div = document.createElement("div");
		var post_title = document.createElement("h3");
		var post_img = document.createElement("img");
		var post_stats_div = document.createElement("div");
		var like_btn = document.createElement("input");
		var dislike_btn = document.createElement("input");
		var rating_text = document.createElement("span");
		var author = document.createElement("span");
		var comment = document.createElement("a");
		var div = document.createElement('div');


		like_btn.type = "button";
		dislike_btn.type = "button";

		post_div.classList.add("post");
		post_title.classList.add("post_name");
		post_img.classList.add("post_img");
		post_stats_div.classList.add("post_stats");
		like_btn.classList.add("button");
		dislike_btn.classList.add("button");
		like_btn.classList.add("like_btn");
		dislike_btn.classList.add("dislike_btn");
		rating_text.classList.add("rating");
		author.classList.add("author");
		comment.classList.add("comment");

		like_btn.value="";
		dislike_btn.value="";

		post_title.innerHTML = posts[i].name;
		post_img.src = posts[i].url;
		rating_text.innerHTML = "Rating : "+ posts[i].rating;
		rating_text.id = "rate"+posts[i].id;
		like_btn.id=posts[i].id;
		dislike_btn.id=posts[i].id;
		author.id = posts[i].author;
		author.innerHTML = posts[i].author_name;
		//comment.href = "comment.html";
		comment.setAttribute("post_id",posts[i].id+"");
		comment.innerHTML = "Comments (" +posts[i].coments_count+ ")";
	

		like_btn.setAttribute("onclick","loadLikeState(this,1)");
		dislike_btn.setAttribute("onclick","loadLikeState(this,-1)");
			
		comment.setAttribute("onclick","loadComments(this)");

		//TMP attributes///////////////
		//post_div.setAttribute("onclick","copyDiv(this)");




		div.appendChild(rating_text);
		//div.appendChild(comment);

		post_stats_div.appendChild(div);

		post_stats_div.appendChild(like_btn);
		post_stats_div.appendChild(dislike_btn);
		post_stats_div.appendChild(comment);
		post_stats_div.appendChild(author);

		post_div.appendChild(post_title);
		post_div.appendChild(post_img);
		post_div.appendChild(post_stats_div);




		feed.appendChild(post_div);



		

		if(current_user){
			if ('likes' in posts[i]){
				var like_state =  posts[i]["likes"][current_user.uid];
				console.log(like_state);
				if(like_state){
					if(like_state==1)
						like_btn.classList.add("active_btn");
					else
						dislike_btn.classList.add("active_btn");
				}
			}
		}

		/*if(feed.offsetWidth<post_img.naturalWidth){
			post_img.width=feed.offsetWidth;
		}*/
	}
}




////Listeners////////////////////

function loadLikeState(elem,action) {

	
	if(current_user){
		console.log(elem.id);
		var post_id = elem.id; 


		firebase.database().ref('/posts/'+post_id+'/likes/'+current_user.uid).once('value').then(function(snapshot) {
	  		var like_state = snapshot.val();

	  		if(like_state!=action){

	  			if(like_state===null){
	  				console.log("Yeees");
	  				changeRating(elem,action);
	  			}
	  			else{

	  				if(like_state!=0){
		  				if(action>0) action++;
		  				else action--;
		  			}
		  			
	  				changeRating(elem,action);

	  			}
	  		}else {

	  			getOffLike(elem,action);

	  		}
		});	
	}
}

function changeRating(elem,action){

	var post_id = elem.id; 
	var parent = elem.parentElement;
	
	var active = parent.getElementsByClassName("active_btn");
	if(active.length >0){
		active[0].classList.remove("active_btn");
	}
	elem.classList.add("active_btn");

	firebase.database().ref('/posts/'+post_id+'/rating').once('value').then(function(snapshot) {
  		var rating = snapshot.val();
  		rating+=action;
  	
  		if(action>1) action--;
  		if(action<-1) action++;

	  	var updates_rating = {};
	  	var updates_user = {};
  		updates_rating['/posts/' + post_id+"/rating"] = rating;
  		updates_user['/posts/' + post_id+"/likes/"+current_user.uid] = action;

  		firebase.database().ref().update(updates_rating);
  		firebase.database().ref().update(updates_user);

  		firebase.database().ref('/posts/'+post_id+'/rating').once('value').then(function(snapshot){

  			document.getElementById("rate"+post_id).innerHTML = "Rating : " + snapshot.val();
  		});

	});	
}

function getOffLike(elem,action){

	var post_id = elem.id; 
	var parent = elem.parentElement;

	var active = parent.getElementsByClassName("active_btn");
	if(active.length >0){
		active[0].classList.remove("active_btn");
	}


	firebase.database().ref('/posts/'+post_id+'/rating').once('value').then(function(snapshot) {
  		var rating = snapshot.val();
  		rating+=(-1)*action;
  
	  	var updates_rating = {};
	  	var updates_user = {};
  		updates_rating['/posts/' + post_id+"/rating"] = rating;
  		updates_user['/posts/' + post_id+"/likes/"+current_user.uid] = 0;

  		firebase.database().ref().update(updates_rating);
  		firebase.database().ref().update(updates_user);

  		firebase.database().ref('/posts/'+post_id+'/rating').once('value').then(function(snapshot){

  			document.getElementById("rate"+post_id).innerHTML = "Rating : " + snapshot.val();
  		});

	});	

}

function compareTime(a, b) {
  if (a.timestamp < b.timestamp) return 1;
  if (a.timestamp > b.timestamp) return -1;
}


function loadComments(elem){

	var parent = elem.parentElement.parentElement.cloneNode(true);
	console.log(parent);

	localStorage.setItem('post_div', parent.outerHTML);


	console.log(localStorage.getItem("post_div"));
	
	var win = window.open("comment.html", '_blank');
    win.focus();


}



/////////////////// NOTIFICATION /////////////////////////////////


{

/* ========================
  Variables
======================== */

const FIREBASE_AUTH = firebase.auth();
const FIREBASE_MESSAGING = firebase.messaging();
const FIREBASE_DATABASE = firebase.database();

const subscribeButton = document.getElementById('subscribe');
const unsubscribeButton = document.getElementById('unsubscribe');
const sendNotificationForm = document.getElementById('send-notification-form');

/* ========================
  Event Listeners
======================== */

FIREBASE_MESSAGING.onTokenRefresh(handleTokenRefresh);



/* ========================
  Functions
======================== */

function handleTokenRefresh() {
  return FIREBASE_MESSAGING.getToken().then(function(token) {

  	localStorage.setItem('browserTokenMemSite', token);
    FIREBASE_DATABASE.ref('/tokens').push({
      token: token,
      uid: FIREBASE_AUTH.currentUser.uid
    });
  });
}

function checkSubscription() {
  FIREBASE_DATABASE.ref('/tokens').orderByChild("uid").equalTo(FIREBASE_AUTH.currentUser.uid).once('value').then(function(snapshot){
    
  	var user_uid= snapshot.val();
  	var local_token = localStorage.getItem("browserTokenMemSite");
  	if(!local_token) local_token = "undefined";


  	FIREBASE_DATABASE.ref('/tokens').orderByChild("token").equalTo(local_token).once('value').then(function(data){

  		if ( data.val() && user_uid ) {
      	
    	document.getElementById("not_img").src = "images/notifaction_on.png";
    	document.getElementById("notifaction").onclick = unsubscribeFromNotifications;
    	//checkSubscription();


    } else {
      	
    	document.getElementById("not_img").src = "images/notifaction_off.png";
    	document.getElementById("notifaction").onclick = subscribeToNotifications;
	   	//checkSubscription();
    }


  	});
  });
}

function subscribeToNotifications() {
  FIREBASE_MESSAGING.requestPermission()
    .then(function() {handleTokenRefresh();})
    .then(function()  {checkSubscription();})
    .catch(function (err){
      console.log("error getting permission :(");
    });
}

function unsubscribeFromNotifications() {
  FIREBASE_MESSAGING.getToken()
    .then(function(token) {FIREBASE_MESSAGING.deleteToken(token);})
    .then(function() {FIREBASE_DATABASE.ref('/tokens').orderByChild("uid").equalTo(FIREBASE_AUTH.currentUser.uid).once('value')})
    .then(function(snapshot) {

    	var user_uid= snapshot.val();
    	const key = Object.keys(snapshot.val())[0];
    	var local_token = localStorage.getItem("browserTokenMemSite");
  		if(!local_token) local_token = "undefined";


     	FIREBASE_DATABASE.ref('/tokens').orderByChild("token").equalTo(local_token).once('value').
    	then(function(data){

    		if(user_uid && data.val()){
	    		checkSubscription();
	    		localStorage.removeItem("browserTokenMemSite");
	    		return FIREBASE_DATABASE.ref('/tokens').child(key).remove();
    		}


    	})      	
    .catch(function(err){
      console.log("error deleting token :(");
    });
})
}
}

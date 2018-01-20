
initFirebase();
window.onload = loadWindow;

var current_user;
var post_id;
var comments = [];
var base_feed = document.getElementById("feed");




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

		
		comments = [];
		current_user=null;
		base_feed.innerHTML="";
  		if (user) {

  			firebase.database().ref("/users/"+user.uid).once('value').then(function(snapshot){
				current_user = snapshot.val();
    			getComments();
  			});
  		} 
  		else {
    		
    			getComments();
	  	}
	});
}


function getComments(){

	comments = [];
	var feed = document.getElementById("comments_feed");
	base_feed.innerHTML = "";
	if(feed) feed.innerHTML ="";

	console.log(post_id);

	firebase.database().ref("/posts/"+post_id+"/comments").once('value').then(function(snapshot){
				var tmp_comments = snapshot.val();


				for(var key in tmp_comments){
					tmp_comments[key].id = key;
					comments.push(tmp_comments[key]);
				}		

				console.log(comments);
				comments.sort(compareTime);
				displayComments();
  	});


}


function addComment(){

	var text = document.getElementById("text");

	console.log(text.value);

	if(text.value.length>0){
		var new_comment = {
	    	text: text.value,
	    	author:current_user.nickname,
	    	timestamp:Math.floor(Date.now())
		}
			  	
		firebase.database().ref('posts/'+post_id+"/comments/").push(new_comment).then(function(){
			

				firebase.database().ref('posts/'+post_id+"/coments_count").once("value").then(function(snapshot){	
					
					var com_count = snapshot.val();
					com_count++;

					var updates_coments = {};
			  		updates_coments['/posts/' + post_id+"/coments_count"] = com_count;
			  		firebase.database().ref().update(updates_coments);
				});

			getComments();

		});
	}
}


function displayComments(){



	var comments_feed= document.createElement("div");
	var comments_wraper = document.createElement("div");
	comments_wraper.classList.add("comments_wraper");
	comments_feed.classList.add("comments_feed");
	comments_feed.id = "comments_feed";

	for(var i=0;i<comments.length;i++){

		var singe_comment = document.createElement("div");
		var comment_text = document.createElement("span");
		var author = document.createElement("h5");
		var time = document.createElement("span");

		singe_comment.classList.add("singe_comment");
		comment_text.classList.add("comment_text");

		author.classList.add("comment_author");
		time.classList.add("comment_time");

		comment_text.innerHTML = comments[i].text;
		author.innerHTML = comments[i].author;
		//var ts = comments[i].timestamp+"";
		//console.log(new Date());
		//console.log(new Date().getTime()/1000);
		time.innerHTML =    convertToTimeString(new Date(comments[i].timestamp)) ;

		singe_comment.appendChild(author);
		singe_comment.appendChild(time);
		singe_comment.appendChild(comment_text);

		comments_wraper.appendChild(singe_comment);
		
	}


	comments_feed.appendChild(comments_wraper);

	document.getElementById("container").appendChild(comments_feed);


	var user_comment_div =  document.createElement("div");
	var text_area = document.createElement("textarea");
	var send_btn = document.createElement("input");
	var log_btn = document.createElement("a");
	
	send_btn.type ="button";
	

	user_comment_div.classList.add("user_comment_div");
	text_area.classList.add("text_area");
	text_area.id = "text";
	text_area.placeholder = "Leave a comment...";
	send_btn.classList.add("send_btn");
	log_btn.classList.add("log_btn");
	log_btn.href ="login.html";
	log_btn.target ="_blanc";
	log_btn.innerHTML = "Log in to leave a comment";
	send_btn.value = "SEND";
	send_btn.setAttribute("onclick","addComment()");
	
	user_comment_div.appendChild(text_area);
	user_comment_div.appendChild(send_btn);

	comments_feed.appendChild(user_comment_div);
	comments_feed.appendChild(log_btn);

	base_feed.appendChild(comments_feed);

	var wrapper_height = comments_wraper.offsetHeight;
	console.log(wrapper_height);
	if(wrapper_height>200) comments_wraper.style.height = "200px";

	send_btn.id = "scr";
	
	comments_wraper.scrollTop = comments_wraper.scrollHeight;
	send_btn.scrollIntoView();

	if(!current_user){
		user_comment_div.style.display="none";
		log_btn.style.display="";
	}else {
		user_comment_div.style.display="";
		log_btn.style.display="none";
	}
	


}


function loadWindow(){
	var div = document.getElementById("t");

	console.log(localStorage.getItem("post_div"));
	div.outerHTML = localStorage.getItem("post_div");
	var com = document.getElementsByClassName("comment")[0];
	com.style.display="none";
	post_id = com.getAttribute("post_id");

	checkUserIsSignIn();

}


function convertToTimeString(time_str){


	time_str =  time_str+"";

	var end = time_str.indexOf("201");
	return new_time =  time_str.substring(4, end);

}

function compareTime(a, b) {
  if (a.timestamp > b.timestamp) return 1;
  if (a.timestamp < b.timestamp) return -1;
}

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
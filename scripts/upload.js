
var current_user ;
var img;
var font_size;
var text_color;
var stroke_color;
var stroke_size;
var orientation;
var ctx;


initFirebase();
checkUserIsSignIn();

//var ref = new Firebase('application.firebaseio.com/posts');



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
		var image = new Image();
		image.src = document.getElementById("myCanvas").toDataURL();
		


		const file = document.querySelector('#file').files[0];
		
		if(title && file){

			const name = (+new Date()) + '-' + file.name;
			const metadata = { contentType: file.type };
			var task;// = ref.child(name).put(file, metadata);

			console.log(name);

			ref.child(name).putString(image.src, 'data_url').then(function(snapshot) {
  			 	
				var post = {
			    	name:title,
			    	rating:0,
			    	url:snapshot.downloadURL,
			    	author:current_user.uid,
			    	author_name:current_user.nickname,
			    	timestamp:Math.floor(Date.now())
		    	}
		  	
		  		firebase.database().ref('posts/').push(post).then(function(){

		  			window.location.replace("index.html");	
		  		});

			});	

			
		}
	}
}


function updateResults (img_canvas, data) {
    
    var data_URL = img_canvas.toDataURL();

    var canvas = document.getElementById("baseCanvas");
	ctx = canvas.getContext("2d");
	img = new Image();

	img.onload = function(){
		adaptFontSizes();
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img,0,0);
	}

	img.src = data_URL;

	document.getElementById("editor").style.display ="";
   	document.getElementById("save_btn").style.display="";

  }


function loadToCanvas(){

	var file =  document.getElementById("file").files[0];

	var options = {
      canvas: true,
      orientation: true
    };

     loadImage(
      file,
      updateResults,
      options
    ) ;
}


function wrapText(context, text, x, y, maxWidth, lineHeight,position) {
        
        var words = text.split(' ');
        var line = '';
        var lines = 0;
        var lines_arr = [];

        for(var n = 0; n < words.length; n++) {
          	var testLine = line + words[n] + ' ';
          	var metrics = context.measureText(testLine);
          	var testWidth = metrics.width;

          	if (testWidth > maxWidth && n > 0) {
	          	lines_arr.push(line);
	            line = words[n] + ' ';
	            lines++;
          	}
          	else {
            	line = testLine;
          	}
        }
       
       	if(line!=" ")
        	lines_arr.push(line);
        
        for(var i=0;i<lines_arr.length;i++){

        	if(position==1){
        		console.log(y+i*lineHeight);
        		console.log("i = " + i);
        		context.fillText(lines_arr[i], x, (y+i*lineHeight));
        		context.strokeText(lines_arr[i], x, (y+i*lineHeight));
        	}else {
        		context.fillText(lines_arr[i], x, y-((lines_arr.length-1)*lineHeight) +i*lineHeight-lineHeight/4 );
        		context.strokeText(lines_arr[i], x, y-((lines_arr.length-1)*lineHeight) +i*lineHeight-lineHeight/4);
        	}
        		
        }
        
 }

function changeText(top_text,bottom_text){

       
    ctx.drawImage(img,0,0);

	var center = img.width/2;
	  
	ctx.font = font_size +"px Impact ";
	ctx.lineWidth = stroke_size;
	ctx.fillStyle = text_color;
	ctx.strokeStyle = stroke_color;


	ctx.textAlign="center"; 

	console.log(" fonts : "+ font_size);
	console.log(" line : "+ stroke_size);

	wrapText(ctx, top_text, center, font_size, img.width, font_size,1);

	wrapText(ctx, bottom_text, center, img.height-5, img.width, font_size,0);

}

function adaptFontSizes(){

	font_size = img.width/12;
	stroke_size = 2;

    document.getElementById("font_size").value = font_size;
    text_color = (document.getElementById("text_color").value);
	stroke_color = (document.getElementById("stroke_color").value);

}

function setDrawStyles(){
	font_size = (+document.getElementById("font_size").value);
	text_color = (document.getElementById("text_color").value);
	stroke_color = (document.getElementById("stroke_color").value);

	changeText(document.getElementById("top").value,document.getElementById("bottom").value)
	
}
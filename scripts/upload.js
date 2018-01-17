
var current_user ;
var img;
var font_size;
var text_color;
var stroke_color;
var stroke_size;


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



function findExif(){

	var file = document.getElementById("file").files[0];
	EXIF.getData(file, function () {
		 loadToCanvas(this.exifdata.Orientation);
	});

}

function loadToCanvas(orientation){

	console.log(orientation);

	var file = document.getElementById("file").files[0];

	var fr = new FileReader();
	fr.onload = createImage;   // onload fires after reading is complete
	fr.readAsDataURL(file);    // begin reading
	

	 function createImage() {
        img = new Image();
        img.onload = imageLoaded;
        img.src = fr.result;
   	}

    function imageLoaded() {
        var canvas = document.getElementById("myCanvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var width = img.width;
        var height = img.height;

        adaptFontSizes();
        var ctx = canvas.getContext("2d");

        if(orientation){

        	if (4 < orientation && orientation < 9) {
      			canvas.width = height;
     			canvas.height = width;
   			 } 
   			 else {
      			canvas.width = width;
      			canvas.height = height;
    		}

	        switch(orientation){
	        	 case 1:ctx.transform(1, 0, 0, 1, 0, 0);break;
	        	 case 2:ctx.transform(-1, 0, 0, 1, width, 0);;break;
	        	 case 3:ctx.transform(-1, 0, 0, -1, width, height );break;
	        	 case 4:ctx.transform(1, 0, 0, -1, 0, height );;break;
	        	 case 5:ctx.transform(0, 1, 1, 0, 0, 0);break;
	        	 case 6:ctx.transform(0, 1, -1, 0, height , 0);break;
	        	 case 7:ctx.transform(0, -1, -1, 0, height , width);break;
	        	 case 8:ctx.transform(0, -1, 1, 0, 0, width);break;

	        }
	    }

        ctx.drawImage(img,0,0);

        document.getElementById("editor").style.display ="";
        document.getElementById("save_btn").style.display="";
       
    }
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
        		context.fillText(lines_arr[i], x, y-((lines_arr.length-1)*lineHeight) +i*lineHeight);
        		context.strokeText(lines_arr[i], x, y-((lines_arr.length-1)*lineHeight) +i*lineHeight);
        	}
        		
        }
        
 }

function changeText(top_text,bottom_text){

	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect ( 0 , 0 , 300 , 300 );
	ctx.drawImage(img,0,0);

	
	ctx.font = font_size +"px Impact ";
	ctx.lineWidth = stroke_size;
	ctx.fillStyle = text_color;
	ctx.strokeStyle = stroke_color;

	var center = img.width/2;

	ctx.textAlign="center"; 

	console.log(" fonts : "+ font_size);
	console.log(" line : "+ stroke_size);

	wrapText(ctx, top_text, center, font_size, img.width, font_size,1);

	wrapText(ctx, bottom_text, center, img.height-5, img.width, font_size,0);

	/*ctx.fillText(top_text,center,font_size);
    ctx.strokeText(top_text, center, font_size);

   

    ctx.fillText(bottom_text,center,img.height-5);
    ctx.strokeText(bottom_text, center, img.height-5);*/
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
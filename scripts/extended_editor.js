 var img1 = new Image();
 var img2 = new Image();
 var created_img = new Image();

 var texts = [];

 const VERTICAL = 0;
 const HORIZONTAL = 1;
 var same_size = true;
 var orientation = HORIZONTAL;

 var src1;
 var src2;

 var images_count = 1;

 var canvas = document.getElementById("canvas");
 var ctx = canvas.getContext("2d");



function changeFile(){

	cleanAll();
	loadImages();

}


function loadImages(){

	var file1 = document.getElementById("file1").files[0];
	var file2 = document.getElementById("file2").files[0];

	if(images_count==2){
		if(file1 && file2){
			var options = {
		      canvas: true,
		      orientation: true
		    };

		     loadImage(
		      file1,
		      getFirstSource,
		      options
		    ) ;

		     loadImage(
		      file2,
		      getSecondSource,
		      options
		    ) ;
		 }
	}else {

		if(file1){
			var options = {
		      canvas: true,
		      orientation: true
		    };

		    loadImage(
		      file1,
		      getFirstSource,
		      options
		    ) ;
		}
	}
}


function getFirstSource (img_canvas, data) {
    
    src1 = img_canvas.toDataURL();
    
    displayImages();
  }

function getSecondSource (img_canvas, data) {
    
    src2 = img_canvas.toDataURL();
    
    displayImages();
  }

function displayImages(){

	if(images_count==2){
		if(src1 &&src2){

			var first_w;
			var first_h;
			var second_w;
			var second_h;

			img1.onload = function () {
			 		first_w = img1.width;
			 		first_h = img1.height;
			 		
			 		img2.src = src2;
			 }

			img2.onload = function(){
			 		second_w = img2.width;
			 		second_h = img2.height;


			 		if(orientation==HORIZONTAL){

			 			if(first_h>second_h){
			 				if(same_size){
				 				canvas.width = 2*second_w;
				 				canvas.height = second_h;

				 				ctx.drawImage(img1,0,0,second_w,second_h);
							 	ctx.drawImage(img2,second_w,0) ;
							}
			 			}else {

			 				if(same_size){

			 					canvas.width = 2*first_w;
				 				canvas.height = first_h;

				 				ctx.drawImage(img1,0,0);
							 	ctx.drawImage(img2,first_w,0,first_w,first_h) ;

			 				}

			 			}
			 		}else {


			 			if(first_w>second_w){

			 				if(same_size){

			 					canvas.width=second_w;
			 					canvas.height = 2*second_h;

			 					ctx.drawImage(img1,0,0,second_w,second_h);
							 	ctx.drawImage(img2,0,second_h) ;

			 				}

			 			}else {

			 				if(same_size){


			 					canvas.width=first_w;
			 					canvas.height = 2*first_h;

			 					ctx.drawImage(img1,0,0);
							 	ctx.drawImage(img2,0,first_h,first_w,first_h) ;

			 				}

			 			}

			 		}


			 		created_img.src = canvas.toDataURL();
			 		document.getElementById("editor").style.display="";
			 		document.getElementById("editor_panel").style.display="";
			 		adaptCanvas();
	

		 	}

		 	img1.src = src1;
	 	}

	}else {

		if(src1)
			img1.onload = function () {
				canvas.width = img1.width;
				canvas.height = img1.height;

				

				
				
				ctx.drawImage(img1,0,0);
				created_img.src = canvas.toDataURL();

				document.getElementById("editor").style.display="";
				document.getElementById("editor_panel").style.display="none";

				adaptCanvas();
				
			}

			img1.src = src1;
	}
 }

 //ctx.drawImage(img1,0,0); 
 //ctx.drawImage(img2,first_w,0);


function adaptCanvas(){

	var editor_width =  document.getElementById("editor").offsetWidth;
	console.log("canvas: " + canvas.width);
	console.log("editor : " +editor_width);

	if(canvas.width <editor_width){
		canvas.style.width= canvas.width+"px";
	}
	else {
		canvas.style.width= "100%";
	}
}


function swapSrc(){

	var tmp_src = src1;
	src1 = src2;
	src2 = tmp_src;
	displayImages();
}

function changeOrientation(elem){

	var active = document.getElementsByClassName("active_orientation")[0];
	active.classList.remove("active_orientation");
	elem.classList.add("active_orientation");

	if(orientation ==HORIZONTAL)
		orientation = VERTICAL;
	else orientation = HORIZONTAL;

	cleanAll();
	displayImages();

}
      
 function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
     
      	canvas.addEventListener('click', function(evt) {

        var mousePos = getMousePos(canvas, evt);

        var list = document.getElementById("text_list");

        var field = document.createElement("li");
        var text_input = document.createElement("input");
        var delete_btn = document.createElement("input");
        var text_size = document.createElement("input");
        var color = document.createElement("input");
        var select = document.createElement("select");
        var fonts = ["Comic Sans","Arial","Impact"];


        field.classList.add("text_field");
        text_input.classList.add("single_text");
        text_size.classList.add("text_size");
        color.classList.add("color");
        delete_btn.classList.add("delete_text");
        select.classList.add("font_select");

        for(var i=0;i<fonts.length;i++){

        	var option = document.createElement("option");
			option.text =  fonts[i];
			option.value = fonts[i];
			select.add(option);
        }


        text_input.type = "text";
        var font_size = parseInt(canvas.width/18);
        delete_btn.type = "button";
        text_size.type = "number";
        color.type = "color";

        text_size.placeholder = "Size";
        text_input.placeholder = "Text";

        text_size.value = font_size;

        text_input.setAttribute("onkeyup","addText(this)");
        delete_btn.setAttribute("onclick","deleteField(this)");
        text_size.setAttribute("onchange","changeTextSize(this)");
        color.setAttribute("onchange","changeColor(this)");


        field.appendChild(text_input);
        //field.appendChild(select);
        field.appendChild(text_size);
        field.appendChild(color);
        field.appendChild(delete_btn);
        list.appendChild(field);
        text_input.focus();





        var text = {
        	x:mousePos.x,
        	y: mousePos.y,
        	message: "",
        	text_size:font_size,
        	font:"Impact",
        	color:"black",
        	id:texts.length
        }


        texts.push(text);

  }, false);
  


function deleteField(elem){

	var li = elem.parentElement;
	var index =  $(li).index();
	texts.splice(index,1);
	li.parentElement.removeChild(li);
	drawText();
}


function addText(elem){

	var li = elem.parentElement;
	console.log(li);
	var index =  $(li).index();
	console.log(index);
	texts[index].message = elem.value;
	console.log(texts);

	drawText();

}


function changeTextSize(elem){

	var li = elem.parentElement;
	var index =  $(li).index();
	texts[index].text_size = +(elem.value);
	drawText();
}


function changeColor(elem){

	var li = elem.parentElement;
	var index =  $(li).index();
	texts[index].color = elem.value
	drawText();

}

function drawText(){

	ctx.drawImage(created_img,0,0);
	
	for(var i=0;i<texts.length;i++){
		
		ctx.fillStyle = texts[i].color;
		ctx.font = texts[i].text_size + "px " + texts[i].font;
		ctx.fillText(texts[i].message,texts[i].x*canvas.width / canvas.clientWidth,texts[i].y*canvas.height/canvas.clientHeight+  texts[i].text_size/2);
	}
}

function setOneImage(elem){
	images_count=1;
	document.getElementById("file2").style.display = "none";
	var active = document.getElementsByClassName("active_number")[0];
	active.classList.remove("active_number");
	elem.classList.add("active_number");
	cleanAll();
	loadImages();
}

function setTwoImages(elem){

	images_count=2;
	document.getElementById("file2").style.display = "";
	var active = document.getElementsByClassName("active_number")[0];
	active.classList.remove("active_number");
	elem.classList.add("active_number");
	cleanAll();
	loadImages();
}


function cleanAll(){

	texts = [];
	console.log(texts);
	ctx.clearRect(0,0,canvas.width,canvas.height);

	document.getElementById("text_list").innerHTML ="";
	
}

function transferImage(){

	var transfer_src = canvas.toDataURL();

	localStorage.setItem("src_to_display",transfer_src);
	window.location.replace("upload.html"); 

}


window.onresize = function(event) {
    adaptCanvas();
};
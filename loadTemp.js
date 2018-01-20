function loadTemplates(){


	var str = "advice_dog.png,advice_god.png,advice_yoda_gives.png,angry_school_boy.png,bad_luck_brian.png,business_cat.png,butthurt_dweller.png,conspiracy_keanu.png,disaster_girl.png,foul_bachelor_frog.png,futurama_fry.png,one_does_not_simply.png,pedobear_backgrounded.png,philosoraptor.png,sunny_student.png,wonka.png,yo_dawg.png";

	var files = str.split(",");

	for(var i=0;i<files.length;i++){
	
	
			var temp = {

				url: "images/templates/"+files[i]
			}

			firebase.database().ref('templates/').push(temp).then(function(){

		  			console.log("Yss");
		  		});

	
	}

}
statuss = false;
object = "";
objects = [];
model1 = null;
x = 0;
y = 0;
width = 0;
height = 0;
over = false;

function setup(){
    canvas = createCanvas(400,400);
    canvas.center();

    video = createCapture(VIDEO);
    video.size(400,400);
    video.hide();
}

function start(){
    over = false;
    object = document.getElementById("object_input").value;
    document.getElementById("object_input").value = "";
    model1 = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "status:detecting objects";
}

function modelLoaded(){
    console.log("model loaded");
    statuss = true;
}

function draw(){
    image(video,0,0,400,400);
    if(statuss == true){   
        model1.detect(video, gotResults);
        if(objects != []){
            for(i=0; i < objects.length; i++){
                a = objects[i].confidence;
                b = a * 100;
                confidence = b.toFixed(2);
                label = objects[i].label;
                tecst = label + "( " + confidence + "% )";
                x = objects[i].x;
                y = objects[i].y;
                width = objects[i].width;
                height = objects[i].height;
                console.log(tecst,x,y,width,height);
                textSize(50);
                fill('red');
                text(tecst,x,y);
                noFill();
                stroke('red');
                rect(x,y,width,height);
                if(label == object){
                    video.stop();
                    model1.detect(gotResults);
                    document.getElementById("status").innerHTML = object + "found";
                    synth = window.speechSynthesis;
                    utter_this = new SpeechSynthesisUtterance(object + "found");
                    synth.speak(utter_this);
                    object = null;
                    document.getElementById("status").innerHTML = "";
                    over = true;
                }
                else if(over == false){
                    document.getElementById("status").innerHTML = object + "not found";
                }
            }
        } 
    }
}

function gotResults(error,result){
    if(error){
        console.error(error);
    }
    else{
        objects = result;

    }
}
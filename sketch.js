let capture;
let posenet;
let poses = [];
let skeleton;

function setup() {
    createCanvas(800, 500);
    capture = createCapture(VIDEO);
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose', receivedPoses);
}

function receivedPoses(results) {
    poses = results;
}

function modelLoaded() {
    console.log("Model has loaded");
}

function calculateAngle(a, b, c) {
    const angleRadians = Math.atan2(c.position.y - b.position.y, c.position.x - b.position.x) - Math.atan2(a.position.y - b.position.y, a.position.x - b.position.x);
    let angleDegrees = angleRadians * (180 / Math.PI);
    angleDegrees = (angleDegrees + 360) % 360; 

    return angleDegrees;
}

function draw() {
    image(capture, 0, 0);

    for (let i = 0; i < poses.length; i++) {
        let singlePose = poses[i].pose;
        skeleton = poses[i].skeleton;

        for (let j = 0; j < singlePose.keypoints.length; j++) {
            let kp = singlePose.keypoints[j];
            fill(255, 0, 0);
            ellipse(kp.position.x, kp.position.y, 12);
        }

        stroke(0, 255, 0);
        strokeWeight(2);

        for (let j = 0; j < skeleton.length; j++) {
            let a = skeleton[j][0];
            let b = skeleton[j][1];
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }

        fill(0, 0, 255);
        let rightHip = singlePose.keypoints.find(kp => kp.part === "rightHip");
        let rightKnee = singlePose.keypoints.find(kp => kp.part === "rightKnee");
        let rightAnkle = singlePose.keypoints.find(kp => kp.part === "rightAnkle");

        if (rightHip && rightKnee && rightAnkle) {
            let angle = calculateAngle(rightHip, rightKnee, rightAnkle);

           
            if (angle > 175 && angle < 185) {
                textSize(24);
                fill(255, 255, 0);
                text("Right hip angle is 180 degrees!", 10, 30);
            }
        }
    }
}

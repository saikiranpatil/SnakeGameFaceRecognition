const videoElement = document.getElementById('videoInput');
const faceLandmarkCanvas = document.getElementById('faceLandmarkDetector');
const loginButton = document.getElementById('loginButton');
let playGame = false;

let userDetails = {
  age: "",
  gender: "",
  emotions: "",
  position: 0
}

try {
  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.loadFaceExpressionModel('./models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models'), //heavier/accurate version of tiny face detector
    faceapi.nets.ageGenderNet.load('./models')
  ]).then(start)
} catch (error) {
  location.reload();
}

function start() {
  console.log('Models Loaded')

  try {
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        if (gameMode.value === "hand") {
          await hands.send({ image: videoElement });
        }
      },
      width: 720,
      height: 550
    });

    camera.start();

    console.log('video added')
    recognize()
  } catch (err) {
    alert("Enable Camera to play the game")
  }
}

async function recognize() {
  const labeledDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5)

  console.log('Playing')

  hideModal("loading");
  showModal("firstPage");

  const canvas = faceapi.createCanvasFromMedia(videoElement)
  canvas.id = "faceCanvas";
  document.body.append(canvas)

  const displaySize = { width: 360, height: 255 }
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {

    const detections = await faceapi.detectAllFaces(videoElement).withFaceLandmarks().withFaceDescriptors().withFaceExpressions().withAgeAndGender()

    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    if (!resizedDetections.length) {
      facePing.innerHTML = "-"
      return
    }

    if (resizedDetections.length > 1 && gameMode.value === "face") {
      alert("Multiple faces detected")
      loginButton.style.opacity = 0.5
      loginButton.disabled = true
    }

    const resizedDetection = resizedDetections[0]

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

    const results = resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor)
    })

    result = results[0]

    userDetails.age = resizedDetections[0].age;
    userDetails.gender = resizedDetections[0].gender;
    userDetails.emotions = resizedDetections[0].emotions;

    if (results && result.label !== "unknown") {
      loginButton.disabled = false
      username.innerHTML = result.label
      loginButton.style.opacity = 1
    } else {
      loginButton.disabled = true
      loginButton.style.opacity = 0.5
    }

    // updating facePing
    facePing.innerHTML = Math.round(result.distance * 100) / 100;

    // Drawing Boxes with name label 
    const box = resizedDetection.detection.box

    const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
    drawBox.draw(canvas)

    //Adding  Age and Gender Label
    const { age, gender, genderProbability } = resizedDetection
    const ageDetails = [
      `${faceapi.utils.round(age, 0)} years`,
      `${gender} (${faceapi.utils.round(genderProbability)})`
    ]

    const ageLabel = new faceapi.draw.DrawTextField(ageDetails, box.bottomRight)
    ageLabel.draw(canvas)

    const allfaceLandmarks = resizedDetection.landmarks.positions

    findDirectionWithFaceLandmarks(allfaceLandmarks)

    faceLandmarkCanvas.getContext('2d').clearRect(0, 0, videoElement.width, videoElement.height)

    // // Drawing Facial Landmarks
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

    // Drawing Facial Expressions
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections, 0.05)

  }, 500)
}

function loadLabeledImages() {
  const labels = ["Sai Kiran"]
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }
      console.log(label + ' Faces Loaded | ')
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

const canvasElement = document.getElementById('handDetector');
const canvas2 = canvasElement.getContext('2d');

function onResults(results) {
  canvas2.save();
  canvas2.clearRect(0, 0, 720, 550);
  noOfHands.innerHTML = "0";
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      noOfHands.innerHTML = "1";
      drawConnectors(canvas2, landmarks, HAND_CONNECTIONS,
        { color: 'pink', lineWidth: 0.5 });
      drawLandmarks(canvas2, landmarks, { color: 'blue', lineWidth: 0.5 });
    }
  }

  results.multiHandLandmarks.length ? findDirectionWithHandLandmarks(results.multiHandLandmarks[0]) : {};
  canvas2.restore();
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);
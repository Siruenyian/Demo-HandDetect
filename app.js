navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia;

const defaultParams = {
  flipHorizontal: false,
  outputStride: 16,
  imageScaleFactor: 1,
  maxNumBoxes: 20,
  iouThreshold: 0.2,
  scoreThreshold: 0.8,
  modelType: "ssd320fpnlite",
  modelSize: "large",
  bboxLineWidth: "2",
  fontSize: 25,
};

document.querySelector(".Wvid").autoplay = true;
var cursor = document.getElementById("cursor");
// select all
const video = document.querySelector("#video");
const audio = document.querySelector("#audio");
const audio2 = document.querySelector("#audio2");
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

var x, y;
var px, py;
px = py = 0;

window.addEventListener("mouseup", function (e) {
  // gets the object on image cursor position
  var tmp = document.elementFromPoint(x + px, y + py);
  mutex = true;
  tmp.click();
  cursor.style.left = px + x + "px";
  cursor.style.top = py + y + "px";
});

let model;
handTrack.startVideo(video).then((status) => {
  if (status) {
    navigator.getUserMedia(
      { video: {} },
      (stream) => {
        video.srcObject = stream;
        //runDetection();

        setInterval(runDetection, 0.5);
      },
      (err) => console.log(err)
    );
  }
});

var xglobal = 0;
var yglobal = 0;

function getWidth() {
  if (self.innerWidth) {
    return self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
}

function getHeight() {
  if (self.innerHeight) {
    return self.innerHeight;
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight;
  }

  if (document.body) {
    return document.body.clientHeight;
  }
}

const WHITE_KEYS = ["z", "x", "c", "v", "b", "n", "m"];
const BLACK_KEYS = ["s", "d", "g", "h", "j"];

const keys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll(".key.white");
const blackKeys = document.querySelectorAll(".key.black");

keys.forEach((key) => {
  key.addEventListener("click", () => playNote(key));
});

// keys[4].style.backgroundColor = "red";
// console.log(
//   "key clientleft: " +
//     keys[4].getBoundingClientRect().left +
//     document.body.scrollLeft +
//     " " +
//     keys[4].getBoundingClientRect().top +
//     document.body.scrollTop
// );
document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const key = e.key;
  const whiteKeyIndex = WHITE_KEYS.indexOf(key);
  const blackKeyIndex = BLACK_KEYS.indexOf(key);

  if (whiteKeyIndex > -1) {
    playNote(whiteKeys[whiteKeyIndex]);
  }
  if (blackKeyIndex > -1) {
    playNote(blackKeys[blackKeyIndex]);
  }
});

function playNote(key) {
  const noteAudio = document.getElementById(key.dataset.note);
  noteAudio.currentTime = 0;
  noteAudio.play();
  key.classList.add("active");
  noteAudio.addEventListener("ended", () => {
    key.classList.remove("active");
  });
}

function detectCollision(Obj1, Obj2, key) {
  // console.log(Obj1.x + " " + Obj1.y + " " + Obj1.width + " " + Obj1.height);
  // console.log(Obj2.x + " " + Obj2.y + " " + Obj2.width + " " + Obj2.height);
  if (
    Obj1.x < Obj2.x + Obj2.width &&
    Obj1.x + Obj1.width > Obj2.x &&
    Obj1.y < Obj2.y + Obj2.height &&
    Obj1.y + Obj1.height > Obj2.y
  ) {
    console.log("collision DETECTEDDDDDDDD");
    playNote(key);
    // alert("COLLISON DETECTED");
  }
}

// constructor
function Obj(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}
for (let i = 0; i < keys.length; i++) {}
function runDetection() {
  model.detect(video).then((predictions) => {
    // const face = predictions.find((fc) => fc.label == "face");
    const pinch = predictions.find((ac) => ac.label == "pinch");
    const open = predictions.find((op) => op.label == "open");
    const close = predictions.find((cl) => cl.label == "closed");
    const point = predictions.find((po) => po.label == "point");

    const bboxa = predictions.find((po) => po.bbox);
    xglobal =
      ((bboxa.bbox[0] + 0.5 * bboxa.bbox[2]) / video.width) * screen.width;
    yglobal =
      ((bboxa.bbox[1] + 0.5 * bboxa.bbox[3]) / video.height) * screen.height;

    var CursorObj = new Obj(xglobal, yglobal, 15, 20);
    for (let i = 0; i < keys.length; i++) {
      var Key0Obj = new Obj(
        keys[i].getBoundingClientRect().left,
        keys[i].getBoundingClientRect().top,
        keys[i].getBoundingClientRect().width,
        keys[i].getBoundingClientRect().height
      );
      detectCollision(Key0Obj, CursorObj, keys[i]);
    }

    // if (CursorObj.x < Key0Obj.x + Key0Obj.width) {
    //   console.log("URMOMGAY");
    // }
    // if (CursorObj.x + CursorObj.width > Key0Obj.x) {
    //   console.log("URMOM COLLIDE 2");
    // }
    // if (CursorObj.y < Key0Obj.y + Key0Obj.height) {
    //   console.log("URMOM COLLIDE 3");
    // }
    // if (CursorObj.y + CursorObj.height > Key0Obj.y) {
    //   console.log("URMOM COLLIDE 2");
    // }

    // console.log("ayyo bitches = " + xglobal + " " + yglobal);
    // console.log(predictions);

    if (predictions.length > 0) {
      // console.log(open);
      // console.log(close);
      //audio.currentTime = 0;

      if (point) {
        // audio.play();
        cursor.style.left = px + xglobal + "px";
        cursor.style.top = py + yglobal + "px";
        // console.log("EARRAPE");
      } else if (open) {
        // audio2.play();
      } else if (close) {
        // audio2.pause();
        // audio2.currentTime = 0;
      }
    }

    model.renderPredictions(predictions, canvas, context, video);

    //requestAnimationFrame(runDetection);
  });
}

//model.setModelParameters(params);
window.addEventListener("mousemove", function (e) {
  x = e.clientX;
  y = e.clientY;
  // console.log("HAHAHAHAH" + x + " " + y);
  // sets the image cursor to new relative position
  cursor.style.left = px + x + "px";
  cursor.style.top = py + y + "px";
});

handTrack
  .load()
  .then((lmodel) => {
    model = lmodel;
  })
  .catch((err) => {
    console.log("unable to load!!");
  });

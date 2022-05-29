// *** All functions relaed to snake directions here 

// ### Main Function to change snake directions
function moveSnakeDirection(event) {
    const x = direction.x;
    const y = direction.y;

    switch (event) {
        case "up":
            direction.x = -1;
            direction.y = 0;
            break;

        case "down":
            direction.x = 1;
            direction.y = 0;
            break;

        case "left":
            direction.y = -1;
            direction.x = 0;
            break;

        case "right":
            direction.y = 1;
            direction.x = 0;
            break;

        default:
            break;
    }
    if (x !== direction.x && y !== direction.y) {
        move_music.play();

        showModal(event + "Move")
        setTimeout(() => {
            hideModal(event + "Move")
        }, 500);
    }
}

// ## Movement detection of face by its Landmarks

// function to find distance between two given face landmarks
function findDistanceBetweenFaceLandmarks(faceLandmarks, i, j) {
    return faceapi.euclideanDistance([faceLandmarks[i].x, faceLandmarks[i].y], [faceLandmarks[j].x, faceLandmarks[j].y])
}

function findDirectionWithFaceLandmarks(faceLandmarks) {
    const topLeftDiagonalDistance = findDistanceBetweenFaceLandmarks(faceLandmarks, 1, 27);
    const bottomLeftDiagonalDistance = findDistanceBetweenFaceLandmarks(faceLandmarks, 1, 8);
    const topRightDiagonalDistance = findDistanceBetweenFaceLandmarks(faceLandmarks, 27, 15);
    const bottomRightDiagonalDistance = findDistanceBetweenFaceLandmarks(faceLandmarks, 8, 15);

    // console.log(topRightDiagonalDistance, bottomRightDiagonalDistance, topLeftDiagonalDistance, bottomLeftDiagonalDistance)
}

// ## Movement detection of hand by its Landmarks
function findDirectionWithHandLandmarks(handLandmarks) {
    // check if ring finger is folded
    if (handLandmarks[16].y > handLandmarks[14].y) {
        // check if index finger is folded
        if (handLandmarks[8].y > handLandmarks[6].y) {
            moveSnakeDirection("down")
        } else {
            // check if middle finger is folded
            if (handLandmarks[12].y > handLandmarks[10].y) {
                moveSnakeDirection("left")
            }
            else {
                moveSnakeDirection("right")
            }
        }
    } else {
        moveSnakeDirection("up")
    }
}

// Detecting directions using keyboard and mobile screens 
window.mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

if (window.mobileCheck()) {
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }

    function handleTouchStart(evt) {
        back_music.play();
        const firstTouch = getTouches(evt)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    };

    function handleTouchMove(evt) {
        if (!xDown || !yDown) {
            return;
        }

        back_music.play();

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 0) {
                /* right swipe */
                moveSnakeDirection("right");
            } else {
                /* left swipe */
                moveSnakeDirection("left");
            }
        } else {
            if (yDiff > 0) {
                /* down swipe */
                moveSnakeDirection("down");
            } else {
                /* up swipe */
                moveSnakeDirection("up");
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    };
}
else {
    window.addEventListener("keydown", (t) => {
        if ((t.key == "ArrowUp" || "ArrowDown" || "ArrowLeft" || "ArrowRight")) {
            back_music.play();
        }

        switch (t.key) {
            case "ArrowUp":
                moveSnakeDirection("up");
                break;

            case "ArrowDown":
                moveSnakeDirection("down");
                break;

            case "ArrowLeft":
                moveSnakeDirection("left");
                break;

            case "ArrowRight":
                moveSnakeDirection("right");
                break;

            case "Escape":
                pause();

            default:
                break;
        }
    })
}

// *** All functions related to displaying modals here 
function showModal(elementId, blur = false) {
    if (blur) {
        document.getElementsByClassName("mainDisplay")[0].style.filter = "blur(5px)";
    }
    document.getElementById(elementId).classList.add("showModal")
    document.getElementById(elementId).classList.remove("hideModal")
}

function hideModal(elementId) {
    document.getElementsByClassName("mainDisplay")[0].style.filter = "none";
    document.getElementById(elementId).classList.add("hideModal")
    document.getElementById(elementId).classList.remove("showModal")
}

// *** All EventListeners ***
playButton.addEventListener("click", () => {
    hideModal("firstPage")
    showModal("secondPage")
})

loginButton.addEventListener("click", () => {
    if (!loginButton.disabled) {
        hideModal("secondPage")
        showModal("main")
        playGame = true
        document.getElementById("main").zIndex = "5465454546546"
    }
})
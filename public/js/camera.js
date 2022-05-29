// variables for saving pictures to cloudinary
const cloud_name = "mysampletestcloudinary";
const upload_preset = "l1hjhngl";
const canvas = document.getElementById("canvas");
const cloudinary_photo = document.getElementById("cloudinary_photo");
const start_camera_button = document.getElementById("start_camera_button");
const take_picture_button = document.getElementById("take_picture_button");
const clear_picture_button = document.getElementById("clear_picture_button");
const upload_button = document.getElementById("upload_button");

take_picture_button.addEventListener("click", takePhoto);
clear_picture_button.addEventListener("click", clearPhotos);
upload_button.addEventListener("click", uploadPhoto);

function clearPhotos() {
    var context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/png");
    cloudinary_photo.setAttribute("src", data);
    upload_button.disabled = true;
}

function takePhoto() {
    var context = canvas.getContext("2d");
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(videoElement, 0, 0, width, height);
        upload_button.disabled = false;
    } else {
        clearPhotos();
    }
}

function uploadPhoto() {
    canvas.toBlob((blob) => {
        var formdata = new FormData();
        formdata.append("file", blob);
        formdata.append("upload_preset", upload_preset);
        formdata.append("cloud_name", cloud_name);

        var xhr = new XMLHttpRequest();
        xhr.open(
            "POST",
            "https://api.cloudinary.com/v1_1/" + cloud_name + "/image/upload",
            false
        );

        xhr.onload = function () {
            let response = JSON.parse(this.response);
            cloudinary_photo.setAttribute("src", response.secure_url);
            console.log(this.responseText)
        };

        xhr.send(formdata);
    });
}
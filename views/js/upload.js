function updateSelection() {
    let fileElement = document.getElementById('file');
    text = "";

    if ('files' in fileElement) {
        if (fileElement.files.length == 0) {
            text = "[No file selected]"
        } else {
            for (let i = 0; i < fileElement.files.length; i++) {
                if (text != "") {
                    text += ", ";
                }
                let file = fileElement.files[i];
                if ('name' in file) {
                    text += file.name;
                }
            }
        }
    }

    document.getElementById('uploadLabel').innerHTML = text;
}

function getLink() {
    //let fileElement = document.getElementById('file');
    //let password = document.getElementById('password').innerHTML;
    const formData = new FormData(document.getElementById("mainForm"));
    var xhttp = new XMLHttpRequest();
    //var boundary=Math.random().toString().substr(2);
    xhttp.open("POST", "/upload");
    //xhttp.setRequestHeader("Content-type", "multipart/form-data; charset=utf-8; boundary=" + boundary);
    /*for(var key in formData){
        multipart += "--" + boundary
        + "\r\nContent-Disposition: form-data; name=" + key
        + "\r\nContent-type: application/octet-stream"
        + "\r\n\r\n" + formData[key] + "\r\n";
    }*/
    //multipart += "--"+boundary+"--\r\n";

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 || this.status == 200) {
            link = JSON.parse(this.responseText)
            showNotification(link.fileLink);
        }
    }
    xhttp.send(formData);
}

function showNotification(link) {
    let notification = document.getElementById("notification");
    notification.innerHTML = "";
    var p = document.createElement("P");
    var text = document.createTextNode('Your file is uploaded');
    p.appendChild(text);
    var linkElement = document.createElement('a');
    var linkText = document.createTextNode(`${link}`);
    linkElement.appendChild(linkText);
    linkElement.href = link;
    notification.appendChild(p);
    notification.appendChild(linkElement);
    notification.classList.add("show")
}

function showError() {
    let notification = document.getElementById("notification");
    notification.classList.add("show")
}
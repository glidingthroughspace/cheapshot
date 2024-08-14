const socket = io.connect("/manage");

socket.on("phone_connected", function (data) {
  console.log("Phone connected");
  const phones = document.querySelector("#numphones");
  phones.innerText = data.num_phones;
});

socket.on("phone_disconnected", function (data) {
  console.log("Phone disconnected");
  const phones = document.querySelector("#numphones");
  phones.innerText = data.num_phones;
});

async function previewPhoto() {
  await fetch(`/api/v1/preview-photo`, {});
  window.setTimeout(function () {
    const photo = document.querySelector("#manage-preview");
    photo.src = `/api/v1/snapshots/preview/photos/${Math.ceil(
      parseInt(document.querySelector("#numphones").innerText, 10) / 2
    )}?_=${Date.now()}`;
  }, 750);
}

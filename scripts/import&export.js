function fileDownloader(filename = "roulette.json", mime, bom) {
  let data = JSON.stringify(defaultItems);
  var blobData = typeof bom !== "undefined" ? [bom, data] : [data];
  var blob = new Blob(blobData, { type: mime || "application/octet-stream" });
  if (typeof window.navigator.msSaveBlob !== "undefined") {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var blobURL =
      window.URL && window.URL.createObjectURL
        ? window.URL.createObjectURL(blob)
        : window.webkitURL.createObjectURL(blob);
    var tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", filename);

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }

    document.body.appendChild(tempLink);
    tempLink.click();

    // Fixes "webkit blob resource error 1"
    setTimeout(function () {
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
    }, 200);
  }
}

function importJson() {
  const interval = setInterval(() => {
    const fileUpload = document.getElementById("file-upload");
    if (fileUpload) {
      fileUpload.addEventListener("change", (e) => {
        const file = e?.target?.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.addEventListener("load", (event) => {
            const result = event.target.result;
            const splittedResult = result.split(",");
            const json = splittedResult[splittedResult.length - 1];
            window.localStorage.setItem("defaultItems", decodeURIComponent(escape(window.atob(json))));
          });
          reader.readAsDataURL(file);
        }
        window.location.reload();
      });
      clearInterval(interval);
    }
  }, 200);
}
importJson();

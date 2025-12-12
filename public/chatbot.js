(function () {
  // 1️⃣ Create floating chat icon
  let icon = document.createElement("button");
  icon.innerHTML = "💬";
  icon.id = "floatingChatIcon";
  icon.style.position = "fixed";
  icon.style.bottom = "20px";
  icon.style.right = "20px";
  icon.style.width = "55px";
  icon.style.height = "55px";
  icon.style.borderRadius = "50%";
  icon.style.border = "none";
  icon.style.background = "#4f46e5";
  icon.style.color = "white";
  icon.style.fontSize = "26px";
  icon.style.cursor = "pointer";
  icon.style.display = "flex";
  icon.style.alignItems = "center";
  icon.style.justifyContent = "center";
  icon.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
  icon.style.zIndex = "99999";

  document.body.appendChild(icon);

  // 2️⃣ Create iframe (chat window) → hidden initially
  let iframe = document.createElement("iframe");
  iframe.src = "http://localhost:5000/chatbot.html";
  iframe.id = "chatIframe";
  iframe.style.position = "fixed";
  iframe.style.bottom = "90px";
  iframe.style.right = "20px";
  iframe.style.width = "350px";
  iframe.style.height = "500px";
  iframe.style.border = "none";
  iframe.style.display = "none"; // HIDDEN
  iframe.style.zIndex = "99998";
  iframe.style.borderRadius = "10px";
  iframe.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";

  document.body.appendChild(iframe);

  // 3️⃣ On icon click → show iframe + hide icon
  icon.addEventListener("click", function () {
    iframe.style.display = "block";
    icon.style.display = "none";
  });

  // 4️⃣ Optional: Detect close button from inner page
  window.addEventListener("message", function (event) {
    if (event.data === "closeChat") {
      iframe.style.display = "none";
      icon.style.display = "flex";
    }
  });
})();

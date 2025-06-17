const inputElement = document.getElementById("user-message");
const buttonElement = document.getElementById("send");

buttonElement.addEventListener("click", () => {
  const value = inputElement.value; // get latest value on click

  fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: value,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Server says:", data.AI);
      const newDiv = document.createElement("div");
      newDiv.textContent = data.AI;
      document.body.appendChild(newDiv);
    })
    .catch((err) => console.error("Error:", err));
});

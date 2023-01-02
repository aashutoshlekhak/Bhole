import bot from "./assets/shiva.jpg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

// for initial loading type animation

function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += "ॐ";

    if (element.textContent === "ॐॐॐॐe") {
      element.textContent = "";
    }
  }, 300);
}

//for the letter by letter typing experience

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      //text will be the text returned by the AI. It will check until the length of the text.
    } else {
      clearInterval(interval);
    }
    //clearInterval clears the timer set by the set Interval method.
  }, 20);
}

//to generate unique id for each answer

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

//to generate color stripe between answers and questions

function chatStripe(isAi, value, uniqueId) {
  return `
<div class="wrapper ${isAi && "ai"}">
     <div class="chat">
        <div class="profile">
            <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}">
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
    </div>
</div>
        `;
}

// function to handle submit the AI generated response

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // bot's chatstripe

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // fetch data from server -> bot's response

  const response = await fetch("http://localhost:5000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";
  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    console.log({ parsedData });
    typeText(messageDiv, parsedData);
  } else {
    const err = await reseponse.text();
    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});

/*
Ehm don't mind me just clarifying my
global variables, kekw

keep in mind im especially using ES6
so uh.. no function keyword ig???
*/

let currentText = "";
let textArr;
let currentIndex = 0;
let coloredTextElement;
let stats;
let timerLimit;
let tests = 0;
let format;

/*

TYPING DATA/STATISTICS FORMULAS

(Correct/Chars)*100 = Accuracy Precentage
Words/Minutes = WPM
Words/Seconds = WPS ! NOT USED

*/

const startFade = async() => {
  await $("#title").fadeIn(1500);
  await $("#subtitle").fadeIn(1500);
  await $("#st-btn").fadeIn(1500);
}

// Initializing Data/Statistics for Test on-start
const startTyping = () => {
  stats = 
  {
      "totalWords": 0,
      "totalChars": 0,
      "totalCorrect": 0,
      "totalIncorrect": 0
  };
  document.getElementById("typingForm").style.display = "none";
  if(document.getElementById("typingTest").value != "none") {
    const timer =
    {
      "minutes": document.getElementById("typingTest").value.split(":")[0],
      "seconds": document.getElementById("typingTest").value.split(":")[1]
    };
    setTypeTimer(timer);
  }
  format = document.getElementById("typingFormat").value;
  $("#typing").fadeIn(300);
  fetchText();
}

// Custom-Made Timer for Test
const setTypeTimer = (timer) => {
  timerElement.style.display = "block";
  timerLimit = { "minutes": timer["minutes"], "seconds": timer["seconds"] };
  const interval = setInterval(() => {
    if(timer["seconds"] <= 1) {
      if(timer["minutes"] <= 0) {
        clearInterval(interval);
        endTyping();
      } else {
        timer["seconds"] = 59;
        timer["minutes"]--;
      }
    } else {
      timer["seconds"]--;
    }

    timerElement.innerHTML = timer["minutes"] + " minute(s) and " + timer["seconds"] + " second(s) left";
  }, 1000);
}

// Showing End Statistics and ending test
const endTyping = async(showStats = true) => {
  const data = stats;
  const accuracy = Math.floor((data["totalCorrect"]/data["totalChars"])*100);
  document.getElementById("stats").innerHTML = 
    "<h4><b>Test Statistics</b></h4><b>Total Words</b>: " + data["totalWords"] +
    "<br><b>Total Characters</b>: " + data["totalChars"] +
    "<br><b>Total Correct</b>: " + data["totalCorrect"] +
    "<br><b>Total Incorrect</b>: " + data["totalIncorrect"] +
    "<br><b>Accuracy:</b> " + accuracy + "%";
  if(showStats == true) {
    let min = parseInt(timerLimit["minutes"]);
    let wpm = Math.floor(data["totalWords"]/min);
    console.log(data["totalWords"] / min);
    console.log(min);
    if(timerLimit["seconds"] == 30) {
      wpm = data["totalWords"]/0.5;
    }
    document.getElementById("stats").innerHTML += "<br><br><b>WPM</b>: " + wpm;
  }
  await $("#typing").fadeOut(1800);
  await $("#stats").fadeIn(1800);
  await $("#startNewTest").fadeIn(1800);
  tests++;
}

// Fetching Text for User to Type with APIs
const fetchText = async() => {
  if(format == "word") {
    const wordData = await fetch("https://random-word-api.herokuapp.com/word?number=8", {
      headers: {
        Accept: "application/json"
      }
    });
    const words = await wordData.json();
    textUpdate(words.join(" "));
  } else if(format == "joke") {
    const jokeData = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json"
      }
    });
    const jokeJSON = await jokeData.json();
    textUpdate(jokeJSON.joke);
  } else {
    const rand = Math.floor(Math.random() * 3);
    if(rand == 0) {
      const wordData = await fetch("https://random-word-api.herokuapp.com/word?number=8", {
        headers: {
          Accept: "application/json"
        }
      });
      const words = await wordData.json();
      textUpdate(words.join(" "));
    } else {
      const jokeData = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json"
        }
      });
      const jokeJSON = await jokeData.json();
      textUpdate(jokeJSON.joke);
    }
  }
}

// Update new text element data
const textUpdate = (text) => {
  currentText = text;
  textArr = currentText.split("");
  let arr = [];
  for(var i = 0; i < textArr.length; i++) {
    arr.push('<span id=' + i + '>' + textArr[i] + '</span>');
  }
  coloredTextElement = arr.join("");
  textElement.innerHTML = coloredTextElement;
  currentIndex = 0;
}

// Main Typing Event Func
const typingEvent = (e) => {
  typingBox.value = "";
  typingBox.placeholder = "";
  if(textArr[currentIndex+1] == undefined) {
    fetchText();
  }
  
  let key = String.fromCharCode(e.which);
  if(textArr[currentIndex] == "”") {
    textArr[currentIndex] = '"';
  } if(textArr[currentIndex] == "‘") {
    textArr[currentIndex] = "'";
  }
  if(textArr[currentIndex] == key) {
    document.getElementById(currentIndex).classList.add("correct");
    console.log("correct");
    stats["totalCorrect"]++;
  } else {
    document.getElementById(currentIndex).classList.add("incorrect");
    console.log(textArr[currentIndex]);
    console.log(key);
    console.log("incorrect");
    stats["totalIncorrect"]++;
  }
  
  currentIndex++;
  stats["totalChars"]++;
  
  if(key == " ") {
    stats["totalWords"]++;
  }
}

// Starting Fade Animation
startFade();

// Making life easier with these variables already setup
const textElement = document.getElementById("typingText");
const textBTNElement = document.getElementById("st-btn");
const typingBox = document.getElementById("typingBox");
const timerElement = document.getElementById("timer");

// Doesn't do anything rn, if I continue this project, I will make an scrollDown animation for this
textBTNElement.addEventListener("click", fetchText);
document.getElementById("newTextBTN").addEventListener("click", fetchText);
document.getElementById("endTestBTN").addEventListener("click", () => {
  endTyping(false);
});
document.getElementById("submitForm").addEventListener("click", startTyping);

// Main Typing Event Function
typingBox.onkeypress = typingEvent;
document.onkeyup = () => {
  typingBox.value = "";
}

// fadeIn/Out Animation with JQuery Lib for startNewTest-btn
document.getElementById("startNewTest").addEventListener("click", async() => {
  await $("#startNewTest").fadeOut(1800);
  await $("#stats").fadeOut(1800);
  await $("#typingForm").fadeIn(1800);
});
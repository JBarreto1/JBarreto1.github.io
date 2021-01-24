let total = 0
let hitCount = 0
let missCount = 0
let percentage = 100
let longestStreak = 0
let currentStreak = 0

function hit() {
    // do the math here
    total += 1
    hitCount += 1
    percentage = (hitCount / total) * 100
    currentStreak += 1
    if (currentStreak > longestStreak) {
        longestStreak = currentStreak
        document.getElementById("streak").innerHTML = longestStreak;
    }

    // report it here
    document.getElementById("total").innerHTML = total;
    document.getElementById("hit").innerHTML = hitCount;
    document.getElementById("percentage").innerHTML = percentage.toFixed(2);;
  }

function miss() {
    // do the math here
    total = total + 1
    missCount = missCount + 1
    percentage = (hitCount / total) * 100
    currentStreak = 0

    // report it here
    document.getElementById("total").innerHTML = total;
    document.getElementById("miss").innerHTML = missCount;
    document.getElementById("percentage").innerHTML = percentage.toFixed(2);;

  }

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList

var terms = ['make','hit','in','out','miss','off','brick'];
var grammar = '#JSGF V1.0; grammar terms; public <term> = ' + terms.join(' | ') + ' ;'
const startBtn = document.getElementById("startBtn")
const result = document.getElementById("result")

let toggleBtn = null
if (typeof SpeechRecognition === "undefined") {
    startBtn.remove();
    result.innerHTML = "Browser does not support Speech API. Please download latest chrome";
} else {
    const recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = event => {
        const res = event.results[0][0].transcript
        console.log(res)
        // const text = event[0][0].transcript;
        // console.log(text)
        // const response = process(text)
    }
    let listening = false;
	toggleBtn = () => {
        if (listening) {
            recognition.stop();
            console.log("stop listening")
        } else {
            recognition.start();
            console.log("start listening")
        }
        listening = !listening;
    };
    startBtn.addEventListener("click", toggleBtn);
}

function process(rawText) {
    let text = rawText.replace(/\s/g, "");
    text = text.toLowerCase();
    if (text == "hit") {
        hit()
    }
    if (text == "miss") {
        miss()
    }
    if (text != "miss" && text != "hit") {
        console.log(text)
    }
}

// function hitFound(texts) {
//     for (i = 0; i < texts.length; i++){
//         if (texts[i].transcript == "hit"){
//             hit()
//         }
//         if (texts[i].transcript == "miss"){
//             miss()
//         }
//     }
//     return 0
// }




    

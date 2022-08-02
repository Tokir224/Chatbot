var height = 100

navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        console.log('You let me use your mic!')
      })
      .catch(function(err) {
        console.log('No mic for you!')
      });

jQuery(document).ready(function () {
    jQuery(".toggle-btn, .close-icon").click(function () {
        jQuery("body").toggleClass("show");
    });
});

function scrollToBottom() {
    height += 100
    $('.chat-box-des-main').scrollTop(height);
}


function getBotResponse() {
    var rawText = $("#textInput").val();
    var userHtml = '<div class="right-chat"><p class="chat-word">' + rawText + '</p></div> ';
    $("#textInput").val("");
    $("#chatbox").append(userHtml);
    scrollToBottom();
    $.get("/get", { msg: rawText }).done(function (data) {
        var botHtml = '<div class="left-chat"><p class="chat-word">' + data + '</p></div> ';
        $("#chatbox").append(botHtml);
        scrollToBottom();
    });

}
$("#textInput").keypress(function (e) {
    if (e.which == 13 && $("#textInput").val().length != 0){
        getBotResponse();
    }
});
$("#buttonInput").click(function () {
    if ($("#textInput").val().length != 0){
       getBotResponse();
    }
})

var language = 'en-US';
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

var recognition;

function setUp() {
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
//        start_button.style.display = 'inline-block';
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function () {
            console.log("onstart")
            recognizing = true;
            start_img.style.display = 'none'
            audio_img.style.display = 'inline-block'

        };

        recognition.onerror = function (event) {
            if (event.error == 'no-speech') {
                start_img.style.display = 'none'
                stop_img.style.display = 'inline-block'
                ignore_onend = true;
            }
            if (event.error == 'audio-capture') {
                start_img.style.display = 'none'
                stop_img.style.display = 'inline-block'
                ignore_onend = true;
            }
            if (event.error == 'not-allowed') {
                start_img.style.display = 'none'
                stop_img.style.display = 'inline-block'
                if (event.timeStamp - start_timestamp < 100) {
                } else {
                }
                ignore_onend = true;
            }
        };

        recognition.onend = function () {
            console.log("onend")
            recognizing = false;
            if (ignore_onend) {
                return;
            }
            start_img.style.display = 'inline-block'
            audio_img.style.display = 'none'
            console.log(final_transcript);
            if (!final_transcript) {
                return;
            }
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                var range = document.createRange();
                window.getSelection().addRange(range);
            }
            $.get("/get", { msg: final_transcript }).done(function (data) {
                var botHtml = '<div class="left-chat"><p class="chat-word">' + data + '</p></div> ';
                $("#chatbox").append(botHtml);
                scrollToBottom();
                console.log("data",data)
                var msg = new SpeechSynthesisUtterance();
                msg.text = data;
                window.speechSynthesis.speak(msg);
            });

        };

        recognition.onresult = function (event) {
            console.log("onresult")
            var interim_transcript = '';
            if (typeof (event.results) == 'undefined') {
                recognition.onend = null;
                recognition.stop();
                upgrade();
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
        };
    }
}

function upgrade() { // tell user to upgrade &/or use Chrome
    start_button.style.visibility = 'hidden';
}

function startButton(event) {
    console.log(recognizing)
    if (recognizing) {
        console.log("startButton", recognizing)
        recognition.stop();
        return;
    }
    console.log("startButton", recognizing)
    final_transcript = '';
    recognition.lang = language;
    recognition.start();
    ignore_onend = false;
    start_img.style.display = 'none'
}

setUp();
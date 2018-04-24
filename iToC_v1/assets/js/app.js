
var unsortedAnswer = [],      unsortedRecord = [],
    answer = [],              answerRecord = [],
    remainingSecs,            data,
    participantInfo = [],     participantNum,
    interval,                 counter = 0,
    part = $("#partInfo .form-control"),
    letters = $(".form-control[name=letter]"),
    rows = $(".form-control[name=row]"),
    columns = $(".form-control[name=column]"),
    correctAnswer = ["4E", "7B", "7H", "Q", "R", "W"],
    gong = new Audio("assets/gong.mp3");

function timer(secs, id, func) {
  var reset = secs;
  remainingSecs = secs;
  interval = setInterval(function() {
     secs--
     remainingSecs --
     if (secs >= 10) {
       $(id).text(secs);
     } else {
       $(id).text("0" + secs);
     }
     if (secs == -1) {
        func();
        secs = reset;
     }
  }, 1000);
}

function start() {
  $("#form").trigger("reset");
  $("#cover").toggleClass("hide");
  $("#puzzle").toggleClass("hide");
  $("#formCover").toggleClass("partCover hide");
  $("#partInfo").addClass("hide");
  $("#instructions").html("Moving only 3 tokens and moving only to the grey squares you must make the arrow point upwards. You have 30 seconds to study the puzzle and choose 3 tokens to solve the puzzle. Decide on the new position for each token. Once the 30 seconds are up, you have 45 seconds to fill in the form below. For each token, enter the letter corresponding to the token, then the co-ordinates of the row and column for the new position.")
  answer = [];
  unsortedAnswer = [];
  timer(30, "#cd1 span", ready);
}

function ready() {
  gong.play();
  $("#formCover").toggleClass("partCover hide");
  $("#timerTwoDisplay").toggleClass("hide");
  $("#puzzleCover").toggleClass("partCover");
  clearInterval(interval);
  unsortedAnswer.push("Ready at " + remainingSecs + "s");
  $("#cd1 span").text("30");
  timer(45, "#cd2 span", submit);
}

function submit() {
  gong.play();
  $("#cover").toggleClass("hide");
  $("#puzzle").toggleClass("hide");
  $("#puzzleCover").toggleClass("partCover");
  $("#timerTwoDisplay").toggleClass("hide");
  clearInterval(interval);
  unsortedAnswer.push("Submit at " + remainingSecs + "s");
  $("#cd2 span").text("45");
  for(var i = 0; i < letters.length; i++){
    unsortedAnswer.push(letters[i].value.toUpperCase(), rows[i].value + columns[i].value.toUpperCase())
    answer.push(letters[i].value.toUpperCase(), rows[i].value + columns[i].value.toUpperCase());
  }
  unsortedRecord.push(unsortedAnswer);
  answer.sort();
  answerRecord.push(answer);
  if (answer.toString() === correctAnswer.toString()) {
    $("#cover-btn").html("<h4>CORRECT!</h4>");
    unsortedRecord.push("Success!");
    $("#thanks-btn").toggleClass("hide");
  } else if (counter == 20) {
    $("#cover-btn").html("<h4>END OF SESSION</h4>");
    $("#thanks-btn").toggleClass("hide");
    unsortedRecord.push("Fail!");
  } else {
    $("#cover-btn").html("<h4>Incorrect - Click to try again</h4>");
  }
}

function exportFile()
    {
        var data = [unsortedRecord, participantInfo];
        //var data = [[1,2,3,4,5],[11,22,33,44,55],[111,222,333,444,555],[1111,2222,3333,4444,5555]];
        var keys = ['"Times and Form Entry"', '"Participant Info"'];

        var convertToCSV = function(data, keys) {
            var orderedData = [];
            for (var i = 0, iLen = data.length; i < iLen; i++) {
                temp = data[i];
                for (var j = 0, jLen = temp.length; j < jLen; j++) {

                    quotes = ['"'+temp[j]+'"'];
                    if (!orderedData[j]) {
                        orderedData.push([quotes]);
                    } else {
                        orderedData[j].push(quotes);
                    }
                }
            }
            return keys.join(',') + '\r\n' + orderedData.join('\r\n');
        }


        var str = convertToCSV(data, keys);

        var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
        saveAs(blob, [participantNum+'.csv']);
    }

$("#cover-btn").on("click", function(){
  start();
});

$("#form-cover-btn").on("click",function(){
  ready();
});

$("#submit-btn").on("click", function(){
  submit();
});

$("#thanks-btn").on("click", function(){
  for(var i = 0; i < part.length; i++){
    if (i < 1) {
      participantInfo.push("Age: " + part[i].value);
    } else {
      participantInfo.push(part[1].value);
    }
  }
  participantNum = "A" + (Math.floor(Math.random()*90000) + 10000)
  participantInfo.push(participantNum);
  exportFile();
});


let unsortedAnswer = [],      unsortedRecord = [],
    answer = [],              answerRecord = [],
    totalSecs,                data,
    participantInfo = [],     participantNum,
    interval,                 counter = 0,
    part = $("#partInfo .form-control"),
    letters = $(".form-control[name=letter]"),
    rows = $(".form-control[name=row]"),
    columns = $(".form-control[name=column]"),
    correctAnswer = ["4E", "7B", "7H", "Q", "R", "W"],
    participantLetter,
    gong = new Audio("../assets/gong.mp3");



function timer(secs) {
  totalSecs = secs;
  interval = setInterval(function() {
     totalSecs ++
  }, 1000);
}

function start() {
  $("#form").trigger("reset");
  $("#cover").toggleClass("hide");
  $("#puzzle").toggleClass("hide");
  $("#formCover").toggleClass("partCover hide");
  $("#partInfo").addClass("hide");
  answer = [];
  unsortedAnswer = [];
  timer(0);
}

function ready() {
  gong.play();
  $("#formCover").toggleClass("partCover hide");
  $("#puzzleCover").toggleClass("partCover");
  clearInterval(interval);
  console.log(totalSecs)
  unsortedAnswer.push("Ready at " + totalSecs + "s");
}

function submit() {
  gong.play();
  $("#cover").toggleClass("hide");
  $("#puzzle").toggleClass("hide");
  $("#puzzleCover").toggleClass("partCover");
  clearInterval(interval);
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

function exportFile() {
  var data = [unsortedRecord, participantInfo];
  //var data = [[1,2,3,4,5],[11,22,33,44,55],[111,222,333,444,555],[1111,2222,3333,4444,5555]];
  var keys = ['"Time"', '"Participant Info"'];
  
  var convertToCSV = function(data, keys) {
    console.log("data:", data);
    var orderedData = [];
    for (var i = 0; i < data.length; i++) {
      console.log("i", i);
      var temp = data[i];
      for (var j = 0; j < temp.length; j++) {
        var quotes = ['"'+temp[j]+'"'];
        orderedData[j] ? orderedData[j].push(quotes) : orderedData.push([quotes]);
      }
      
      
    }
    return keys.join(',') + '\r\n' + orderedData.join('\r\n');

  }

  var str = convertToCSV(data, keys);
  console.log(str);
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

participantLetter = $("title").text().split('')[0]

$("#thanks-btn").on("click", function() {
  for(var i = 0; i < part.length; i++){
    if (i < 1) {
      participantInfo.push("Age: " + part[i].value);
    } else {
      participantInfo.push(part[1].value);
    }
  }
  console.log(participantInfo)
  participantNum = participantLetter + (Math.floor(Math.random()*90000) + 10000)
  participantInfo.push(participantNum);
  exportFile();
});

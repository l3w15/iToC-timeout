var thinkTime = [],
    unsortedAnswer = [],      unsortedRecord = [],
    answer = [],              interval,
    totalSecs,            data,
    participantInfo = [],     participantNum,
    totalTime = 0,            counter = 0,
    part = $("#partInfo .form-control"),
    letters = $(".form-control[name=letter]"),
    rows = $(".form-control[name=row]"),
    columns = $(".form-control[name=column]"),
    correctAnswer = ["4E", "7B", "7H", "Q", "R", "W"],
    gong = new Audio("../assets/gong.mp3");

function timer(secs) {
  totalSecs = secs;
  interval = setInterval(function() {
     totalSecs ++
  }, 1000);
}

function start() {
  counter ++;
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
  totalTime += totalSecs;
}

function submit() {
  gong.play();
  $("#cover").toggleClass("hide");
  $("#puzzle").toggleClass("hide");
  $("#puzzleCover").toggleClass("partCover");
  clearInterval(interval);
  for(var i = 0; i < letters.length; i++){
    unsortedAnswer.push(" " + letters[i].value.toUpperCase() + " to " + rows[i].value.toUpperCase() + columns[i].value.toUpperCase())
    answer.push(letters[i].value.toUpperCase(), rows[i].value + columns[i].value.toUpperCase());
  }
  unsortedRecord.push(unsortedAnswer);
  answer.sort();
  if (answer.toString() === correctAnswer.toString()) {
    $("#finish").html("CORRECT!");
    unsortedRecord.push("Success!");
    $("#cover2").toggleClass("hide");
  } else if (counter === 20) {
    $("#finish").html("END OF SESSION");
    $("#cover2").toggleClass("hide");
    unsortedRecord.push("Fail!");
  } else {
    $("#cover-btn").toggleClass("hide");
    $("#wait-btn").toggleClass("hide");
    $("#cover-btn").html("<h4>Incorrect - Click to try again</h4>");
  }
}

function exportFile() {
  var data = [unsortedRecord, thinkTime, participantInfo];
  var keys = ['"Answers submitted"','"Thinking Time (seconds)"', '"Participant Info"'];

  var convertToCSV = function(data, keys) {
    var orderedData = [];
    for (var i = 0; i < data.length; i++) {
      var temp = data[i];
      for (var j = 0; j < temp.length; j++) {
        var quotes = ['"'+temp[j]+'"'];
        orderedData[j] ? orderedData[j].push(quotes) : orderedData.push([quotes]);
      }
    }
    return keys.join(',') + '\r\n' + orderedData.join('\r\n');
  }

  var str = convertToCSV(data, keys);

  var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
  saveAs(blob, [participantNum+'.csv']);
}

function minutesAndSeconds(time) {
  var min = 0;
  var s = 0;
  while (time > 60) {
    min += 1;
    time -= 60;
  }
  s = time;
  return min + "m" + s + "s"
}

$("#cover-btn").on("click", function(){
  $("#cover-btn").toggleClass("hide");
  $("#wait-btn").toggleClass("hide");
  setTimeout(start, 5000);
});

$("#form-cover-btn").on("click",function(){
  ready();
});

$("#submit-btn").on("click", function(){
  submit();
});

var participantLetter = $("title").text().split('')[0];

$("#export").on("click", function(){
  for(var i = 0; i < part.length; i++){
    if (i < 1) {
      participantInfo.push("Age: " + part[i].value);
    } else {
      participantInfo.push(part[1].value);
    }
  }
  participantNum = participantLetter + (Math.floor(Math.random()*90000) + 10000);
  unsortedRecord.push("Total thinking time: " + minutesAndSeconds(totalTime));
  participantInfo.push(participantNum);
  exportFile();
  $("#export").toggleClass("hide");
  $("#restart").toggleClass("hide");
});

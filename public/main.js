$(function() {
  var arrLength = 0;
  var questionAnswer = [];
  
  function myFunc(val){
      console.log("this.val()", val);
      answerArr.push(val);
      i++;
      loop();
  }

  $.get( "/getData", function(data){
      console.log("ABC : ", data);
      questionAnswer = data.data;
      arrLength = questionAnswer.length;
      loop();
  });

  var i = 0;
  function loop(){
      if(i < arrLength){
          var objectData = questionAnswer[i];
          if(objectData.type == "none"){
              $("div.container").append('<div class="bs-calltoaction bs-calltoaction-primary"><div class="row"><div class="col-md-9 cta-contents"><h1 class="cta-title">'+objectData.questsion+'</h1></div></div></div>')
              i++;
              loop();
          }else if (objectData.type == "button") {
              var str = "";
              objectData.answer.forEach(function(val,ind){
                str = str + '<button type="button" class="btn btn-primary" onclick="myFunc('+val.toString()+');" value="'+val+'">'+val+'</button>';
              })
              $("div.container").append('<div class="bs-calltoaction bs-calltoaction-primary"><div class="row"><div class="col-md-9 cta-contents"><h1 class="cta-title">'+objectData.questsion+'</h1></div><div class="col-md-3 cta-button">'+str+'</div></div></div>')
              i++;
              loop();
          }else if (objectData.type == "date") {
              var str = "<input type='date' class='datepicker' id='datepicker'></input>";              
              $("div.container").append('<div class="bs-calltoaction bs-calltoaction-primary"><div class="row"><div class="col-md-9 cta-contents"><h1 class="cta-title">'+objectData.questsion+'</h1></div><div class="col-md-3 cta-button">'+str+'</div></div></div>')
              i++;
              loop();
          }else if (objectData.type == "dropdown") {
              var str = '<div class="dropdown"><button class="btn dropdown-toggle" type="button" data-toggle="dropdown">symptom select<span class="caret"></span></button><ul class="dropdown-menu">';
              objectData.answer.forEach(function(val,ind){
                str = str + '<li><a href="#">'+val+'</a></li>';
              })
              str = str + "</ul></div>";
              $("div.container").append('<div class="bs-calltoaction bs-calltoaction-primary"><div class="row"><div class="col-md-9 cta-contents"><h1 class="cta-title">'+objectData.questsion+'</h1></div><div class="col-md-3 cta-button">'+str+'</div></div></div>')

              i++;
              loop();
          }else{
            console.log(objectData);
            i++;
            loop();
          }
      }else{
        $("div.container").append("<button id='submit' class='btn btn-success'>ButtonTest</button>");
        /*$("button#submit").click(function(){
            $('#piechart').piechart({
                  data: [
                      Fever = [
                          {cat: 'Fever', val: 9, label: "Common Cold"},
                          {cat: 'Fever', val: 7, label: "viral sinusitis"},
                          {cat: 'Fever', val: 5, label: "Flu"}
                      ]
                  ]
              });
        })*/
      }
  }
  var answerArr = [];


  var socket = io();

  // Socket events
  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Socket.IO Chat – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

  socket.on('disconnect', function () {
    log('you have been disconnected');
  });

  socket.on('reconnect', function () {
    log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', function () {
    log('attempt to reconnect has failed');
  });

});

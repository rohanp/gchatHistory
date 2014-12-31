function getChatHistory() {
  Logger.log("starting!")
  var email = Session.getActiveUser().getEmail();
  var subject = "Chat";

  var threads = GmailApp.getChatThreads(0,10);
  //body = format(thread[0].getMessages()[0].getRawContent());
  
  var person="mustuni1";
  var body="";
  
  for each (thread in threads){
    if(rightPerson(thread, person)){
       body += "\n"+ thread.getLastMessageDate() + "\n";
       for each (msg in thread.getMessages()){
          body+= format(msg.getRawContent(), person) + "\n";
          Logger.log(body);
          Utilities.sleep(1000);
       }
    }
  }
  
  GmailApp.sendEmail(email, subject, body);

  function rightPerson(thread, person){
    s=thread.getMessages()[0].getRawContent()+"";
    Logger.log(s);
    return s.search("To: " + person) != -1 || s.search("From: " + person) != -1;
  }

  function format(s,person){
    var me;
    if(s.search("To: " + person)!=-1){
      me=true;
    } else {
      me=false;
    }
    
    messageIndex = s.search("7bit") + 4;
    message = s.substring(messageIndex).replace('&#39;',"\'");
    
    if(me){
      return "me: " + message.trim();
    } else {
      return person + ": " + message.trim();
    }
  }
}


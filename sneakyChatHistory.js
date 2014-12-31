function main() {
  var startTime= (new Date()).getTime();
  var numThreads = 3000  
  var doc = DocumentApp.openByUrl(
      'https://docs.google.com/document/d/1JyiDWAeDoitq_unJYclvW2JJJHGJWW3TB0P-9Uc7W9Y/edit');
  var startRow = parseInt(doc.getName());
  ScriptApp.deleteTrigger(ScripApp.getProjectTriggers()[0]);
  
  
  for(var i = startRow; i <= numThreads; i++) {
    var currTime = (new Date()).getTime();
    if(currTime - startTime >= 200000) {
      ScriptApp.newTrigger("main")
               .timeBased()
               .at(new Date(currTime+350000))
               .create();
      break;
    } else {
      writeThreadHistory(i, doc);
      doc.setName(i);
    }
  }
  
  function writeThreadHistory(threadNum, doc) {
      Logger.log("writing thread!");
      var thread = GmailApp.getChatThreads(threadNum,1)[0];
      var person="mustuni1";
      var body="";
  
      if(rightPerson(thread, person)){
          body += "\n"+ thread.getLastMessageDate() + "\n";
          for each (msg in thread.getMessages()){
            body+= format(msg.getRawContent(), person) + "\n";
            Utilities.sleep(1000);
          }
      }
    doc.getBody().appendParagraph(body);
  }

  function rightPerson(thread, person){
    s=thread.getMessages()[0].getRawContent()+"";
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




function main() {
  var person="PersonsName";
  var startTime= (new Date()).getTime();
  var numThreads = 3000  
  var doc = DocumentApp.openById(ScriptProperties.getProperty("Id"));
  var name = doc.getName();
  var startRow = getLastThread(name);
  var startMsg = getLastMsg(name);
  
  for(var i = startRow; i <= numThreads; i++) {
    var currTime = (new Date()).getTime();
    if(currTime - startTime >= 330000) {
        break;
      } else {
        if(!writeThread(i, doc, doc.getName(), startMsg, startTime, person)){
          break;
        } else{
          startMsg=0;
        }
    }
  }
  
  function writeThread(threadNum, doc, name, startMsg, startTime, person) {
      Logger.log("checking thread #"+threadNum);
      var thread = GmailApp.getChatThreads(threadNum,1)[0];
      var len=thread.getMessageCount();
      Logger.log(len + "=?" + getThreadLen(name));
    
      //in case new threads were started mid-execution
      while(len!=getThreadLen(name)){
          Logger.log(len + "!=" + getThreadLen(name));
          threadNum++
          thread = GmailApp.getChatThreads(threadNum,1)[0];
          len=thread.getMessageCount();
          Logger.log("moved up one thread to" + threadNum);
      }
       var body="";
      
      if(rightPerson(thread, person)){
          Logger.log("Starting thread #" + threadNum); 
          if(startMsg==0){
            body += "\n"+ thread.getLastMessageDate() + "\n";
          }
          messeges=thread.getMessages()
          for(var n=startMsg; n<len; n++){
              if((new Date()).getTime()-startTime>350000){
                   doc.getBody().appendParagraph(body);
                   doc.setName(threadNum+":" + n + "/"+len);
                   Logger.log("leaving off on thread#"+threadNum+" line#"+n);
                   return false
                }
              body+= format(messeges[n].getRawContent(), person) + "\n";
          }
      }
    doc.getBody().appendParagraph(body);
    
    thread=GmailApp.getChatThreads(threadNum+1,1)[0];
    len=thread.getMessageCount();
    doc.setName((threadNum+1) + ":0/"+len);
    
    return true
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
  
  function getLastThread(s){
    end=s.search(":");
    return parseInt(s.substring(0,end));
  }
  
  function getLastMsg(s){
    start=s.search(":")+1;
    end=s.search("/");
    return parseInt(s.substring(start,end));
  }
  
  function getThreadLen(s){
    Logger.log("NAME="+s);
    start=s.search("/")+1;
    return parseInt(s.substring(start));
  }
}
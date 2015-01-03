function setup() {
  var len=GmailApp.getChatThreads(0,1)[0].getMessages().length
  var doc=DocumentApp.create('0:0/'+len);
  var currTime=(new Date()).getTime();
  ScriptProperties.setProperty("Id",doc.getId());
  
  ScriptApp.newTrigger("main")
               .timeBased()
               .everyMinutes(10)
               .create();
}
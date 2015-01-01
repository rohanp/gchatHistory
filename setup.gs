function myFunction() {
  len=GmailApp.getChatThreads(0,1)[0].getMessages().length
  doc=DocumentApp.create('0:0/'+len);
  ScriptProperties.setProperty("Id",doc.getId());
  
}

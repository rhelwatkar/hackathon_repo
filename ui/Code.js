var appUrl = ScriptApp.getService().getUrl();
var show_sidebar = true;
var show_footer =true;

function doGet(e) {
  var template = '';
  // Logger.log("stringify : "+JSON.stringify(e));
  // var req = JSON.stringify(e);

  Logger.log("e.parameter.page : "+e.parameter.page);
  
  try{
    switch(e.parameter.page){

      case'':
      case undefined:
      case 'index':
      case 'dashboard':
        template="index.html"
        break;

      case 'report':
        template='report_page.html'
        break;

      case 'login':
        template="login.html"
        show_sidebar=false
        show_footer=false
        break;
      
      default:
        template="error.html"
        show_sidebar=false
        show_footer=false
        break;
      

    }
  }catch(exception){

  }
  var page = HtmlService.createHtmlOutput();

  page.append(HtmlService.createTemplateFromFile('header.html').evaluate().getContent());
  if(show_sidebar){
    page.append(HtmlService.createTemplateFromFile('sidebar.html').evaluate().getContent());
  }
  
  page.append(HtmlService.createTemplateFromFile(template).evaluate().getContent());

  if(show_footer){
    page.append(HtmlService.createTemplateFromFile('footer.html').evaluate().getContent());
  }

  page.setFaviconUrl("https://www.globalpayments.com/-/media/project/global-payments/corporate/corporate/global/favicon/globalpayments_symbol_rgb.png");
  // page.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  page.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  
  return page;
}

function getUserEmail(){
  return Session.getActiveUser().getEmail();
}

function getUserName()
{
  let fullName = getUserEmail();
  
  return fullName;
}
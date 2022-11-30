

var audit_data_list;

var directory_options={
  'Dir 1':'Dir 1',
  'Dir 2':'Dir 2',
};

function html_directory_options(){
    var output ='';
    for(var dir_id in directory_options) {
        output+="<option id='"+dir_id+"' value='"+dir_id+"'>"+dir_id+"</option>";
    }
    return output;
}

function generateReport(inputs=null){
  if(inputs){
    var folder = inputs.directoryName;
    var created_date = inputs.date;
  }

  // fetch
  let url='https://storage.cloud.google.com/evidence_data/inventory.json?authuser=2'; // 
  var res = UrlFetchApp.fetch(url); //('https://people.sc.fsu.edu/~jburkardt/data/csv/cities.csv')
  Logger.log('res-'+res);
  // var csvraw = res.getContentText()

  // convert
  var csv = Utilities.parseCsv(res);
  // Logger.log('Csv-'+csvraw);
  // audit_data_list = csv;
}

function importCSVFromDrive() {
  var fileName = 'students.csv';
  var files = findFilesInDrive(fileName);
  if(files.length === 0) {
    Logger.log("No files with name \"" + fileName + "\" were found in Google Drive.");
    return;
  } else if(files.length > 1) {
    Logger.log("Multiple files with name " + fileName +" were found. This program does not support picking the right file yet.");
    return;
  }
  var file = files[0];
  var contents = file.getBlob().getDataAsString();
  Logger.log(contents);
  // var array = JSON.parse("[" + contents + "]");
  const usingSplit = contents.split(',');
  audit_data_list=usingSplit;
  Logger.log("contents array-");
  Logger.log(audit_data_list);
}

//Returns files in Google Drive that have a certain name.
function findFilesInDrive(filename) {
  var files = DriveApp.getFilesByName(filename);
  var result = [];
  while(files.hasNext())
    result.push(files.next());
  return result;
}

// function saveAsJSON() {
//   var blob,file,fileSets,obj;
  
//   obj = {//Object literal for testing purposes
//     key:"value"
//   }

// /**
//  * Creates a file in the users Google Drive
//  */
  
//   fileSets = {
//     title: 'AAA_Test.json',
//     mimeType: 'application/json'
//   };
  
//   blob = Utilities.newBlob(JSON.stringify(obj), "application/vnd.google-apps.script+json");
//   file = Drive.Files.insert(fileSets, blob);
//   Logger.log('ID: %s, File size (bytes): %s, type: %s', file.id, file.fileSize, file.mimeType);

// }

function auditDataTable(){
  var output_html = '';
  var headers=[];

  // if(audit_data_list === undefined) generateReport(inputs=null);
  if(audit_data_list === undefined) getData();

  if(audit_data_list){
      headers = audit_data_list[0];
      let j=0;
      audit_data_list.forEach(function(audit_data){
          if(j==0){
            j++;
          }else{
            var tmp = '';
            tmp=tmp+'<tr>';
            for(let i=0;i<audit_data.length;i++){
              tmp=tmp+'<td>'+audit_data[i]+'</td>';
            }
            tmp=tmp+'</tr>';

            output_html=output_html+tmp;
          }
      });

      if(output_html == ''){
        Logger.log('Info [report.gs] -> auditDataTable()- No data found');
      }
  }else{
    Logger.log("ERROR [report.gs] -> auditDataTable()- Audit data list object invalid!");
  }
  var content_data =  HtmlService.createHtmlOutput(output_html).getContent();
  return {'headers':headers, 'data':content_data}

}

function convertRangeToCsvFile() {
  
  if(audit_data_list === undefined) generateReport(inputs=null);

  try {
      if(audit_data_list){
        var data = audit_data_list;
        var csvFile = undefined;
        // Loop through the data in the range and build a string with the CSV data
        if (data.length > 1) {
          var csv = "";
          for (var row = 0; row < data.length; row++) {
            for (var col = 0; col < data[row].length; col++) {
              if (data[row][col].toString().indexOf(",") != -1) {
                data[row][col] = "\"" + data[row][col] + "\"";
              }
            }
            // Join each row's columns
            // Add a carriage return to end of each row, except for the last one
            if (row < data.length-1) {
              csv += data[row].join(",") + "\r\n";
            }
            else {
              csv += data[row];
            }
          }
          csvFile = csv;
        }
        return csvFile;
      }
      return false;
  }
  catch(err) {
    Logger.log(err);
  }
}

function getData(){
  var fileName = 'inventory.csv';
  var files = findFilesInDrive(fileName);
  if(files.length === 0) {
    Logger.log("No files with name \"" + fileName + "\" were found in Google Drive.");
    return;
  } else if(files.length > 1) {
    Logger.log("Multiple files with name " + fileName +" were found. This program does not support picking the right file yet.");
    return;
  }
  var file = files[0];
  var csvFile = file.getBlob().getDataAsString();
  // Logger.log("typeof- "+typeof contents);
  // Logger.log(contents);
  var csvData = Utilities.parseCsv(csvFile);
  // Logger.log(csvData);
  audit_data_list=csvData;
  return csvData;
}

function getDataRowsFromJson(){
  let csvDataArray = getData();
  let audit_data_list=csvDataArray;
  let j=0;
      audit_data_list.forEach(function(audit_data){
          if(j==0){
            j++;
          }else{
            for(let i=0;i<audit_data.length;i++){
              let foo = audit_data[i];
              var myArr = JSON.parse(foo);
              // Logger.log("foo:"+typeof foo);
              Logger.log("myArr:"+myArr);
              Object.keys(myArr)
              .forEach(function eachKey(key) { 
                Logger.log("key:"+key); // alerts key 
                Logger.log("value:"+foo[key]); // alerts value
              });
            }
        }
      });
}
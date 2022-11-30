var headers=[
  "Resource Name",
  "Resource Type",
  "Project ID",
  "Creation Time",
  "Metadata"
];



function getAuditJsonData() {
  var result = [];
  var jsData = outputData;
  jsData.forEach(function(audit_data){
    var resource_name = audit_data.name.toString();
      resource_name = resource_name.split(".com/").pop();

    var resource_type = audit_data.type.toString();
      resource_type = resource_type.split(".com/").pop();

    var project_id = audit_data.ancestors.toString();
      project_id = project_id.split("/").pop();

    // var project_id = audit_data.ancestors;
    // .replace("projects/","");
    // Logger.log("project_id"+project_id);
    var creation_time = audit_data.time;
    var metadata = JSON.stringify(audit_data.metadata);
    // Logger.log("creation_time"+creation_time);
    var row = {
      "resource_name":resource_name,
      "resource_type":resource_type,
      "project_id":project_id,
      "creation_time":creation_time,
      "metadata":metadata
    };
    
    result.push(row);
  });
  // Logger.log("result:");
  // Logger.log(result);
  return {'headers':headers, 'data':result}
}

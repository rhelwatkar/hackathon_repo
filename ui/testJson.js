var headers=[
  "Resource Name",
  "Resource Type",
  "Project ID",
  "Creation Time",
  "Discovery Document Uri"
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

    var creation_time = audit_data.time;
    var metadata = audit_data.metadata.discoveryDocumentUri;//JSON.stringify(audit_data.metadata.discoveryName);

    var row = {
      "resource_name":resource_name,
      "resource_type":resource_type,
      "project_id":project_id,
      "creation_time":creation_time,
      "metadata":metadata
    };
    
    result.push(row);
  });

  return {'headers':headers, 'data':result}
}

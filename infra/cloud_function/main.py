import functions_framework
from google.cloud import storage
from flask import jsonify
from os import path, environ 
import json
from google.cloud import asset_v1
import datetime

date_object = datetime.date.today()

def main(request):    
    project_resource =  "projects/{}".format('macro-virtue-368606')
    asset_client = asset_v1.AssetServiceClient()
    response = asset_client.list_assets(
        request={
            "parent": project_resource,
            "read_time": None,
            "asset_types": "",
            "content_type":'RESOURCE',
            "page_size": 10
        }
        )
   
    assets=[]
    asset_types=[]
    for asset in response:
        asset_types.append(str(asset.asset_type))
        asset_types=list(dict.fromkeys(asset_types))
        asset_response = asset_v1.Asset.to_json(asset)
        asset_response=json.loads(asset_response)
        assets.append({
            "name": asset_response["name"],
            "type": asset_response["assetType"],
            "ancestors" : asset_response["ancestors"],
            "time": asset_response["updateTime"],
            "metadata" : asset_response["resource"]      
        })

    upload_to_storage("Inventory",assets)

    for asset in asset_types: 
        asset_data = asset_client.list_assets(
            request={
                "parent": project_resource,
                "read_time": None,
                "asset_types": [asset],
                "content_type":'RESOURCE',
                "page_size": 10
            }
        )
        asset_data_list=[]
        for asset in asset_data:
            asset_type=str(asset.asset_type)
            asset_response = asset_v1.Asset.to_json(asset)
            asset_response=json.loads(asset_response)
            asset_data_list.append({
                "name": asset_response["name"],
                "type": asset_response["assetType"],
                "ancestors" : asset_response["ancestors"],
                "time": asset_response["updateTime"],
                "metadata" : asset_response["resource"]
            })  
            new_asset=asset_type.split("/")
            new_asset= new_asset[1]
        print (f"STARING FOR {asset_type}")
        upload_to_storage(new_asset,asset_data_list)
  return "Asset Discovery has been completed Please Validate at Asset Discovery has been Completed please validate: https://console.cloud.google.com/storage/browser/evidence_data/2022-12-01"

def upload_to_storage(asset_type, payload_data):
    storage_client = storage.Client()
    bucket = storage_client.bucket('evidence_data')
    blob = bucket.blob(f'{date_object}/{asset_type}.json')
    blob.upload_from_string(json.dumps(payload_data))
    
    print(f"uploaded data for{asset_type}")
    
if __name__ == "__main__":
    hackathon_test_1("")









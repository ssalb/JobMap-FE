import os
import logging
import json
import re
from geopy import distance
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from azure.cosmos import cosmos_client, errors, http_constants, documents

app = Flask(__name__)
#app = Flask(name)
CORS(app)

# Set environment variables
os.environ['ACCOUNT_URI'] = 'https://wirvsvirus.documents.azure.com:443/'
os.environ['ACCOUNT_KEY'] = '#####'

# Initialize the Cosmos client
url = os.environ['ACCOUNT_URI']
key = os.environ['ACCOUNT_KEY']
client = cosmos_client.CosmosClient(url, {'masterKey': key})  

def write_to_db(database_name, container_name, part_key, data):
    # create database if it doesn't exist yes
    try:
        database = client.CreateDatabase({'id': database_name})
    except errors.HTTPFailure:
        database = client.ReadDatabase("dbs/" + database_name)
    
    # create container if it doesn't exit yet
    container_definition = {'id': container_name,
                            'partitionKey':
                                        {
                                            'paths': [part_key],
                                            'kind': documents.PartitionKind.Hash
                                        }
                            }
    try:
        container = client.CreateContainer("dbs/" + database['id'], container_definition, {'offerThroughput': 400})
    except errors.HTTPFailure as e:
        if e.status_code == http_constants.StatusCodes.CONFLICT:
            container = client.ReadContainer("dbs/" + database['id'] + "/colls/" + container_definition['id'])
        else:
            raise e
    
    # add item to db
    client.UpsertItem("dbs/" + database_name + "/colls/" + container_name, data)

    return {"status":"success","message":"created item for {}".format(data['username'])}

def get_distance(center_loc, check_loc):
    center_point_tuple = tuple((center_loc['lat'], center_loc['lng']))
    check_point_tuple = tuple((check_loc['lat'], check_loc['lng']))

    return distance.distance(center_point_tuple, check_point_tuple).km
       
def read_from_db(database_name, container_name, rawqueryDict):
    # generate query
    query = "SELECT DISTINCT c.username, c.email, c.competencies, c.availability, c.location, c.text FROM {} c JOIN competencies IN c.competencies JOIN availabilities IN c.availability".format(container_name)
    if "competencies" in rawqueryDict:
        competencies = ""
        for competency in rawqueryDict["competencies"]:
            competencies = competencies + "OR CONTAINS(competencies,'{}') ".format(competency)
        if len(competencies) > 0:
            competencies = "({})".format(competencies[3:len(competencies)-1])
            query = query + " WHERE " + competencies
    if "availability" in rawqueryDict:
        weekdays = ["'{}'".format(weekday['day']) for weekday in rawqueryDict['availability']]
        query = query + " AND availabilities.day IN ({})".format(*weekdays)
        
    print("going to query: " + query)

    # check returned items
    results = {"status":"success","results":[]}
    for item in client.QueryItems("dbs/" + database_name + "/colls/" + container_name,query,{'enableCrossPartitionQuery': True}):
        if "radius_km" in rawqueryDict:
            if get_distance(rawqueryDict["location"],item["location"]) <= int(rawqueryDict["radius_km"]):
                print("{} this is in range!".format(item['username']))
                results['results'].append(item)
        else:
            results['results'].append(item)

    return results

def format_availability(inputStr):
    availabilityList = []
    weekdays = {
        'Montag':['Mo','Mon','Mont'],
        'Dienstag':['Di','Die','Dienst'],
        'Mittwoch':['Mi','Mittw'],
        'Donnerstag':['Do','Donn','Donnerst'],
        'Freitag':['Fr','Freit','Fri'],
        'Samstag':['Sa','Samst','Smstg'],
        'Sonntag':['So','Son','Sonn']
    }
    times = {
        "vormittag":["früh","morgen","morgens","morgen","vor","mittag","mittags"],
        "nachmittag":["nach","afternoon"],
        "abend":["spät","abends"],
        "halbtag":["halb","teil","teilzeit"],
        "ganztag":["ganz","immer","voll"]
    }
    inputList = inputStr.split(",")
    for i in inputList:
        availabilityItem = {}
        # check weekday
        availabilityItem['day'] = "n/a"
        for weekday, weekdayCorpus in weekdays.items():
            if weekday in i.strip() or i.strip() in weekdayCorpus:
                availabilityItem['day'] = weekday
                break

        # check time
        availabilityItem['time'] = "n/a"
        for timerange, timeCorpus in times.items():
            if timerange in i.strip() or i.strip() in timeCorpus:
                availabilityItem['time'] = timerange
                break

        availabilityList.append(availabilityItem)
    
    return availabilityList

def extract_info(inputDict):
    outputDict = {}
    cosmos_params = []
    for k, v in inputDict.items():
        if k in ['availability'] and type(v) == "string":
            outputDict[k] = format_availability(v)
        elif k in ['competencies'] and type(v) == "string":
            outputDict[k] = [i.strip().lower() for i in v.split(",")]
        elif k in ['location']:
            outputDict[k] = {"lat":v[0],"lng":v[1]}
        elif k in ['hourly_rate']:
            outputDict['hourly_rate'] = float(re.sub("[^0-9.,]", "", v).replace(",","."))
        elif k in ['target']:
            cosmos_params.append(v)
            if v == "workerpool":
                cosmos_params.append("/username")
            elif v == "jobpool":
                cosmos_params.append("/jobname")
        else:
            outputDict[k] = v
    return outputDict, cosmos_params

@app.route('/biete', methods=['POST'])
def register():
    #print(request.get_json(force=True))
    dataDict, cosmos_params = extract_info(request.get_json(force=True))
    print("extracted the following and going to proceed: {}".format(json.dumps(dataDict).encode("utf-8", errors="ignore")))
    res = write_to_db("jobmap", cosmos_params[0], cosmos_params[1], dataDict)
    return make_response(jsonify(res)) 

@app.route('/suche', methods=['POST'])
def get_results():
    dataDict, cosmos_params = extract_info(request.get_json(force=True))
    print("extracted the following and going to proceed: {}".format(json.dumps(dataDict).encode("utf-8", errors="ignore")))
    res = read_from_db("jobmap", cosmos_params[0], dataDict)
    return make_response(jsonify(res)) 

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=80)
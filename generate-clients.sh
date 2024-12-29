#!/bin/sh

URL="http://51.178.82.124:8080/openapi/v3/api-docs"
OPENAPI_FILE="factory-planner.openapi.json"
OUTDIR=src/app/factory-planner-api
rm -rf $OUTDIR
rm -rf $OPENAPI_FILE

curl -X GET $URL -o $OPENAPI_FILE
openapi-generator generate -i $OPENAPI_FILE -g typescript-angular -o $OUTDIR --additional-properties fileNaming=kebab-case,withInterfaces=true --generate-alias-as-model


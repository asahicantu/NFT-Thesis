#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        -e "s/\${COUCHDB_USR}/$6/" \
        -e "s/\${COUCHDB_PSW}/$7/" \
        -e "s/\${COUCHDB_PORT}/$8/" \
        scripts/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        -e "s/\${COUCHDB_USR}/$6/" \
        -e "s/\${COUCHDB_PSW}/$7/" \
        -e "s/\${COUCHDB_PORT}/$8/" \
        scripts/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}


ORG=1
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
CAPEM=organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem

COUCHDB_USR=${FABRIC_USER_ADMIN}
COUCHDB_PSW=${FABRIC_USER_ADMIN_PW}
COUCHDB_PORT=5984

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $COUCHDB_USR $COUCHDB_PSW $COUCHDB_PORT)" > organizations/peerOrganizations/org1.example.com/connection-org1.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $COUCHDB_USR $COUCHDB_PSW $COUCHDB_PORT)" > organizations/peerOrganizations/org1.example.com/connection-org1.yaml

ORG=2
P0PORT=9051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem
CAPEM=organizations/peerOrganizations/org2.example.com/ca/ca.org2.example.com-cert.pem
COUCHDB_USR=${FABRIC_USER_ADMIN}
COUCHDB_PSW=${FABRIC_USER_ADMIN_PW}
COUCHDB_PORT=7984


echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $COUCHDB_USR $COUCHDB_PSW $COUCHDB_PORT)" > organizations/peerOrganizations/org2.example.com/connection-org2.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $COUCHDB_USR $COUCHDB_PSW $COUCHDB_PORT)" > organizations/peerOrganizations/org2.example.com/connection-org2.yaml

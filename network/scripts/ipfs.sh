#!/bin/bash
source scripts/envVar.sh
source scripts/utils.sh
infoln "***********************************"
infoln "       Configuring IPFS Services   "
infoln "***********************************"

chmod +x compose/ipfs/init.sh

# infoln "Generating a swarm key"
# # Generate a swarm key and output into a file 
# docker run --rm golang:1.9 sh -c 'go get github.com/Kubuxu/go-ipfs-swarm-key-gen/ipfs-swarm-key-gen && ipfs-swarm-key-gen' > ./compose/ipfs/swarm.key

infoln "Composing services..."
docker compose -f ./compose/docker-compose-ipfs.yaml up -d

infoln "Setting up directories..."
# needs jq package
ipfs_ports=`docker ps -q --filter "name=ipfs_node" | xargs -n1 docker port | grep -Po '5001/tcp.*'|  cut -d ":" -f 2`

for ipfs_port in $ipfs_ports
do
    echo "Getting address from ipfs port $ipfs_port"
    ipfs_address=`curl -X POST "http://127.0.0.1:$ipfs_port/api/v0/id" | jq '.Addresses[0]' | sed 's/"//g' ` 
    echo "Registering address $ipfs_address ..."
    curl -X POST "http://127.0.01:5001/api/v0/swarm/peering/add?arg=$ipfs_address"
    curl -X POST "http://127.0.01:5001/api/v0/swarm/bootstrap/add?arg=$ipfs_address"
done
infoln "Getting available addresses from bootstrap node"
curl -X POST "http://127.0.01:5001/api/v0/swarm/peering/ls"

infoln "IPFS Configuration finished"
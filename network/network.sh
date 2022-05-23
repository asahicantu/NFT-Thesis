#!/bin/bash
source scripts/utils.sh
source scripts/envVar.sh
# Parse commandline args
## Parse mode
if [ "$1" == "start" ]; then
    ./scripts/start.sh
    ./scripts/ipfs.sh
    chaincodeName="erc721"
    ./scripts/deployCC.sh $CHANNEL_NAME $chaincodeName "../chaincode/token-erc-721/chaincode-typescript" "typescript" "1.0" "1"
elif [ "$1" == "deployCC" ]; then
    infoln "Deploying chaincode"
    chaincodeName="erc721"
    ./scripts/deployCC.sh $CHANNEL_NAME $chaincodeName "../chaincode/token-erc-721/chaincode-typescript" "typescript" "5.0" "5"
    #./network.sh deployCC -ccn erc1155 -ccp ../token-erc-1155/chaincode-go/ -ccl go
    #./scripts/deployCC.sh $CHANNEL_NAME $CC_NAME $CC_SRC_PATH $CC_SRC_LANGUAGE $CC_VERSION $CC_SEQUENCE $CC_INIT_FCN $CC_INVK_FCN $CC_END_POLICY $CC_COLL_CONFIG $CLI_DELAY $MAX_RETRY $VERBOSE
    #./network.sh deployCC -ccn basic -ccp ../chaincode/token-erc-20/chaincode-go -ccl go
elif [ "$1" == "stop" ]; then
    ./scripts/stop.sh
elif [ "$1" == "restart" ]; then
    ./scripts/stop.sh
    ./scripts/start.sh
else
    printHelp
fi
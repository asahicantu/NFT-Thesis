interface ConnectionParams{
  channelName: string,
  chaincodeName: string,
  mspId: string,
  organization:string,
  //Identity user name
  idName: string,
  // Peer name
  peerName:string
  //Peer endpoint from organization
  peerEndpoint:string
  //
}

export default ConnectionParams;

interface ConfigElement{
  name:string,
  url:string,
  certificate:string
}

interface PeerElement extends ConfigElement{
  walletUrl : string
}

interface User{
  organization:string,
  name:string,
  affilitation:string
}

interface ConfigSet{
    _id:string,
    mspid:string,
    peers:PeerElement[],
    authorities:ConfigElement[]
}

export {ConfigElement,PeerElement, User, ConfigSet};

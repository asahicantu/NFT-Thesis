import User from '../../../common/user'
interface ConfigElement{
  name:string,
  url:string,
  certificate:string
}

interface PeerElement extends ConfigElement{
  walletUrl : string
}



interface ConfigSet{
    _id:string,
    mspid:string,
    peers:PeerElement[],
    authorities:ConfigElement[]
}

export {ConfigElement,PeerElement, User, ConfigSet}

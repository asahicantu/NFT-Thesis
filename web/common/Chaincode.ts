
interface Chaincode {

  organization:string
  userId: string
  channel: string
  name: string
  functionName:string
  params: Record<string,string> | any
}

export default Chaincode

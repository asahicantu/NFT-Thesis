interface User{
  id:string,
  affiliation:string,
  mspId:string,
}
/**
 * Certificate Authority
 */
interface CA{
  name: string,
  url: string,
  TLSCertificates: string[]
}

interface CAParams{
  user: User,
  ca:CA
}
export default CAParams;

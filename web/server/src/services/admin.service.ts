import { Gateway, GatewayOptions, Wallet, Wallets} from 'fabric-network'
import { User, Client } from 'fabric-common'
import FabricCAServices = require('fabric-ca-client');
// import {ChaincodeExecOption} from 'interfaces/enums.interface';
class AdminService {
  adminUserId: string = process.env.HYP_ADMIN_USER_ID as string
  adminUserPasswd: string = process.env.HYP_ADMIN_USER_PW as string

  /**
   *
 * @param {*} ccp = Organization Config profile
 */
  buildCAClient(caConfig: any): FabricCAServices {
    // Create a new CA client for interacting with the CA.
    const caTLSCACerts = caConfig.tlsCACerts.pem
    const caClient = new FabricCAServices(caConfig.url, { trustedRoots: caTLSCACerts, verify: false }, caConfig.caName)
    console.log(`Certificate Authority client  [${caConfig.name}] built`)
    return caClient
  }

   async buildWallet(walletPath: string | undefined, couchDbUrl:string|undefined): Promise<Wallet> {
    // Create a new  wallet : Note that wallet is for managing identities.
    let wallet: Wallet
    if (walletPath) {
      wallet = await Wallets.newFileSystemWallet(walletPath)
      console.log(`Built a file system wallet at ${walletPath}`)
    } else if(couchDbUrl) {
      console.log(`Building a couchDb wallet at ${couchDbUrl}`)
      wallet = await Wallets.newCouchDBWallet(couchDbUrl,'wallet')
      console.log('CouchDB wallet built')
    }
    else{
      wallet = await Wallets.newInMemoryWallet()
      console.log('Built an in memory wallet')
    }
    return wallet
  };

  async enrollAdmin(caClient: FabricCAServices, wallet: Wallet, orgMspId: string): Promise<void> {
    try {
      console.log(`Enrolling admin by MSP ${orgMspId}`)
      // Check to see if we've already enrolled the admin user.
      const identity = await wallet.get(this.adminUserId)
      if (identity) {
        console.log('An identity for the admin user already exists in the wallet')
        return
      }

      // Enroll the admin user, and import the new identity into the wallet.
      const enrollment = await caClient.enroll({ enrollmentID: this.adminUserId, enrollmentSecret: this.adminUserPasswd })
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: orgMspId,
        type: 'X.509',
      }
      await wallet.put(this.adminUserId, x509Identity)
      console.log('Successfully enrolled admin user and imported it into the wallet')
    } catch (error) {
      console.error(`Failed to enroll admin user : ${error}`)
      throw error
    }
  }

  async registerAndEnrollUser(caClient: FabricCAServices, wallet: Wallet, orgMspId: string, userId: string, affiliation: string): Promise<void> {
    try {
      // Check to see if we've already enrolled the user
      const userIdentity = await wallet.get(userId)
      if (userIdentity) {
        console.log(`An identity for the user ${userId} already exists in the wallet`)
        return
      }
      // Must use an admin to register a new user
      const adminIdentity = await wallet.get(this.adminUserId)
      if (!adminIdentity) {
        console.log('An identity for the admin user does not exist in the wallet')
        console.log('Enroll the admin user before retrying')
        return
      }
      // build a user object for authenticating with the CA
      const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type)
      const adminUser = await provider.getUserContext(adminIdentity, this.adminUserId)
      // Register the user, enroll the user, and import the new identity into the wallet.
      // if affiliation is specified by client, the affiliation value must be configured in CA
      console.log(`Registering user ${userId}`)
      let secret: string | undefined
      let userAlreadyEnrolled: boolean = false
      try {
        secret = await caClient.register({
          affiliation,
          enrollmentID: userId,
          role: 'client',
        }, adminUser)
      }
      catch (error: any) {
        if (error.errors) {
          for (let err of error.errors) {
            if (err.code == 74) //Means the user has already been registered{
              console.log(err.code, err.message)
            userAlreadyEnrolled = true
          }
        }
      }
      if (userAlreadyEnrolled) {
        console.log(`Re-Enrolling user ${userId}`)
        const user: User = await provider.getUserContext(adminIdentity, userId)
        const enrollment = await caClient.reenroll(user, [])
        this.addToWallet(wallet, userId, orgMspId, 'X.509', enrollment)
        console.log(`Successfully reenrolled user ${userId} and imported it into the wallet`)
      }
      else {
        console.log(`Enrolling user ${userId}`)
        const enrollment = await caClient.enroll({
          enrollmentID: userId,
          enrollmentSecret: secret as string,
        })
        this.addToWallet(wallet, userId, orgMspId, 'X.509', enrollment)
        console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`)
      }
    } catch (error) {
      console.error(`Failed to register user : ${error}`)
      throw error
    }
  }

  addToWallet(wallet: Wallet, userId: string, mspId: string, identityType: string, enrollment: FabricCAServices.IEnrollResponse): void {
    console.log(`Saving credentials into wallet for user ${userId}`)
    const identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: mspId,
      type: identityType,
    }
    wallet.put(userId, identity)
  }


  prettyJSONString = (inputString: string): string => {
    if (inputString) {
      return JSON.stringify(JSON.parse(inputString), null, 2)
    } else {
      return inputString
    }
  }
}
export default AdminService

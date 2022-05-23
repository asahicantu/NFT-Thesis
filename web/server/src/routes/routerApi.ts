import express from 'express'
import ChaincodeRouter from './chaincode.router'
import AdminRouter from './admin.router'
import IPFSRouter from './ipfs.router'

function routerApi(app: express.Express, rootApi: string){
  const router = express.Router()
  const chaincodeRouter = new ChaincodeRouter()
  const adminRouter = new AdminRouter()
  const ipfsRouter = new IPFSRouter()
  app.use(express.json())
  app.use(express.text())
  app.use(express.raw())
  app.use(express.urlencoded({ extended: true }))
  app.use(rootApi, router)
  router.use('/admin', adminRouter.router)
  router.use('/nft', chaincodeRouter.router)
  router.use('/ipfs', ipfsRouter.router)
}

export default routerApi

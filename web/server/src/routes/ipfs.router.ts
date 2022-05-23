import express from 'express'
import Boom from 'boom'
var _ = require('underscore')
import AdminService from 'services/admin.service'
import DbService from '../services/db.service'
import IPFSService from '../services/ipfs.service'
import { ImportCandidateStream, IPFSPath, ToContent } from 'ipfs-core-types/src/utils'
import { AddAllOptions, CatOptions, GetOptions, IDOptions, ListOptions } from 'ipfs-core-types/src/root'
import { CID } from 'ipfs-http-client'

export default class IPFSRouter {
  router: express.Router
  ipfsService: IPFSService
  dbService: DbService
  adminService: AdminService
  constructor() {
    this.router = express.Router()
    this.ipfsService = new IPFSService()
    _.bindAll(this.ipfsService, Object.getOwnPropertyNames(Object.getPrototypeOf(this.ipfsService)))

    this.router.get('/', async (req, res) => {
      const parameters = await this.ipfsService.version()
      res.json(parameters)
    })

    this.router.post('/add/file',
      async (req, res, next) => {
        let path: string = req.query.path as string
        let content: ToContent = req.body as string
        console.log(content)
        let result = await this.ipfsService.addFile(path, content)
        console.log(result)
        res.json(result.cid.toString())
      })

    this.router.post('/add/files',async (req,res, next) => {
        let stream: ImportCandidateStream = req.body.stream
        let options: AddAllOptions = req.body.options
        let content: ToContent = req.body.content
        let result = this.ipfsService.addFiles(stream, options)
        res.json(result)
      })

    this.router.get('/cat', async (req, res) => {
      let path = req.query.path as string
      let options: CatOptions = req.body.options
      let content = await this.ipfsService.cat(path, options)
      res.json(content)
    })


    this.router.get('/get', async (req, res) => {
      let path = req.query.path as string
      if(true){
        let options : GetOptions = {
          archive: true
        }
        let content = await this.ipfsService.get(path, options)
        res.json(content)
      }
    })


    this.router.get('/list', async (req, res) => {
      let path: IPFSPath = req.body.path
      let options: ListOptions = req.body.options
      let content = this.ipfsService.list(path, options)
      res.json(content)
    })

    this.router.get('/peer', async (req, res) => {
      let options: IDOptions = req.body.options
      let content = this.ipfsService.peerId(options)
      res.json(content)
    })
  }
}

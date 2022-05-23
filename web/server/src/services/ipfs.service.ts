import { } from 'ipfs-core-types'
import { create, IPFSHTTPClient, Options } from 'ipfs-http-client'
import { AddAllOptions, AddOptions, AddResult, CatOptions, IDOptions, IDResult, IPFSEntry, ListOptions, VersionResult } from 'ipfs-core-types/src/root'
import { ImportCandidate, ImportCandidateStream, IPFSPath, ToContent, ToDirectory, ToFile, ToFileMetadata } from 'ipfs-core-types/src/utils'
import { optional } from 'joi'
import { chown } from 'fs'
import { GetOptions } from 'ipfs-core-types/src/dag'

export default class IPFSService {
  ipfsNode: IPFSHTTPClient
  constructor() {
    console.log('Connecting to ipfs node...')
    let opt: Options = {
      host: '127.0.0.1',
      port: 5001,
      protocol: 'http'
    }
    this.ipfsNode = create(opt)
  }

  public async version(): Promise<VersionResult> {
    return await this.ipfsNode.version()
  }

  public async addFile(path: string, content: ToContent): Promise<AddResult> {
    let file: ToFile | ToDirectory | ToFileMetadata = { path: path, content: content }
    let options: AddOptions = {}
    let addedFile = await this.ipfsNode.add(file, options)
    return addedFile
  }

  public addFiles(stream: ImportCandidateStream, options: AddAllOptions): AsyncIterable<AddResult> {
    let addedFile = this.ipfsNode.addAll(stream, options)
    return addedFile
  }

  public async cat(path: IPFSPath, options: CatOptions): Promise<Array<Uint8Array>> {
    let elements = await  this.ipfsNode.cat(path,options)
    let files : Array<Uint8Array> = []
    for await (const element of elements){
      files.push(element)
    }
    return files
  }

  public  async get(path: IPFSPath, options: GetOptions): Promise<Array<Uint8Array>> {
    let elements = await  this.ipfsNode.get(path,options)
    let files : Array<Uint8Array> = []
    for await (const element of elements){
      files.push(element)
    }
    return files
  }

  public list(path: IPFSPath, options: ListOptions): AsyncIterable<IPFSEntry> {
    return this.ipfsNode.ls(path, options)
  }

  public async peerId(options?: IDOptions): Promise<IDResult> {
    return await this.ipfsNode.id(options)
  }
}

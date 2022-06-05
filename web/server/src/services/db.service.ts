import { Console } from 'console'
import { ConfigSet } from 'interfaces/register.interface'
import *  as Nano from 'nano'
class DBService {
  nano: Nano.ServerScope
  db: Nano.DocumentScope<unknown>
  dbname:string
  constructor() {
    const port = process.env.SRV_DB_PORT as string
    const host = process.env.SRV_DB_URL as string
    const user = process.env.SRV_DB_USER_ID as string
    const pw = process.env.SRV_DB_USER_PW as string
    const url = `http://${user}:${pw}@${host}:${port}`
    this.dbname = process.env.SRV_DB_DBNAME as string
    this.nano = Nano.default(url)
    //Build default database at runtime
    this.tryCreateDB()
  }

  tryCreateDB(){
    this.nano.db.list()
      .then((dbs: string[]) => {
        if (!dbs.includes(this.dbname)) {
          console.log(`Database ${this.dbname} not exists, creating....`)
          this.createDb(this.dbname)
        }
      }).finally(() => {
        this.db = this.nano.db.use(this.dbname)
        console.log(`Database ${this.dbname} connected!`)
      })
  }

  async createDb(dbName: string): Promise<Nano.DatabaseCreateResponse | string> {
    try {
      console.log(`Database ${dbName} created`)
      return await this.nano.db.create(dbName)
    }
    catch {
      const msg = `Database ${dbName} already exists`
      console.log(msg)
      return msg
    }
  }

  async dbInfo(): Promise<Nano.InfoResponse> {
    return await this.nano.info()
  }

  async registerOrg(configSet: object): Promise<Nano.DocumentInsertResponse | unknown> {
    try {
      this.tryCreateDB()
      const response = await this.db.insert(configSet)
      return response
    }
    catch (error) {
      throw(error)
    }
  }

  async GetConfig(orgConfig: string): Promise<any> {
    try{
      const val = (await this.db.get(orgConfig) as Object) as ConfigSet
      return val
    }
    catch(error){
      console.log(error)
      return undefined
    }
  }
}
export default DBService

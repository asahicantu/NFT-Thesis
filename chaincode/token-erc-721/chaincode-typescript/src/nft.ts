/*
 * SPDX-License-Identifier: Apache-2.0
 */
import { Object, Property } from 'fabric-contract-api'

@Object()
export class NFT {
    @Property()
    public ID: string

    @Property()
    public URI: string

    @Property()
    public FileFormat: string

    @Property()
    public Owner: string

    @Property()
    public Organization: string

    @Property()
    public FileName: string
}


export class NFTExtended extends NFT {
    @Property()
    public Weight: number

    @Property()
    public ApprovedForTransfer:string | object

    @Property()
    public RankerOrganizations: string[]

}

/*
SPDX-License-Identifier: Apache-2.0
*/
import { Context, Contract, Info, Transaction } from 'fabric-contract-api'
import { NFT, NFTExtended } from './nft'

@Info({ title: 'TokenERC721Contract', description: 'ERC721 SmartContract, implemented in TypeScript' })
export class TokenERC721Contract extends Contract {
    // Define objectType names for prefix
    balancePrefix: string = 'balance'
    nftPrefix: string = 'nft'
    uriPrefix: string = 'uri'
    approvalPrefix: string = 'approval'
    // Define key names for options
    nameKey: string = 'name'
    symbolKey: string = 'symbol'

    constructor() {
        super('TokenERC721Contract')
    }

    /**
    *
    * @param {Context} ctx the transaction context
    * @returns {Number} The number of non-fungible tokens present in the ledger
    */
    @Transaction(true)
    public async GetAllResults(ctx: Context, isHistory: boolean, owner: string): Promise<any> {
        const iterator = await ctx.stub.getStateByPartialCompositeKey(this.balancePrefix, [owner])
        let allResults = []
        let res = await iterator.next() as any
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes: any = {}
                console.log(res.value.value.toString('utf8'))
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.txId
                    jsonRes.Timestamp = res.value.timestamp
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'))
                    } catch (err) {
                        console.log(err)
                        jsonRes.Value = res.value.value.toString('utf8')
                    }
                } else {
                    jsonRes.Key = res.value.key
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'))
                    } catch (err) {
                        console.log(err)
                        jsonRes.Record = res.value.value.toString('utf8')
                    }
                }
                allResults.push(jsonRes)
            }
            res = await iterator.next()
        }
        iterator.close()
        return allResults
    }

    /**
     * BalanceOf counts all non-fungible tokens assigned to an owner
     *
     * @param {Context} ctx the transaction context
     * @param {String} owner An owner for whom to query the balance
     * @returns {Number} The number of non-fungible tokens owned by the owner, possibly zero
     */
    @Transaction(false)
    public async BalanceOf(ctx: Context, owner: string): Promise<number> {
        // There is a key record for every non-fungible token in the format of balancePrefix.owner.tokenId.
        // BalanceOf() queries for and counts all records matching balancePrefix.owner.*
        const iterator = await ctx.stub.getStateByPartialCompositeKey(this.balancePrefix, [owner])

        // Count the number of returned composite keys
        let balance = 0
        let result = await iterator.next()
        while (!result.done) {
            balance++
            result = await iterator.next()
        }
        return balance
    }

    /**
     * OwnerOf finds the owner of a non-fungible token
     *
     * @param {Context} ctx the transaction context
     * @param {String} tokenId The identifier for a non-fungible token
     * @returns {String} Return the owner of the non-fungible token
     */
    @Transaction(false)
    public async OwnerOf(ctx: Context, tokenId: string): Promise<string> {
        const nft = await this._readNFT(ctx, tokenId)
        const owner = nft.Owner
        if (!owner) {
            throw new Error('No owner is assigned to this token')
        }
        return owner
    }

    /**
     * TransferFrom transfers the ownership of a non-fungible token
     * from one owner to another owner
     *
     * @param {Context} ctx the transaction context
     * @param {String} from The current owner of the non-fungible token
     * @param {String} to The new owner
     * @param {String} tokenId the non-fungible token to transfer
     * @returns {Boolean} Return whether the transfer was successful or not
     */
    @Transaction(true)
    public async TransferFrom(ctx: Context, from: string, to: string, tokenId: string): Promise<boolean> {
        const sender = ctx.clientIdentity.getID()

        const nft = await this._readNFT(ctx, tokenId)

        // Check if the sender is the current owner, an authorized operator,
        // or the approved client for this non-fungible token.
        const owner = nft.Owner
        const approved = nft.ApprovedForTransfer == to
        const operatorApproval = await this.IsApprovedForAll(ctx, owner, sender)
        if (owner !== sender && !approved && !operatorApproval) {
            throw new Error('The sender is not allowed to transfer the non-fungible token')
        }

        // Check if `from` is the current owner
        if (owner !== from) {
            throw new Error('The from is not the current owner.')
        }

        // Clear the approved client for this non-fungible token
        nft.ApprovedForTransfer = undefined

        // Overwrite a non-fungible token to assign a new owner.
        nft.Owner = to
        const nftKey = ctx.stub.createCompositeKey(this.nftPrefix, [tokenId])
        await ctx.stub.putState(nftKey, Buffer.from(JSON.stringify(nft)))

        // Remove a composite key from the balance of the current owner
        const balanceKeyFrom = ctx.stub.createCompositeKey(this.balancePrefix, [from, tokenId])
        await ctx.stub.deleteState(balanceKeyFrom)

        // Save a composite key to count the balance of a new owner
        const balanceKeyTo = ctx.stub.createCompositeKey(this.balancePrefix, [to, tokenId])
        await ctx.stub.putState(balanceKeyTo, Buffer.from('\u0000'))

        // Emit the Transfer event
        const tokenIdInt = parseInt(tokenId)
        const transferEvent = { from: from, to: to, tokenId: tokenIdInt }
        ctx.stub.setEvent('Transfer', Buffer.from(JSON.stringify(transferEvent)))

        return true
    }

    /**
     * Approve changes or reaffirms the approved client for a non-fungible token
     *
     * @param {Context} ctx the transaction context
     * @param {String} approved The new approved client
     * @param {String} tokenId the non-fungible token to approve
     * @returns {Boolean} Return whether the approval was successful or not
     */
    @Transaction(true)
    public async Approve(ctx: Context, approved: string, tokenId: string): Promise<boolean> {
        const sender = ctx.clientIdentity.getID()

        const nft = await this._readNFT(ctx, tokenId)

        // Check if the sender is the current owner of the non-fungible token
        // or an authorized operator of the current owner
        const owner = nft.Owner
        const operatorApproval = await this.IsApprovedForAll(ctx, owner, sender)
        if (owner !== sender && !operatorApproval) {
            throw new Error('The sender is not the current owner nor an authorized operator')
        }

        // Update the approved client of the non-fungible token
        nft.ApprovedForTransfer = approved
        const nftKey = ctx.stub.createCompositeKey(this.nftPrefix, [tokenId])
        await ctx.stub.putState(nftKey, Buffer.from(JSON.stringify(nft)))

        // Emit the Approval event
        const tokenIdInt = parseInt(tokenId)
        const approvalEvent = { owner: owner, approved: approved, tokenId: tokenIdInt }
        ctx.stub.setEvent('Approval', Buffer.from(JSON.stringify(approvalEvent)))

        return true
    }

    /**
     * SetApprovalForAll enables or disables approval for a third party ("operator")
     * to manage all of message sender's assets
     *
     * @param {Context} ctx the transaction context
     * @param {String} operator A client to add to the set of authorized operators
     * @param {Boolean} approved True if the operator is approved, false to revoke approval
     * @returns {Boolean} Return whether the approval was successful or not
     */
    @Transaction(true)
    public async SetApprovalForAll(ctx: Context, operator: string, approved: boolean): Promise<boolean> {
        const sender = ctx.clientIdentity.getID()

        const approval = { owner: sender, operator: operator, approved: approved }
        const approvalKey = ctx.stub.createCompositeKey(this.approvalPrefix, [sender, operator])
        await ctx.stub.putState(approvalKey, Buffer.from(JSON.stringify(approval)))

        // Emit the ApprovalForAll event
        const approvalForAllEvent = { owner: sender, operator: operator, approved: approved }
        ctx.stub.setEvent('ApprovalForAll', Buffer.from(JSON.stringify(approvalForAllEvent)))

        return true
    }

    /**
     * GetApproved returns the approved client for a single non-fungible token
     *
     * @param {Context} ctx the transaction context
     * @param {String} tokenId the non-fungible token to find the approved client for
     * @returns {Object} Return the approved client for this non-fungible token, or null if there is none
     */
    @Transaction(false)
    public async GetApproved(ctx: Context, tokenId: string): Promise<string | object | undefined> {
        const nft = await this._readNFT(ctx, tokenId)
        return nft.ApprovedForTransfer
    }

    /**
     * IsApprovedForAll returns if a client is an authorized operator for another client
     *
     * @param {Context} ctx the transaction context
     * @param {String} owner The client that owns the non-fungible tokens
     * @param {String} operator The client that acts on behalf of the owner
     * @returns {Boolean} Return true if the operator is an approved operator for the owner, false otherwise
     */
    @Transaction(false)
    public async IsApprovedForAll(ctx: Context, owner: string, operator: string): Promise<boolean> {
        const approvalKey = ctx.stub.createCompositeKey(this.approvalPrefix, [owner, operator])
        const approvalBytes = await ctx.stub.getState(approvalKey)
        let approved
        if (approvalBytes && approvalBytes.length > 0) {
            const approval = JSON.parse(approvalBytes.toString())
            approved = approval.approved
        } else {
            approved = false
        }

        return approved
    }

    // ============== ERC721 metadata extension ===============

    /**
     * Name returns a descriptive name for a collection of non-fungible tokens in this contract
     *
     * @param {Context} ctx the transaction context
     * @returns {String} Returns the name of the token
     */
    @Transaction(false)
    public async Name(ctx: Context): Promise<string> {
        const nameAsBytes = await ctx.stub.getState(this.nameKey)
        return nameAsBytes.toString()
    }

    /**
     * Symbol returns an abbreviated name for non-fungible tokens in this contract.
     *
     * @param {Context} ctx the transaction context
     * @returns {String} Returns the symbol of the token
    */
    @Transaction(false)
    public async Symbol(ctx: Context): Promise<string> {
        const symbolAsBytes = await ctx.stub.getState(this.symbolKey)
        return symbolAsBytes.toString()
    }

    /**
     * TokenURI returns a distinct Uniform Resource Identifier (URI) for a given token.
     *
     * @param {Context} ctx the transaction context
     * @param {string} tokenId The identifier for a non-fungible token
     * @returns {String} Returns the URI of the token
    */
    @Transaction(false)
    public async TokenURI(ctx: Context, tokenId: string): Promise<string> {
        const nft = await this._readNFT(ctx, tokenId)
        return nft.URI
    }

    @Transaction(false)
    public async Token(ctx: Context, tokenId: string): Promise<NFTExtended> {
        const nft = await this._readNFT(ctx, tokenId)
        return nft
    }

    @Transaction(false)
    public async Tokens(ctx:Context, owner: string): Promise<Array<NFTExtended>> {
        const tokens = new Array<NFTExtended>()
        return tokens
    }

    @Transaction(true)
    public async Rate(ctx: Context, tokenId: string, organization: string,rank:string): Promise<NFTExtended> {
        const nft = await this._readNFT(ctx, tokenId)
        if (!nft.RankerOrganizations.includes(organization)) {
            nft.RankerOrganizations.push(organization)
            let rankInt = parseInt(rank)
            nft.Weight = (rankInt / 5  * nft.Weight )
        }
        return nft
    }

    // ============== ERC721 enumeration extension ===============

    /**
     * TotalSupply counts non-fungible tokens tracked by this contract.
     *
     * @param {Context} ctx the transaction context
     * @returns {Number} Returns a count of valid non-fungible tokens tracked by this contract,
     * where each one of them has an assigned and queryable owner.
     */
    @Transaction(false)
    public async TotalSupply(ctx: Context): Promise<any> {
        // There is a key record for every non-fungible token in the format of nftPrefix.tokenId.
        // TotalSupply() queries for and counts all records matching nftPrefix.*
        const iterator = await ctx.stub.getStateByPartialCompositeKey(this.nftPrefix, [])
        let results = []
        // Count the number of returned composite keys
        let result = await iterator.next()
        while (!result.done) {
            if (result.value) {
                results.push(result.value)
            }
            result = await iterator.next()
        }
        return results
    }

    /**
     * TotalSupplyCount counts non-fungible tokens tracked by this contract.
     *
     * @param {Context} ctx the transaction context
     * @returns {Number} Returns a count of valid non-fungible tokens tracked by this contract,
     * where each one of them has an assigned and queryable owner.
     */
    @Transaction(false)
    public async TotalSupplyCount(ctx: Context): Promise<number> {
        // There is a key record for every non-fungible token in the format of nftPrefix.tokenId.
        // TotalSupply() queries for and counts all records matching nftPrefix.*
        const iterator = await ctx.stub.getStateByPartialCompositeKey(this.nftPrefix, [])

        // Count the number of returned composite keys
        let totalSupply = 0
        let result = await iterator.next()
        while (!result.done) {
            totalSupply++
            result = await iterator.next()
        }
        return totalSupply
    }

    // ============== Extended Functions for this sample ===============

    /**
     * Set optional information for a token.
     *
     * @param {Context} ctx the transaction context
     * @param {String} name The name of the token
     * @param {String} symbol The symbol of the token
     */
    @Transaction(true)
    public async SetOption(ctx: Context, name: string, symbol: string): Promise<boolean> {

        // Check minter authorization - this sample assumes Org1 is the issuer with privilege to set the name and symbol
        const clientMSPID = ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'Org1MSP') {
            throw new Error('client is not authorized to set the name and symbol of the token')
        }

        await ctx.stub.putState(this.nameKey, Buffer.from(name))
        await ctx.stub.putState(this.symbolKey, Buffer.from(symbol))
        return true
    }

    /**
     * Mint a new non-fungible token
     *
     * @param {Context} ctx the transaction context
     * @param {String} tokenId Unique ID of the non-fungible token to be minted
     * @param {String} tokenURI URI containing metadata of the minted non-fungible token
     * @returns {Object} Return the non-fungible token object
    */

    @Transaction(true)
    public async Mint(ctx: Context,id:string, uri: string, format: string, owner: string, ownerOrg: string, filename: string): Promise<object> {

        // Check minter authorization - this sample assumes Org1 is the issuer with privilege to mint a new token
        const clientMSPID = ctx.clientIdentity.getMSPID()
        if (clientMSPID !== 'Org1MSP') {
            throw new Error('client is not authorized to mint new tokens')
        }


        // Check if the token to be minted does not exist
        let exists = await this._nftExistsById(ctx, id)
        if (exists) {
            throw new Error(`The token with Id ${id} is already minted.`)
        }
        exists = await this._nftExistsByUri(ctx, uri)
        if(exists){
            throw new Error(`The toekn with Uri ${uri} is already minted` )
        }
        const nftToken: NFTExtended = {
            ID: id,
            URI: uri,
            FileFormat: format,
            Owner: owner,
            Organization: ownerOrg,
            FileName: filename,
            Weight: 0,
            ApprovedForTransfer: undefined,
            RankerOrganizations: []
        }

        // Add a non-fungible token

        const nftKey = ctx.stub.createCompositeKey(this.nftPrefix, [nftToken.ID])
        await ctx.stub.putState(nftKey, Buffer.from(JSON.stringify(nftToken)))

        const uriKey = ctx.stub.createCompositeKey(this.uriPrefix, [nftToken.URI])
        await ctx.stub.putState(uriKey, Buffer.from(nftToken.ID))

        // A composite key would be balancePrefix.owner.tokenId, which enables partial
        // composite key query to find and count all records matching balance.owner.*
        // An empty value would represent a delete, so we simply insert the null character.
        const minter = ctx.clientIdentity.getID() // Get ID of submitting client identity
        const balanceKey = ctx.stub.createCompositeKey(this.balancePrefix, [minter, nftToken.ID])
        await ctx.stub.putState(balanceKey, Buffer.from('\u0000'))

        // Emit the Transfer event
        const transferEvent = { from: '0x0', to: minter, tokenId: nftToken.ID }
        ctx.stub.setEvent('Transfer', Buffer.from(JSON.stringify(transferEvent)))
        return nftToken
    }

    /**
     * Burn a non-fungible token
     *
     * @param {Context} ctx the transaction context
     * @param {String} tokenId Unique ID of a non-fungible token
     * @returns {Boolean} Return whether the burn was successful or not
     */
    @Transaction(true)
    public async Burn(ctx: Context, tokenId: string): Promise<boolean> {
        const owner = ctx.clientIdentity.getID()

        // Check if a caller is the owner of the non-fungible token
        const nft = await this._readNFT(ctx, tokenId)
        if (nft.Owner !== owner) {
            throw new Error(`Non-fungible token ${tokenId} is not owned by ${owner}`)
        }

        // Delete the token
        const nftKey = ctx.stub.createCompositeKey(this.nftPrefix, [tokenId])
        await ctx.stub.deleteState(nftKey)

        // Remove a composite key from the balance of the owner
        const balanceKey = ctx.stub.createCompositeKey(this.balancePrefix, [owner, tokenId])
        await ctx.stub.deleteState(balanceKey)

        // Emit the Transfer event
        const tokenIdInt = parseInt(tokenId)
        const transferEvent = { from: owner, to: '0x0', tokenId: tokenIdInt }
        ctx.stub.setEvent('Transfer', Buffer.from(JSON.stringify(transferEvent)))

        return true
    }

    /**
     * ClientAccountBalance returns the balance of the requesting client's account.
     *
     * @param {Context} ctx the transaction context
     * @returns {Number} Returns the account balance
     */
    @Transaction(false)
    public async ClientAccountBalance(ctx: Context): Promise<number> {
        // Get ID of submitting client identity
        const clientAccountID = ctx.clientIdentity.getID()
        return this.BalanceOf(ctx, clientAccountID)
    }

    // ClientAccountID returns the id of the requesting client's account.
    // In this implementation, the client account ID is the clientId itself.
    // Users can use this function to get their own account id, which they can then give to others as the payment address
    @Transaction(false)
    public async ClientAccountID(ctx: Context): Promise<string> {
        // Get ID of submitting client identity
        const clientAccountID = ctx.clientIdentity.getID()
        return clientAccountID
    }

    private async _readNFT(ctx: Context, tokenId: string): Promise<NFTExtended> {
        const nftKey = ctx.stub.createCompositeKey(this.nftPrefix, [tokenId])
        const nftBytes = await ctx.stub.getState(nftKey)
        if (!nftBytes || nftBytes.length === 0) {
            throw new Error(`The tokenId ${tokenId} is invalid. It does not exist`)
        }
        const nft = JSON.parse(nftBytes.toString())
        return nft as NFTExtended
    }

    private async _nftExistsById(ctx: Context, tokenId: string): Promise<boolean> {
        const nftKeyId = ctx.stub.createCompositeKey(this.nftPrefix, [tokenId])
        const nftBytesById = await ctx.stub.getState(nftKeyId)
        return nftBytesById && nftBytesById.length > 0
    }

    private async _nftExistsByUri(ctx: Context, uri:string): Promise<boolean> {
        const nftKeyUri = ctx.stub.createCompositeKey(this.uriPrefix, [uri])
        const nftBytesByUri = await ctx.stub.getState(nftKeyUri)
        return nftBytesByUri && nftBytesByUri.length > 0
    }
}

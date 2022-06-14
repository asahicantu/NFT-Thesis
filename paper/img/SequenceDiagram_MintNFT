sequenceDiagram
    actor M as Minter
    actor R as Receiver
    participant NFT as NFT_System
    participant F as Fabric
    participant I as IPFS
    activate NFT

    M->>+NFT: Access to Minting NFT Section
    NFT-->>M: Displays NFT Form
    M->>+NFT: Creates NFT Metadata, selects data file and submits
    NFT->>+I: Try add minting data
    alt CID Exists
        I-->>NFT: Error: CID  already exists
        NFT-->>M: Return error
    else 
        I-->>NFT:Saves Data and returns generated CID
        alt NFT with CID exists:
            F-->>NFT: NFT already minted
        else
            NFT-->>M: Rturn Minted NFT
        end
    end
    M->>R:Share NFT / CID
    R->>NFT:Request Data with CID
    NFT->>F:Request NFT
    alt NFT Exists:
        F-->>NFT:Return minted NFT
        NFT->>I:Request data withc NFT/CID
        activate I
        alt CID Exists:
            I-->>NFT:Success, CID found
            NFT-->>R:Return Data with valid CID
        else
            I-->>NFT:Error, CID not found
        end
        deactivate I
    else
        F-->>NFT:Return Not found error
        NFT-->>R:Return Not found error
    end
    deactivate NFT
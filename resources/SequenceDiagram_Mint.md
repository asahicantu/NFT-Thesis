sequenceDiagram
    actor O1 as Organization_1
    actor O2 as Organization_2
    %%actor O1_M as O1_Minter
    %%actor O2_R as O2_Receiver
    participant NFT as NFT_System
    participant F as Fabric
    %%participant I as IPFS
    activate NFT
    %% Organization 1
    O1->>+NFT: Register
    NFT->>F: Request CA Credentials
    activate F
    F-->>NFT: Validates Certificate and returns admin wallet
    deactivate F
    NFT-->>O1: Access granted, return admin wallet
    O1->>NFT: Enroll Minter
    activate F
    NFT->>F: Request enroll user 'Minter'
    F-->>NFT: Validates Certificate and returns 'minter' wallet
    deactivate F
    NFT-->>+O1: 'minter' User and wallet created 
    deactivate NFT

    %% Organization 2
    O2->>+NFT: Register
    NFT->>F: Request CA Credentials
    activate F
    F-->>NFT: Validates Certificate and returns admin wallet
    deactivate F
    NFT-->>O2: Access granted, return admin wallet
    O2->>NFT: Enroll Minter
    activate F
    NFT->>F: Request enroll user 'Minter'
    F-->>NFT: Validates Certificate and returns 'minter' wallet
    deactivate F
    NFT-->>+O2: 'minter' User and wallet created 
    deactivate NFT
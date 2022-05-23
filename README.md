# NFT as a proof of Digital
Ownership-reward system integrated to a Secure Distributed Computing system Managed by Blockchain

## Summary
This is a Thesis project for my masters degree in Data Science provided by University of Stavanger.
The purpose of this work is to demonstrate the feasibility and potential to implement an NFT-Based system to store and manage ownership of data, contribute to the newtork and use Proof of Ownership as the consensus mechanism.

![Hyperledger architecture](resources/Hyperledger-NFT%20Architecture.png)

### A permissioned Blockchain-based network
The project simulates the interaction between two organization in a permissioned blockchain network where they can:
* Upload a data file system with its metadata
* Mint uploaded data as an NFT and store the resulted hash or IPFS-CID into their own database as a proof of ownership.
* Transfer the generated NFT Asset
* Burn the NFT
* Extend the NFT

Thus, the project aims to show the potential a solution like this has to be implemented in real applications for corporate organizations.

## Purpose
This thesis project emerged by the need to overcome security threats and data breaches as well as to explore a way to share and contribute in a commonly shared data repository similar to what current oil companies use in Norway.

## Technologies
### Hyperledger
### IPFS
### ExpressJS
### Typescript
### React
### Docker Containers

## System Components
### Hyperledger Fabric
#### Chaincode
### Private IPFS Network
### Backend
### Frontend

# Repository Structure
## network
Contains all the hyperlesdger fabric implementation for the development of this project
## thesis
Source code for the thesis report written in Latex. Final version can be found here:
## web
Contains all web components for the application program.
### client
Frontend application developed in React and Typescript
### server
Backend server appplication developed in ExpressJS and Typescript
### common
Common data types and utils used by both Backened and server
## REST
A Postman collection to explore and use all the API calls created. Related documentation can be found there to further extend to other applications

## chaincode
Contains the smart contracts and code developed for Fabric NFT system
### token-erc-721
Implementation and extension of Ethereum Standart ERC-721 (NFT) smart contract built in TypeScript.

## resources
Miscelaneous, images and diagrams build to present and explain the system architecture, technologies used and workflows.

# Instructions
To run the project follow the following steps:
## Prerequisites
* A linux operating system or bash scripting shell is required.
* On a windows machine the usage of WSL (any linux distribution) can help to run the project
* Docker Desktop installed (if using Windows with WSL make sure the option 'Use WSL 2 Based engine' or similar is selected).

![Docker WSL Selection](resources/Docker_Desktop_WSL_Selection.png)

## 1. Clone the repository
``` bash
git clone https://github.com/asahicantu/NFT-Thesis.git
```
## 2. Change to network folder
Move to the repository's directory and then to the network directory
```bash
cd NFT-Thesis/network
```
## 3. Enable execution mode for all .sh (shell scripting files)
```bash
find . -name "*.sh" -exec chmod +x {} \;
```
## 4. Run the network infrastructure
Execute the following command to create all the network infrastructure in docker, certificates, organizations nad connection files.
```bash
./network start
```
This process will take some minutes to finish running, what it does:
1. Invokes Docker-compose commands to create the docker containers for:
  1. Hyperledger fabric 
### 
//NOTE: Since that this website is not online, the design has not been optimized for mobile, otherwise, this website use a responsive css, so it should look decent also on mobile.


import Link from "next/link";
import "@app/chats.css"; 
import { useState } from "react"; 
import { Signer, ethers } from "ethers";
import Web3Modal from "web3modal"; 
import WalletConnectProvider from "@walletconnect/web3-provider";
import { abi, contractAddress } from "@infocontracts";

let provider; 
let web3modal; 

const providerOptions = {
walletconnect:{
package: WalletConnectProvider,
options :{
rpc :{11155111: "https://eth-sepolia.g.alchemy.com/v2/Z4iZqIYn02E4azjwQ6-utMqyFgY6ZSUX"},
}
} 
}


const Groups = () => {

const[isConnected, setIsConnected] = useState(false); 
const[userAddress, setUserAddress] = useState(); 
const[userAddressComplete, setUserAddressCompleted] = useState(); 
const[yourGroupUserInterface, setYourGroupUserInterface] = useState(true); 
const[userGroups, setUserGroups] = useState([]); 
const[totaleGroups, setTotalGroups] = useState([]); 
const[isCreatingAGroup, setIsCreatingAGroup] = useState(false); 
const[groupNameInputValue, setGroupNameInputValue] = useState(''); 
const[descriptionInputValue, setDescriptionInputValue] = useState(''); 
const[waitingForTxWhenCreatingAGroup, setWaitingForTxWhenCreatingAGroup] = useState(false); 
const[isReturningAGroup, setIsReturningAGroup] = useState(false);
const[groupNameReturning, setGroupNameReturning] = useState(); 
const[ownerOfGroupReturing, setOwnerOfGroupReturning] = useState(); 
const[groupMessagges,setGroupMessagges] = useState([]); 
const[inputValueWhenSendingAMessageInTheGroup, setinputValueWhenSendingAMessageInTheGroup] = useState(''); 
const[isSendingAMessage,setIsSendingAMessage] = useState(false); 
const[hasUserAlreadyJoinedTheGroup,setUserJoinedTheGroup] = useState(false); 
const[joinGroupDivMessage,setJoinGroupDivMessage] = useState(false); 
const[nameWhenJoiningTheGroup,setTheNameWhenJoiningTheGroup] = useState(); 
const[descritpionWhenJoiningTheGroup,setDescritpionWhenJoiningTheGroup] = useState(); 
const[isJoiningTheGroupTx,setIsJoiningTheGroupTx] = useState(false); 
const[isNetworkWrong,setIsNetworkWrong] = useState(false); 
const[joiningManuallyAGroup,setJoiningManuallyAGroup] = useState(false); 
const[groupNameValueWhenJoiningManually,setGroupNameValueWhenJoiningManually] = useState(''); 
const[groupDescriptionValueWhenJoiningManually,setGrouDescriptionValueWhenJoiningManually] = useState(''); 
const[errorWhenJoiningAGroupManually,setErrorWhenJoiningAGroupManually] = useState(false); 
const[errorWhenCreatingAGroup,setErrorWhenCreatingAGroup] = useState(false); 
const[divWhenJoiningManuallyAGroup,setDivWhenJoiningManuallyAGroup] = useState(false); 


async function connectWallet(){
web3modal = new Web3Modal({
cacheProvider: false, 
providerOptions,
})
provider = await web3modal.connect(); 
const ethersProvider = new ethers.providers.Web3Provider(provider); 
if(provider.chainId == 11155111){
try{
const signer = ethersProvider.getSigner(); 
setIsConnected(true); 
const signerAddress = await signer.getAddress(); 
const firstThree = signerAddress.slice(0,5); 
const lastThree = signerAddress.slice(-3); 
setUserAddress(firstThree + "..." + lastThree); 
setUserAddressCompleted(signerAddress); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
const getUserGroups = await contract.returnUserGroups(); 
setUserGroups(getUserGroups); 
const getAllGroups  = await contract.returnAllTheGroups(); 
setTotalGroups(getAllGroups); 
}catch(e){
console.log(e); 
}
}else{
try{
setIsNetworkWrong(true); 
}catch(e){
console.log(e); 
}
}
}


async function createGroup(name, description){
web3modal = new Web3Modal({
cacheProvider: false, 
providerOptions,
})
try{
const ethersProvider = new ethers.providers.Web3Provider(provider); 
const signer = ethersProvider.getSigner(); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
const createGroup = await contract.createGroup(name, description); 
setWaitingForTxWhenCreatingAGroup(true); 
setIsCreatingAGroup(false);
setDescriptionInputValue(''); 
setGroupNameInputValue(''); 
await createGroup.wait(1); 
setWaitingForTxWhenCreatingAGroup(false); 


const getUserGroups = await contract.returnUserGroups(); 
setUserGroups(getUserGroups); 
const getAllGroups  = await contract.returnAllTheGroups(); 
setTotalGroups(getAllGroups); 
}catch{
setErrorWhenCreatingAGroup(true); 
}
}


async function setYourGroupUserInterfaceToFalse(){
setYourGroupUserInterface(false); 
}


async function setYourGroupUserInterfaceToTrue(){
setYourGroupUserInterface(true); 
}


const handleInputGroupNameChange = (e) => {
setGroupNameInputValue(e.target.value); 
}


const handleDescriptionInputChange = (e) => {
setDescriptionInputValue(e.target.value); 
}


const handleInputMessageChange = (e) => {
setinputValueWhenSendingAMessageInTheGroup(e.target.value); 
}


const handleNameChangingWhenJoiningManuallyAGroup = (e) => {
setGroupNameValueWhenJoiningManually(e.target.value); 
}


const handleDescriptionChangingWhenJoiningManuallyAGroup = (e) => {
setGrouDescriptionValueWhenJoiningManually(e.target.value); 
}


async function notSetUserJoinedTheGroup(){
setUserJoinedTheGroup(false); 
}


async function setIsCreatingAGroupFunction(){
setIsCreatingAGroup(true); 
}


async function notSetIsCreatingAGroupFunction(){
setIsCreatingAGroup(false); 
setDescriptionInputValue(''); 
setGroupNameInputValue(''); 
}


async function notSetJoinDivGroupMessage(){
setJoinGroupDivMessage(false); 
}


async function notSetIsReturningAGroupFunction(){
setIsReturningAGroup(false); 
}


async function setNotErrorWhenJoiningAGroupManually(){
setErrorWhenJoiningAGroupManually(false); 
}


async function setNotErrorWhenCreatingAGrpup(){
setErrorWhenCreatingAGroup(false); 
}


async function returnGroup_(groupName,groupOwner){
web3modal = new Web3Modal({
cacheProvider: false, 
providerOptions,
})
const ethersProvider = new ethers.providers.Web3Provider(provider); 
const signer = ethersProvider.getSigner(); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
setIsReturningAGroup(true); 
setGroupNameReturning(groupName); 
setOwnerOfGroupReturning(groupOwner); 
const returnMessaggesInsideTheGroup = await contract.returnGroupMessagges(groupName); 
setGroupMessagges(returnMessaggesInsideTheGroup); 
}

async function sendAMessage(group,message){
web3modal = new Web3Modal({
cacheProvider: false, 
providerOptions,
})
const ethersProvider = new ethers.providers.Web3Provider(provider); 
const signer = ethersProvider.getSigner(); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
const sendMessage = await contract.sendMessagesInAGroup(group,message); 
setIsSendingAMessage(true); 
await sendMessage.wait(1); 
setIsSendingAMessage(false); 
const returnMessaggesInsideTheGroup = await contract.returnGroupMessagges(group); 
setGroupMessagges(returnMessaggesInsideTheGroup); 
}


async function seeIfUserCanJoinTheGroup(groupName,groupDescription){
web3modal = new Web3Modal({
cacheProvider: false, 
providerOptions,
})
const ethersProvider = new ethers.providers.Web3Provider(provider); 
const signer = ethersProvider.getSigner(); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
const getUserGroups = await contract.returnUserGroups(); 
for(let i = 0; i < getUserGroups.length; i++){
if(getUserGroups[i][0] == groupName.toString()){
setUserJoinedTheGroup(true); 
console.log("Success")
break; 
}else{
setJoinGroupDivMessage(true); 
setTheNameWhenJoiningTheGroup(groupName); 
setDescritpionWhenJoiningTheGroup(groupDescription); 
console.log("Error")
}
}
}



async function joinGroupFunction(group,description){
web3modal = new Web3Modal({
cacheProvider: false, 
providerOptions,
})
try{
const ethersProvider = new ethers.providers.Web3Provider(provider); 
const signer = ethersProvider.getSigner(); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
const joinTheGroup = await contract.joinGroup(group,description); 
setJoinGroupDivMessage(false); 
setIsJoiningTheGroupTx(true); 
await joinTheGroup.wait(1); 
setIsJoiningTheGroupTx(false); 
}catch(e){
setUserJoinedTheGroup(true); 
setJoinGroupDivMessage(false); 
}
}

async function setJoiningManuallyAGroupFunction(){
setJoiningManuallyAGroup(true); 
}


async function setNotJoiningManuallyAGroupFunction(){
setJoiningManuallyAGroup(false); 
}


async function joinManuallyAGroup(group,description){
web3modal = new Web3Modal({
cacheProvider: false, 
providerOptions,
})
try{
const ethersProvider = new ethers.providers.Web3Provider(provider); 
const signer = ethersProvider.getSigner(); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
const joinTheGroup = await contract.joinGroup(group,description); 
setDivWhenJoiningManuallyAGroup(true); 
await joinTheGroup.wait(1); 
setDivWhenJoiningManuallyAGroup(false); 
}catch(e){
setErrorWhenJoiningAGroupManually(true); 
}
}


return(
<>
{isConnected? <>
{isReturningAGroup? <> 
{isSendingAMessage? <> 
<div className = "flex flex-row justify-center w-[100%] absolute mt-[240px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-white">Sending the message in the group...</div>
<div className = "flex flex-wrap justify-center mb-5">
<div className = "loader"></div>
</div>
</div>
</div>
</> :<> </>}
 
<div className = "bg-black   h-[800px]">
<div className = "flex flex-wrap border-b-2 border-white">
<div className = "text-white text-2xl p-6 m-2 hover:bg-slate-700 transition-all rounded-md cursor-pointer" onClick = {()=> notSetIsReturningAGroupFunction()}>Your Groups</div>
</div>

<div className = "mt-6 text-center text-2xl text-white">{groupNameReturning}</div>
<div className = "mt-2 text-center text-xl text-white pb-7 border-b-2 border-b-slate-500">Owner: {ownerOfGroupReturing}</div>

{groupMessagges.map((messagges,index) => (
<>
<div key = {index} className = "text-slate-700 text-center text-xl mt-8">{messagges[1]}</div>
<div key = {index} className = "text-slate-400 text-xl text-center">{messagges[2]}</div>
</>
))}
<div className="bg-black p-4 fixed bottom-0 left-0 w-full border-t border-gray-600 flex items-center">
<input type="text" placeholder="Send a message" className="w-full bg-black border-2 border-slate-600 text-white p-3 rounded-lg mr-2" value = {inputValueWhenSendingAMessageInTheGroup} onChange = {handleInputMessageChange}/>
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick = {()=> sendAMessage(groupNameReturning,inputValueWhenSendingAMessageInTheGroup)}>Send</button>
</div>
</div>
    
    
</>
: <> 
{waitingForTxWhenCreatingAGroup? <>
<div className = "flex flex-row justify-center w-[100%] absolute mt-[240px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-white">Creating the group...</div>
<div className = "flex flex-wrap justify-center mb-5">
<div className = "loader"></div>
</div>
</div>
 </div>
</>: <> </>}
{divWhenJoiningManuallyAGroup? <> 
 <div className = "flex flex-row justify-center w-[100%] absolute mt-[240px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-white">Joining the group...</div>
<div className = "flex flex-wrap justify-center mb-5">
<div className = "loader"></div>
</div>
</div>
</div>
</> : <> </>}
{isCreatingAGroup? <> 
<div className = "flex flex-row justify-center w-[100%] absolute mt-[240px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-white">Select the name and description to create a group</div>
   
<p className = "text-white pl-5">Name</p><input type = "text" placeHolder = "Select the name" className = "ml-5 p-1 rounded-lg w-[90%]" value = {groupNameInputValue} onChange = {handleInputGroupNameChange} ></input>
<p className = "text-white pl-5 mt-7">Description</p><input type = "text" placeHolder = "Choice a description" className = "ml-5 p-1 rounded-lg w-[90%] mb-6" value = {descriptionInputValue} onChange = {handleDescriptionInputChange}></input>
<div className = "flex flex-wrap justify-between">
<button className = "border-white border-2 text-white rounded-md text-md p-1 m-2 hover:bg-red-500 hover:text-black" onClick = {() => notSetIsCreatingAGroupFunction()}>Cancel</button>
<button className = "border-white border-2 text-white rounded-md text-md p-1 m-2 hover:bg-green-500 hover:text-black"onClick = {() => createGroup(groupNameInputValue,descriptionInputValue)}>Confirm</button>
</div>
</div>
</div>
    
</> : <> </>}
{joiningManuallyAGroup? <> 
<div className = "flex flex-row justify-center w-[100%] absolute mt-[240px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-white">Select the name and the description of the group</div>
<p className = "text-white pl-5">Name</p><input type = "text" placeHolder = "Select the group name" className = "ml-5 p-1 rounded-lg w-[90%]" value = {groupNameValueWhenJoiningManually} onChange = {handleNameChangingWhenJoiningManuallyAGroup}></input>
<p className = "text-white pl-5 mt-7">Description</p><input type = "text" placeHolder = "Select the group description" className = "ml-5 p-1 rounded-lg w-[90%] mb-6" value = {groupDescriptionValueWhenJoiningManually} onChange = {handleDescriptionChangingWhenJoiningManuallyAGroup}></input>
<div className = "flex flex-wrap justify-between">
<button className = "border-white border-2 text-white rounded-md text-md p-1 m-2 hover:bg-red-500 hover:text-black" onClick = {() => setNotJoiningManuallyAGroupFunction()}>Cancel</button>
<button className = "border-white border-2 text-white rounded-md text-md p-1 m-2 hover:bg-green-500 hover:text-black" onClick = {()=> joinManuallyAGroup(groupNameValueWhenJoiningManually,groupDescriptionValueWhenJoiningManually)}>Confirm</button>
</div>
</div>
</div>
</> : <> </>}
{errorWhenJoiningAGroupManually? <>
<div className = "flex flex-row justify-center w-[100%] absolute mt-[240px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-red-500">Error when joining the group, try again: make sure you're not already in the group or the group exists</div>
<div className = "justify-center flex flex-wrap">
<button className = "border-white border-2 text-white rounded-md text-md p-1 m-2 hover:bg-red-500 hover:text-black" onClick = {() => setNotErrorWhenJoiningAGroupManually()}>Cancel</button>
</div>
</div>
</div>
</> : <> </>}
{errorWhenCreatingAGroup? <>
<div className = "flex flex-row justify-center w-[100%] absolute mt-[240px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-red-500">Error when creating the group, try again: Make sure the name of the group does not already exists</div>
<div className = "justify-center flex flex-wrap">
<button className = "border-white border-2 text-white rounded-md text-md p-1 m-2 hover:bg-red-500 hover:text-black" onClick = {() => setNotErrorWhenCreatingAGrpup()}>Cancel</button>
</div>
</div>
</div>
</> : <> </>}
<div className = "bg-black min-h-[800px] h-[auto]">

<div className = "flex flex-wrap  border-b-slate-400 border-b-2 justify-between">

<div className = "flex flex-wrap justify-center py-6">
<div className = "photoLogo inline-block"></div>

<div className = "px-2 inline-block text-white text-center text-[40px] hover:bg-slate-700 transition-all rounded-md cursor-pointer">MessBlock</div>

<div className = "inline-block text-green-500 text-[33px] mt-2.5">Groups</div>
</div>
<Link href = "/">
<div className = "text-white text-[25px] m-7 p-3 hover:bg-slate-700 transition-all rounded-md cursor-pointer">Chats</div>
</Link>
</div>

<div className = "text-white text-2xl text-center mt-10 pb-10"> ✅ Logged as {userAddress} ✅</div>
<div className = " mt-3 flex flex-wrap justify-center">
<div className = "w-auto h-auto cursor-pointer p-2 border-2 border-white text-white rounded-lg text-xl hover:border-green-400 transition-all" onClick = {() => setIsCreatingAGroupFunction()}>Create a group</div>
<div className = "px-6 text-white text-2xl pt-2">or</div>
<div className = "w-auto h-auto cursor-pointer p-2 border-2 border-white text-white rounded-lg text-xl hover:border-green-400 transition-all" onClick = {() => setJoiningManuallyAGroupFunction()}>Join a group</div>
</div>


{yourGroupUserInterface? <>

<div className = "flex flex-wrap justify-center mt-6 border-b-2 border-b-slate-700 pb-6">
<div className = "text-white mx-28 text-3xl border-b-white border-b-4 cursor-pointer">Your groups</div>
<div className = "text-white mx-28 text-3xl cursor-pointer hover:border-b-slate-400 transition-all" onClick = {() => setYourGroupUserInterfaceToFalse()}>Groups</div>
{userGroups.map((groups, index) => (
<>
<div key = {index} className = "h-auto w-[100%] text-white text-xl px-10 py-2 mt-5 hover:bg-slate-700 transition-all rounded-md cursor-pointer" onClick = {()=> returnGroup_(groups[0],groups[2])}>{groups[0]}</div>
<div className = "h-auto w-[100%] text-white text-xl px-10 py-2">{groups[1]}</div>
<div className = "h-auto w-[100%] text-white text-xl px-10 py-2 border-b-[3px] border-b-slate-600">Creator: {groups[2]}</div>
</>
))}

</div>

    
</>
:<>
{isJoiningTheGroupTx? <> 
    <div className = "flex flex-row justify-center w-[100%] absolute mt-[240px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-white">Joining {nameWhenJoiningTheGroup}...</div>
<div className = "flex flex-wrap justify-center mb-5">
<div className = "loader"></div>
</div>
</div>
</div>

</> :<> </>}
{joinGroupDivMessage? <><div className = "flex flex-row justify-center w-[100%] absolute mt-[240px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-white">Do you want to join this group?</div>
<div className = "text-white text-center text-2xl pt-2 px-5 pb-4">{nameWhenJoiningTheGroup}</div>
<div className = "flex flex-wrap justify-between">
<button className = "border-white border-2 text-white rounded-md text-md p-1 m-2 hover:bg-red-500 hover:text-black" onClick = {() => notSetJoinDivGroupMessage()}>Cancel</button>
<button className = "border-white border-2 text-white rounded-md text-md p-1 m-2 hover:bg-green-500 hover:text-black" onClick = {()=> joinGroupFunction(nameWhenJoiningTheGroup,descritpionWhenJoiningTheGroup)}>Confirm</button>
</div>
</div>
 </div>
</> :<> </>}
{hasUserAlreadyJoinedTheGroup?<> 
<div className = "flex flex-row justify-center w-[100%] absolute mt-[240px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-white">User already joined the group</div>
<div className = "flex flex-wrap justify-center">
 <div className = "border-white border-2 p-1 text-white text-xl mb-5 mt-2 rounded-lg hover:bg-red-500 transition-all cursor-pointer"onClick = {() => notSetUserJoinedTheGroup()}>Cancel</div>
</div>
</div>
</div>
</> :<> </>}
<div className = "flex flex-wrap justify-center mt-6 border-b-2 border-b-slate-700 pb-6">
<div className = "text-white mx-28 text-3xl cursor-pointer hover:border-b-slate-400 transition-all" onClick = {() => setYourGroupUserInterfaceToTrue()}>Your groups</div>
<div className = "text-white mx-28 text-3xl border-b-white border-b-4 cursor-pointer">Groups</div>
{totaleGroups.map((groups, index) => (
<>

<div key = {index} className = "h-auto w-[100%] text-white text-xl px-10 py-2 mt-5 hover:bg-slate-700 transition-all rounded-md cursor-pointer"onClick = {()=> seeIfUserCanJoinTheGroup(groups[0],groups[1])}>{groups[0]}</div>
<div className = "h-auto w-[100%] text-white text-xl px-10 py-2">{groups[1]}</div>
<div className = "h-auto w-[100%] text-white text-xl px-10 py-2 border-b-[3px] border-b-slate-600">Creator: {groups[2]}</div>
</>
))}
</div>


</>}

</div>
    
</>}
</>: <>
{isNetworkWrong? <>
<div className = "bg-black min-h-[800px] h-auto">

<div className = "flex flex-wrap  border-b-slate-400 border-b-2 justify-between">

<div className = "flex flex-wrap justify-center py-6">
<div className = "photoLogo inline-block"></div>

<div className = "px-2 inline-block text-white text-center text-[40px] hover:bg-slate-700 transition-all rounded-md cursor-pointer">MessBlock</div>

<div className = "inline-block text-green-500 text-[33px] mt-2.5">Groups</div>
</div>
<Link href = "/">
<div className = "text-white text-[25px] m-7 p-3 hover:bg-slate-700 transition-all rounded-md cursor-pointer">Chats</div>
</Link>
</div>
<div className = "text-center text-red-500 mt-32">Can't interact with this website, make shure you connect your web3 wallet using the sepholia ethereum network: chainId is 11155111</div>
<div className = "text-center text-white mt-3">To be able to see the MessBlock groups you need to connect your Web3 wallet</div>

<div className = "flex flex-wrap justify-center mt-10">
<div className = "h-auto w-auto border-2 border-white rounded-lg">
<div className = "text-white text-2xl p-10 hover:bg-slate-700 transition-all rounded-md cursor-pointer" onClick ={() => connectWallet()}>Connect Wallet</div>
</div>
</div>
</div>

</> : <>
<div className = "bg-black min-h-[800px] h-auto">

<div className = "flex flex-wrap  border-b-slate-400 border-b-2 justify-between">

<div className = "flex flex-wrap justify-center py-6">
<div className = "photoLogo inline-block"></div>

<div className = "px-2 inline-block text-white text-center text-[40px] hover:bg-slate-700 transition-all rounded-md cursor-pointer">MessBlock</div>

<div className = "inline-block text-green-500 text-[33px] mt-2.5">Groups</div>
</div>
<Link href = "/">
<div className = "text-white text-[25px] m-7 p-3 hover:bg-slate-700 transition-all rounded-md cursor-pointer">Chats</div>
</Link>
</div>

<div className = "text-center text-white mt-32">To be able to see the MessBlock groups you need to connect your Web3 wallet</div>

<div className = "flex flex-wrap justify-center mt-10">
<div className = "h-auto w-auto border-2 border-white rounded-lg">
<div className = "text-white text-2xl p-10 hover:bg-slate-700 transition-all rounded-md cursor-pointer" onClick ={() => connectWallet()}>Connect Wallet</div>
</div>
</div>
</div>
</>}
</>}
</>
)
}


export default Groups; 
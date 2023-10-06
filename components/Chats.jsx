//NOTE: SInce that this website is not online, the design has not been optimized for mobile, otherwise, this website use a responsive css, so it should look decent also on mobile.

import "@app/chats.css"; 

import Link from "next/link";
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


const Chats = () => {


const[isConnected, setIsConnected] = useState(false); 
const[userAddress, setUserAddress] = useState();
const[_userChats, setUserChats] = useState([]); 
const[isChatShowed, setChatShowed] = useState(false); 
const[chatShowedWith, setChatShowedWith] = useState(); 
const[userChatMessagges, setUserChatMessagges] = useState([]); 
const[createNewChatDiv, setCreateNewChatDiv] = useState(false); 
const[inputValueWhenCreatingChat, setInputValueWhenCreatingAChat] = useState('');
const[waitingForCrreatingChatDiv, setwaitingForCrreatingChatDiv] = useState(); 
const[inputValueWhenSendingMessages, setInputValueWhenSendingMessagges] = useState(''); 
const[deleteChatDiv, setDeleteChatDiv] = useState(false); 
const[sendingMessage, setSendingMessage] = useState(false); 
const[isNetworkWrong,setIsNetworkWrong] = useState(false); 
const[errorWhenCreatingAChat,setErrorWhenCreatingAChat] = useState(false); 


async function connectWallet(){
web3modal = new Web3Modal({
providerOptions, 
cacheProvider: false
})
provider = await web3modal.connect(); 
const ethersProvider = new ethers.providers.Web3Provider(provider); 
if(provider.chainId == 11155111){
try{
setIsConnected(true); 
const signer = ethersProvider.getSigner(); 
const signerAddress = await signer.getAddress(); 
const firstThreeWordOfTheAddress = signerAddress.slice(0,5); 
const lastThreeWordOfTheAddress = signerAddress.slice(-3)
setUserAddress(firstThreeWordOfTheAddress + "..." + lastThreeWordOfTheAddress); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
const getUserChats = await contract.returnUserChats(); 
setUserChats(getUserChats); 
}catch(e){
}
}else{
try{
setIsNetworkWrong(true); 
}catch(e){
}
}
}



function showCreateNewChatDiv(){
setCreateNewChatDiv(true); 
}


function notShowCreateNewChatDiv(){
setCreateNewChatDiv(false); 
}


const handleInputChange = (e) => {
setInputValueWhenCreatingAChat(e.target.value);
};


const handleCreateChat = () => {
createNewChat(inputValueWhenCreatingChat);
setInputValueWhenCreatingAChat('');
};


const handleInputChangeWithNewMessage = (e) => {
setInputValueWhenSendingMessagges(e.target.value); 
}


const handleSendMessage = () => {
_sendMessage(inputValueWhenSendingMessages); 
setInputValueWhenSendingMessagges(''); 
}


async function createNewChat(_inputValue){
web3modal = new Web3Modal({
providerOptions, 
cacheProvider: false
})
try{
const ethersProvider = new ethers.providers.Web3Provider(provider); 
const signer = ethersProvider.getSigner(); 
const signerAddress = await signer.getAddress(); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
const _createChat = await contract.createChat(_inputValue); 
setCreateNewChatDiv(false); 
setwaitingForCrreatingChatDiv(true); 
await _createChat.wait(1); 
setwaitingForCrreatingChatDiv(false);
const getUserChats = await contract.returnUserChats(); 
setUserChats(getUserChats); 
}catch{
setErrorWhenCreatingAChat(true); 
notShowCreateNewChatDiv(); 
}
}


async function deleteChatWithUser(users){
web3modal = new Web3Modal({
providerOptions, 
cacheProvider: false
})
const ethersProvider = new ethers.providers.Web3Provider(provider); 
const signer = ethersProvider.getSigner(); 
const signerAddress = await signer.getAddress(); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
const _deleteChat = await contract.deleteChat(users); 
setDeleteChatDiv(true); 
await _deleteChat.wait(1); 
setDeleteChatDiv(false); 
const getUserChats = await contract.returnUserChats(); 
setUserChats(getUserChats); 
}


async function returnChat(users){
web3modal = new Web3Modal({
providerOptions, 
cacheProvider: false
})
const ethersProvider = new ethers.providers.Web3Provider(provider); 
const signer = ethersProvider.getSigner(); 
const signerAddress = await signer.getAddress(); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
setChatShowed(true); 
const getChatWithUser = await contract.returnChat(users.toString()); 
setUserChatMessagges(getChatWithUser); 
}


async function notReturnChat(){
setChatShowed(false); 
}

async function _sendMessage(inputValue){
web3modal = new Web3Modal({
providerOptions, 
cacheProvider: false
})
const ethersProvider = new ethers.providers.Web3Provider(provider); 
const signer = ethersProvider.getSigner(); 
const signerAddress = await signer.getAddress(); 
const contract = new ethers.Contract(contractAddress, abi, signer); 
const sendMessageToUser = await contract.sendMessage(chatShowedWith,inputValue.toString()); 
setSendingMessage(true); 
setInputValueWhenCreatingAChat(''); 
await sendMessageToUser.wait(1); 
setSendingMessage(false); 
const getChatWithUser = await contract.returnChat(chatShowedWith); 
setUserChatMessagges(getChatWithUser); 
}


async function setNotErrorWhenCreatingAChat(){
setErrorWhenCreatingAChat(false); 
}
  

return(
<>


{isConnected? <>
{isChatShowed? <> 
{sendingMessage? <>
<div className = "flex flex-row justify-center w-[100%] absolute mt-[300px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-white">Wait, sending the message...</div>
<div className = "flex flex-wrap justify-center mb-5">
<div className = "loader"></div>
</div>
</div>
</div>
</>
  
  
  
:<> </>}
<div className = "bg-black h-[800px]">
<div className = "flex flex-wrap border-b-2 border-white">
<div className = "text-white text-2xl p-6 m-2 hover:bg-slate-700 transition-all rounded-md cursor-pointer" onClick ={()=> notReturnChat()} >Your chats</div>
</div>
<div className = "text-center text-xl text-white py-3">Your chat with</div>
<div className = "text-center text-xl text-white py-1 pb-5">{chatShowedWith}</div>
{userChatMessagges.map((messagges, index) => (
<div key={index} className = "">
<div className = "text-center mt-10">
<div className = "block h-auto w-auto  text-slate-700 text-xl">{messagges[1]}</div>
<div className = "block h-auto w-auto  text-slate-400 text-xl">{messagges[0]}</div>
</div>
</div>
))}
<div className="bg-black p-4 fixed bottom-0 left-0 w-full border-t border-gray-600 flex items-center">
<input type="text" placeholder="Send a message" className="w-full bg-black border-2 border-slate-600 text-white p-3 rounded-lg mr-2" value = {inputValueWhenSendingMessages} onChange={handleInputChangeWithNewMessage}/>
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick = {() => handleSendMessage()}>Send</button>
</div>
</div>
</> : <>
{deleteChatDiv? <>
<div className = "flex flex-row justify-center w-[100%] absolute mt-[300px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-white">Deleting the chat...</div>
<div className = "flex flex-wrap justify-center mb-5">
<div className = "loader"></div>
</div>
</div>
</div>
  
  
</>:<> </>}
{errorWhenCreatingAChat? <> 
<div className = "flex flex-row justify-center w-[100%] absolute mt-[240px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-red-500">Error when creating a chat: Make sure to create a chat with a valid address</div>
<div className = "justify-center flex flex-wrap">
<button className = "border-white border-2 text-white rounded-md text-md p-1 m-2 hover:bg-red-500 hover:text-black" onClick = {() => setNotErrorWhenCreatingAChat()}>Cancel</button>
</div>
</div>
</div>
</>: <> </>}
{createNewChatDiv? <>
<div className = "flex flex-row justify-center w-[100%] absolute mt-[300px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "py-5 px-10 text-white text-xl text-center">Select the address to start a chat</div>
<div className = "flex flex-wrap justify-center">
<input className = "mb-5 mt-2 mx-10 rounded-md p-1 w-[405px]"type = "text" value = {inputValueWhenCreatingChat} onChange={handleInputChange}></input>
</div>
<div className = "flex flex-wrap justify-between">
<button className = "border-white border-2 text-white rounded-md text-md p-1 m-2 hover:bg-red-500 hover:text-black"onClick = {()=> notShowCreateNewChatDiv()}>Cancel</button>
<button className = "border-white border-2 text-white rounded-md text-md p-1 m-2 hover:bg-green-500 hover:text-black" onClick = {() => handleCreateChat()}>Confirm</button>

</div>
</div>

</div>
</> : <> </>}
{waitingForCrreatingChatDiv? <>
<div className = "flex flex-row justify-center w-[100%] absolute mt-[300px]">
<div className = "h-auto w-auto bg-black border-white border-2 rounded-lg">
<div className = "text-xl p-5 text-white">Creating a new chat...</div>
<div className = "flex flex-wrap justify-center mb-5">
<div className = "loader"></div>
</div>
</div>
</div>
   
   
</>:<> </>}
{/* True of the: isConnected */}
<div className = "bg-black   h-[800px]">

<div className = "flex flex-wrap  border-b-slate-400 border-b-2 justify-between">

<div className = "flex flex-wrap justify-center py-6">
<div className = "photoLogo inline-block"></div>

<div className = "px-2 inline-block text-white text-center text-[40px] hover:bg-slate-700 transition-all rounded-md cursor-pointer">MessBlock</div>

<div className = "inline-block text-green-500 text-[33px] mt-2.5">Chats</div>
</div>
<Link href = "/groupsPage">
<div className = "text-white text-[25px] m-7 p-3 hover:bg-slate-700 transition-all rounded-md cursor-pointer">Groups</div>
</Link>
</div>

<div className = "flex flex-wrap justify-center mt-3">
<button className = "border-white border-2 text-white text-md p-3 rounded-md hover:bg-slate-700 transition-all cursor-pointer"onClick ={() => showCreateNewChatDiv()}>Create new chat</button>
</div>

<div className = "text-white text-2xl text-center mt-10 border-b-2 border-b-slate-400 pb-10">✅ Logged as {userAddress} ✅</div>




<div className = "text-center text-white text-2xl mt-5 pb-5">Your chats </div>

{_userChats.map((users, index) => (
<div key={index} className = "h-auto flex flex-wrap justify-center w-[100%] bg-black border-b-slate-700 border-b-2">
<div className = "inline-block text-white p-10 text-center hover:bg-slate-800 transition-all rounded-md cursor-pointer" onClick = {()=>returnChat(users) && setChatShowedWith(users)}>{users}</div>
<button className = "inline-block bg-red-500 h-auto w-auto mt-10 px-0.5 mb-14 rounded-sm hover:bg-red-700" onClick = {() => deleteChatWithUser(users)}>-</button>
</div>
))}


</div>
</>}
</> 
: 
<>
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
</>:  <> 
{/* False of the: isConnected? */}
<div className = "bg-black   h-[800px]">

<div className = "flex flex-wrap  border-b-slate-400 border-b-2 justify-between">

<div className = "flex flex-wrap justify-center py-6">
<div className = "photoLogo inline-block"></div>

<div className = "px-2 inline-block text-white text-center text-[40px] hover:bg-slate-700 transition-all rounded-md cursor-pointer">MessBlock</div>

<div className = "inline-block text-green-500 text-[33px] mt-2.5">Chats</div>
</div>
<Link href = "/groupsPage">
<div className = "text-white text-[25px] m-7 p-3 hover:bg-slate-700 transition-all rounded-md cursor-pointer">Groups </div>
</Link>
</div>

<div className = "text-center text-white mt-32">To be able to see your chats you need to connect your Web3 wallet</div>

<div className = "flex flex-wrap justify-center mt-10">
<div className = "h-auto w-auto border-2 border-white rounded-lg">
<div className = "text-white text-2xl p-10 hover:bg-slate-700 transition-all rounded-md cursor-pointer" onClick ={() => connectWallet()}>Connect Wallet</div>
</div>
</div>

</div>
{/* Finish of the: isConnected? */}
</>}
</>

}
  
</>
)
}

export default Chats; 
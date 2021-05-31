
const socket=io()

//elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML

//options
const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true})


//server(emit)->client(receive)==acknowledgement==>server
//client(emit)->server(receive)--acknowledgement-->client

// socket.on('countUpdated',(count)=>{
//     console.log('count has been updated',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked')
//     socket.emit('increment')
// })

const autoscroll=()=>{
//new message element
const $newMessage=$messages.lastElementChild

//height   of new message
const newMessageStyles=getComputedStyle($newMessage)

const newMessageMargin=parseInt(newMessageStyles.marginBottom)
const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
//console.log(newMessageMargin)

//visible height
const visibleHeight=$messages.offsetHeight

//height of messages container
const containerHeight=$messages.scrollHeight

//how far have i scroll
const scrollOffset=$messages.scrollTop+visibleHeight
if(containerHeight-newMessageHeight<=scrollOffset){
  $messages.scrollTop=$messages.scrollHeight
}
}
socket.on('message',(message)=>{
    console.log(message)
const html=Mustache.render(messageTemplate,{
  username:message.username,
  message:message.text,
  //createdAt:message.createdAt
createdAt:moment(message.createdAt).format('h:mm a')//DMMM,YYYY
})
$messages.insertAdjacentHTML('beforeend',html)
autoscroll()
  })

  // socket.on('locationMessage',(url)=>{
    socket.on('locationMessage',(message)=>{
  // console.log(url)
console.log(message)
  const html=Mustache.render(locationMessageTemplate,{
    username:message.username,
      url:message.url,
      createdAt:moment(message.createdAt).format('h:mm a')//DMMM,YYYY
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
  })

  socket.on('roomData',({room,users})=>{
    // console.log(room)
    // console.log(users)
    const html=Mustache.render(sidebartemplate,{
      room,
      users
    })
    document.querySelector('#sidebar').innerHTML=html
  })

  $messageForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        //disable
        $messageFormButton.setAttribute('disabled','disabled')
//const message=document.querySelector('input').value
const message=e.target.elements.message.value

// socket.emit('sendMessage',message,(message)=>{
//   console.log('The message was delivered!',message)
// })
socket.emit('sendMessage',message,(error)=>{
//enable
$messageFormButton.removeAttribute('disabled')
$messageFormInput.value=''
$messageFormInput.focus()
  if(error){
  return console.log(error)
} console.log('Message Delivered')
})
    })

$sendLocationButton.addEventListener('click',()=>{
  if(!navigator.geolocation){
      return alert('Geolocation is not supported by the browser')
  }
//disable
$sendLocationButton.setAttribute('disabled','disabled')
  navigator.geolocation.getCurrentPosition((position)=>{
//console.log(position)
socket.emit('sendLocation',{
    latitude:position.coords.latitude,
    longitude:position.coords.longitude
},()=>{
  //enable
 $sendLocationButton.removeAttribute('disabled')
  console.log('Location Shared!')
})
  })
})
socket.emit('join',{username,room},(error)=>{
  if(error){
    alert(error)
    location.href='/'//send to root of site
  }
})
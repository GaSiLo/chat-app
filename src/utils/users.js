const users=[]
const addUser=({id,username,room})=>{
//clean data
    username=username.trim().toLowerCase()
room=room.trim().toLowerCase()
//validate
if(!username||!room){
return{
    error:'Username and room required'
}
}
//check for existing user
const existingUser=users.find((user)=>{
    return user.room===room && user.username===username
})
//validate username
if(existingUser){
    return{
        error:'Username is in use'
    }
}
//store user
const user={id,username,room}
users.push(user)
return {user}
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
if(index!==-1){
 return users.splice(index,1)[0]   
}
}

const getUser=(id)=>{
   return users.find((user)=>user.id===id) 
}

const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
}
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
// addUser({
//     id:24,
//     username:'Sad   ',
//     room:'north'
// })
// // console.log(users)
//  addUser({
//      id:42,
//      username:'dasd',
//      room:'north'
//  })
//  addUser({
//     id:32,
//     username:'Sad',
//     room:'south'
// })
// // // console.log(res)
// // const removedUser=removeUser(24)
// // console.log(removedUser)
// // console.log(users)
// const user=getUser(421)
// console.log(user)

// const userList=getUsersInRoom('sourth') 
// console.log(userList)
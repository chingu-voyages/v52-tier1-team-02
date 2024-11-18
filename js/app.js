/* Create database for store user data */
let requ = indexedDB.open('userDataStored',1);
requ.onupgradeneeded = function(event){
    let dataInstance = event.target.result;
    /* create object store data with unique phone path */
    let storeDat = dataInstance.createObjectStore('users',path)
}

requ.onsuccess = function(event){
    let dataInstance = event.target.result;
    //create functio to add user 
    function addUser(user){
        let transaction = dataInstance.transaction(['users'],'readwrite')
        let objectStore = transaction.objectStore('users')
        let requ = objectStore.add(user)//relate with phone

        requ.onsuccess= function(){
            console.log('user added',user)
        }
        requ.onerror = function(){
            console.error('Error addding user',requ.error)
        }
    
    }
    console.log(addUser(storeData()))

}

/* create function store data of user for first time */
function storeData(){
    /* store user's data  in variable  */
    let namee =document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    let address = document.getElementById('address').value;
    /*create object to store data user in it*/
    let user = {
        name: namee,
        phone: phone,
        address: address,
    
    }
    console.log(user.name);
    console.log(user.phone);
    let senddata = user ;
    console.log(senddata);
    return senddata

}
let submitt = document.querySelector('#submit');
submitt.addEventListener('click',(e)=>{
    e.preventDefault();
    storeData();
})

console.log(requ)






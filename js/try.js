const formSec = document.querySelector('.form');
const okMessage = document.getElementById('alertMessage')
const okBtn = document.getElementById('ok')
const accountPage = document.querySelector('.account')
//hide this section and appear on complete and success visit request
okMessage.style.display = 'none';//alert message confirm request is done
accountPage.style.display = 'none'
//variable to help apperaing accountpage after alert ok message
let ook =false;
/**TODO: svariable for storage*/
let db;
//let noo = 1
/* TODO: Check if indexedDb is avaliable on your browser*/
const indexedDB = window.indexedDB ||
window.mozIndexedDB ||
window.webkitIndexedDB ||
window.msIndexedDB ||
window.shimIndexedDB;

/** TODO: check if indexedDB on browser /work or not work */
if  (!indexedDB){
    console.log("Indexed is not on your browser");
}
else{
    console.log('db is on your browser');
   // document.querySelector('.alert').innerHTML= 'db is on your browser'
}


/* TODO: create database in browser to store data from from */
const request = indexedDB.open('people_Data',1);

/* TODO: inform us there is error during request */
request.onerror = function (event){
    console.error('error is occured');
    console.error(event)
};

/* TODO: handle shape of data that will be store and how to work with in future */
request.onupgradeneeded = function (event){
    db = event.target.result;
    /** ToDO: storage by phone */
    const store = db.createObjectStore('peopleData', {keyPath: 'phone'});
    /* organise data such as table  */
    store.createIndex('name','name',{unique: false});
    store.createIndex('address','address',{unique: false});
    store.createIndex('phone','phone',{unique: false});
    store.createIndex('status','status',{unique: false});
    store.createIndex('mail','mail',{unique: false});
    store.createIndex('slottime','slottime',{unique: false});
    //store.createIndex('allData',['name','address','phone','mail','status'],{unique: false});
}


/* create function store data of user for first time */
function storeData(){
    /* store user's data  in variable  */
    let namee =document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    let address = document.getElementById('address').value;
    let slottime = document.getElementById('time').value;
    let mail = document.getElementById('mail').value;
    /*create object to store data user in it*/
    if(namee && phone && address){
        return {
            name: namee,
            phone: phone,
            address: address,
            status: 'pending',
            mail: mail,
            slottime: slottime,
        }
    }else{
        console.log('please fill in all field');
    }

}


/** TODO: put event of from insid function to ensure data store after database is created */
request.onsuccess = function (event){
    db =event.target.result;
    let submitt = document.querySelector('form');
    submitt.addEventListener('submit',(e)=>{
        e.preventDefault();
   
        let user =storeData();
        console.log(user)
        //check data from user filled then store data in 'peopleData'
        if(user){
            const transactionn = db.transaction('peopleData','readwrite');
            const store = transactionn.objectStore('peopleData');
            // store data of from in store
            const query = store.put(user);
            console.log(query)
            query.onsuccess= function (){
                console.log('final query', query.result)//by phone
                const statusIndex = store.index('status');
                const phoneIndex = store.index('phone');
                const mailIndex = store.index('mail');
                const addressIndex = store.index('address');
                const nameIndex = store.index('name');
                const timeIndex = store.index('slottime');
                //const allDataIndex = store.index('allData')
           
          
          
               const statusQuery = statusIndex.getAll(['pending']);//return client with done status
               statusQuery.onsuccess = function (){
                   console.log('status of user', statusQuery.result)
               }
              /* const allDataQuery = allDataIndex.getAll()// bring all data for all user
               allDataQuery.onsuccess = function (){
                   console.log('All data of user', allDataQuery.result)
               }*/
            }
            
        //after success store data database is closed
           transactionn.oncomplete = function (){
                  console.log('transaction is completed',user.name)
                  messageAlert()
                //db.close()
            }   

        //tell if error is happened and not completed
            transactionn.onerror = function (event){
                console.error('transactionerror',event)
            }
            document.querySelector('#kk').value=user.name;

        }   
    })
}


// function show message to confirm request is done 
function messageAlert(){
    okMessage.style.display= 'block';
    okBtn.addEventListener('click',()=>{
        okMessage.style.display = 'none';
        formSec.style.display = 'none';
        ook = true;
      // call function with input ook = true   
        displayAccount(ook);
        console.log('infun',ook)

    })
}


 // function display stored data in client'page after submit form 
function displayAccount(ok){
    console.log('iiiiiin',ok)
    const phoneInput = document.querySelector('#phone').value;
     
    /*
    make page of from convert to account page for client 
    contains data of name/phone/address/email/prefered visit time
    1-delete/disappear form by add class for hidden
    2- visible for page account of user
    by add class for visibility
    */
   //if ook variable === true account page appear and form disappear
   if(ok){
       accountPage.style.display = 'block'
       let name = document.querySelector('.clientName');
       let phone = document.querySelector('.clientphone');
       let mail = document.querySelector('.clientmail');
       let address = document.querySelector('.clientaddress');
       let slotTime = document.querySelector('.clienttime');
       let status = document.querySelector('.clientstatus');
       
       //open objectstore and get user by phone in input in store
       const objectStore = db.transaction('peopleData','readonly').objectStore('peopleData');
       const request = objectStore.get(phoneInput);
       request.onsuccess= function(event){
        const userData = event.target.result;
        if(userData){
            phone.textContent = userData.phone;
            status.textContent = userData.status;
            name.textContent = userData.name;
            address.textContent = userData.address;
            mail.textContent =userData.mail;
            slotTime.textContent =userData.slottime;
            document.querySelector('.welcome').textContent ='Welcome ' + userData.name

        }
       }
   }  
   
}
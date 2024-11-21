
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
    document.querySelector('.alert').innerHTML= 'db is on your browser'
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
    store.createIndex('name_client',['name'],{unique: false});
    store.createIndex('address_client',['address'],{unique: false});
    store.createIndex('phone',['phone'],{unique: false});
    store.createIndex('status',['status'],{unique: false});
    store.createIndex('mail',['mail'],{unique: false});
    store.createIndex('allData',['name','address','phone','mail','status'],{unique: false});
    //noo = noo + 1;
}

/* TODO: Add data and query to find it */


/* create function store data of user for first time */
function storeData(){
    /* store user's data  in variable  */
    let namee =document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    let address = document.getElementById('address').value;
    /*create object to store data user in it*/
    if(namee && phone && address){
        return {
            name: namee,
            phone: phone,
            address: address,
            status: 'pending',
            mail: '@'
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
                const addressIndex = store.index('address_client');
                const nameIndex = store.index('name_client');
                const allDataIndex = store.index('allData')
           
          
          
               const statusQuery = statusIndex.getAll(['pending']);//return client with done status
               statusQuery.onsuccess = function (){
                   console.log('status of user', statusQuery.result)
               }
               const allDataQuery = allDataIndex.getAll()// bring all data for all user
               allDataQuery.onsuccess = function (){
                   console.log('All data of user', allDataQuery.result)
               }
            }
            
        //after success store data database is closed
           transactionn.oncomplete = function (){
                  console.log('transaction is completed',user.name)
                  document.querySelector('#phone').value=user.phone;
                  document.querySelector('#name').value='';
                 // document.querySelector('.alert').value='';
                 // document.querySelector('#phone').value='';
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
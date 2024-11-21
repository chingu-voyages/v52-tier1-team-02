
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

let submitt = document.querySelector('form');
submitt.addEventListener('submit',(e)=>{
    e.preventDefault();
   
    let user =storeData();
    console.log(user)
    const transactionn = db.transaction('peopleData','readwrite');
    const store = transactionn.objectStore('peopleData');
    const query = store.put(user);
    console.log(query)
   
    const statusIndex = store.index('status');
    const phoneIndex = store.index('phone');
    const mailIndex = store.index('mail');
    const addressIndex = store.index('address_client');
    const nameIndex = store.index('name_client');
    const allDataIndex = store.index('allData')
    
   //const query = store.put(user);
    //console.log(query)
   
    const statusQuery = statusIndex.getAll(['pending']);//return client with done status
    statusQuery.onsuccess = function (){
        console.log('status of user', statusQuery.result)
    }
    const allDataQuery = allDataIndex.getAll()// bring all data for all user
    allDataQuery.onsuccess = function (){
        console.log('All data of user', allDataQuery.result)
    }
   /* //add data from input 
    store.put({phone : 5656565,
        name :'hh',
        address : '23st cklklk',
        status : 'pending',
        mail: '@'
    })
    store.put({phone : 5555555,
        name :'kkkk',
        address : '55st 5ppppp',
        status : 'pending',
        mail: '@'
})
    store.put({phone : 2222255,
        name :'mmmmmm',
        address : '55st mmmp',
        status : 'done',
        mail: '@'
})*/
    


    // store data fro form
    //store.put() 
    //store.put(storeData())
    
    /** TODO: Query for data that stored *//*
    const phoneQuery = store.get(55555)// bring data for certain phone
    const statusQuery = statusIndex.getAll(['pending']);//return client with done status
    const addressQuery = addressIndex.get(['kkk'])// return user with specific address
    const allDataQuery = allDataIndex.getAll()// bring all data for all user
 // if query is succeeded
    phoneQuery.onsuccess = function (){
        console.log('phoneQuery of user ', phoneQuery.result);
    }
    statusQuery.onsuccess = function (){
        console.log('status of user', statusQuery.result)
    }
    addressQuery.onsuccess = function (){
        console.log('address of user', addressQuery.result)
    }
    allDataQuery.onsuccess = function (){
        console.log('All data of user', allDataQuery.result)
    }*/

    query.onsuccess= function (){
        console.log('final query', query.result)//by phone
    
    }
    

   transactionn.oncomplete = function (){
        db.close()
    }

    
})

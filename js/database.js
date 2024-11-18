/* TODO: Check if indexedDb is avaliable on your browser*/
const indexedDB = window.indexedDB ||
window.mozIndexedDB ||
window.webkitIndexedDB ||
window.msIndexedDB ||
window.shimIndexedDB;

if  (!indexedDB){
    console.log("Indexed is not on your browser");
}
else{
    console.log('db is on your browser');
    document.querySelector('.alert').innerHTML= 'db is on your browser'
}
/* TODO: create database in browser to store data from from */
const request = indexedDB.open('visitRequest',1);

/* TODO: inform us there is error during request */
request.onerror = function (event){
    console.error('error is occured');
    console.error(event)
};

/* TODO: handle shape of data that will be store and how to work with in future */
request.onupgradeneeded = function (){
    const db = request.result;
    const store = db.createObjectStore('peopleData', {keyPath: 'phone'});
    store.createIndex('name_client',['name'],{unique: false});
    store.createIndex('address_client',['address'],{unique: false});
    store.createIndex('phone',['phone'],{unique: false});
    store.createIndex('status',['status'],{unique: false});
    store.createIndex('mail',['mail'],{unique: false});
    store.createIndex('allData',['name','address','phone','mail','status'],{unique: false});
}

/* TODO: Add data and query to find it */
request.onsuccess = function (){
    console.log('database opened successfully');
    
    const db = request.result;

    const transactionn = db.transaction('peopleData','readwrite');
    const store = transactionn.objectStore('peopleData');
    const statusIndex = store.index('status');
    const phoneIndex = store.index('phone');
    const mailIndex = store.index('mail');
    const addressIndex = store.index('address_client');
    const nameIndex = store.index('name_client');
    const allDataIndex = store.index('allData')

    //add data from input 
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
})
    


    // store data fro form
    //store.put() 
    //store.put(storeData())
    
    /** TODO: Query for data that stored */
    const phoneQuery = store.get(5656565)// bring data for certain phone
    const statusQuery = statusIndex.getAll(['done']);//return client with done status
    const addressQuery = addressIndex.get(['23st cklklk'])// return user with specific address
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
    }

    transactionn.oncomplete = function (){
        db.close()
    }

    
}

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

let submitt = document.querySelector('#submit');
u = submitt.addEventListener('click',(e)=>{
    e.preventDefault();
    return storeData();
    
})

 
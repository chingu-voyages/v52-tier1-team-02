const userAdmin = document.querySelector('.landpage')
//user interface
const formUser = document.querySelector('#formUser')
const formSec = document.querySelector('.form');
const citzenBtn = document.querySelector('#citzien');
const okMessage = document.getElementById('alertMessage')
const okBtn = document.getElementById('ok')
const accountPage = document.querySelector('.account');
//admin interface
const formAdminn = document.querySelector('#formAdmin');
const adminBtn = document.querySelector('#admin');
const yesAccessStatus = document.querySelector('#yesAccessStatus');
const noAccessStatus = document.querySelector('#noAccessStatus');

//hide this section and appear on complete and success visit request
okMessage.style.display = 'none';//alert message confirm request is done
accountPage.style.display = 'none'

//hide confirmation message for yes/no access for admin
yesAccessStatus.style.display = 'none';
noAccessStatus.style.display = 'none';

/* Add event when user choose as admin or citzien form*/
document.addEventListener('click',(e)=>{
    let btn = e.target;
    if(btn.id === 'citzien'){
        console.log('citcien')
        formUser.style.display= 'block'
        formAdminn.style.display= 'none'
    }
    if(btn.id === 'admin'){
        formUser.style.display='none';
        formAdminn.style.display= 'block'
    }  
})


/** get mail and password from input and store it in object */
function admin(){
    let adminInputMail = document.getElementById('mailAdmin').value;
    let passAdmin = document.getElementById('passAdmin').value;
    console.log(passAdmin)
    if(passAdmin && adminInputMail){
       console.log('yes admin')
       document.querySelector('#alermAdmin').innerHTML=''

        return  {
            mail: adminInputMail,
            password: passAdmin,
        }

    }else{
        console.log('noadmin',adminInputMail)
        document.querySelector('#alermAdmin').innerHTML='Please type both mail and password'
    }
}




//variable to help apperaing accountpage after alert ok message
let ook =false;

/**TODO: svariable for storage*/
let db;

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


// saved emails and passwords for login of admin
let adminAccess = [ 
    {
        mail: 'ghg@hotmail.com',
        password: 1144
    },
    {
        mail: 'jjj@hotmail.com',
        password: 5465

    },
    {
        mail: 'ppp@hotmail.com',
        password: 7961
    }
]

/** TODO: store emails of admin / citizen data in indexedDB */
/* TODO: handle shape of data that will be store and how to work with in future */
request.onupgradeneeded = function (event){
    db = event.target.result;
    /** ToDO: storage by phone for citizen */
    const store = db.createObjectStore('peopleData', {keyPath: 'phone'});
    /* organise data such as table  */
    store.createIndex('name','name',{unique: false});
    store.createIndex('address','address',{unique: false});
    store.createIndex('phone','phone',{unique: true});
    store.createIndex('status','status',{unique: false});
    store.createIndex('mail','mail',{unique: true});
    store.createIndex('slottime','slottime',{unique: false});
    //store.createIndex('allData',['name','address','phone','mail','status'],{unique: false});
     
    // store for mails of admin
    /** create admin object in database that opened to store varfied mail to accesss to user data*/
    const adminStore = db.createObjectStore('admin', {keyPath: 'mail'});
    /** create index for data */
    adminStore.createIndex('mail','mail',{unique: true})//doesn't allow add two same mail
    adminStore.createIndex('password','password',{unique: true})
    //when admin objectstore in database created we will have aleardy emails 
    //for admin was stored in data base 
    adminStore.transaction.oncomplete = function (event){
        const store = db.transaction('admin','readwrite').objectStore('admin');
        adminAccess.forEach((customer)=>{
            store.add(customer)
        })
    }
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
    if(namee && phone && address && mail){
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


    /* TODO: send form of admin*/
/* check this mail allowed used as admin */
    let adminFormSubmit = document.querySelector('#adminFormSubmit')
    adminFormSubmit.addEventListener('click',(e)=>{
        e.preventDefault();
        let admincheckin = admin()
        const transaction = db.transaction('admin','readonly');
        const store = transaction.objectStore('admin')
        store.openCursor().onsuccess = (event)=>{
            const cursor = event.target.result;
            if(cursor){
                let mail = cursor.value.mail
               // console.log(mail);
                let password = cursor.value.password
                console.log(typeof password)
                console.log(typeof admincheckin.password)
                //console.log(password)
                //console.log(`key2 is ${cursor.key} is ${password},${mail}`);
                if(admincheckin.mail === mail && Number(admincheckin.password) === password){
                    console.log('you have access')
                    yesAccessStatus.style.display = 'block';
                    document.getElementById('yesAccess').innerHTML =`Welcome ${mail} you have access to client data`

                    return; //to stop loop when find rightmail and password
                    
                }
                cursor.continue()//continue untill check all data match with input or not

                
            } else {
                console.log('No more data')
            }
        }
        

    })
    //done by admin when log in 
    let displayDataBy = document.querySelector('#yesAccessBtn');
    displayDataBy.addEventListener('click',()=>{
        const transaction = db.transaction('peopleData','readwrite');
        const store = transaction.objectStore('peopleData');
        createTable()

        store.openCursor().onsuccess= (event)=>{
            const cursor = event.target.result;
            if(cursor){
                let table = document.querySelector('#table')
                let childRow = document.createElement('tr');
                let nameuserTable = document.createElement('td');
                let mailuserTable = document.createElement('td');
                let phoneuserTable = document.createElement('td');
                let addressuserTable = document.createElement('td');
                let perferredtimeuserTable = document.createElement('td');
                let statususerTable = document.createElement('td');
                table.appendChild(childRow);
                childRow.appendChild(nameuserTable).innerHTML= cursor.value.name;
                childRow.appendChild(mailuserTable).innerHTML= cursor.value.mail;
                childRow.appendChild(phoneuserTable).innerHTML= cursor.value.phone;
                childRow.appendChild(addressuserTable).innerHTML= cursor.value.address;
                childRow.appendChild(perferredtimeuserTable).innerHTML= cursor.value.slottime;
                childRow.appendChild(statususerTable).innerHTML= cursor.value.status ;
                cursor.continue();//to go next data
            }else {
                console.log('No More data');
            }
        }
    })
   

}

 //retrieve data for admin
    /* create table will contain on user data stored in indexedDB */
    function createTable(){
        let tableSection = document.querySelector('.tablesec');
        let table = document.querySelector('#table')
        let row = document.createElement('tr');
        let nameTitle = document.createElement('th')
        let mailTitle = document.createElement('th')
        let phoneTitle = document.createElement('th')
        let addressTitle = document.createElement('th')
        let perferedslotTitle = document.createElement('th')
        let statusTitle = document.createElement('th');
        row.appendChild(nameTitle).innerHTML="Name"
        row.appendChild(mailTitle).innerHTML='E-mail'
        row.appendChild(phoneTitle).innerHTML = 'Phone'
        row.appendChild(addressTitle).innerHTML = 'address';
        row.appendChild(perferedslotTitle).innerHTML = 'Perferred timeslot'
        row.appendChild(statusTitle).innerHTML = 'visit'
        table.appendChild(row);
        tableSection.appendChild(table)
       console.log('table')
       
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
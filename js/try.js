// in header welcome word with name of account of citizen and notification
let nav = document.querySelector('nav');
let welcome = document.querySelector('.welcome');
let acceptNotify = document.querySelector('#acceptNotify');       
welcome.style.display = 'none';
acceptNotify.style.display = 'none';

//about in nav and section
let aboutBtn = document.getElementById('aboutBtn');
let about = document.getElementById('about');
let paraAbout = document.getElementById('paraAbout');
about.style.display = 'none';




//first page with admin button and citizen button 
let userAdmin = document.querySelector('.landpage');
const citzenBtn = document.querySelector('#citzien');//button
const adminBtn = document.querySelector('#admin');//button
const myAccount = document.querySelector('#myAccount');//button

//user interface
const formUser = document.querySelector('#formUser')//section of user form
const formSec = document.querySelector('.form');//section of user form
let wrongAddress = document.getElementById('wrongAddress'); // appear for wrongaddress or incomplete form blank
const okMessage = document.getElementById('alertMessage')// appeared after submit form to ensure request sent
const okBtn = document.getElementById('ok')//ok btn in alert message
const accountPage = document.querySelector('.account');// section of citizen page contains all data after fiiling form
wrongAddress.style.display = 'none'  //make message disappear when only on submit incomplete for citizen    


//user account section
let myVisitAccouSec = document.querySelector('.myVisitAccouSec');
let myaccVisitform = document.querySelector('.myaccVisitform');
let myacco = document.querySelector('#myacco');
let noaccount = document.querySelector('.noaccount');
myVisitAccouSec.style.display = 'none';


//admin interface
const adminformsec = document.querySelector('#adminformsec');
const formAdminn = document.querySelector('#formAdmin');
const yesAccessStatus = document.querySelector('#yesAccessStatus');
const noAccessStatus = document.querySelector('#noAccessStatus');
adminformsec.style.display = 'none';

//table section 
let tableSection = document.querySelector('.tablesec');
let printTable = document.querySelector('.printTable');//butttonto print table
//button to back to homepage from table page
const home = document.querySelector('.home');
//home.style.display = 'none';
//printTable.style.display = 'none';
tableSection.style.display = 'none';
 //back to homepage user/admin from table page
home.addEventListener('click',()=>{
    document.querySelector('#table').visibility = 'hidden'
    tableSection.style.display = 'none';
    //home.style.display ='none';
    userAdmin.style.display = 'block';
})


//print section 
let printSec = document.querySelector('#printSec');
let printD = document.querySelector('.printD');
//hide print and back table buttons
const printBtn1 = document.querySelector('.printBtn1');
printSec.style.display = 'none';
const backtable = document.querySelector('.backtable');
backtable.style.display = 'none';


//hide notification icon for admin
let notify = document.querySelector('#notification');
notify.style.display = 'none'
//hide this section and appear on complete and success visit request
okMessage.style.display = 'none';//alert message confirm request is done
accountPage.style.display = 'none'

//hide confirmation message for yes/no access for admin
yesAccessStatus.style.display = 'none';
noAccessStatus.style.display = 'none';


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

//when citizen recieve notification has visit
document.addEventListener('click',(e)=>{
    let visitstat = document.querySelector('.clientstatus').textContent;
    if(e.target.id === 'notification' || e.target.id === 'acceptNotify'){
        if(visitstat !== 'pending'){
            alert('You have visit check time of visit in your request!');
            acceptNotify.style.display = 'none';    
        }
    }else{
        return; 
    }
})

/* TODo : appear and disappear about us section */
aboutBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    if(about.style.display === 'none'){
        about.style.display = 'block';
        formSec.style.display = 'none';
        myVisitAccouSec.style.display = 'none';
        adminformsec.style.display = 'none';
        about.scrollIntoView({behavior: 'smooth', block: 'start'});        
    }else{
        about.style.display = 'none';
        
    }
})



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
        mail: 'admin@hotmail.com',
        password: 5465
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
        adminAccess.forEach((admin)=>{
            store.add(admin)
        })
    }
}


//function hide all citizen element
function hideCitizen(){
    formUser.style.display= 'none';
    okMessage.style.display= 'none';
    accountPage.style.display = 'none';
    document.querySelector('.noaccount').textContent = "";
    about.style.display = 'none';

}

//function hide all citizen element
function hideCountCitizen(){
    okMessage.style.display= 'none';
    accountPage.style.display= 'none';
    myVisitAccouSec.style.display = 'none'
    about.style.display = 'none';

}
//function hide all admin element
function hideAdmin(){
    adminformsec.style.display= 'none';
    yesAccessStatus.style.display= 'none';
    noAccessStatus.style.display= 'none';
    about.style.display = 'none';

    //tableSection.style.display= 'none';    
}

 
//myAccount
/* Add event when user choose as admin or citzien form or his/her account*/
document.addEventListener('click',(e)=>{
    let btn = e.target;
    if(btn.id === 'citzien'){//make reqyest
        console.log('citcien');
        formUser.style.display= 'block';
        formUser.scrollIntoView({behavior: 'smooth', block: 'center'})
        tableSection.style.display = 'none';
        wrongAddress.style.display = 'none'
        hideAdmin();
        hideCountCitizen();
    }
    if(btn.id === 'myAccount'){//have already request account
        console.log('myAccount');
        myVisitAccouSec.style.display= 'block';
        noaccount.style.display = 'none';
        tableSection.style.display = 'none';
        hideAdmin();
        hideCitizen();
        myVisitAccouSec.scrollIntoView({behavior: 'smooth', block: 'center'})

    }
   
    if(btn.id === 'admin'){//admin
        console.log('admmm')
        adminformsec.style.display= 'block';
        formAdminn.style.display= 'block';
        tableSection.style.display = 'none';
        hideCitizen();
        hideCountCitizen();
        adminformsec.scrollIntoView({behavior: 'smooth', block: 'start'})

    }  
})


/** TODO: put event of from insid function to ensure data store after database is created */
request.onsuccess = function  (event){
    //reference of databas that opened/created
    db =event.target.result;
    //for citizen that has lready visit request and want to check it
    myaccVisitform.addEventListener('submit',(e)=>{
        e.preventDefault();
        window.scrollTo(0,0)//start begain of page
        let phoninput = myacco.value;//phone input to get data related with phone
            //make transaction to able work with stored data in indexedDB in objectstore called peopleData
            const store = db.transaction('peopleData','readonly').objectStore('peopleData');
            //find data by phone
            const request = store.get(phoninput);
            console.log(request)
            request.onsuccess= function(event){
                console.log('success')
                let userData = event.target.result;
                console.log('data',userData)
    //element that we want to fill it by data from indexedDB by phone            
                let name = document.querySelector('.clientName');
                let phone = document.querySelector('.clientphone');
                let mail = document.querySelector('.clientmail');
                let address = document.querySelector('.clientaddress');
                let slotTime = document.querySelector('.clienttime');
                let status = document.querySelector('.clientstatus');
               //to make accountpage of citizen
               let noaccount = document.querySelector('.noaccount');
               if(userData){
                   myVisitAccouSec.style.display = 'none';
                   userAdmin.style.display = 'none';
                   accountPage.style.display = 'block'
                   phone.textContent = userData.phone;
                   status.textContent = userData.status;
                   name.textContent = userData.name;
                   address.textContent = userData.address;
                   mail.textContent = userData.mail;
                   slotTime.textContent = userData.slottime;
                   welcome.style.display = 'block';
                   acceptNotify.style.display = 'block';  
                   //nav.style.display = 'block';
                   welcome.style.display = 'block';     

                   notify.style.display = 'block';
                   welcome.textContent ='Welcome ' + userData.name;//welcome message after data of citzien stored
                   if(status.textContent !== 'pending'){
                       //will style it in css notificate
                       acceptNotify.style.visibility = 'visible';
                       //acceptNotify.classList.add('notificat');//give notification for citizen has visit time
                       document.querySelector('#changeStatus').style.color= 'red';//font will be red in citizen account when give time for visit             
                    }else{
                       document.querySelector('#changeStatus').style.color= 'black';//font will be red in citizen account when give time for visit             
                       acceptNotify.style.visibility = 'hidden';
                    }
            }else{
                noaccount.style.display = 'block';
                noaccount.textContent = 'This number has not visit request';
            }           
        } 

    })

    //for new citizen visit request to submit citizen form visit request
    let submitt = document.querySelector('form');
    submitt.addEventListener('submit',async(e)=>{
        e.preventDefault();  
        //call function that return  citzin data store in object 
        let user =await storeData();
        console.log(user)
        //check data from user filled then store data in 'peopleData' 
        if(user){
            const transactionn = db.transaction('peopleData','readwrite');
            const store = transactionn.objectStore('peopleData');
            // add data of citizen in indexedDB in peopleData
            const query = store.put(user);
            console.log(query)
            //when adding data in indexedDB successed then put each data in index
            query.onsuccess= function (){
                console.log('final query', query.result)//by phone
                const statusIndex = store.index('status');
                const phoneIndex = store.index('phone');
                const mailIndex = store.index('mail');
                const addressIndex = store.index('address');
                const nameIndex = store.index('name');
                const timeIndex = store.index('slottime');
                //const allDataIndex = store.index('allData')
               /*
               const statusQuery = statusIndex.getAll(['pending']);//return client with done status
               statusQuery.onsuccess = function (){
                   console.log('status of user', statusQuery.result)
               }*/
              /* const allDataQuery = allDataIndex.getAll()// bring all data for all user
               allDataQuery.onsuccess = function (){
                   console.log('All data of user', allDataQuery.result)
               }*/
            }
            
            
        //after success store data database is closed
           transactionn.oncomplete = function (){
                  console.log('transaction is completed',user.name)
                  messageAlert(); 
            }   

        //tell if error is happened and not completed
            transactionn.onerror = function (event){
                console.error('transactionerror',event)
                //when using the same e-mail to make request 
                wrongAddress.style.display = 'block';
                wrongAddress.textContent= 'There is request with the same E-mail'
            }

        }  
 
    })


    /* TODO: send form of admin to log in*/
    /* check this mail allowed used as admin */
    let adminFormSubmit = document.querySelector('#adminFormSubmit')
    adminFormSubmit.addEventListener('click',(e)=>{
        e.preventDefault();
        let table = document.querySelector('#table');
        table.innerHTML = ''//to delete old table each time admin login
        let admincheckin = admin();
        let miallnput = document.querySelector('#mailAdmin').value;
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
                    document.getElementById('yesAccess').textContent =`Welcome ${mail} you have access to client data`
                    //to stop loop when find rightmail and password  in case there are many data to loop over it
                   // return; 
                    
                }else{//in case wrong mail od admin or any user but mail in admin login will get have not access
                    noAccessStatus.style.display = 'block';
                    console.log('no access')
                    document.querySelector('#noAccess').textContent =`This ${miallnput}  has not access to client data`;
                    document.querySelector('#noAccessBtn').addEventListener('click',()=>{
                        noAccessStatus.style.display = 'none';
                    })

                }
                cursor.continue()//continue untill check all data match with input or not

                
            } else {
                console.log('No more data')
            }
        }
    })


    
}

//Done by admin when log in and click on button of welcome confirmation access message
//Create table to display data of citzien stored in indexedDB.
let displayDataBy = document.querySelector('#yesAccessBtn');//Button in section confirmation message appered after successing login of admin
displayDataBy.addEventListener('click',tableOfData);


 //back to table of data all citizena
 backtable.addEventListener('click',(e)=>{
   //e.preventDefault();
    //document.querySelector('#table').textContent = '';
    printSec.innerHTML = '';
    printSec.style.display = 'none';
    backtable.style.display = 'none';
    tableSection.style.display = 'block';
    tableOfData();
   })  


// for admin
 //retrieve data for admin
    /* create table will contain on user data that were stored in indexedDB  */
function createTable(){
    tableSection.style.display = 'block';
    let tablee = document.querySelector('#table');
    tablee.innerHTML= '';//clear table each time formed
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
    tablee.appendChild(row);
   console.log('table')
   
}

   
//retrieve data of citizen in table by admin         
function tableOfData(){
    tableSection.style.display = 'none';
    let sortTable = document.querySelector('.sortTableBtn');
    let tableLoading = document.querySelector('.tableLoading');
    tableLoading.style.display = 'block';
    //*sortTable.style.display = 'none';
    tableLoading.textContent = 'Table is loading, please waiting for seconds';
    //Transaction to able work with stored data in indexedDB
    const transaction = db.transaction('peopleData','readwrite');
    const store = transaction.objectStore('peopleData');
    hideAdmin();
    userAdmin.style.display= 'none';
    home.style.display= 'block'//button to back to hemepage 
    //tableSection.style.display= 'block';
    //table.style.display = "block";
    //calling function that create skeleton of table that contains on columns for data
    //and will be filled from indexedDB after open cursor
    // table.textContent = "";
    //loop over stored citizen data in indexedDB and added to table 
    createTable();
    store.openCursor().onsuccess= async (event)=>{
        tableSection.style.display= 'none';
        let tablle = document.querySelector('#table');
        const cursor = event.target.result;
        let childRow = document.createElement('tr');
        let nameuserTable = document.createElement('td');
        let mailuserTable = document.createElement('td');
        let phoneuserTable = document.createElement('td');
        let addressuserTable = document.createElement('td');
        let perferredtimeuserTable = document.createElement('td');
        let statususerTable = document.createElement('td');
        let editBtn = document.createElement('button')
        //add btton to edit status of visit
        editBtn.classList.add('edit')
        if(cursor){               
            editBtn.setAttribute('id',cursor.value.phone)
            childRow.appendChild(nameuserTable).innerHTML= cursor.value.name;
            childRow.appendChild(mailuserTable).innerHTML= cursor.value.mail;
            childRow.appendChild(phoneuserTable).innerHTML= cursor.value.phone;
            childRow.appendChild(addressuserTable).innerHTML= cursor.value.address;
            childRow.appendChild(perferredtimeuserTable).innerHTML= cursor.value.slottime;
            childRow.appendChild(statususerTable).innerHTML= cursor.value.status ;
            childRow.appendChild(editBtn).innerHTML= 'Edit status' ;
            editBtn.addEventListener('click',updateVisit)
            tablle.appendChild(childRow);
            home.style.display= 'none'//button to back to hemepage will appear after data download
            cursor.continue();//to go next stored data
        }else {
            console.log('No More data');
            tableLoading.style.display = 'none';
            tableSection.style.display= 'block';
            home.style.display= 'block'//button to back to hemepage appears after complete data download from db
            sortTable.style.display = 'block'// sort button appear when all data is appeared
            
        }
        
    }
}
//print table 
printTable.addEventListener('click',()=>{
    home.style.visibility = 'hidden';
    printTable.style.display = 'none';
    document.querySelector('.sortTableBtn').style.display = 'none';
    //hide all edit buttons in table
    document.querySelectorAll('.tablesec div #table button').forEach((btn)=>{btn.style.visibility = 'hidden'});
    window.print();
    home.style.visibility = 'visible';
    printTable.style.display = 'block';
    document.querySelector('.sortTableBtn').style.display = 'block';
    //hide all edit buttons in table
    document.querySelectorAll('.tablesec div #table button').forEach((btn)=>{btn.style.visibility = 'visible'});
})

/** sort data table according to address */
function sortTable(){
    let tablesort = document.querySelector('#table');
    let rows ,currentRow ,nextRow, i ,stateSwitch;
    let switching = true;
    while (switching){
        switching = false;
        rows = tablesort.rows;
        for(i= 1; i< rows.length-1; i++){
            stateSwitch = false;
            currentRow = rows[i].getElementsByTagName('TD')[3];
            nextRow = rows[i + 1].getElementsByTagName('TD')[3];
            if(currentRow.textContent.toLowerCase() > nextRow.textContent.toLowerCase()){
                stateSwitch = true;
                break;
            }
        }
        if (stateSwitch){
            rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
            switching = true
        }
    }
}


//citizen
// function show message to confirm request is done for citizen 
function messageAlert(){
    okMessage.style.display= 'block';
    okBtn.addEventListener('click',()=>{
        okMessage.style.display = 'none';
        formSec.style.display = 'none';
        wrongAddress.textContent = '';
        //welcome.style.display = 'block';
        ook = true;
      // call function with input ook = true   
        displayAccount(ook);//create page of all data for citizen after make visit request
        console.log('infun',ook)
    })
}

//citizen
 // function display stored data in client'page after submit form 
function displayAccount(ok){
    window.scrollTo(0,0);
    console.log('iiiiiin',ok)
    notify.style.display = 'block';
   // nav.style.display = 'block';
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
       userAdmin.style.display = 'none'
       accountPage.style.display = 'block';
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
    
          if(userData){//to make accountpage of citizen
              phone.textContent = userData.phone;
              status.textContent = userData.status;
              name.textContent = userData.name;
              address.textContent = userData.address;
              mail.textContent = userData.mail;
              slotTime.textContent = userData.slottime;
              welcome.style.display = 'block'
              welcome.textContent ='Welcome ' + userData.name;//welcome message after data of citzien stored
          }
          //clear data from form of visiting request after data stored in indexedDB
          document.getElementById('name').value = '';
          document.getElementById('phone').value = '';
          document.getElementById('address').value = '';
          document.getElementById('time').value = '';
          document.getElementById('mail').value = '';
        }
   }   
}

//citizen
//close data citizen page account and back to homepage
document.getElementById('homepage').addEventListener('click',(e)=>{
    e.preventDefault();
    hideCitizen();
    hideAdmin();
    window.scrollTo(0,0)//start begin of page
    userAdmin.style.display = 'block'//appear citizen / admin buttons
    accountPage.style.display = 'none'
    welcome.style.display ='none';
    notify.style.display ='none';
    acceptNotify.style.display = 'none'
})

//admin and edit request
// for edit time of visit by admin from table when press edit
function updateVisit(e){
    e.preventDefault();
    printSec.scrollIntoView({behavior: 'smooth', block: 'center'})
    about.style.display = 'none';
    printSec.innerHTML= '';
   // document.querySelector('#table').textContent = '';
    tableSection.style.display = 'none';
    printSec.style.display = 'block';
    backtable.style.display = 'block';
    //printBtn1.style.display = 'block';
    //db = e.target.result;
    let storee = db.transaction('peopleData','readwrite').objectStore('peopleData');
    const request = storee.get(e.target.id);
    console.log('type for printphone',typeof e.target.id)
    console.log('e.id',e.target.id)
    request.onsuccess = async(event)=>{
        tableSection.style.display = 'none';
        //document.querySelector('#table').textContent = '';
        const citiz = event.target.result;
        let printD = document.createElement('dl');
        let printBtn1 = document.createElement('button');
        printBtn1.textContent = 'print';
        //printD.style.display = 'block';
        printSec.appendChild(printD);
        let dtName = document.createElement('dt');
        dtName.textContent = "Name";
        let ddN = document.createElement('dd');
        ddN.innerHTML = citiz.name;
        let dtMail = document.createElement('dt');
        dtMail.textContent = "E-mail";
        let ddM = document.createElement('dd');
        ddM.innerHTML = citiz.mail;
        let dtPhone = document.createElement('dt');
        dtPhone.textContent = "Phone";
        let ddP = document.createElement('dd');
        ddP.innerHTML = citiz.phone;
        let dtAddress = document.createElement('dt');
        dtAddress.textContent = "Address";
        let ddA = document.createElement('dd');
        ddA.innerHTML = citiz.address;
        let dtTime = document.createElement('dt');
        dtTime.textContent = "perferref slottime";
        let ddT = document.createElement('dd');
        ddT.innerHTML = citiz.slottime;
        let label = document.createElement('label')
        label.textContent = 'Enter time of visit'
        let inpuVisit = document.createElement('input');
        //this button has no effect but when change input visit admin must click outside visit input to ecaute change so I put it
        let visitBtnChang = document.createElement('input');
        visitBtnChang.setAttribute('type','submit');
        //append in printSec
        printD.appendChild(dtName);
        printD.appendChild(ddN);
        printD.appendChild(dtMail);
        printD.appendChild(ddM);
        printD.appendChild(dtPhone);
        printD.appendChild(ddP);
        printD.appendChild(dtAddress);
        printD.appendChild(ddA);
        printD.appendChild(dtTime);
        printD.appendChild(ddT);
        printSec.appendChild(label);
        printSec.appendChild(inpuVisit);
        printSec.appendChild(visitBtnChang);
        printSec.appendChild(printBtn1);
        //create element show visit time
        let visitTime = document.createElement('dt')
        visitTime.innerHTML = 'visit time:';
        let visitTimedes = document.createElement('dd')
        visitTimedes.textContent = citiz.status;
        printD.appendChild(visitTime);
        printD.appendChild(visitTimedes);
       // add time for visit in request by admin 
        inpuVisit.addEventListener('change',()=>{
            console.log(citiz.status)
            citiz.status = inpuVisit.value;
            console.log(citiz.status);
            //create transaction every time there change in input
            let upStore = db.transaction('peopleData','readwrite').objectStore('peopleData')
            let requestUpdat = upStore.put(citiz);
            requestUpdat.onerror = (event)=>{

                console.error('error in update')
            }//change pending status to day by admin
            requestUpdat.onsuccess = (event)=>{
                const statusIndex = upStore.index('status');
                visitTimedes.innerHTML = inpuVisit.value;//time of visit by admin
                acceptNotify.classList.add('notificat');//give notification for citizen has visit time

                console.log('success update');                
            }
            
        })
        //print visit request of citizin
        printBtn1.addEventListener('click',()=>{
            if(visitTimedes.textContent){
                 //hide during print
                 label.style.visibility = 'hidden';
                 inpuVisit.style.visibility = 'hidden';
                 printBtn1.style.visibility = 'hidden';
                 backtable.style.visibility = 'hidden';
                 visitBtnChang.style.visibility = 'hidden';
                 window.print()
                 //appear after print command when back to page
                 label.style.visibility = 'visible';
                 inpuVisit.style.visibility = 'visible';
                 printBtn1.style.visibility = 'visible';
                 backtable.style.visibility = 'visible';
                 visitBtnChang.style.visibility = 'visible';
            }else{
            
                 console.log('enter time of visit to print');
            }
        })
        
        
    }
}

 /** TODO: add json file Los angeles data  */
 //address input for add option tags for addresses by json file
 let adreInput = document.getElementById('address');
  // call this function cause get json data addresses then call second function to create option tag with fetched data
  function storesequencefun(){
    addresses_func()
    .then((data)=>createAddressOPtion(data))
 }

 //fetch addresseslosangelesdata from json file
 const addresses_func = async () => {
    let response = await fetch('addresslosangeles.json');
    try{
        let res = await response.json();
        console.log('json data:',res);
        let data = res
        return data
    }catch(e){
        console.error('there is error to fetch json data',e)
    }
    
 }
    
//create option tags for input address with json address data
    function createAddressOPtion(data){
        let dataArr = data;
        dataArr.forEach((addressesj)=>{
            let option = document.createElement('option');
            option.setAttribute('value',addressesj.HSE_ID+ ' '+ addressesj.HSE_NBR +' '+ addressesj.HSE_DIR_CD+' '+ addressesj.STR_NM+ ' ' + addressesj.STR_SFX_CD );
            adreInput.appendChild(option);
        }) 

    }
//call function to fetch los angles and create option tag for addresses
setTimeout(storesequencefun,0.1);  

/* create function store data of user for first time from form*/
let storeData = async ()=>{
    /* store user's data  in variable  */
    let namee =document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    //let addressesop = '';
    let addressp = document.querySelector('#adresOption').value;
    console.log(addressp)
    let slottime = document.getElementById('time').value;
    let mail = document.getElementById('mail').value;
    /*create object to store data user in it*/
    let checkAddLosAn = await addresses_func()
    console.log('////////',checkAddLosAn)
    //check address filled with citizen is in Los angeles or no
        let result =  checkAddLosAn.some((adre)=>{ 
             return (adre.HSE_ID+ ' '+ adre.HSE_NBR +' '+ adre.HSE_DIR_CD+' '+ adre.STR_NM+ ' ' + adre.STR_SFX_CD) === addressp})
        if(namee && phone && addressp && mail && slottime){
               if(await result){
                    let dd = {
                        name: namee,
                        phone: phone,
                        address: addressp,
                        status: 'pending',
                        mail: mail,
                        slottime: slottime,
                        json:checkAddLosAn
                    }

                    return dd
     
                }else{
                    wrongAddress.textContent = 'Please write your correct address and choose from option that appeared in address section';
                    
                }
              
            }else{//when citizen leave empty blank input in form
                console.log('please fill in all field');
                wrongAddress.style.display = 'block';
                wrongAddress.textContent = 'please fill in all field';
       }
   
}


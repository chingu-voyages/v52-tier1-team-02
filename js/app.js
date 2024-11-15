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
}

let submitt = document.querySelector('#submit');
submitt.addEventListener('click',(e)=>{
    e.preventDefault();
    storeData();
})






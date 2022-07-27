//declares a variable to target all items with the fa-trash class
const deleteBtn = document.querySelectorAll('.fa-trash')
//declares a variable to target all spans with the item class
const item = document.querySelectorAll('.item span')
//declares a variable to target all spans with the item and completed classes
const itemCompleted = document.querySelectorAll('.item span.completed')

//makes an array with the querySelectorAll results, loop through all, and add a click event that fires the deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//makes an array with the querySelectorAll results, loop through all, and add a click event that fires the markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//makes an array with the querySelectorAll results, loop through all, and add a click event that fires the markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//grabs the first item inside the <li> with the class of 'completed' and delete it
async function deleteItem(){
    //traverses the dom up to the parent li and gets the texts inside of the first span element
    const itemText = this.parentNode.childNodes[1].innerText
    //try-catch is a cleaner way to handle errors, essentially error handling
    try{
        //sends a delete request to the deleteItem endpoint, sets header to inform server that it is sending json, and the itemtext variable contents in the body
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //waitng for response, parsing json
        const data = await response.json()
        console.log(data)
        //reloads the page
        location.reload()

    //logs an error to the console if there is one
    }catch(err){
        console.log(err)
    }
}

//a function to mark an item as complete
async function markComplete(){
    //traverses the dom up to the parent li and gets the texts inside of the first span element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a PUT request to the markcomplete endpoint, sets header to inform server that it is sending json, and the itemtext variable contents in the body
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
           //waitng for response, parsing json
        const data = await response.json()
        console.log(data)
        location.reload()

    //logs an error to the console if there is one
    }catch(err){
        console.log(err)
    }
}

//a function to mark an item as not complete
async function markUnComplete(){
     //traverses the dom up to the parent li and gets the texts inside of the first span element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sends a PUT request to thte deleteitem endpoint, sets header to inform server that it is sending json, and the itemtext variable contenets in the body
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
           //waitng for response, parsing json
        const data = await response.json()
        console.log(data)
        //reloads the page
        location.reload()

    //logs an error to the console if there is one
    }catch(err){
        console.log(err)
    }
}
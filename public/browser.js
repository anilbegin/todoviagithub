let ourForm = document.getElementById('ourForm')
let ourField = document.getElementById('ourField')

function itemTemplate(item)
{
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text">${item.text}</span>
                <div>
                <button data-id='${item._id}' class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id='${item._id}' class="delete-me btn btn-danger btn-sm">Delete</button>
                </div>
            </li>`
}

//Client Side rendering
let ourHTML = items.map(function(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text">${item.text}</span>
                <div>
                <button data-id='${item._id}' class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id='${item._id}' class="delete-me btn btn-danger btn-sm">Delete</button>
                </div>
            </li>`
}).join('')
ourList.insertAdjacentHTML('beforeend', ourHTML) 

ourForm.addEventListener('submit', function(e) {
    e.preventDefault()
    axios.post('/add-item', {text: ourField.value}).then(function(response) {
        ourList.insertAdjacentHTML('beforeend', itemTemplate(response.data))
    }).catch(function() {
        console.log('Error: try adding later')
    })
})

document.addEventListener('click', function(e) {
    // Delete Item Section
    if(e.target.classList.contains('delete-me')) {
        if(confirm('Are you sure you want to delete this item?')) {
            axios.post('/delete-item', {id: e.target.getAttribute('data-id')}).then(function() {
                e.target.parentElement.parentElement.remove()
            }).catch(function() {
                console.log('Error: try again later')
            })
        }
        
    }
    // Edit Item Section
    if(e.target.classList.contains('edit-me')) {
        let userInput = prompt('Enter your desired new text', e.target.parentElement.parentElement.querySelector('.item-text').innerHTML)
        if(userInput)
        {
            axios.post('/edit-item', {text: userInput, id: e.target.getAttribute('data-id')}).then(function() {
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput
            }).catch(function() {
                console.log('Error: try again later')
            })
        }
        
    }
})
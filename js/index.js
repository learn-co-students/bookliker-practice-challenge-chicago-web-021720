const BOOKURL = 'http://localhost:3000/books'
const USERURL = 'http://localhost:3000/users'
const showDiv = document.getElementById('show-panel')

const runApp = () => {
    displayBooks()
    moreInfoClickListener() // displays info when title is clicked
}
// fetch books and apply renderBook
const displayBooks = () => {
    fetch(BOOKURL).then(r => r.json()).then(books => {
        books.forEach(book => renderBook(book))
    })   
}
//render book in show div page
const renderBook = (book) => {
    const ul = document.getElementById('list')
    const li =  `<li id=${book.id}>${book.title}</li>`
    ul.innerHTML += li

    const showInfo =`<div id=show-${book.id} class=bookinfo><h3>${book.title}</h3><img src=${book.img_url}><br><p>${book.description}</p><button id=button-${book.id}>read book</button>${renderUsers(book)}</div>`
    showDiv.innerHTML += showInfo
    renderUsers(book)   
    
    const infoDiv = document.getElementById(`show-${book.id}`)
    infoDiv.style.display = 'none'

}
//show users under book info on show div 
const renderUsers = (book) => {
    let userArray = book.users.map(user => {
        return `<h4 id=user-${user.id}>${user.username}</h4>`
    })
    return userArray.join('')
}
// listens for book title lis and button
const handleClick = (event) => {
    if (parseInt(event.target.id)) {
        displayBook(event)
    }

    if (event.target.id.substring(0,6) == 'button'){
        readBook(event)
    }
}
// adds book to page
const displayBook = (event) => {
    bookInfoArray = document.getElementsByClassName('bookinfo')
    for (let i=0; i < bookInfoArray.length; i++){
        bookInfoArray[i].style.display = 'none'
    }
    chosenBook = document.getElementById(`show-${event.target.id}`)
    chosenBook.style.display = 'block'
}
//adds a like / read of user to page
const readBook = (event) => {
    const bookId = event.target.id.substring(7)
    const myUserInfo = {id: 1, username: "pouros"}

    fetch(BOOKURL + `/${bookId}`).then(r => r.json()).then(book => {
        const bookUsers = book.users
        userRead = document.getElementById(`show-${book.id}`).lastElementChild.innerText
        if (userRead === 'pouros') {
            alert('you already read this book')
            return
        }

        const bookUserHashArray = [myUserInfo]
        for (let i = 0; i < bookUsers.length; i ++) {
            bookUserHashArray.unshift({id: bookUsers[i].id, username: bookUsers[i].username})   
        }
        bookUserHashArray;

        const patchObj = {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json', "Accept": "application/json"},
            body: JSON.stringify({users: bookUserHashArray})
        }

        fetch(BOOKURL + `/${bookId}`, patchObj).then(r => r.json()).then(book => {
            console.log(book)
            let user = book.users.slice(-1)[0]
            document.getElementById(`show-${book.id}`).innerHTML += `<h4 id=user-${user.id}>${user.username}</h4>`
        })
    })
}
//adds click listener 
const moreInfoClickListener = () => {
    addEventListener('click', handleClick)
}
runApp()


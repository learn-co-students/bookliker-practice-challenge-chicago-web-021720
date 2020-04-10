const list = document.getElementById('list');
const show = document.getElementById('show-panel');
let currentUser;

const fetchBooks = () => {
    fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(books => {
        books.forEach(book => {
            list.innerHTML += `<li data-id="${book.id}">${book.title}</li>`
        })
    });
}

const fetchUser = userId => {
    fetch(`http://localhost:3000/users/${userId}`)
        .then(resp => resp.json())
        .then(user => currentUser = user);
}

const listEventListener = () => {
    list.addEventListener('click', event => {
    const id = event.target.dataset.id
    fetch(`http://localhost:3000/books/${id}`)
        .then(resp => resp.json())
        .then(book => {
            renderShowPage(book)
        });
    });
}

const likeEventListener = (usersArr) => {
    show.addEventListener('click', event => {
        event.preventDefault();
        if (event.target.matches('button')) {
            const id = event.target.dataset.id
            const updatedArr = [...usersArr]
            if(!updatedArr.includes(currentUser))
                {
                    updatedArr.push(currentUser)
                }
            const reqObj = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    users: updatedArr
                })
            }
            fetch(`http://localhost:3000/books/${id}`, reqObj)
                .then(resp => resp.json())
                .then(book => {
                    console.log(book)
                });
        }
    })
}

const renderShowPage = book => {
    show.innerHTML = `<h1>${book.title}</h1><br>
    <img src=${book.img_url}><br>
    <p>${book.description}</p>`
    console.log(book.users)
    if (book.users) {
        book.users.forEach(user => {
            show.innerHTML += `<li>${user.username}</li>`
        });
    };

    show.innerHTML += `<button data-id=${book.id}>Like Book</button>`
    console.log(book.users)
    likeEventListener(book.users)
}

function main() {
    fetchBooks()
    fetchUser(1)
    listEventListener()
}

main()
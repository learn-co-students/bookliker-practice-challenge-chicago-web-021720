document.addEventListener("DOMContentLoaded", function() {
  //Get Books
  const BOOKS_URL = `http://localhost:3000/books`;
  const bookList = document.getElementById('list');
  const bookInfo = document.getElementById('bookInfo');

  const renderBook = book => {
    bookList.innerHTML += `<li data-id="${book.id}">${book.title}</li>`;
  }

  const getBooks = () => {
    fetch(BOOKS_URL)
      .then(response => response.json())
      .then(books => books.forEach(book => renderBook(book)));
  };

  const renderBookInfo = book => {
    bookInfo.innerHTML = `<img src="${book.img_url}"/><p>${book.description}</p>
                         <ul>
                         ${book.users.map(user => '<li>' + user.username + '</li>').join('')}
                         </ul>
                         <button data-id="${book.id}">Like</button>
                         `;
  };


  const getBook = id => {
    let val;
    fetch(`${BOOKS_URL}/${id}`)
      .then(response => response.json())
      .then(data => renderBookInfo(data));
    return val;
  }

  getBooks();

  bookList.addEventListener('click', function(event){
    if(event.target.tagName === 'LI'){
      const book = getBook(event.target.dataset.id);
      console.log(book);
    }
  });

  bookInfo.addEventListener('click', function(event){
    if(event.target.tagName === 'BUTTON'){
      const userList = event.target.previousElementSibling;
      const currentusers = Array.from(userList.children).map(child => child.innerText);
      const users = event.target.innerText === 'Like' ?
        [...currentusers, "Adam Shaffer"] : currentusers.filter(user => user !== "Adam Shaffer");
      const id = event.target.dataset.id;
      console.log(users);
      const configurationObject = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({users: users})
      }
      fetch(`${BOOKS_URL}/${id}`, configurationObject)
        .then(response => response.json())
        .then(data => {
          userList.innerHTML = data.users.map(user => '<li>' + user + '</li>').join('');
          event.target.innerText = event.target.innerText === 'unlike' ? 'Like' : 'unlike';
        });
    }
  });
});

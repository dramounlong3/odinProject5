let section = document.querySelector("section");

function handleDelete(e) {
  e.preventDefault();
  let myList = localStorage.getItem("list");
  let myListArray = JSON.parse(myList);

  //delete book
  myListArray.forEach((item) => {
    if (
      item.bookID ==
      e.target.parentElement.parentElement.parentElement.getAttribute(
        "data-num"
      )
    ) {
      //刪除元素的動作需要等到動畫結束再執行，否則刪除會在一瞬間結束
      e.target.parentElement.parentElement.parentElement.addEventListener(
        "animationend",
        () => {
          e.target.parentElement.parentElement.parentElement.remove();
        }
      );
      myListArray.splice(item.bookID, 1);
      e.target.parentElement.parentElement.parentElement.style.animation =
        "scaleDown 0.5s forwards";
    }
  });

  //因為刪除等了0.5秒才刪除，故重新取得book id 和 data-num 也必須等動畫結束
  e.target.parentElement.parentElement.parentElement.addEventListener(
    "animationend",
    () => {
      //重新取得section底下的所有card
      let card = document.querySelectorAll("section div[data-num]");
      if (myListArray !== null) {
        //re-assign localstorage book id
        myListArray.forEach((item, idx) => {
          item.bookID = idx;
        });

        //re-assign data-num
        card.forEach((item, idx) => {
          item.setAttribute("data-num", `${idx}`);
        });

        localStorage.setItem("list", JSON.stringify(myListArray));
      }
    }
  );
}

function handleRead(e) {
  e.preventDefault();
  let myList = localStorage.getItem("list");
  let myListArray = JSON.parse(myList);

  //toggle class read
  myListArray.forEach((item) => {
    if (
      item.bookID ==
      e.target.parentElement.parentElement.parentElement.getAttribute(
        "data-num"
      )
    ) {
      item.bookStatus = !item.bookStatus;

      e.target.previousSibling.innerText = `Read: ${
        item.bookStatus ? "Y" : "N"
      }`;
      e.target.classList.toggle("read");
      e.target.nextSibling.classList.toggle("read");
      e.target.parentElement.classList.toggle("read");
      e.target.parentElement.previousSibling.classList.toggle("read");
      e.target.parentElement.parentElement.classList.toggle("read");
    }
  });

  localStorage.setItem("list", JSON.stringify(myListArray));
}

//load books from localStorage on page load
function loadData() {
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      let bookItem = document.createElement("div");
      bookItem.setAttribute("data-num", `${item.bookID}`);
      bookItem.classList.add("mb-3", "gap");
      bookItem.innerHTML = `<div class="card text-dark" style="width: 18rem;"><div class="card-header card-title fs-4">Title: ${
        item.bookTitle
      }</div><div class="card-body"><p class="card-text">Author: ${
        item.bookAuthor
      }</p><p class="card-text">Pages: ${
        item.bookPages
      }</p><p class="card-text">Language: ${
        item.bookLanguage
      }</p><p class="card-text">Publish date: ${
        item.bookPublishDate
      }</p><p class="card-text">Read: ${
        item.bookStatus ? "Y" : "N"
      }</p><a href="#" class="mark btn btn-primary me-3" onclick="handleRead(event)">mark read</a><a href="#" class="delete btn btn-danger" onclick="handleDelete(event)"><i class="fas fa-trash-alt"></i></a></div></div>`;
      section.appendChild(bookItem);
    });

    let checkRead = document.querySelectorAll("div[data-num]");
    checkRead.forEach((card, idx) => {
      if (myListArray[idx].bookStatus) {
        card.childNodes[0].classList.toggle("read");
        card.childNodes[0].childNodes[0].classList.toggle("read");
        card.childNodes[0].childNodes[1].classList.toggle("read");
        card.childNodes[0].childNodes[1].childNodes[5].classList.toggle("read");
        card.childNodes[0].childNodes[1].childNodes[6].classList.toggle("read");
      }
    });
  }
}

loadData();

//JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        event.preventDefault();
        form.classList.add("was-validated");
      },
      false
    );

    const addBook = document.querySelector("#addBook");
    const modalBook = new bootstrap.Modal(
      document.querySelector("#modalBook"),
      {
        keyboard: false,
      }
    );

    addBook.addEventListener("click", (e) => {
      if (form.checkValidity()) {
        const bookInput = document.querySelectorAll(".form-control");
        const bookStatus = document.querySelector("#bookStatus");
        let book = {
          bookTitle: bookInput[0].value,
          bookAuthor: bookInput[1].value,
          bookPages: bookInput[2].value,
          bookLanguage: bookInput[3].value,
          bookPublishDate: bookInput[4].value,
          bookStatus: bookStatus.checked,
        };
        // store data into an array of objects
        let myList = localStorage.getItem("list");
        if (myList == null) {
          //替BOOK編號，從0開始編
          book.bookID = 0;
          localStorage.setItem("list", JSON.stringify([book]));
        } else {
          let myListArray = JSON.parse(myList);
          //若localstorage已有資料則新的book編號為mylist長度
          book.bookID = myListArray.length;
          myListArray.push(book);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }

        //add new book
        let bookItem = document.createElement("div");
        //set unique attribute by bookID
        bookItem.setAttribute("data-num", `${book.bookID}`);
        bookItem.classList.add("mb-3", "gap");
        bookItem.innerHTML = `<div class="card text-dark" style="width: 18rem;"><div class="card-header card-title fs-4">Title: ${
          book.bookTitle
        }</div><div class="card-body"><p class="card-text">Author: ${
          book.bookAuthor
        }</p><p class="card-text">Pages: ${
          book.bookPages
        }</p><p class="card-text">Language: ${
          book.bookLanguage
        }</p><p class="card-text">Publish date: ${
          book.bookPublishDate
        }</p><p class="card-text">Read: ${
          book.bookStatus ? "Y" : "N"
        }</p><a href="#" class="mark btn btn-primary me-3" onclick="handleRead(event)">mark read</a><a href="#" class="delete btn btn-danger" onclick="handleDelete(event)"><i class="fas fa-trash-alt"></i></a></div></div>`;

        section.appendChild(bookItem);

        if (book.bookStatus) {
          bookItem.childNodes[0].classList.toggle("read");
          bookItem.childNodes[0].childNodes[0].classList.toggle("read");
          bookItem.childNodes[0].childNodes[1].classList.toggle("read");
          bookItem.childNodes[0].childNodes[1].childNodes[5].classList.toggle(
            "read"
          );
          bookItem.childNodes[0].childNodes[1].childNodes[6].classList.toggle(
            "read"
          );
        }

        bookItem.style.animation = "scaleUp 1s forwards";
        modalBook.hide();
      }
    });
  });
})();

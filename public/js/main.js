let config = {
    apiKey: "AIzaSyDEh4HY8n2GY2griI9QlUgC65-VJOWiMOY",
    authDomain: "todo-525c1.firebaseapp.com",
    databaseURL: "https://todo-525c1.firebaseio.com",
    projectId: "todo-525c1",
    storageBucket: "",
    messagingSenderId: "763413120816"
  };
  firebase.initializeApp(config);


  function renderCards(cardsObj){
    let html = "";
    let noteArea = document.querySelector("#noteArea");
    for (key in cardsObj){
        let card = cardsObj[key];
        html+= `
        <div class="card col s12" style="margin:5px" id=${card.id}>
            <div class="card-content">
                <p>${card.text}</p>
            </div>
            <div class="card-action">
                <a class="waves-effect waves-light btn" onclick="editCard('${card.id}')"><i class="material-icons left">edit</i>Edit</a>
                <a class="waves-effect waves-light btn" onclick="deleteCard('${card.id}')"><i class="material-icons left">delete</i>Remove</a>
            </div>
        </div>
        `;
    }
    noteArea.innerHTML= html;
  
  }

  function save(id, text){
    firebase.database().ref('cards/' + id).set({
        id: id,
        text: text
      });
  }

  function updateCard(id){

    let textarea = document.querySelector(`#textarea${id}`);
    let text = textarea.value;
    save(id, text);
   
  }

  function createCard(){
    let newId = firebase.database().ref('cards/').push().key;
    let text = document.querySelector("#textarea1").value;
    save(newId, text);
    return false;
  }

  function deleteCard(id){
    firebase.database().ref(`cards/${id}`).set(null);
  }

  function editCard(id){
    let card = document.querySelector(`#${id}`);
    card.children[0].innerHTML = `
    <div class="input-field">
        <textarea id="textarea${id}" class="materialize-textarea"  ></textarea>
        <label for="textarea${id}">Textarea</label>
    </div>
    `;
    card.children[1].innerHTML = `
        <a class="waves-effect waves-light btn" onclick="updateCard('${card.id}')"><i class="material-icons left">save</i>Save</a>
        <a class="waves-effect waves-light btn" onclick="renderCards(getCards())"><i class="material-icons left">close</i>Cancel</a>
    `;
  }

  function getCards(fun){

    let cardsRef = firebase.database().ref('cards/');
    cardsRef.on('value', function(snapshot) {

        fun(snapshot.val());
    });
  }


  function main(){

    var cardsRef = firebase.database().ref('cards');
    
    cardsRef.on('child_added', function(data) {
        console.log("child added");
        getCards(renderCards);
    });

    cardsRef.on('child_changed', function(data) {
        console.log("child changed");
        getCards(renderCards);
    });

    cardsRef.on('child_removed', function(data) {
        console.log("child removed");
        getCards(renderCards);
    });
    
  }

  window.addEventListener('load', main);
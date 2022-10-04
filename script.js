// Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCUIi0m91uGMH6PHpcUIDyTaytI2lSsCHI",
  authDomain: "todoapp-metrix.firebaseapp.com",
  databaseURL: "https://todoapp-metrix-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "todoapp-metrix",
  storageBucket: "todoapp-metrix.appspot.com",
  messagingSenderId: "599833567578",
  appId: "1:599833567578:web:1f128fba15adfae2e3d363",
  measurementId: "G-C7W5CCCRY7"
};

const notes = document.querySelector(".notes");

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.database().ref("agendaGEII")

document.getElementById("ajoutDevoir").addEventListener("submit", submitForm);

// Add function 
function submitForm(e) {
  e.preventDefault();
  var matiere = getElementVal("matiere");
  var devoir = getElementVal("devoir");
  var date = getElementVal("date");
  var ds = getElementVal("ds");

  var convertedDate = new Date(date);
  var timestamp = Math.floor(convertedDate.getTime() / 1000);

  saveHomework(matiere, devoir, date, ds, timestamp);
  alert("Devoir ajouté ! Votre IP a été enregistrée, elle sera utilisée en cas de vandalisme.");  

  document.getElementById("ajoutDevoir").reset();
  location.reload();
}

const saveHomework = (matiere, devoir, date, ds, timestamp) => {
  var newHomework = db.push();

  newHomework.set({
    matiere: matiere,
    devoir: devoir,
    date: date,
    ds: ds,
    timestamp: timestamp
  });
}

const getElementVal = (id) => {
  return document.getElementById(id).value;
}

// Order by date function
db.orderByChild("timestamp").on("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
   var childData = childSnapshot.val();
   var id=childData.id;
   console.log(childData);

   const div = document.createElement("div");
   const text = document.createTextNode(`${childData.ds} | ${childData.matiere} | ${childData.devoir} | Pour le : ${childData.date}`);
   if (Math.floor(Date.now() / 1000) < childData.timestamp) {
   div.classList.add("container2");
   div.classList.add("noteText");
   div.classList.add("blur");
   div.appendChild(text);
   notes.append(div);
   } else { }
  });
 });
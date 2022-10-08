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

// Order by date function + retrieve data
db.orderByChild("timestamp").on("value", function(snapshot) {

  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'fr',
    weekends: false,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right:''
    },
    eventClick: function(info) {
      alert('Matière : ' + info.event.extendedProps.matiere + '\nDevoir à faire : ' + info.event.title + '\nPour le ' + info.event.extendedProps.date);
    }
  });

  snapshot.forEach(function(childSnapshot) {
   var childData = childSnapshot.val();

   // Debug
   // console.log(childData);

   const div = document.createElement("div");
   const text = document.createTextNode(`${childData.ds} | ${childData.matiere} | ${childData.devoir} | Pour le : ${childData.date}`);

   // Remove old homework and sort by date
   if (Math.floor(Date.now() / 1000) < childData.timestamp) {
    div.classList.add("container2");
    div.classList.add("noteText");
    div.classList.add("blur");
    notes.setAttribute('id', 'notes');

    // Ajout checkbox
    if (childData.ds == "DEVOIR") {
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.setAttribute('id', childSnapshot.key);
      div.appendChild(cb);
    }

    // Ajout texte
    div.appendChild(text);
    notes.append(div);

    // Ajout calendrier
    calendar.addEvent({
      title: childData.devoir,
      start: childData.date,
      end : childData.datefin,
      extendedProps: {
        matiere: childData.matiere,
        date: childData.date
      },
      allDay: true
    });
   } else { 
    // Affichage des devoirs passés
    calendar.addEvent({
      title: childData.devoir,
      start: childData.date,
      end : childData.datefin,
      extendedProps: {
        matiere: childData.matiere,
        date: childData.date
      },
      allDay: true
    });
   }
  });
  // Affichage du calendrier
  calendar.render();
  viewList();
 });


// Local storage function (devoirs faits)
setTimeout(function(){
  var checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {};
  var $checkboxes = jQuery("#notes :checkbox");
  
  $checkboxes.on("change", function(){
    $checkboxes.each(function(){
      checkboxValues[this.id] = this.checked;
    });
    localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
  });
  
  jQuery.each(checkboxValues, function(key, value) {
    jQuery("#" + key).prop('checked', value);
  });
}, 500);

// Vue Calendrier/Liste
function viewCalendar() {
  document.getElementById('calendar').style.display="block";
  document.getElementById('calendar').style.height="auto";
  document.getElementById('notes').style.display="none";
}

function viewList() {
  document.getElementById('calendar').style.display="none";
  document.getElementById('notes').style.display=null;
}
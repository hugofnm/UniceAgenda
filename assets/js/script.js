// Configuration Firebase
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

// Initialisation Firebase
const notes = document.querySelector(".notes");

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.database().ref("agendaGEII")

document.getElementById("ajoutDevoir").addEventListener("submit", submitForm);

// Fonction spéciale noël
function playSound() {
  var audio = new Audio("assets/christmas/AllIWantForChristmasIsYou.mp3");
  audio.play();
}

// Fonction ajout de devoir
// ESSENTIELLE
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

// Fonction récupération données Firebase + affichage dans l'ordre 
// ESSENTIELLE
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
    },
    // Ajout vacances
    events: [
      {
        title:"Vacances de la Toussaint",
        start: '2022-10-27',
        end: '2022-11-06',
        color: 'LimeGreen',
        display: 'background'
      },
      {
        title:"Vacances de Noël",
        start: '2022-12-17',
        end: '2023-01-02',
        color: 'LimeGreen',
        display: 'background'
      },
      {
        title:"Vacances d'hiver",
        start: '2023-02-18',
        end: '2023-02-26',
        color: 'LimeGreen',
        display: 'background'
      },
      {
        title:"Vacances de Pâques",
        start: '2023-04-15',
        end: '2023-05-01',
        color: 'LimeGreen',
        display: 'background'
      },
      {
        title:"Pont de l'Ascension",
        start: '2023-05-17',
        end: '2023-05-21',
        color: 'LimeGreen',
        display: 'background'
      },
      {
        title:"Semaine à la montagne",
        start: '2023-01-11',
        end: '2023-01-15',
        color: 'Chocolate',
        display: 'background'
      }
    ]
  });

  snapshot.forEach(function(childSnapshot) {
   var childData = childSnapshot.val();
   var color = "CornflowerBlue";

   // Debug
   // console.log(childData);

   const div = document.createElement("div");
   const text = document.createTextNode(`${childData.ds} | ${childData.matiere} | ${childData.devoir} | Pour le : ${childData.date}`);

   // Suppression devoirs passés + tri par date
   if (Math.floor(Date.now() / 1000) < (childData.timestamp + 86399)) {
    div.classList.add("container2");
    div.classList.add("noteText");
    div.classList.add("blur");
    notes.setAttribute('id', 'notes');

    // Ajout checkbox pour la fonction devoirs fait
    if (childData.ds == "DEVOIR") {
      const cb = document.createElement('input');
      const style = document.createElement('label');
      const style2 = document.createElement('div');
      style.classList.add("containercheck");
      style2.classList.add("checkmark");
      cb.type = 'checkbox';
      cb.setAttribute('id', childSnapshot.key);
      div.appendChild(style);
      style.appendChild(cb);
      style.appendChild(style2);
    }

    // Ajout blocs devoirs
    div.appendChild(text);
    notes.append(div);
   } else {}

   if (childData.ds == "CONTRÔLE") {
     color = "Crimson";
   }

   if (childData.ds == "RATTRAPAGE") {
    color = "DarkOrange";
  }

   if (childData.matiere == "BDE - Vie étudiante") {
     color = "Purple";
   }

    // Ajout au calendrier
    calendar.addEvent({
      title: childData.devoir,
      start: childData.date,
      end : childData.datefin,
      color: color,
      extendedProps: {
        matiere: childData.matiere,
        date: childData.date
     },
     allDay: true
    });
  });

  // Affichage du calendrier
  calendar.render();
  viewList();
});

// Fonctions de changement de vue
// Vue liste
function viewList() {
  document.getElementById('calendar').style.display="none";
  document.getElementById('edt').style.display="none";
  document.getElementById('container').style.display="none";
  document.getElementById('installer').style.display="none";
  document.getElementById('notes').style.display=null;
  document.getElementById('hamburger').checked = false;
}

// Vue calendrier
function viewCalendar() {
  document.getElementById('calendar').style.display="block";
  document.getElementById('calendar').style.height="auto";
  document.getElementById('edt').style.display="none";
  document.getElementById('notes').style.display="none";
  document.getElementById('container').style.display="none";
  document.getElementById('installer').style.display="none";
}

// Vue Emploi Du Temps
function viewEDT() {
  document.getElementById('edt').style.display="block";
  document.getElementById('edt').style.height="auto";
  document.getElementById('calendar').style.display="none";
  document.getElementById('notes').style.display="none";
  document.getElementById('container').style.display="none";
  document.getElementById('installer').style.display="none";
  renderEdt();
}

// Vue Ajout de devoir
function viewAdder() {
  document.getElementById('calendar').style.display="none";
  document.getElementById('edt').style.display="none";
  document.getElementById('notes').style.display="none";
  document.getElementById('installer').style.display="none";
  document.getElementById('container').style.display=null;
  document.getElementById('hamburger').checked = false;
}

function viewInstaller() {
  document.getElementById('calendar').style.display="none";
  document.getElementById('edt').style.display="none";
  document.getElementById('notes').style.display="none";
  document.getElementById('container').style.display="none";
  document.getElementById('installer').style.display=null;
  document.getElementById('hamburger').checked = false;
}

// PWA Installation
var beforeInstallPrompt = null;
window.addEventListener("beforeinstallprompt", eventHandler, errorHandler);

function eventHandler(event){
    beforeInstallPrompt = event;        
}

function askPWA() {
  beforeInstallPrompt.prompt();
}

// Vue titre selon appareil utilisé
if (window.matchMedia("(max-width: 600px)").matches) {
  document.getElementById('title').innerHTML = "Agenda 🎄";
  document.getElementById('menuToggle').style.top="30px";
} else {
  document.getElementById('title').innerHTML = "Agenda 🎄 GEII Groupe 2";
  document.getElementById('menuToggle').style.top="50px";
}

// Fonction Emploi du temps
function renderEdt() {
  var calendarEdt = document.getElementById('edt');

  var edt = new FullCalendar.Calendar(calendarEdt, {
    initialView: 'timeGridWeek',
    nowIndicator: true,
    allDaySlot: false,
    scrollTime: '08:00:00',
    locale: 'fr',
    weekends: false,
    eventColor: 'CornflowerBlue',
    googleCalendarApiKey : 'AIzaSyATdEEIAy0sZoNb_WmildGuzDqMVEyK7bM', // Clé API Google Calendar Sécurisée NE PAS MODIFIER !!!
    eventSources: 
    [
      {
        googleCalendarId: "280qjjomfafbui0kd0jpk4v42gdeppcb@import.calendar.google.com",
        color : 'SandyBrown'
      },
      {
        googleCalendarId: "blmeejh60k8vto6lasj5t5sa4g8m2cgs@import.calendar.google.com",
        color : 'DarkSeaGreen'
      }
    ],
    customButtons: {
      grA: {
        text: 'Groupe A',
        click: function() {
          var events = edt.getEventSources();
          events.forEach(event => {
            event.remove(); // Suppression évènements
          });
          edt.addEventSource("280qjjomfafbui0kd0jpk4v42gdeppcb@import.calendar.google.com");
        }
      },
      grB: {
        text: 'Groupe B',
        click: function() {
          var events = edt.getEventSources();
          events.forEach(event => {
            event.remove(); // Suppression évènements
          });
          edt.addEventSource("blmeejh60k8vto6lasj5t5sa4g8m2cgs@import.calendar.google.com");
        }
      }
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'grA,grB'
    }
  });

  edt.render();
};

// Fonction Devoirs faits
// Pour des raisons diverses, veuiller laisser la fonction en dernier
setTimeout(function(){
  var checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {};
  var $checkboxes = jQuery("#notes :checkbox");
  
  $checkboxes.on("change", function(){
    $checkboxes.each(function(){
      checkboxValues[this.id] = this.checked;
    });
    localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
    playSound();
  });
  
  jQuery.each(checkboxValues, function(key, value) {
    jQuery("#" + key).prop('checked', value);
  });
}, 500);
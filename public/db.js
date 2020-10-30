const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

const request = indexedDB.open("budget-tracker", 1);
let db

request.onupgradeneeded = function(e) {
  const db = e.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onerror = function(e) {
  console.log("An error occurred");
};

request.onsuccess = function(e) {
  db = e.target.result;

  if (navigator.onLine) {
    checkDatabase()
  }
}
request.onerror = function(e) {
  console.log(e.target.errorCode)
}


function saveRecord(record) {
  const tx = db.transaction(["pending"], "readwrite");
  const store = tx.objectStore("pending");
  store.add(record);
} 

function checkDatabase() {
  const tx = db.transaction(["pending"], "readwrite");
  const store = tx.objectStore("pending");
  const all = store.getAll();


  all.onsuccess = function () {
    if (all.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(all.result),
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json"
        }

      }).then(response => {
        return response.json()
      }).then(() => {
        const tx = db.transaction(["pending"], "readwrite");
        const store = tx.objectStore("pending");
        store.clear();
      })
    }
  }
}

window.addEventListener("online", checkDatabase)


// db.onerror = function (e) {
//   console.log("error");
// };
// if (method === "put") {
//   store.put(object);
// }
// if (method === "get") {
//   all.onsuccess = function () {
//     resolve(all.result);
//   };
// }
// tx.oncomplete = function () {
//   db.close();
// };
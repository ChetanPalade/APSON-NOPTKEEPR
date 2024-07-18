// script.js
document.addEventListener('DOMContentLoaded', fetchAndDisplayNotes);
document.getElementById('createNoteForm').addEventListener('submit', createNote);
document.getElementById('searchButton').addEventListener('click', searchNotes);
document.getElementById('viewTrashButton').addEventListener('click', viewTrashNotes);
document.getElementById('viewArchivedButton').addEventListener('click', viewArchivedNotes);

function fetchAndDisplayNotes() {       
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
  .then(response => response.json())
  .then(data => displayNotes(data))
  .catch(error => console.error('Error fetching notes:', error));
}

function createNote(event) {
  event.preventDefault();

  const title = document.getElementById('noteTitle').value;
  const content = document.getElementById('noteContent').value;
  const tags = document.getElementById('noteTags').value.split(',').map(tag => tag.trim());
  const backgroundColor = document.getElementById('noteBackgroundColor').value;

  fetch('/api/notes/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ title, content, tags, backgroundColor })
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    fetchAndDisplayNotes();
    document.getElementById('createNoteForm').reset();
  })
  .catch(error => console.error('Error creating note:', error));
}

function searchNotes() {
  const query = document.getElementById('searchInput').value;
  fetch(`/api/notes/search?query=${query}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
  .then(response => response.json())
  .then(data => displayNotes(data))
  .catch(error => console.error('Error searching notes:', error));
}

function viewTrashNotes() {
  fetch('/api/notes/trash', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
  .then(response => response.json())
  .then(data => displayNotes(data))
  .catch(error => console.error('Error fetching trash notes:', error));
}

function viewArchivedNotes() {
  fetch('/api/notes/archived', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
  .then(response => response.json())
  .then(data => displayNotes(data))
  .catch(error => console.error('Error fetching archived notes:', error));
}

function displayNotes(notes) {
  const notesContainer = document.getElementById('notesContainer');
  notesContainer.innerHTML = '';

  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.style.backgroundColor = note.backgroundColor;
    noteElement.innerHTML = `
      <h2>${note.title}</h2>
      <p>${note.content}</p>
      <p>Tags: ${note.tags.join(', ')}</p>
      <button onclick="archiveNote('${note._id}')">Archive</button>
      <button onclick="deleteNote('${note._id}')">Delete</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}

function archiveNote(noteId) {
  fetch(`/api/notes/archive/${noteId}`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    fetchAndDisplayNotes();
  })
  .catch(error => console.error('Error archiving note:', error));
}

function deleteNote(noteId) {
  fetch(`/api/notes/delete/${noteId}`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    fetchAndDisplayNotes();
  })
  .catch(error => console.error('Error deleting note:', error));
}

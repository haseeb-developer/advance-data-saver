document.addEventListener('DOMContentLoaded', () => {
  const dataForm = document.getElementById('dataForm');
  const categorySelect = document.getElementById('category');
  const dynamicFields = document.querySelectorAll('.dynamic-field');
  const dataList = document.getElementById('dataList');
  const selectAllCheckbox = document.getElementById('selectAll');
  const deleteSelectedBtn = document.getElementById('deleteSelected');
  const deleteAllBtn = document.getElementById('deleteAll');
  const searchInput = document.getElementById('searchInput');
  const searchCategory = document.getElementById('searchCategory');
  const searchBtn = document.getElementById('searchBtn');

  // Toggle main password field visibility
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('passwordInput');
  togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePasswordBtn.textContent = type === 'password' ? '👁' : '🙈';
  });

  // Initialize CodeMirror for Code Category
  let codeMirrorInstance = null;

  // Hide all dynamic fields
  function hideAllFields() {
    dynamicFields.forEach(field => field.style.display = 'none');
  }

  // Show dynamic fields based on selected category
  categorySelect.addEventListener('change', (e) => {
    hideAllFields();
    const category = e.target.value;
    if (category === 'image') {
      document.getElementById('fields-image').style.display = 'block';
    } else if (category === 'password') {
      document.getElementById('fields-password').style.display = 'block';
    } else if (category === 'note') {
      document.getElementById('fields-note').style.display = 'block';
    } else if (category === 'code') {
      document.getElementById('fields-code').style.display = 'block';
      if (!codeMirrorInstance) {
        codeMirrorInstance = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
          lineNumbers: true,
          mode: document.getElementById('codeLanguage').value,
          theme: 'dracula',
          lineWrapping: true
        });
      }
    } else if (category === 'link') {
      document.getElementById('fields-link').style.display = 'block';
    } else if (category === 'event') {
      document.getElementById('fields-event').style.display = 'block';
    } else if (category === 'contact') {
      document.getElementById('fields-contact').style.display = 'block';
    } else if (category === 'task') {
      document.getElementById('fields-task').style.display = 'block';
    } else if (category === 'document') {
      document.getElementById('fields-document').style.display = 'block';
    }
  });

  // Update CodeMirror mode when language is changed
  const codeLanguageSelect = document.getElementById('codeLanguage');
  codeLanguageSelect.addEventListener('change', (e) => {
    if (codeMirrorInstance) {
      codeMirrorInstance.setOption('mode', e.target.value);
    }
  });

  // Handle form submission
  dataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = categorySelect.value;
    if (!category) {
      alert('Please select a category.');
      return;
    }

    let entry = {
      id: Date.now(),
      category,
      content: {}
    };

    // Process each category accordingly:
    if (category === 'image') {
      const imageFileInput = document.getElementById('imageFile');
      const imageType = document.getElementById('imageType').value.trim();
      if (imageFileInput.files.length === 0) {
        alert('Please upload an image.');
        return;
      }
      const file = imageFileInput.files[0];
      const reader = new FileReader();
      reader.onload = function(event) {
        entry.content.imageData = event.target.result;
        entry.content.imageType = imageType;
        saveEntry(entry);
        addEntryToList(entry);
        dataForm.reset();
        hideAllFields();
      };
      reader.readAsDataURL(file);
    } else if (category === 'password') {
      const passLabel = document.getElementById('passwordLabel').value.trim();
      const passValue = passwordInput.value;
      if (!passLabel || !passValue) {
        alert('Please enter both a label and a password.');
        return;
      }
      entry.content.label = passLabel;
      entry.content.password = passValue;
      saveEntry(entry);
      addEntryToList(entry);
      dataForm.reset();
      hideAllFields();
    } else if (category === 'note') {
      const noteTitle = document.getElementById('noteTitle').value.trim();
      const noteSubtitle = document.getElementById('noteSubtitle').value.trim();
      let noteTag = document.getElementById('noteTag').value.trim();
      const noteContent = document.getElementById('noteContent').value.trim();
      if (!noteTitle && !noteContent) {
        alert('Please provide at least a title or content for the note.');
        return;
      }
      // Ensure tag starts with a hashtag
      if (noteTag && noteTag[0] !== '#') {
        noteTag = '#' + noteTag;
      }
      entry.content.title = noteTitle;
      entry.content.subtitle = noteSubtitle;
      entry.content.tag = noteTag;
      entry.content.content = noteContent;
      saveEntry(entry);
      addEntryToList(entry);
      dataForm.reset();
      hideAllFields();
    } else if (category === 'code') {
      const codeContent = codeMirrorInstance
        ? codeMirrorInstance.getValue()
        : document.getElementById('codeEditor').value;
      if (!codeContent.trim()) {
        alert('Please enter some code.');
        return;
      }
      entry.content.language = codeLanguageSelect.value;
      entry.content.code = codeContent;
      saveEntry(entry);
      addEntryToList(entry);
      dataForm.reset();
      hideAllFields();
      if (codeMirrorInstance) {
        codeMirrorInstance.setValue('');
      }
    } else if (category === 'link') {
      const linkURL = document.getElementById('linkURL').value.trim();
      const linkTitle = document.getElementById('linkTitle').value.trim();
      const linkDescription = document.getElementById('linkDescription').value.trim();
      if (!linkURL) {
        alert('Please enter a valid URL.');
        return;
      }
      entry.content.url = linkURL;
      entry.content.title = linkTitle;
      entry.content.description = linkDescription;
      saveEntry(entry);
      addEntryToList(entry);
      dataForm.reset();
      hideAllFields();
    } else if (category === 'event') {
      const eventTitle = document.getElementById('eventTitle').value.trim();
      const eventDate = document.getElementById('eventDate').value;
      const eventTime = document.getElementById('eventTime').value;
      const eventLocation = document.getElementById('eventLocation').value.trim();
      if (!eventTitle) {
        alert('Please enter an event title.');
        return;
      }
      entry.content.title = eventTitle;
      entry.content.date = eventDate;
      entry.content.time = eventTime;
      entry.content.location = eventLocation;
      saveEntry(entry);
      addEntryToList(entry);
      dataForm.reset();
      hideAllFields();
    } else if (category === 'contact') {
      const contactName = document.getElementById('contactName').value.trim();
      const contactEmail = document.getElementById('contactEmail').value.trim();
      const contactPhone = document.getElementById('contactPhone').value.trim();
      const contactAddress = document.getElementById('contactAddress').value.trim();
      if (!contactName) {
        alert('Please enter a contact name.');
        return;
      }
      entry.content.name = contactName;
      entry.content.email = contactEmail;
      entry.content.phone = contactPhone;
      entry.content.address = contactAddress;
      saveEntry(entry);
      addEntryToList(entry);
      dataForm.reset();
      hideAllFields();
    } else if (category === 'task') {
      const taskTitle = document.getElementById('taskTitle').value.trim();
      const taskDescription = document.getElementById('taskDescription').value.trim();
      const taskDue = document.getElementById('taskDue').value;
      if (!taskTitle) {
        alert('Please enter a task title.');
        return;
      }
      entry.content.title = taskTitle;
      entry.content.description = taskDescription;
      entry.content.due = taskDue;
      saveEntry(entry);
      addEntryToList(entry);
      dataForm.reset();
      hideAllFields();
    } else if (category === 'document') {
      const documentTitle = document.getElementById('documentTitle').value.trim();
      const documentDescription = document.getElementById('documentDescription').value.trim();
      const documentFileInput = document.getElementById('documentFile');
      if (!documentTitle) {
        alert('Please enter a document title.');
        return;
      }
      if (documentFileInput.files.length > 0) {
        const file = documentFileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
          entry.content.fileData = event.target.result;
          entry.content.title = documentTitle;
          entry.content.description = documentDescription;
          saveEntry(entry);
          addEntryToList(entry);
          dataForm.reset();
          hideAllFields();
        };
        reader.readAsDataURL(file);
      } else {
        // Save without file
        entry.content.title = documentTitle;
        entry.content.description = documentDescription;
        saveEntry(entry);
        addEntryToList(entry);
        dataForm.reset();
        hideAllFields();
      }
    }
  });

  // Save entry to localStorage
  function saveEntry(entry) {
    let entries = JSON.parse(localStorage.getItem('dataEntries')) || [];
    entries.push(entry);
    localStorage.setItem('dataEntries', JSON.stringify(entries));
  }

  // Remove entry from localStorage by ID
  function removeEntry(id) {
    let entries = JSON.parse(localStorage.getItem('dataEntries')) || [];
    entries = entries.filter(entry => entry.id !== id);
    localStorage.setItem('dataEntries', JSON.stringify(entries));
  }

  // Load entries from localStorage on startup
  function loadEntries() {
    const savedEntries = localStorage.getItem('dataEntries');
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      entries.forEach(entry => addEntryToList(entry));
    }
  }

  // Add entry to the UI list
  function addEntryToList(entry) {
    const li = document.createElement('li');
    li.className = 'data-item';
    li.dataset.id = entry.id;

    // Custom checkbox (for each entry)
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'entry-checkbox';
    li.appendChild(checkbox);

    // Header with category title and individual delete button
    const headerDiv = document.createElement('div');
    headerDiv.className = 'item-header';
    const title = document.createElement('h3');
    title.textContent = entry.category.toUpperCase();
    headerDiv.appendChild(title);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-single';
    delBtn.addEventListener('click', () => {
      li.remove();
      removeEntry(entry.id);
    });
    headerDiv.appendChild(delBtn);
    li.appendChild(headerDiv);

    // Content display based on category
    const contentDiv = document.createElement('div');
    contentDiv.className = 'data-content';

    if (entry.category === 'image') {
      const img = document.createElement('img');
      img.src = entry.content.imageData;
      img.alt = 'Saved Image';
      contentDiv.appendChild(img);
      if (entry.content.imageType) {
        const typeP = document.createElement('p');
        typeP.innerHTML = `<strong>Type:</strong> ${entry.content.imageType}`;
        contentDiv.appendChild(typeP);
      }
    } else if (entry.category === 'password') {
      const labelP = document.createElement('p');
      labelP.innerHTML = `<strong>Label:</strong> ${entry.content.label}`;
      contentDiv.appendChild(labelP);
      const passwordP = document.createElement('p');
      passwordP.innerHTML = `<strong>Password:</strong> <span class="masked">******</span>`;
      const toggleSpan = document.createElement('span');
      toggleSpan.textContent = ' 👁';
      toggleSpan.style.cursor = 'pointer';
      toggleSpan.addEventListener('click', () => {
        const maskedSpan = passwordP.querySelector('.masked');
        if (maskedSpan.textContent === '******') {
          maskedSpan.textContent = entry.content.password;
          toggleSpan.textContent = ' 🙈';
        } else {
          maskedSpan.textContent = '******';
          toggleSpan.textContent = ' 👁';
        }
      });
      passwordP.appendChild(toggleSpan);
      contentDiv.appendChild(passwordP);
    } else if (entry.category === 'note') {
      if (entry.content.title) {
        const noteTitle = document.createElement('h4');
        noteTitle.textContent = entry.content.title;
        contentDiv.appendChild(noteTitle);
      }
      if (entry.content.subtitle) {
        const noteSubtitle = document.createElement('p');
        noteSubtitle.innerHTML = `<em>${entry.content.subtitle}</em>`;
        contentDiv.appendChild(noteSubtitle);
      }
      if (entry.content.tag) {
        const noteTag = document.createElement('p');
        noteTag.innerHTML = `<span class="note-tag">${entry.content.tag}</span>`;
        contentDiv.appendChild(noteTag);
      }
      if (entry.content.content) {
        const noteContent = document.createElement('p');
        noteContent.textContent = entry.content.content;
        contentDiv.appendChild(noteContent);
      }
    } else if (entry.category === 'code') {
      const pre = document.createElement('pre');
      pre.className = 'code-block';
      const codeEl = document.createElement('code');
      codeEl.textContent = entry.content.code;
      codeEl.className = entry.content.language;
      pre.appendChild(codeEl);
      contentDiv.appendChild(pre);
      hljs.highlightElement(codeEl);
    } else if (entry.category === 'link') {
      const linkEl = document.createElement('a');
      linkEl.href = entry.content.url;
      linkEl.textContent = entry.content.title || entry.content.url;
      linkEl.target = '_blank';
      contentDiv.appendChild(linkEl);
      if (entry.content.description) {
        const desc = document.createElement('p');
        desc.textContent = entry.content.description;
        contentDiv.appendChild(desc);
      }
    } else if (entry.category === 'event') {
      const eventTitle = document.createElement('h4');
      eventTitle.textContent = entry.content.title;
      contentDiv.appendChild(eventTitle);
      const details = document.createElement('p');
      details.innerHTML = `<strong>Date:</strong> ${entry.content.date || 'N/A'} <br>
                           <strong>Time:</strong> ${entry.content.time || 'N/A'} <br>
                           <strong>Location:</strong> ${entry.content.location || 'N/A'}`;
      contentDiv.appendChild(details);
    } else if (entry.category === 'contact') {
      const contactName = document.createElement('h4');
      contactName.textContent = entry.content.name;
      contentDiv.appendChild(contactName);
      const info = document.createElement('p');
      info.innerHTML = `<strong>Email:</strong> ${entry.content.email || 'N/A'} <br>
                        <strong>Phone:</strong> ${entry.content.phone || 'N/A'} <br>
                        <strong>Address:</strong> ${entry.content.address || 'N/A'}`;
      contentDiv.appendChild(info);
    } else if (entry.category === 'task') {
      const taskTitle = document.createElement('h4');
      taskTitle.textContent = entry.content.title;
      contentDiv.appendChild(taskTitle);
      if (entry.content.description) {
        const taskDesc = document.createElement('p');
        taskDesc.textContent = entry.content.description;
        contentDiv.appendChild(taskDesc);
      }
      if (entry.content.due) {
        const dueP = document.createElement('p');
        dueP.innerHTML = `<strong>Due:</strong> ${entry.content.due}`;
        contentDiv.appendChild(dueP);
      }
    } else if (entry.category === 'document') {
      const docTitle = document.createElement('h4');
      docTitle.textContent = entry.content.title;
      contentDiv.appendChild(docTitle);
      if (entry.content.description) {
        const docDesc = document.createElement('p');
        docDesc.textContent = entry.content.description;
        contentDiv.appendChild(docDesc);
      }
      if (entry.content.fileData) {
        const downloadLink = document.createElement('a');
        downloadLink.href = entry.content.fileData;
        downloadLink.download = entry.content.title;
        downloadLink.textContent = 'Download Document';
        downloadLink.className = 'document-file';
        contentDiv.appendChild(downloadLink);
      }
    }
    li.appendChild(contentDiv);
    dataList.appendChild(li);
  }

  // "Select All" functionality
  selectAllCheckbox.addEventListener('change', (e) => {
    const checked = e.target.checked;
    document.querySelectorAll('#dataList .entry-checkbox').forEach(cb => {
      cb.checked = checked;
    });
  });

  // "Delete Selected" button event
  deleteSelectedBtn.addEventListener('click', () => {
    document.querySelectorAll('#dataList .entry-checkbox').forEach(cb => {
      if (cb.checked) {
        const li = cb.closest('.data-item');
        const id = Number(li.dataset.id);
        li.remove();
        removeEntry(id);
      }
    });
  });

  // "Delete All" button event
  deleteAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all entries?')) {
      localStorage.removeItem('dataEntries');
      dataList.innerHTML = '';
    }
  });

  // Search filter functionality
  function filterEntries() {
    const query = searchInput.value.toLowerCase();
    const selectedCategory = searchCategory.value.toLowerCase();
    document.querySelectorAll('#dataList .data-item').forEach(item => {
      const itemCategory = item.querySelector('.item-header h3').textContent.toLowerCase();
      const itemText = item.textContent.toLowerCase();
      // Check if the entry matches both the search query and category (or if "all" is selected)
      if ((selectedCategory === 'all' || itemCategory === selectedCategory) &&
          itemText.indexOf(query) !== -1) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Search button event
  searchBtn.addEventListener('click', filterEntries);
  
  // Optionally, filter as user types (uncomment the following lines if desired)
  // searchInput.addEventListener('keyup', filterEntries);
  // searchCategory.addEventListener('change', filterEntries);

  // Load entries on page load (persistent storage)
  loadEntries();
});

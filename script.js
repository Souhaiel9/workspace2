const dropArea = document.querySelector('.drop-section')
const listSection = document.querySelector('.list-section')
const listContainer = document.querySelector('.list')
const fileSelector = document.querySelector('.file-selector')
const fileSelectorInput = document.querySelector('.file-selector-input')

// upload files with browse button
fileSelector.onclick = () => fileSelectorInput.click()
fileSelectorInput.onchange = () => {
    [...fileSelectorInput.files].forEach((file) => {
        if(typeValidation(file.type)){
            uploadFile(file)
        }
    })
}

// when file is over the drag area
dropArea.ondragover = (e) => {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((item) => {
        if(typeValidation(item.type)){
            dropArea.classList.add('drag-over-effect')
        }
    })
}
// when file leave the drag area
dropArea.ondragleave = () => {
    dropArea.classList.remove('drag-over-effect')
}
// when file drop on the drag area
dropArea.ondrop = (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over-effect')
    if(e.dataTransfer.items){
        [...e.dataTransfer.items].forEach((item) => {
            if(item.kind === 'file'){
                const file = item.getAsFile();
                if(typeValidation(file.type)){
                    uploadFile(file)
                }
            }
        })
    }else{
        [...e.dataTransfer.files].forEach((file) => {
            if(typeValidation(file.type)){
                uploadFile(file)
            }
        })
    }
}


// check the file type
function typeValidation(type){
    var splitType = type.split('/')[0]
    if(type == 'application/pdf' || splitType == 'image' || splitType == 'video'){
        return true
    }
}

// upload file function
function uploadFile(file){
    listSection.style.display = 'block'
    var li = document.createElement('li')
    li.classList.add('in-prog')
    li.innerHTML = `
        <div class="col">
            <img src="icons/${iconSelector(file.type)}" alt="">
        </div>
        <div class="col">
            <div class="file-name">
                <div class="name">${file.name}</div>
                <span>0%</span>
            </div>
            <div class="file-progress">
                <span></span>
            </div>
            <div class="file-size">${(file.size/(1024*1024)).toFixed(2)} MB</div>
        </div>
        <div class="col">
            <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20"><path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="tick" height="20" width="20"><path d="m8.229 14.438-3.896-3.917 1.438-1.438 2.458 2.459 6-6L15.667 7Z"/></svg>
        </div>
    `
    listContainer.prepend(li)
    var http = new XMLHttpRequest()
    var data = new FormData()
    data.append('file', file)
    http.onload = () => {
        li.classList.add('complete')
        li.classList.remove('in-prog')
    }
    http.upload.onprogress = (e) => {
        var percent_complete = (e.loaded / e.total)*100
        li.querySelectorAll('span')[0].innerHTML = Math.round(percent_complete) + '%'
        li.querySelectorAll('span')[1].style.width = percent_complete + '%'
    }
    http.open('POST', 'sender.php', true)
    http.send(data)
    li.querySelector('.cross').onclick = () => http.abort()
    http.onabort = () => li.remove()
}
// find icon for file
function iconSelector(type){
    var splitType = (type.split('/')[0] == 'application') ? type.split('/')[1] : type.split('/')[0];
    return splitType + '.png'
}

document.addEventListener('DOMContentLoaded', function() {
    const listNameInput = document.getElementById('SST-list-name');
    const listNameCount = document.getElementById('SST-list-name-count');

    listNameInput.addEventListener('input', function() {
        const count = listNameInput.value.length;
        listNameCount.textContent = `${count}/30`;
    });

    const addListBtn = document.getElementById('SST-add-list-btn');
    addListBtn.addEventListener('click', function() {
        const listName = document.getElementById('SST-list-name').value;
        const listDescription = document.getElementById('SST-list-description').value;
        const listStartDate = document.getElementById('SST-list-start-date').value;
        const listEndDate = document.getElementById('SST-list-end-date').value;
        if (listName.trim() === '' || listDescription.trim() === '' || listStartDate.trim() === '' || listEndDate.trim() === '') {
            alert('Please fill in all fields');
            return;
        }
        const list = document.createElement('div');
        list.className = 'SST-list';
        list.innerHTML = `
            <h2>${listName}</h2>
            <p>Description: ${listDescription}</p>
            <p>Start Date: ${listStartDate}</p>
            <p>End Date: ${listEndDate}</p>
            <button class="SST-delete-list-btn">Delete Project</button>
            <input type="text" class="SST-task-name" placeholder="Enter task name">
            <select class="SST-task-priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button class="SST-add-task-btn">Add Task</button>
            <ul class="SST-task-list"></ul>
        `;
        document.querySelector('.SST-lists-container').appendChild(list);

        // Close the modal after adding the project
        closeModal();
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('SST-add-task-btn')) {
            const taskName = event.target.parentElement.querySelector('.SST-task-name').value;
            const taskPriority = event.target.parentElement.querySelector('.SST-task-priority').value;
            if (taskName.trim() === '') {
                alert('Please enter a task name');
                return;
            }
            const task = document.createElement('li');
            task.className = 'SST-task-item';
            task.innerHTML = `
                <input type="checkbox">
                <span>${taskName}</span>
                <span> Priority: ${taskPriority}</span>
                <button class="SST-edit-task-btn">Edit</button>
                <button class="SST-done-task-btn">Done</button>
            `;
            event.target.parentElement.querySelector('.SST-task-list').appendChild(task);
        }

        if (event.target.classList.contains('SST-edit-task-btn')) {
            const taskNameSpan = event.target.parentElement.querySelector('span');
            const newTaskName = prompt('Enter new task name:', taskNameSpan.textContent);
            if (newTaskName !== null) {
                taskNameSpan.textContent = newTaskName;
            }
        }

        if (event.target.classList.contains('SST-done-task-btn')) {
            const taskItem = event.target.parentElement;
            taskItem.classList.toggle('SST-done');
        }

        if (event.target.classList.contains('SST-delete-list-btn')) {
            const list = event.target.parentElement;
            list.remove();
        }
    });

    // Modal functionality
    const modal = document.getElementById('SST-project-modal');
    const newProjectBtn = document.querySelector('.SST-new-project');
    const closeButton = document.querySelector('.SST-close-button');

    newProjectBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        closeModal();
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
    }
});

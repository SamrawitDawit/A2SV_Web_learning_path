document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    loadTasks()

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e){
        if (e.key == "Enter") {
            addTask();
        }
    })

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item'

            const taskTextSpan = document.createElement('span')
            taskTextSpan.textContent = taskText

            const buttonsContainer = document.createElement('div')
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', function() {
                editTask(taskTextSpan);
            })

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', function(){
                taskItem.remove();
                saveTasks();
            });


            buttonsContainer.appendChild(editBtn);
            buttonsContainer.appendChild(deleteBtn);
            taskItem.appendChild(taskTextSpan);
            taskItem.appendChild(buttonsContainer);
            taskList.appendChild(taskItem);
            
            taskInput.value = '';
            saveTasks();

        }
    }

    function editTask(taskTextSpan) {
        const currentText = taskTextSpan.textContent;
        const newText = prompt('Edit your task:', currentText);
        if (newText !== null && newText.trim() !== ''){
            taskTextSpan.textContent = newText.trim();
            saveTasks();
        }
    }
    function saveTasks(){
        const tasks = [];
        document.querySelectorAll('.task-item span').forEach(function(task){
            tasks.push(task.textContent);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks(){
        const savedTasks = localStorage.getItem('tasks');
        if(savedTasks){
            const tasks = JSON.parse(savedTasks)
            tasks.forEach(function(taskText){
                const taskItem = document.createElement('li');
                taskItem.className = 'task-item';

                const taskTextSpan = document.createElement('span');
                taskTextSpan.textContent = taskText;

                const buttonsContainer = document.createElement('div')
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.className = 'edit-btn';
                editBtn.addEventListener('click', function() {
                    editTask(taskTextSpan);
                })

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', function(){
                    taskItem.remove();
                    saveTasks();
                });

                buttonsContainer.appendChild(editBtn);
                buttonsContainer.appendChild(deleteBtn);
                taskItem.appendChild(taskTextSpan);
                taskItem.appendChild(buttonsContainer);
                taskList.appendChild(taskItem);
            })
        }
    }
})
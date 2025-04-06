interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
    createdAt: Date;
}

class TodoList {
    private todos: TodoItem[] = [];
    private nextId: number = 1;


    constructor(
        private taskInput: HTMLInputElement,
        private addTaskBtn: HTMLButtonElement,
        private taskList: HTMLUListElement
    ){
        this.setupEventListeners();
        this.loadTasks();
    }

    private setupEventListeners(): void{
        this.addTaskBtn.addEventListener('click', ()=>this.addTask());
        this.taskInput.addEventListener('keypress', (e)=>{
            if(e.key === 'Enter') this.addTask();
        });
    }

    private addTask(): void {
        const taskText = this.taskInput.value.trim();
        if (taskText) {
            const newTodo: TodoItem = {
                id: this.nextId++,
                text: taskText,
                completed: false,
                createdAt: new Date()
            };
            this.todos.push(newTodo);
            this.renderTask(newTodo);
            this.saveTasks();
            this.taskInput.value = '';
        }
    }

    private renderTask(todo: TodoItem): void {
        const taskItem = document.createElement("li")
        taskItem.className = `task-item ${todo.completed ? 'completed' : ''}`
        taskItem.dataset.id = todo.id.toString();

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = todo.text;
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'task-buttons';

        const completeBtn = document.createElement('button');
        completeBtn.textContent = todo.completed ? 'Undo': 'Complete';
        completeBtn.className = 'complete-btn';
        completeBtn.addEventListener('click', ()=>this.toggleComplete(todo.id));

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', ()=>this.editTask(todo.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', ()=> this.deleteTask(todo.id));

        buttonsContainer.append(completeBtn, editBtn, deleteBtn);
        taskItem.append(taskTextSpan, buttonsContainer);
        this.taskList.appendChild(taskItem);
    }

    private toggleComplete(id: number): void {
        const todo = this.todos.find(task => task.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTasks();
            this.refreshDisplay();
        }
    }

    private editTask(id: number): void {
        const todo = this.todos.find(task => task.id === id);
        if (todo) {
            const newText = prompt('Edit your task', todo.text)
            if (newText !== null && newText.trim() !== ''){
                todo.text = newText.trim();
                this.saveTasks();
                this.refreshDisplay();
            }
        }
    }

    private deleteTask(id: number): void {
        this.todos = this.todos.filter(task => task.id !== id);
        this.saveTasks();
        this.refreshDisplay();
    }

    private refreshDisplay(): void{
        this.taskList.innerHTML = '';
        this.todos.forEach(todo => this.renderTask(todo));
    }

    private saveTasks(): void{
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('nextId', this.nextId.toString());
    }

    private loadTasks(): void{
        const savedTodos = localStorage.getItem('todos');
        const savedNextId = localStorage.getItem('nextId');

        if (savedTodos) {
            this.todos = JSON.parse(savedTodos);
            this.todos.forEach(todo => {
                todo.createdAt = new Date(todo.createdAt)
            });
        }
        if (savedNextId) {
            this.nextId = parseInt(savedNextId, 10);
        }

        this.refreshDisplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput') as HTMLInputElement;
    const addTaskBtn = document.getElementById('addTaskBtn') as HTMLButtonElement;
    const taskList = document.getElementById('taskList') as HTMLUListElement;

    if (taskInput && addTaskBtn && taskList) {
        new TodoList(taskInput, addTaskBtn, taskList);
    } else {
        console.error('Could not find all required elements!');
    }
});
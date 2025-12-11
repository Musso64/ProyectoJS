const taskName = document.getElementById("taskName");
const taskDescription = document.getElementById("taskDescription");
const taskStatus = document.getElementById("taskStatus");
const tasksToDo = document.getElementById("to-do");
const tasksInProgress = document.getElementById("inProgress");
const tasksFinished = document.getElementById("finished");
const formTasks = document.querySelector("form");
const taskDashboard = document.getElementById("taskDashboard");
const modalContainer = document.querySelector('.modal-container');
let editingTaskId = null;
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

let tasks = [];
class Task {
    id=crypto.randomUUID();
    name;
    description;
    status;
    createdAt=Date.now();
    completedAt;
    constructor(name,description,status){
        this.name = name;
        this.status = status;
        this.description= description;
    }
}

function handleDelete(taskID, taskElement) {
    if (!taskElement || !taskID) return;

    taskElement.classList.add('bg-red-50', 'border-l-4', 'border-red-500');
    
    taskElement.style.transition = 'all 0.3s ease';
    taskElement.style.transform = 'scale(0.95)';
    taskElement.style.opacity = '0';
    taskElement.style.maxHeight = taskElement.offsetHeight + 'px';
    
    setTimeout(() => {
        taskElement.style.maxHeight = '0';
        taskElement.style.marginBottom = '0';
        taskElement.style.paddingTop = '0';
        taskElement.style.paddingBottom = '0';
    }, 50);

    setTimeout(() => {
        tasks = tasks.filter(task => task.id !== taskID);
        saveTasks();
        taskElement.remove();
        showNotification('Task deleted', 'warning');
        
    }, 350);
}

function renderTasks () {
    tasksToDo.innerHTML="";
    tasksInProgress.innerHTML="";
    tasksFinished.innerHTML="";
    tasks.forEach(task => {
        const liTask = document.createElement("li");
        liTask.className = "bg-white p-2 font-light rounded-md shadow-md mb-1 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5";
        liTask.setAttribute('data-task-id', task.id);
        liTask.innerHTML = `  <div class='flex flex-row justify-around'> 
                                <div class='flex flex-col'> 
                                <div class='font-semibold'>${task.name}</div> 
                                <div class='ms-2 font-light break-words max-w-xs overflow-y-auto max-h-10'>${task.description || "No Description"}</div>
                                <div class='ms-4 font-thin'>Created at: ${new Date (task.createdAt).toLocaleString ()}</div>
                                ${task.completedAt ? `<div class='ms-4 font-thin'>Completed at: ${new Date (task.completedAt).toLocaleString ()}</div>` : ""} 
                                </div>
                                <div class='flex flex-col align-middle justify-center gap-2'> 
                                    <button class="bg-red-500 rounded-md py-1 w-full text-white shadow-md h-14 deleteTasks transition-colors duration-200 hover:bg-red-600 active:scale-95 mb-1">Delete</button> 
                                     <button type="button" class="bg-yellow-500 rounded-md py-1 w-full text-white shadow-md h-14 editTasks transition-colors duration-200 hover:bg-yellow-600 active:scale-95 mt-1">Edit</button> 
                                </div> 
                                </div> `;
        liTask.classList.add('opacity-0', 'scale-95');
        switch (task.status){
            case "toDo":
                tasksToDo.appendChild(liTask);
                break;
            case "inProgress":
                tasksInProgress.appendChild(liTask);
                break;
            case "finished":
                tasksFinished.appendChild(liTask);
                break;
        }
        setTimeout(() => {
            liTask.classList.remove('opacity-0', 'scale-95');
            liTask.classList.add('opacity-100', 'scale-100');
        }, 10);
    });
}

function saveTasks(){
    const saveTask=JSON.stringify(tasks);
    try{
        localStorage.setItem("taskDashboard",saveTask);
        console.log("Why would I ever want for something else when I am God?");
    } catch (e){
        console.error("What became of the want to see myself a RUNAWAY? ",e);
    }
}

function loadTasks (){
    try{
        const loadTask = localStorage.getItem("taskDashboard");
        if (loadTask){
            tasks = JSON.parse(loadTask);
            renderTasks();
            console.log("Fly perfect wings, I know you are still with me!");
        } else {
            tasks = [];
        }
    } catch (e){
        console.log("Please die, little dreams, Kill the camellias in me... ", e);
    }
}

function addTask(){
        let name = taskName.value;
        let description = taskDescription.value;
        let status = taskStatus.value;
        let task = new Task(name,description,status);
        if(status === "finished"){
            task.completedAt = Date.now();
        }
        if (!name.trim()) {
            alert('Task name is required! Dumbass!');
            taskName.focus();
            return;
        }
        try{
            tasks.push(task);
            renderTasks();
            saveTasks();
            formTasks.reset();
            console.log("Perhaps there are still happy answers left for my discovery...")
        } catch (e) {
            console.log("Maybe we are all cruel machines stuffed into human skin...", e);
        }

    }

function modalEditTasks (taskID){
    const editTaskName = document.getElementById("editTaskName");
    const editTaskDescription = document.getElementById("editTaskDescription");
    const editTaskStatus = document.getElementById("editTaskStatus");
    editingTaskId = taskID;

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    document.querySelector(".modal-container").classList.remove("hidden");
    modal.classList.add("flex");
    overlay.classList.add("flex");
    document.querySelector(".modal-container").classList.add("flex");

    for (let i=0; i < tasks.length ; i++){
        if (tasks[i].id === editingTaskId){
            editTaskName.value = tasks[i].name;
            editTaskDescription.value = tasks[i].description;
            editTaskStatus.value = tasks[i].status;
            break;
        }
    }

}

function modalClose (){
    modal.classList.remove("flex");
    overlay.classList.remove("flex");
    document.querySelector(".modal-container").classList.remove("flex");
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    document.querySelector(".modal-container").classList.add("hidden");
}

function saveEditedTasks (taskID) {
    const editTaskName = document.getElementById("editTaskName");
    const editTaskDescription = document.getElementById("editTaskDescription");
    const editTaskStatus = document.getElementById("editTaskStatus");
    try {
        for (let i=0; i < tasks.length ; i++){
            if (tasks[i].id === taskID){
                tasks[i].name = editTaskName.value;
                tasks[i].description = editTaskDescription.value;
                tasks[i].status = editTaskStatus.value;
                if (tasks[i].status === "finished" && !tasks[i].completedAt){
                    tasks[i].completedAt = Date.now();
                }
                break;
            }
        }
        saveTasks();
        renderTasks();
        modalClose();
        console.log("If I went with you would there be happy-ever-afters?");
    } catch (e) {
        console.log("So I can hear no more... ", e);
    }

}

formTasks.addEventListener("submit", function(event) {
    event.preventDefault();
    addTask();
});


document.addEventListener("DOMContentLoaded",function (){
    loadTasks();

    taskDashboard.addEventListener("click", function (event){

    if(event.target.classList.contains('deleteTasks')){
        const taskElement = event.target.closest('li');
        const taskId = taskElement?.dataset?.taskId;
        if (taskId && taskElement) {
            if(confirm("Do you REALLY want to delete this thingy?")){
                handleDelete(taskId, taskElement);
            }
        }
    }     

    if(event.target.classList.contains('editTasks')) {
        const taskElement = event.target.closest('li');
        const taskId = taskElement?.dataset?.taskId;
        if (taskId) {
            modalEditTasks(taskId);
        }
    }
    modalContainer.addEventListener("click", function (event){
        if(event.target.classList.contains('closeModal')) {
            modalClose();
        }
        if(event.target.classList.contains('saveChanges')) {
            saveEditedTasks(editingTaskId);
        }
    })
})
});
const taskName = document.getElementById("taskName");
const taskDescription = document.getElementById("taskDescription");
const taskStatus = document.getElementById("taskStatus");
const tasksToDo = document.getElementById("to-do");
const tasksInProgress = document.getElementById("inProgress");
const tasksFinished = document.getElementById("finished");
const formTasks = document.querySelector("form");
const taskDashboard = document.getElementById("taskDashboard");

let tasks = [];
let x;
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

function handleDelete (taskID, taskElement){
    tasks = tasks.filter (task => task.id !== taskID);
    saveTasks();
    renderTasks();
}

function renderTasks () {
    tasksToDo.innerHTML="";
    tasksInProgress.innerHTML="";
    tasksFinished.innerHTML="";
    tasks.forEach(task => {
        const liTask = document.createElement("li");
        liTask.className = "bg-white p-2 font-light rounded-md shadow-md mb-1";
        liTask.setAttribute('data-task-id', task.id);
        liTask.innerHTML = `  <div class='flex flex-row justify-around'> 
                                <div class='flex flex-col'> 
                                <div class='font-semibold'>${task.name}</div> 
                                <div class='ms-2 font-light break-words max-w-xs overflow-y-auto max-h-10'>${task.description || "No Description"}</div>
                                <div class='ms-4 font-thin'>${new Date (task.createdAt).toLocaleString ()}</div> 
                                </div>
                                <div class='flex flex-col'> 
                                    <button type="button" class="bg-red-500 rounded-md py-1 w-full text-white shadow-md h-1/2 deleteTasks">Delete</button> 
                                     <button type="button" class="bg-yellow-500 rounded-md py-1 w-full text-white shadow-md h-1/2 viewTasks">View</button> 
                                </div> 
                                </div> `;
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
        if (!name.trim()) {
            alert('Task name is required! Dumbass!');
            taskName.focus();
            return;
        }   
        tasks.push(task);
        renderTasks();
        saveTasks();
        formTasks.reset();
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
})
});
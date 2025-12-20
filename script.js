//Things to note:
//javascript requires ";" after each line/function.
//=== means equal.
//What does parseInt do?

//Load raw data from localStorage (may be null)
let raw = JSON.parse(localStorage.getItem("tasks"));

//Drag and drop logic
let draggedTaskId = null;
let insertIndex = null;

//Need to relearn how this code works
let tasks = Array.isArray(raw) ? raw.map(item => {
    if (typeof item === 'string') {                                                                     //this handles legacy data that may still be using only strings
        return { 
            id: Date.now() + Math.floor(Math.random() * 1000), 
            text: item,
            done: false,
            important: false, //is this right?
            urgent: false,
            quadrant: 4
         };
    } else {
        return {
            id: item.id || (Date.now() + Math.floor(Math.random() * 1000)),
            text: item.text || '',
            done: item.done,
            important: item.important,
            urgent: item.urgent,
            quadrant: computeQuad(item.important, item.urgent)

        };
    }
}) : [];

//Clear old data and load from local storage
rebuildDOM();

// Calculating quadrant
function computeQuad(important, urgent) {
    if (important && urgent) return 1;
    if (important && !urgent) return 2;
    if (!important && urgent) return 3;
    return 4;
}

// Calculating important and urgent from quadrant
function computeFromQuad(quadrant) {
    switch (quadrant) {
        case 1: return { important: true, urgent: true };
        case 2: return { important: true, urgent: false };
        case 3: return { important: false, urgent: true};
        case 4: return { important: false, urgent: false };
        default: return { important: false, urgent: false };
    }
}

//Create a task
function createTask(userInput, important, urgent) {
    return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: userInput,
        done: false,
        important: important,
        urgent: urgent,
        quadrant: computeQuad(important, urgent)
    };
}

function rebuildDOM() {
    for (let i = 1; i <= 4; i++) {
    document.getElementById("q" + i).innerHTML = "";
}
tasks.forEach(task => addTaskToDOM(task));
}

// Assigning event listeners for each quadrant
for (let i = 1; i <= 4; i++) {
    const quadrant = document.getElementById("quad-q" + i);

    quadrant.addEventListener("dragover", function (event) {
        event.preventDefault(); // required
        quadrant.classList.add("drag-over");

        const mouseY = event.clientY;
        const items = quadrant.querySelectorAll("li");

        // Always insert at the end of items array (default behaviour)
        insertIndex = items.length;

        items.forEach((li, index) => {
            const rect = li.getBoundingClientRect();            // finding the position of each li
            const middle = rect.top + rect.height / 2;          // finding the mid point

            // if mouse is above the middle then insert before, loops ends because insertIndex != items.length anymore
            if (mouseY < middle && insertIndex === items.length) {
                insertIndex = index;
            }
        });
            
        console.log("Quadrant:", i, "Insert index:", insertIndex);
    });
        
    quadrant.addEventListener("dragleave", () => {
        quadrant.classList.remove("drag-over");
    });

    quadrant.addEventListener("drop", function (event) {
        event.preventDefault(); //required
        quadrant.classList.remove("drag-over");

        // 1. find the task
        const task = tasks.find(t => t.id === draggedTaskId);
        if (!task) return;

        // 2. update task.quadrant = i
        task.quadrant = i;
        
    
        //2.5 recalculate important and urgent attributes
        const updateTask = computeFromQuad(i);
        task.important = updateTask.important;
        task.urgent = updateTask.urgent;

        // Change data
        // Remove the dragged task from tasks array
        const oldIndex = tasks.indexOf(task);
        tasks.splice(oldIndex, 1);

        // Place task in the right order in tasks array
        // Find the first task in the quadrant
        const firstIndexInTasks = tasks.findIndex(t => t.quadrant === i);

        // Calculate index position
        // Special case: if insertIndex is null for some reason...
        if (insertIndex === null) {
            insertIndex = tasks.filter(t => t.quadrant === i).length;
        }

        const finalIndex = firstIndexInTasks === -1 ? tasks.length : firstIndexInTasks + insertIndex;

        tasks.splice(finalIndex, 0, task);
        // 3. save
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // 4. rebuild DOM and reset draggedTaskId
        rebuildDOM();
        draggedTaskId = null;
    });
}



//End testing

//function to build the DOM (the HTML code) and inserting the data from local storage into it
function addTaskToDOM(task) {
    
    const li = document.createElement('li');
    li.draggable = true; //!task.done;                  //if task is completed, no drag
    li.addEventListener("dragstart", function (event) {      //This records the task id
        if (task.done) {
            event.preventDefault();
            return;
        }
        draggedTaskId = task.id;
        insertIndex = null;
        li.classList.add("task-dragging");
        //console.log("Drag started:", draggedTaskId);
    });

    li.addEventListener("dragend", function () {
        li.classList.remove("task-dragging");
    });


    li.setAttribute('data-id', task.id);                //Store unique id for reference
    li.classList.toggle('completed', task.done);        //Add 'completed' class if task is done
    
    //Create a label or span to display the task text. what is the difference between a label and span???
    const taskSpan = document.createElement('span');
    taskSpan.textContent = task.text;                   //fill span with task.text
    taskSpan.classList.add('task-text');                //allow for css styling
    li.appendChild(taskSpan);                           

    const checkbox = document.createElement('input');   //what is an input element???
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;                       //checked if the task is done
    checkbox.id = `task-${task.id}`;                    //unique id for the checkbox. ${} is used to insert the variable value into the string, javascript will evaluate the value inside the ${}
    li.appendChild(checkbox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "X";                                                                 // <button>X</button>
    deleteButton.className = 'delete-task';                                                          // <button class="delete-Button">X</button> (to allow for css to apply style)
    li.appendChild(deleteButton);

    document.getElementById("q" + task.quadrant).appendChild(li);                                   // adding the li element to the relevant list                           

    //Checkbox eventListener
    checkbox.addEventListener('change', () => {         
        task.done = checkbox.checked;
        li.classList.toggle('completed', task.done);

        localStorage.setItem('tasks', JSON.stringify(tasks));           //save change to localStorage after each change
    })

    //It removes the li from the DOM and removes the li from local storage
    deleteButton.addEventListener("click", function () {                                            
        li.classList.add("task-exit");
        setTimeout(() => li.remove(), 200);                                                         //removes the li from the DOM after 200 milliseconds to allow for the css animation to complete
                                                                                        
        tasks = tasks.filter(t => t.id !== task.id);                                                //remove the task from the array using id
        localStorage.setItem("tasks", JSON.stringify(tasks));                                       //update local storage with new array
        
    });

}

//allowing the button to add tasks when clicked
document.getElementById("addButton").addEventListener("click", function() {                         //in the document (html file) find the element "addButton" and if someone clicks the button run the function.
    let task = document.getElementById("taskInput").value;                                          //this is the function. It is assigning the variable task with the user input.
    if (task === "") return;                                                                        //To prevent blank tasks from being added. 

    let importance = document.getElementById("important").value === "true";                         // Converting string to boolean 
    let urgency = document.getElementById("urgent").value === "true";                               // Converting string to boolean 
    
    
    task = createTask(task, importance, urgency);                                                   // creating the task object
    tasks.push(task);                                                                               //pushing the user data to the tasks array for local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));                                           //saves the task array to local storage as each item is added.

    rebuildDOM();

    //Clear user input data and display placeholder text
    document.getElementById("taskInput").value = "";
});

//allowing "enter" key to add tasks to the list
document.getElementById("taskInput").addEventListener("keydown", function(event) {                  //listen for the event keydown in the id taskList, use a function passing a variable to check if the keydown was the "Enter" key.
    if (event.key === "Enter") {
        document.getElementById("addButton").click();                                               //instead of duplicating the rules again, simply call on the addButton function.
    }
});

//clear all button logic
const modal = document.getElementById("confirm-modal");
const yesBtn = document.getElementById("confirm-yes");
const noBtn = document.getElementById("confirm-no");
const clearAllBtn = document.getElementById("clear-all");

clearAllBtn.addEventListener("click", function() {
     //make the modal appear in DOM
    modal.classList.add("modal-visible");
});

 //ESC key close modal
document.addEventListener("keydown", function(event) {
    if (event.key !== "Escape") return;
    if (!modal.classList.contains("modal-visible")) return;
       
    modal.classList.remove("modal-visible");
});

//Click outside modal closes it
modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.classList.remove("modal-visible");
    }
});

//event listeners for no button --> return
noBtn.addEventListener("click", function() {
    modal.classList.remove("modal-visible");
});

//event listener for yes button --> delete storage, DOM
yesBtn.addEventListener("click", function() {
    tasks = [];
    localStorage.removeItem("tasks");
    rebuildDOM();
    modal.classList.remove("modal-visible");
    document.getElementById("taskInput").focus();
});



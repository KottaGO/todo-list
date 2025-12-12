//Things to note:
//javascript requires ";" after each line/function.
//=== means equal.
//What does parseInt do?

//Load raw data from localStorage (may be null)
let raw = JSON.parse(localStorage.getItem("tasks"));

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

//function to build the DOM (the HTML code) and inserting the data from local storage into it
//NEED TO UPDATE FUNCTION TO READ ID, TEXT, BULLION FROM TASK TO CREATE DOM
function addTaskToDOM(task) {
    
    const li = document.createElement('li');
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



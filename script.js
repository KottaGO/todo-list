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
            urgent: false
         };
    } else {
        return {
            id: item.id || (Date.now() + Math.floor(Math.random() * 1000)),
            text: item.text || '',
            done: item.done,
            important: item.important,
            urgent: item.urgent,
            value: parseInt(important) + parseInt(urgent)

        };
    }
}) : [];

//the sort function will sort the array by comparing two values. If b.priority is bigger than a.priority then it will return a positive number which will tell the sort function that the "b" value should come first and the "a" value should come after.
function sortTasks() {
    tasks.sort((a,b) => {
        if (a.value === 7) {
            return 1;
        }
    });

    tasks.sort((a,b) => {
        if (a.value === 3) {
            return 1;
        }
    });

    tasks.sort((a,b) => {
        if (a.value === 9) {
            return 1;
        }
    });

    tasks.sort((a,b) => {
        if (a.value === 5) {
            return 1;
        }
    });
}

function computeQuad(important, urgent) {
    if (important && urgent) return 1;
    if (important && !urgent) return 2;
    if (!important && urgent) return 3;
    return 4;
}

//using local storage to load data
sortTasks();
tasks.forEach(task => addTaskToDOM(task));

//Create a task
function createTask(userInput, important, urgent) {
    return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: userInput,
        done: false,
        important: important,
        urgent: urgent,
        value: computeQuad(important, urgent)
    };
}




//function to build the DOM (the HTML code) and inserting the data from local storage into it
//NEED TO UPDATE FUNCTION TO READ ID, TEXT, BULLION FROM TASK TO CREATE DOM
function addTaskToDOM(task) {
    
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);                //Store unique id for reference
    li.classList.toggle('completed', task.done);        //Add 'completed' class if task is done

    //adding priority visual cues
    //if (task.priority === 3) {
    //    li.classList.add("priority-high");
    //} else if (task.priority === 2) {
    //    li.classList.add("priority-normal");
   // } else if (task.priority === 1) {
    //    li.classList.add("priority-low");
    //}

    
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

    taskList.appendChild(li);                           //add task to the end of the list

    //Checkbox eventListener
    checkbox.addEventListener('change', () => {         
        task.done = checkbox.checked;
        li.classList.toggle('completed', task.done);       

        if (task.done) {
            taskList.appendChild(li);
        } else {
            const firstCompleted = taskList.querySelector('li.completed'); 
            taskList.insertBefore(li, firstCompleted || null);
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));           //save change to localStorage after each change
    })

    //It removes the li from the DOM and removes the li from local storage
    deleteButton.addEventListener("click", function () {                                            
        li.classList.add("task-exit");
        setTimeout(() => li.remove(), 200);                                                         //removes the li from the DOM after 200 milliseconds to allow for the css animation to complete
                                                                                        
        tasks = tasks.filter(t => t.id !== task.id);                                                //remove the task from the array using id
        sortTasks();
        localStorage.setItem("tasks", JSON.stringify(tasks));                                       //update local storage with new array
        
    });

}

//allowing the button to add tasks when clicked
document.getElementById("addButton").addEventListener("click", function() {                         //in the document (html file) find the element "addButton" and if someone clicks the button run the function.
    let task = document.getElementById("taskInput").value;                                          //this is the function. It is assigning the variable task with the user input.
    if (task === "") return;                                                                        //To prevent blank tasks from being added. 

    let importance = document.getElementById("important").value;
    //if nothing selected then the dropbox should flash red
    let urgency = document.getElementById("urgent").value;
    //if nothing selected then the dropbox should flash red
    
    task = createTask(task, importance, urgency);
    tasks.push(task);                                                                               //pushing the user data to the tasks array for local storage
    sortTasks();
    localStorage.setItem("tasks", JSON.stringify(tasks));                                           //saves the task array to local storage as each item is added.

    //Build DOM for new task using new function
    taskList.innerHTML = "";                                                                        //we are clearing the exsisting DOM
    tasks.forEach(addTaskToDOM);                                                                  //rebuilding the DOM using the updated tasks array

    //what if the button get clicked again? The taskInput is still displaying the variable assigned above which means the user will have to erase it manually, yuck! Reset the variable to display the placeholder text we created in the html file.
    document.getElementById("taskInput").value = "";
});

//allowing "enter" key to add tasks to the list
document.getElementById("taskInput").addEventListener("keydown", function(event) {                  //listen for the event keydown in the id taskList, use a function passing a variable to check if the keydown was the "Enter" key.
    if (event.key === "Enter") {
        document.getElementById("addButton").click();                                               //instead of duplicating the rules again, simply call on the addButton function.
    }
});



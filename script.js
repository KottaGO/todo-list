//Things to note:
//javascript requires ";" after each line/function.
//=== means equal.

//Load raw data from localStorage (may be null)
let raw = JSON.parse(localStorage.getItem("tasks"));

//Currently the local storage is holding data in an array which only contains the text the user inputs. We will assign two more variable for each user entry. Id to identify each task uniquely, text for the actual task, and a bullion value to check if the task has been completed.
let tasks = Array.isArray(raw) ? raw.map(item => {
    if (typeof item === 'string') {                                                                     //this handles legacy data that may still be using only strings
        return { id: Date.now() + Math.floor(Math.random() * 1000), text: item, done: false };
    } else {
        return {
            id: item.id || (Date.now() + Math.floor(Math.random() * 1000)),
            text: item.text || '',
            done: item.done
        };
    }
}) : [];

//Create a task
function createTask(userInput) {
    let createTask = Array.isArray(id: Date.now() + Math.floor(Math.random() * 1000), text: task, done: false);
    return createTask;
}

//using local storage to load data
tasks.forEach(function(task) {
    addTaskToDOM(task);
});

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
    checkbox.id = 'task-${task.id}';                    //unique id for the checkbox. I don't understand what this code syntax is
    li.appendChild(checkbox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "X";                                                                 // <button>X</button>
    deleteButton.className = 'delete-task'                                                          // <button class="delete-Button">X</button> (to allow for css to apply style)
    li.appendChild(deleteButton);

    taskList.appendChild(li);                           //add task to list

    //Checkbox eventListener
    checkbox.addEventListener('change', () => {         //is it only listening for the change or should it also listen for the click by the user
        task.done = checkbox.checked;
        li.classList.toggle('completed', task.done);       //need explaination for how this is working

        if (task.done) {
            taskList.appendChild(li);
        } else {
            const firstCompleted = taskList.querySelector('li.completed'); //no idea how this workd or the syntax
            taskList.insertBefore(li, firstCompleted || null);
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));           //save change to localStorage after each change
    })

    //It removes the li from the DOM and removes the li from local storage
    deleteButton.addEventListener("click", function () {                                            
        li.classList.add("task-exit");
        setTimeout(() => li.remove(), 200);                                                         //removes the li from the DOM after 200 milliseconds to allow for the css animation to complete
                                                                                        
        tasks = tasks.filter(t => t !== task);                                                      //remove the task from the array
        localStorage.setItem("tasks", JSON.stringify(tasks));                                       //update local storage with new array
        
    });

    //so far all the above is stored in memory and is not yet in the format we want. We need to put each element inside the <li></li>
    //li.appendChild(taskSpan);
    //li.appendChild(deleteButton);
    
    //now that the LI is built we need to add it to the unordered list which can be identifyed using the id we assigned it in the HTML document
    //document.getElementById("taskList").appendChild(li);


}

//allowing the button to add tasks when clicked
document.getElementById("addButton").addEventListener("click", function() {                         //in the document (html file) find the element "addButton" and if someone clicks the button run the function.
    let task = document.getElementById("taskInput").value;                                          //this is the function. It is assigning the variable task with the user input.
    if (task === "") return;                                                                        //To prevent blank tasks from being added. 
    
    task = createTask(task);
    tasks.push(task);                                                                               //pushing the user data to the tasks array for local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));                                           //saves the task array to local storage as each item is added.

    //Build DOM for new task using new function
    addTaskToDOM(task);

    //what if the button get clicked again? The taskInput is still displaying the variable assigned above which means the user will have to erase it manually, yuck! Reset the variable to display the placeholder text we created in the html file.
    document.getElementById("taskInput").value = "";
});

//allowing "enter" key to add tasks to the list
document.getElementById("taskInput").addEventListener("keydown", function(event) {                  //listen for the event keydown in the id taskList, use a function passing a variable to check if the keydown was the "Enter" key.
    if (event.key === "Enter") {
        document.getElementById("addButton").click();                                               //instead of duplicating the rules again, simply call on the addButton function.
    }
});
//Things to note:
//javascript requires ";" after each line/function.
//=== means equal.
//hello

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];                                            //grabbing the data from local storage and the using JSON.parse to convert the string to an array. If the no array is found then we use an empty array instead that's the purpose or adding ||(or) [](empty array)
tasks.forEach(function(task) {
    addTaskToDOM(task);
});

//function to build the DOM (the HTML code) and inserting the data from local storage into it
function addTaskToDOM(task) {
    let li = document.createElement("li");                                                          //this is building the HTML code:
                                                                                                    // <li></li>
    let taskSpan = document.createElement("span");                                                  // <span></span>
    taskSpan.textContent = task;                                                                    // <span>task</span>

    let deleteButton = document.createElement("button");                                            // <button></button>
    deleteButton.textContent = "X";                                                                 // <button>X</button>
    deleteButton.classList.add("delete-Button");                                                    // <button class="delete-Button">X</button> (to allow for css to apply style)

    //copied from the click function below. It removes the li from the DOM and removes the li from local storage
    deleteButton.addEventListener("click", function () {                                            
        li.remove();                                                                                //remove task from DOM
        tasks = tasks.filter(t => t !== task);                                                      //remove the task from the array
        localStorage.setItem("tasks", JSON.stringify(tasks));                                       //update local storage with new array
        
    });

    //so far all the above is stored in memory and is not yet in the format we want. We need to put each element inside the <li></li>
    li.appendChild(taskSpan);
    li.appendChild(deleteButton);
    
    //now that the LI is built we need to add it to the unordered list which can be identifyed using the id we assigned it in the HTML document
    document.getElementById("taskList").appendChild(li);

}

//allowing the button to add tasks when clicked
document.getElementById("addButton").addEventListener("click", function() {                         //in the document (html file) find the element "addButton" and if someone clicks the button run the function.
    let task = document.getElementById("taskInput").value;                                          //this is the function. It is assigning the variable task with the user input.
    if (task === "") return;                                                                        //To prevent blank tasks from being added. 
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
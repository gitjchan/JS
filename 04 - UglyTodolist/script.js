var todoList = {
  todos: [],
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    })
  },
  changeTodo: function(position, todoText) {
    this.todos[position].todoText = todoText
  },
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
  },
  toggleCompleted: function(position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
  },
  toggleAll: function() {
    var todos = this.todos;
    var todosTotal = todos.length;
    var completedTodos = 0;
    
    
    //Count up all the todo's that are completed i.e. any that equal to 'true'
    todos.forEach(function(todo) {
      if (todo.completed === true) {
        completedTodos++;
      }
    })
    
    //Find out if all are equal to true with if
    todos.forEach(function(todo) {
      //If it is true then set all the completed to 'false'
      if (completedTodos === todosTotal) {
          todo.completed = false;
      // Otherwise, set all the completed to 'true'  
          } else {
            todo.completed = true;
          }
    })
  }
};

var handlers = {
  addTodo: function() {
    var addTodoInputText = document.getElementById('addTodoTextInput');
    todoList.addTodo(addTodoInputText.value);
    addTodoInputText.value = '';
    view.displayTodos();
  },
  changeTodo: function() {
   //Get position and get the input text
    var changeTodoInputText = document.getElementById('changeTodoTextInput');
    var changeTodoPositionInput = document.getElementById('changeTodoPositionInput');
    // Pass the position and the text to todoList.changeTodo
    todoList.changeTodo(changeTodoPositionInput.valueAsNumber, changeTodoInputText.value);
    // Clear the input text after running
    changeTodoPositionInput.value = '';
    changeTodoInputText.value = '';
    // Call view object to display
    view.displayTodos();
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
    view.displayTodos();
  },
  toggleCompleted: function() {
    var toggleCompletedPositionInput = document.getElementById('toggleCompletedPositionInput');
    todoList.toggleCompleted(toggleCompletedPositionInput.valueAsNumber);
    toggleCompletedPositionInput.value = '';
    view.displayTodos();
  },
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodos();
  }  
};

var view = {
  displayTodos: function() {
    // Find the first ul in the DOM
    var todosUl = document.querySelector('ul');
    // Empty the Ul first - everytime it is run
    todosUl.innerHTML = '';
    // loop around each todo in array
    todoList.todos.forEach(function(todo, position) {
      var todoLi = document.createElement('li');
      var todoTextWithCompletion = '';
      // debugger;
      if (todo.completed === true) {
        todoTextWithCompletion = '(x) ' + todo.todoText + ' ';
      } else {
        todoTextWithCompletion = '( ) ' + todo.todoText + ' ';
      }
      
      todoLi.id = position;
      todoLi.textContent = todoTextWithCompletion;
      todoLi.appendChild(this.createDeleteButton());
      todosUl.appendChild(todoLi);
      console.log(todoLi);
    }, this)
  },
  createDeleteButton: function() {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    return deleteButton;
  },
  setUpEventListeners: function() {
    var todosUl = document.querySelector('ul');
    
    todosUl.addEventListener('click', function(event) {  
      // Get the element that was clicked on
      var elementClicked = event.target;

      // Check if elementClicked is a delete button
      if (elementClicked.className === 'deleteButton') {
        // Run handlers.deleteTodo / match the corresponding li using 'parentNode.id'
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id));    
      }
    })    
  }
};

view.setUpEventListeners();









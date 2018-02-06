interface TodoItem {
    id: number;
    title: string;
    checked: boolean;
}

class TodoList {

    private todos: TodoItem[] = [];

    private newTodoField: HTMLInputElement;
    private newTodoForm: HTMLFormElement;
    private todosParent: HTMLDivElement;

    constructor() {
        this.newTodoField = document.getElementById("new-todo-input") as HTMLInputElement;
        this.newTodoForm = document.getElementById("new-todo-form") as HTMLFormElement;
        this.todosParent = document.getElementById("todo-list") as HTMLDivElement;

        this.loadTodos().forEach((item: TodoItem) => this.createTodo(item));
        this.newTodoForm.addEventListener("submit", (event: Event) => {
            event.preventDefault();
            this.createTodo({ id: Date.now(), title: this.newTodoField.value, checked: false });
        });
    }

    public createTodo(todoItem: TodoItem): void {
        this.todos = [...this.todos, todoItem];

        const todoHtmlItem: HTMLDivElement = document.createElement("div");
        todoHtmlItem.id = `todo-item-${todoItem.id}`;
        todoHtmlItem.className = "columns is-mobile";
        todoHtmlItem.innerHTML = `
            <div class="column is-2">
                <input type="checkbox" id="todo-check-${todoItem.id}" title="Todo checkbox">
            </div>
            <div id="todo-title-${todoItem.id}" class="column ${todoItem.checked ? "has-text-grey-light" : ""}">
                ${todoItem.title}
            </div>
            <div class="column is-2">
                <button type="button" id="todo-remove-${todoItem.id}" class="button is-white is-pulled-right">
                    &times;
                </button>
            </div>
        `;

        this.todosParent.appendChild(todoHtmlItem);
        this.newTodoField.value = "";

        const removeButton = document.getElementById(`todo-remove-${todoItem.id}`) as HTMLButtonElement;
        removeButton.addEventListener("click", () => this.removeTodo(todoItem.id));

        const todoCheckbox = document.getElementById(`todo-check-${todoItem.id}`) as HTMLInputElement;
        todoCheckbox.checked = todoItem.checked;
        todoCheckbox.addEventListener("change", () => this.toggleTodo(todoItem.id));

        this.persistTodos();
    }

    public toggleTodo(id: number): void {
        this.todos.forEach((item: TodoItem) => {
            if (item.id === id) {
                item.checked = !item.checked;

                const todoCheckbox = document.getElementById(`todo-check-${id}`) as HTMLInputElement;
                todoCheckbox.checked = item.checked;

                const todoTitle = document.getElementById(`todo-title-${id}`) as HTMLDivElement;
                todoTitle.classList.toggle("has-text-grey-light");
            }
        });

        this.persistTodos();
    }

    public removeTodo(id: number): void {
        this.todos = this.todos.filter((item: TodoItem) => item.id !== id);

        const todoHtmlItem = document.getElementById(`todo-item-${id}`) as HTMLDivElement;
        this.todosParent.removeChild(todoHtmlItem);

        this.persistTodos();
    }

    private loadTodos(): TodoItem[] {
        const todosString: string | null = window.localStorage.getItem("todo-items");
        if (todosString !== null) {
            return JSON.parse(todosString);
        } else {
            return [];
        }
    }

    private persistTodos(): void {
        if (this.todos.length > 0) {
            window.localStorage.setItem("todo-items", JSON.stringify(this.todos));
        }
    }
}

document.addEventListener("DOMContentLoaded", () => new TodoList());

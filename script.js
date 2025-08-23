export class toDoProgram {
  #currentId = 0;
  toDoList = [];
  /* toDO 데이터 구조
    {
        id: number,
        text: string,
        isDone: boolean,
    }
    */
  // id Date 객체 쓴 버전 and 안 쓴 버전
  addTodo(text) {
    this.toDoList.push({
      id: this.#currentId++,
      text: text,
      isDone: false,
    });
  }
  deleteTodo(id) {}
  modifyTodo(id, text) {}
  toggleTodo(id) {}
  printTodoList() {
    const content =
      this.toDoList.length !== 0
        ? this.toDoList.map(
            (toDo) =>
              `📝: ${toDo.text}\n완료 여부: ${toDo.isDone ? "⭕" : "❌"}`
          )
        : "등록된 todo가 없습니다.";
    if (typeof content === "string") console.log(content);
    else {
      for (let i = 0; i < content.length; i++) {
        console.log(content[i]);
      }
    }
  }
}

/* toDO 데이터 구조
    {
        id: number,
        text: string,
    }
    */
// id Date 객체 쓴 버전 and 안 쓴 버전
function addTodo(text) {}
function deleteTodo(id) {}
function modifyTodo(id, text) {}
function toggleTodo(id) {}
function printTodoList() {}

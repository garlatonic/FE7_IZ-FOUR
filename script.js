class Todo {
  // 밖에서 맘대로 못 바꾸게 프라이빗 인스턴스 필드로 선언
  #list = [];
  #seq = 0;

  // 날짜 가져오기 프라이빗 인스턴스 메서드... 자주 쓰여서 맹금
  #now() {
    const now = new Date();
    const yy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${h}:${m}:${s}`;
  }
  // 아이디 갖고있는지 확인... 이것도 두번 써서 메서드로
  #find(id) {
    return this.#list.find((v) => v.id === id || null);
  }

  addTodo(text) {
    const id = String(this.#seq++);
    const toDo = text;
    const creationDate = this.#now();
    const modifiedDate = undefined;
    const isCompleted = false;

    const item = { id, toDo, creationDate, modifiedDate, isCompleted };
    this.#list.push(item);

    return item;
  }
  deleteTodo(id) {
    this.#list = this.#list.filter((v) => v.id !== id);
  }
  modifyTodo(id, text) {
    const item = this.#find(id);
    if (!item) throw new Error("해당 리스트가 없습니다.");

    item.toDo = text;
    item.modifiedDate = this.#now();
  }
  toggleTodo(id) {
    const item = this.#find(id);

    item.isCompleted = !item.isCompleted;
  }
  printTodoList() {
    const copy = structuredClone(this.#list); // #list가 참조자료형이라 그런지 출력시 한꺼번에 나옴.. 완전복사를 한다
    console.log(copy);
  }
}

const todo = new Todo();

export function addTodo(text) {
  return todo.addTodo(text);
}
export function deleteTodo(id) {
  return todo.deleteTodo(id);
}
export function modifyTodo(id, text) {
  return todo.modifyTodo(id, text);
}
export function toggleTodo(id) {
  return todo.toggleTodo(id);
}
export function printTodoList() {
  return todo.printTodoList();
}

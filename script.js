export class TodoProgram {
  #list = [];
  #currentId = 0;

  #isValid(id) {
    return this.#list.map((toDo) => toDo.id).includes(id);
  }
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

  addTodo(text) {
    const item = {
      id: this.#currentId++,
      text: text,
      isDone: false,
      date: this.#now(),
    };
    this.#list.push(item);

    console.log(`📝${text} 항목이 등록되었습니다.`);

    return this.#list;
  }

  deleteTodo(id) {
    if (!this.#isValid(id)) throw new Error("유효하지 않은 id입니다.");

    this.#list = this.#list.filter((toDo) => {
      if (toDo.id === id) console.log(`📝${toDo.text} 항목이 삭제되었습니다.`);
    });
  }

  modifyTodo(id, text) {
    if (!this.#isValid(id)) throw new Error("유효하지 않은 id입니다.");

    console.log(
      `항목이 수정되었습니다.\n` + `📝${this.#list[id].text} → 📝${text}`
    );

    this.#list[id].text = text;
  }

  toggleTodo(id) {
    if (!this.#isValid(id)) throw new Error("유효하지 않은 id입니다.");

    const currentState = this.#list[id].isDone;
    const toDoState = (bool) => (bool ? "⭕" : "❌");

    console.log(
      `📝${this.#list[id].text} 항목의 상태가 변경되었습니다.\n` +
        `완료 여부: ${toDoState(currentState)} → ${toDoState(!currentState)}`
    );

    this.#list[id].isDone = !currentState;
  }

  printTodoList() {
    if (this.#list.length === 0) {
      console.log("등록된 todo가 없습니다.");
      return;
    }

    this.#list.forEach((item) => {
      console.log(
        `id: ${item.id} | 📝${item.text} | 완료 여부: ${
          item.isDone ? "⭕" : "❌"
        }\n`
      );
    });
  }
}

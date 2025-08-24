export class toDoProgram {
  #currentId = 0;
  toDoList = [];

  #isValid(id) {
    return this.toDoList.map((toDo) => toDo.id).includes(id);
  }

  #findIndex(id) {
    return this.toDoList.findIndex((toDo) => toDo.id === id);
  }

  addTodo(text) {
    const id = this.#currentId++;
    const toDo = {
      id: id,
      text: text,
      isDone: false,
    };

    console.log(`📝${text} 항목이 등록되었습니다.`);

    this.toDoList.push(toDo);

    return toDo;
  }

  deleteTodo(id) {
    if (!this.#isValid(id)) console.log("유효하지 않은 id입니다.");
    else {
      this.toDoList = this.toDoList.filter((toDo) => {
        if (toDo.id === id)
          console.log(`📝${toDo.text} 항목이 삭제되었습니다.`);
        return toDo.id !== id;
      });
    }
  }

  modifyTodo(id, text) {
    if (!this.#isValid(id)) console.log("유효하지 않은 id입니다.");
    else {
      const index = this.#findIndex(id);

      console.log(
        `항목이 수정되었습니다.\n` +
          `📝${this.toDoList[index].text} → 📝${text}`
      );

      this.toDoList[index].text = text;
    }
  }

  toggleTodo(id) {
    if (!this.#isValid(id)) console.log("유효하지 않은 id입니다.");
    else {
      const index = this.#findIndex(id);
      const currentState = this.toDoList[index].isDone;
      const toDoState = (bool) => (bool ? "⭕" : "❌");

      console.log(
        `📝${this.toDoList[index].text} 항목의 상태가 변경되었습니다.\n` +
          `완료 여부: ${toDoState(currentState)} → ${toDoState(!currentState)}`
      );

      this.toDoList[index].isDone = !currentState;
    }
  }

  printTodoList() {
    const content =
      this.toDoList.length !== 0
        ? this.toDoList.map(
            (toDo) =>
              `id: ${toDo.id} | 📝${toDo.text} | 완료 여부: ${
                toDo.isDone ? "⭕" : "❌"
              }\n`
          )
        : "등록된 todo가 없습니다.";

    if (typeof content === "string") console.log(content);
    else {
      console.log("――――――――― 현재 Todo List ―――――――――");
      for (let i = 0; i < content.length; i++) {
        console.log(content[i]);
      }
      console.log("――――――――――――――――――――――――――");
    }
  }
}

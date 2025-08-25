let todos = [];
let idCounter = 1;

/**
 * 할 일 추가
 */
export function addTodo(text) {
  const todo = {
    id: idCounter++,
    text,
    completed: false,
  };
  todos.push(todo);
  console.log(`추가됨: [${todo.id}] ${todo.text}`);
  return todo.id; // id만 반환
}

/**
 * 할 일 삭제
 */
export function deleteTodo(id) {
  const before = todos.length;
  todos = todos.filter((t) => t.id !== id);
  if (todos.length < before) {
    console.log(`${id}번 할 일이 삭제되었습니다.`);
  } else {
    console.log(`${id}번 할 일을 찾을 수 없습니다.`);
  }
}

/**
 * 완료 여부 토글
 */
export function toggleTodo(id) {
  let updated = null;
  todos = todos.map((t) => {
    if (t.id === id) {
      updated = { ...t, completed: !t.completed };
      return updated;
    }
    return t;
  });
  if (updated) {
    console.log(
      `${id}번 할 일 상태가 변경되었습니다: ${
        updated.completed ? "완료" : "미완료"
      }`
    );
  } else {
    console.log(`${id}번 할 일을 찾을 수 없습니다.`);
  }
}

/**
 * 할 일 수정
 */
export function modifyTodo(id, newText) {
  let updated = null;
  todos = todos.map((t) => {
    if (t.id === id) {
      updated = { ...t, text: newText };
      return updated;
    }
    return t;
  });
  if (updated) {
    console.log(`${id}번 할 일이 수정되었습니다: ${updated.text}`);
  } else {
    console.log(`${id}번 할 일을 찾을 수 없습니다.`);
  }
}

/**
 * 현재 리스트 출력
 */
export function printTodoList() {
  console.log("===== 현재 TodoList =====");
  if (todos.length === 0) {
    console.log("(비어 있음)");
  } else {
    todos.forEach((t) => {
      console.log(`[${t.completed ? "O" : "X"}] ${t.id}: ${t.text}`);
    });
  }
  console.log("=========================");
}

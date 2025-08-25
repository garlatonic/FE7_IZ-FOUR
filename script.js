let todos = [];
let countId = 0;

// 할일 추가	addTodo(text)	할일을 입력 받아서 todos 배열에 추가
function addTodo(text) {
  const todo = {
    id: countId,
    task: text,
    toggle: false,
  };
  todos[countId] = todo;
  countId++;
  return todo;
}

// 할일 삭제	deleteTodo(id)	등록된 할일을 삭제
function deleteTodo(id) {
  todos[id] = null;
  for (let i = id; i <= todos.length; i++) {
    todos[id] = todos[id + 1];
  }
  todos[todos.length - 1] = null;
}

// 할일 수정	modifyTodo(id, text)	등록된 할일을 수정
function modifyTodo(id, text) {
  todos[id].task = text;
}

// 할일 완료	toggleTodo(id)	등록된 할일의 완료 여부 토글
function toggleTodo(id) {
  todos[id].toggle = true;
}

// 현재 할일 목록 출력	printTodoList()	현재 할일 목록을 반복 콘솔 출력
function printTodoList() {
  todos.forEach((todo) => {
    if (todo !== null) {
      console.log(todo);
    }
  });
  console.log("-");
}

a = addTodo("자바스크립트 공부");
b = addTodo("운동하기");
printTodoList();

toggleTodo(a.id);

printTodoList();

modifyTodo(b.id, "매일 아침 운동하기");

printTodoList();

deleteTodo(a.id);

printTodoList();

addTodo("git 공부하기");

printTodoList(); //id 중복됨

addTodo("병원가기");

printTodoList(); //id 중복됨

import { updatePage } from "./modify.js";
import { viewDocument } from "./api.js";

function createBread(data) {
  const breadLi = document.createElement("li");
  const breadA = document.createElement("a");
  breadA.textContent = data.content;
  breadA.classList.add("cursor-pointer");
  breadLi.appendChild(breadA);

  if (data.id === "home") {
    const state = { isHome: true };
    breadA.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      history.pushState(state, "", "");
      navigateFn(state);
    });
  } else {
    breadA.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      viewDocument(data.id).then((response) => {
        const state = response;
        history.pushState(state, "", state.id);
        navigateFn(state);
      });
    });
  }

  return breadLi;
}

function addBread(id) {
  const breadcrumb = document.querySelector(".breadcrumb ol");
  breadcrumb.innerHTML = "";
  breadcrumb.appendChild(createBread({ id: "home", content: "홈" }));

  if (id === "홈") return;

  let breads = [];

  let current = document.querySelector(`[data-id="${id}"]`);
  let parent = current.parentElement.closest("li");

  const currentText = current.querySelector(".title").textContent;

  breads.push({ id: id, content: currentText });

  while (parent !== null) {
    // parent가 널이면 상위 페이지 없음
    const id = parent.dataset.id;
    const content = parent.querySelector(".title").textContent;
    breads.push({ id: id, content: content });
    current = parent;
    parent = current.parentElement.closest("li");
  }

  if (breads.length === 0) {
    breadcrumb.appendChild(createBread({ id: id, content: currentText }));
  } else {
    for (let i = 1; i <= breads.length; i++) {
      breadcrumb.appendChild(
        createBread({
          id: breads[breads.length - i].id,
          content: breads[breads.length - i].content,
        })
      );
    }
  }
}

export function navigateFn(state) {
  const pageArea = document.querySelector("#contents");
  const home = document.querySelector(".home");

  /* 브래드크럼 */
  if (state.isHome) {
    // 홈 화면
    home.classList.remove("hidden");
    pageArea.classList.add("hidden");

    addBread("홈");
  } else {
    pageArea.classList.remove("hidden");
    home.classList.add("hidden");

    addBread(state.id);

    // 페이지 이동할 때마다 바꿀 콘텐츠
    const div_inner = document.createElement("div");
    div_inner.classList.add("inner", "flex", "flex-col", "gap-4", "w-3/4");

    const div_title = document.createElement("div");
    div_title.className = "title";

    const h1 = document.createElement("h1");
    h1.classList.add("text-5xl", "font-bold");
    const h1_input = document.createElement("input");
    h1_input.type = "text";
    h1_input.placeholder = "새 페이지";
    h1_input.setAttribute(
      "aria-label",
      "해당 페이지의 제목을 편집하려면 입력하세요."
    );
    h1_input.classList.add("w-full", "outline-0");
    h1_input.value = state.title;

    h1.appendChild(h1_input);
    div_title.appendChild(h1);

    const div_content = document.createElement("div");
    div_content.classList.add("content", "flex-1");

    const editableDiv = document.createElement("div");
    editableDiv.setAttribute("contenteditable", "true");

    const editableDivWrap = document.createElement("div");
    editableDivWrap.classList.add("contents-wrap", "flex-1");

    if (state.content === null) {
      editableDivWrap.append(editableDiv);
    } else {
      editableDivWrap.innerHTML += state.content;
    }

    div_content.append(editableDivWrap);
    div_inner.append(div_title, div_content);

    pageArea.replaceChildren(div_inner);
  }

  updatePage(state.id);
}

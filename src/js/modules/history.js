import { updatePage } from "./modify.js";

function createBread(text) {
  const breadLi = document.createElement("li");
  const breadA = document.createElement("a");
  breadA.textContent = text;
  breadLi.appendChild(breadA);

  return breadLi;
}

function addBread(id) {
  const breadcrumb = document.querySelector(".breadcrumb ol");
  breadcrumb.innerHTML = "";
  breadcrumb.appendChild(createBread("홈"));

  if (id === "홈") return;

  let breads = [];

  let current = document.querySelector(`[data-id="${id}"]`);
  let parent = current.parentElement.closest("li");

  const currentText = current.querySelector(".title").textContent;

  breads.push(currentText);

  while (parent !== null) {
    // p가 널이면 상위 페이지 없음
    breads.push(parent.querySelector(".title").textContent);
    current = parent;
    parent = current.parentElement.closest("li");
  }

  if (breads.length === 0) {
    breadcrumb.appendChild(createBread(currentText));
  } else {
    for (let i = 1; i <= breads.length; i++) {
      breadcrumb.appendChild(createBread(breads[breads.length - i]));
      console.log(breads[breads.length - i]);
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

    // addBread("홈");
  } else {
    pageArea.classList.remove("hidden");
    home.classList.add("hidden");

    // addBread(state.id);

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

    const textarea = document.createElement("textarea");
    textarea.rows = 1;
    textarea.placeholder = "내용을 입력하세요.";
    textarea.setAttribute(
      "aria-label",
      "해당 게시물의 내용을 편집하려면 입력하세요."
    );
    textarea.classList.add(
      "min-w-full",
      "min-h-full",
      "outline-0",
      "resize-none"
    );
    textarea.value = state.content;

    div_content.appendChild(textarea);

    div_inner.append(div_title, div_content);

    pageArea.replaceChildren(div_inner);
  }

  updatePage(state.id);
}

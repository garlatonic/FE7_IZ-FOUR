import { updatePage } from "./modify.js";

function createBread(text) {
  const breadLi = document.createElement("li");
  const breadA = document.createElement("a");
  breadA.textContent = text;
  breadLi.appendChild(breadA);

  return breadLi;
}

export function navigateFn(state) {
  const pageArea = document.querySelector("#contents");
  const home = document.querySelector(".home");
  const breadcrumb = document.querySelector(".breadcrumb ol");

  /* 브래드크럼 */
  if (state.isHome) {
    // 홈 화면
    home.classList.remove("hidden");
    pageArea.classList.add("hidden");
  } else {
    pageArea.classList.remove("hidden");
    home.classList.add("hidden");

    const children = state.documents;
    const depth = children.length;

    if (depth === 0) {
      // 자식페이지 또는 자식이 없는 부모페이지
      const currentPage = document.querySelector(`[data-id="${state.id}"]`);
      const parentPage = currentPage.parentElement.closest("li");

      if (parentPage === null) {
        // 자식 없는 부모 페이지
        breadcrumb.replaceChildren(createBread(state.title));
      } else {
        const parent = parentPage.querySelector(".title").textContent;
        breadcrumb.replaceChildren(
          createBread("홈"),
          createBread(parent),
          createBread(state.title)
        );
      }
    } else {
      // 부모 페이지
      breadcrumb.replaceChildren(createBread("홈"), createBread(state.title));
    }

    // 페이지 이동할 때마다 바꿀 콘텐츠
    const div_inner = document.createElement("div");
    div_inner.classList.add("inner", "flex", "flex-col", "gap-4", "w-2/4");

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

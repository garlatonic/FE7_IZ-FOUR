import { editDocument } from "./api.js";

export function updatePage(id) {
  const pageTitle = document.querySelector(`[data-id="${id}"] .title`);
  const title = document.querySelector(".title h1 input");
  const content = document.querySelector(".content textarea");

  let titleText = title.value;
  let contentText = content.value;

  // 페이지 내용 수정될 때 마다 변경된 값 변수에 넣음
  title.addEventListener("input", (event) => {
    titleText = event.target.value;
    // 오른쪽 편집기에서 타이틀 수정하면 왼쪽 페이지 목록에 바로 반영되게
    pageTitle.textContent = event.target.value;
  });

  content.addEventListener("input", (event) => {
    contentText = event.target.value;
  });

  // API 호출해서 서버에 저장
  title.addEventListener("change", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const pageContent = {
      title: titleText,
      content: contentText,
    };

    editDocument(id, pageContent);
  });

  content.addEventListener("change", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const pageContent = {
      title: titleText,
      content: contentText,
    };

    editDocument(id, pageContent);
  });
}

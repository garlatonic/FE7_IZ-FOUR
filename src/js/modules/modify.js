import { editDocument } from "./api.js";

const ICON_FILE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>`;
const ICON_FILEDATA = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`;

export function updatePage(id) {
  const pageTitle = document.querySelector(`[data-id="${id}"] .title`);
  const title = document.querySelector(".title h1 input");
  const content = document.querySelector(".contents-wrap");

  let titleText = title.value;
  let contentText = content.innerHTML || `<div contenteditable="true"></div>`;

  // 페이지 내용 수정될 때 마다 변경된 값 변수에 넣음
  title.addEventListener("input", (event) => {
    titleText = event.target.value;
    // 오른쪽 편집기에서 타이틀 수정하면 왼쪽 페이지 목록에 바로 반영되게
    pageTitle.textContent = event.target.value;
  });

  content.addEventListener("input", () => {
    const divs = content.querySelectorAll("div");

    // 내용 있으면 아이콘 바꾸기
    if (content.innerText.replaceAll(/\s+\n/g, "") !== "") {
      document.querySelector(`.aside .body [data-id="${id}"] .icon`).innerHTML =
        ICON_FILEDATA;
    } else {
      document.querySelector(`.aside .body [data-id="${id}"] .icon`).innerHTML =
        ICON_FILE;
    }
    if (divs[divs.length - 1].textContent !== "") {
      const newDiv = document.createElement("div");
      newDiv.setAttribute("contenteditable", "true");
      content.append(newDiv);
    }
    contentText = content.innerHTML;
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

  content.addEventListener("input", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const pageContent = {
      title: titleText,
      content: contentText,
    };

    editDocument(id, pageContent);
  });
}

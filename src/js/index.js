import {
 getAllDocuments, viewDocument, postDocument, editDocument, deleteDocument

} from "./modules/document.js";


lucide.createIcons();

// 현재 페이지 id를 동적으로 관리
let currentPageId = null;

// 문서 트리 렌더링 함수
async function renderDocumentTree() {
  const documents = await getAllDocuments();
  const treeList = document.querySelector('.aside-menu .list');
  if (!treeList) return;
  treeList.innerHTML = "";
  documents.forEach(doc => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="#none" class="page-item pl-2" data-id="${doc.id}">
        <div class="icon"><i data-lucide="file"></i></div>
        <div class="title flex-1">${doc.title}</div>
        <div class="util">
          <div role="button" aria-label="새 페이지 만들기" data-tooltip="새 페이지 만들기">
            <i data-lucide="plus"></i>
          </div>
        </div>
      </a>
    `;
    treeList.appendChild(li);

    // 문서 클릭 시 에디터에 내용 표시
    const pageLink = li.querySelector('.page-item');
    pageLink.addEventListener('click', async function(e) {
      e.preventDefault();
      const docData = await viewDocument(doc.id);
      window.openEditor && window.openEditor(docData.id, docData.title, docData.content);
    });
  });
  lucide.createIcons(); // 아이콘 다시 렌더링
}

renderDocumentTree(); // 페이지 로드 시 트리 렌더링

document.addEventListener("DOMContentLoaded", () => {
  // tooltip.init();

  const textarea = document.querySelector("textarea");

  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
});

// 페이지 수정된 내용 저장하는 함수
async function modifyContent(id, title, content) {
  const userName = "FE7_team7";
  const body = JSON.stringify({
    title: title,
    content: content,
  });

  const requestOptions = {
    method: "PUT",
    headers: {
      "x-username": userName,
      "Content-Type": "application/json",
    },
    body: body,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `https://kdt-api.fe.dev-cos.com/documents/${id}`,
      requestOptions
    );

    // const data = await response.json();
    // console.log(data);
  } catch (error) {
    throw new Error("Fetch error:", error);
  }
}

// 현재 페이지 id. 동기적으로 수정해야함
const page_id = "155523";

// 페이지 내용 수정될 때 마다 변경된 값 변수에 넣음
const title = document.querySelector(".title input");
const content = document.querySelector(".content textarea");

let titleText = "";
let contentText = "";

title.addEventListener("input", (event) => {
  titleText = event.target.value;
});

content.addEventListener("input", (event) => {
  contentText = event.target.value;
});

// 일정 시간마다 콘텐츠 수정 함수 실행
setInterval(() => modifyContent(page_id, titleText, contentText), 3000);

import {
  getAllDocuments,
  viewDocument,
  postDocument,
  editDocument,
  deleteDocument,
} from "./modules/document.js";

lucide.createIcons();

async function rootDouments() {
  const documents = await getAllDocuments();
  console.log(documents);
}

rootDouments(); // 문서 불러오기

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

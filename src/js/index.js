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

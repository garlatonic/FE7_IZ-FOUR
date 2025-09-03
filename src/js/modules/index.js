import tooltip from "./tooltip";

import {
  getAllDocuments,
  viewDocument,
  postDocument,
  editDocument,
  deleteDocument,
} from "./modules/document.js";

// 에디터 렌더 및 자동 저장 함수
function openEditor(documentId, title = "", content = "") {
  const titleInput = document.querySelector("#contents .title input");
  const contentTextarea = document.querySelector("#contents .content textarea");

  if (!titleInput || !contentTextarea) return;

  titleInput.value = title;
  contentTextarea.value = content;

  let saveTimeout;
  function autoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      editDocument(documentId, {
        title: titleInput.value,
        content: contentTextarea.value,
      });
    }, 1000);
  }

  titleInput.oninput = autoSave;
  contentTextarea.oninput = autoSave;
}
window.openEditor = openEditor;

export default tooltip;

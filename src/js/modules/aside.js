import { postDocument, viewDocument } from "./document.js";

document.addEventListener("DOMContentLoaded", () => {
  function addPlusEvent(btn) {
    btn.addEventListener('click', async function (e) {
      e.stopPropagation();
      const parentItem = btn.closest('.page-item');
      if (!parentItem) return;
      const parentId = parentItem.dataset.id;
      // 하위 문서 생성 API 호출
      const newDoc = await postDocument(null, { title: "새 페이지", parent: parentId });
      if (!newDoc || !newDoc.id) return;
      let childList = parentItem.parentElement.querySelector('ul');
      if (!childList) {
        childList = document.createElement('ul');
        parentItem.parentElement.appendChild(childList);
      }
      const newLi = document.createElement('li');
      newLi.innerHTML = `
        <a href="#none" class="page-item pl-6" data-id="${newDoc.id}">
          <div class="icon"><i data-lucide="file-text"></i></div>
          <div class="title flex-1">${newDoc.title}</div>
          <div class="util">
            <div role="button" aria-label="새 페이지 만들기" data-tooltip="새 페이지 만들기">
              <i data-lucide="plus"></i>
            </div>
          </div>
        </a>
      `;
      childList.appendChild(newLi);
      // 새 + 버튼에 이벤트 연결
      const plusBtn = newLi.querySelector('.util [role="button"]');
      if (plusBtn) addPlusEvent(plusBtn);
      // 새 페이지 클릭 시 에디터로 이동
      const newPageLink = newLi.querySelector('.page-item');
      newPageLink.addEventListener('click', async function(ev) {
        ev.stopPropagation();
        const doc = await viewDocument(newDoc.id);
        window.openEditor && window.openEditor(doc.id, doc.title, doc.content);
      });
      // 바로 에디터로 이동
      window.openEditor && window.openEditor(newDoc.id, newDoc.title, "");
    });
  }
  document.querySelectorAll('.page-item .util [role="button"]').forEach(addPlusEvent);
});
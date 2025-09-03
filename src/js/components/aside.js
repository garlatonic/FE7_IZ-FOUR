import { getAllDocuments, viewDocument } from "../core/api.js";
// import { updatePage } from "../modules/modify.js";
const ICON_FILE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>`;
const ICON_FILEDATA = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"
><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>`;
const ICON_PLUS = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>`;

const aside = {
  $rootList: document.querySelector("nav.aside-menu .body"),
  data: [],
  async init() {
    const data = await getAllDocuments();
    this.data = data ?? [];
    this.render(this.data);
    this.event();
  },
  render(data) {
    this.$rootList.append(this.buildItems(data));
  },
  buildItems(nodes, depth = 0) {
    const ulEl = document.createElement("ul");

    for (const node of nodes) {
      const liEl = document.createElement("li");
      liEl.dataset.id = node.id;

      const aEl = document.createElement("a");
      aEl.href = `/documents/${node.id}`;
      aEl.dataset.link = `/documents/${node.id}`;
      aEl.className = `page-item pl-${2 + depth * 2}`;

      const iconDiv = document.createElement("div");
      iconDiv.className = "icon";
      iconDiv.innerHTML = ICON_FILE;

      const titleDiv = document.createElement("div");
      titleDiv.className = "title flex-1";
      titleDiv.textContent = node.title || "새 페이지";

      const buttonDiv = document.createElement("div");
      buttonDiv.setAttribute("role", "button");
      buttonDiv.setAttribute("aria-label", "새 페이지 만들기");
      buttonDiv.dataset.tooltip = "새 페이지 만들기";
      buttonDiv.innerHTML = ICON_PLUS;

      const utilDiv = document.createElement("div");
      utilDiv.className = "util";
      utilDiv.append(buttonDiv);

      aEl.append(iconDiv, titleDiv, utilDiv);
      liEl.append(aEl);

      const children = node.documents || [];

      if (children.length > 0) {
        const temp = document.createDocumentFragment();
        temp.append(this.buildItems(children, depth + 1));
        liEl.appendChild(temp);
      }
      ulEl.append(liEl);
    }

    return ulEl;
  },
  event() {},
};

aside.init();

document.addEventListener("DOMContentLoaded", () => {
  function addPlusEvent(btn) {
    btn.addEventListener("click", async function (e) {
      e.stopPropagation();
      const parentItem = btn.closest(".page-item");
      if (!parentItem) return;
      const parentId = parentItem.dataset.id;
      // 하위 문서 생성 API 호출
      const newDoc = await postDocument(null, {
        title: "새 페이지",
        parent: parentId,
      });
      if (!newDoc || !newDoc.id) return;
      let childList = parentItem.parentElement.querySelector("ul");
      if (!childList) {
        childList = document.createElement("ul");
        parentItem.parentElement.appendChild(childList);
      }
      const newLi = document.createElement("li");
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
      const newPageLink = newLi.querySelector(".page-item");
      newPageLink.addEventListener("click", async function (ev) {
        ev.stopPropagation();
        const doc = await viewDocument(newDoc.id);
        window.openEditor && window.openEditor(doc.id, doc.title, doc.content);
      });
      // 바로 에디터로 이동
      window.openEditor && window.openEditor(newDoc.id, newDoc.title, "");
    });
  }
  document
    .querySelectorAll('.page-item .util [role="button"]')
    .forEach(addPlusEvent);
});
import {
  getAllDocuments,
  postDocument,
  viewDocument,
  deleteDocument,
} from "../modules/api.js";
import { navigateFn } from "../modules/history.js";

const ICON_FILE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>`;
const ICON_FILEDATA = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"
><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>`;
const ICON_PLUS = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>`;
const ICON_DELETE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#575757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;

const aside = {
  $aside: document.querySelector("#aside"),
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
    const temp = document.createElement("ul");

    for (const node of nodes) {
      const liEl = document.createElement("li");
      liEl.dataset.id = node.id;

      const aEl = document.createElement("a");
      aEl.href = "#none";
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
      buttonDiv.dataset.action = "addPage";
      buttonDiv.innerHTML = ICON_PLUS;

      const deleteDiv = document.createElement("div");
      deleteDiv.setAttribute("role", "button");
      deleteDiv.setAttribute("aria-label", "페이지 삭제하기");
      deleteDiv.dataset.action = "deletePage";
      deleteDiv.innerHTML = ICON_DELETE;

      const utilDiv = document.createElement("div");
      utilDiv.className = "util flex gap-1";
      utilDiv.append(deleteDiv, buttonDiv);

      aEl.append(iconDiv, titleDiv, utilDiv);
      liEl.append(aEl);

      const children = node.documents || [];

      if (children.length > 0) {
        const temp = document.createDocumentFragment();
        temp.append(this.buildItems(children, depth + 1));
        liEl.appendChild(temp);
      }
      temp.append(liEl);
    }

    return temp;
  },
  event() {
    const addButtons = this.$aside.querySelectorAll(".btn-add");
    addButtons.forEach((button) => {
      const id = null;
      const $target = this.$rootList.childNodes[0];
      button.addEventListener("click", (e) => {
        this.postEvent(id, $target);
      });
    });

    // 어사이드 내부 클릭이벤트만 케치
    this.$aside.addEventListener("click", (e) => {
      const $item = e.target.closest("[data-id]");
      if (!$item) return;
      const id = $item.dataset.id;

      e.preventDefault();
      e.stopPropagation();

      // 페이지 이동 막기
      if (e.target.closest("[role=button]")) {
        const $target = e.target.closest("[role=button]");

        if ($target.dataset.action === "addPage") {
          this.postEvent(id, $target);
          return;
        } else {
          this.deleteEvent(id, $item);
          return;
        }
      }

      // id에 해당하는 페이지 내용 불러옴
      const pagePromise = viewDocument(id);

      pagePromise.then((page) => {
        // history API로 주소값 변경하고 편집기 영역 교체하기
        const state = page;
        history.pushState(state, "", state.id);
        navigateFn(state);
      });

      return;
    });
  },
  postEvent(id, $target) {
    // 부모 page-item 찾기
    const parentItem =
      $target.closest(".page-item") || this.$rootList.childNodes[0];

    // 자식 패딩값 결정
    const parentPaddingValue =
      [...parentItem.classList]
        .map((cls) => cls.match(/pl-(\d+)/))
        .filter(Boolean)
        .map((match) => Number(match[1]))[0] || 0;

    let childList = parentItem.parentElement.querySelector("ul");
    if (!childList) {
      childList = document.createElement("ul");
      parentItem.parentElement.appendChild(childList);
    }

    // 새 페이지 li 생성
    const newLi = document.createElement("li");

    const newA = document.createElement("a");
    newA.classList = `page-item pl-${parentPaddingValue + 2}`;
    newA.href = "#none";

    const newIcon = document.createElement("div");
    newIcon.className = "icon";
    newIcon.innerHTML = ICON_FILE;

    const newTitle = document.createElement("div");
    newTitle.className = "title flex-1";
    newTitle.textContent = "새 페이지";

    const buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("role", "button");
    buttonDiv.setAttribute("aria-label", "새 페이지 만들기");
    buttonDiv.dataset.action = "addPage";
    buttonDiv.innerHTML = ICON_PLUS;

    const deleteDiv = document.createElement("div");
    deleteDiv.setAttribute("role", "button");
    deleteDiv.setAttribute("aria-label", "페이지 삭제하기");
    deleteDiv.dataset.action = "deletePage";
    deleteDiv.innerHTML = ICON_DELETE;

    const newUtil = document.createElement("div");
    newUtil.className = "util flex gap-1";

    newUtil.append(deleteDiv, buttonDiv);
    newA.append(newIcon, newTitle, newUtil);
    newLi.appendChild(newA);

    childList.appendChild(newLi);

    let newId = "";
    postDocument(null, {
      parent: id || null,
    }).then((data) => {
      newId = data.id; // 응답값 newId에 저장
      newLi.dataset.id = newId;

      // id에 해당하는 페이지 내용 불러옴
      const pagePromise = viewDocument(newId);
      pagePromise.then((page) => {
        // history API로 주소값 변경하고 편집기 영역 교체하기
        const state = page;
        history.pushState(state, "", state.id);
        navigateFn(state);
      });
    });
  },
  deleteEvent(id, $item) {
    // 삭제 버튼 클릭 시 api 발똥
    viewDocument(id).then((data) => {
      if (data.documents.length > 0) {
        data.documents.map((doc) => {
          const $childItem = document.querySelector(`li[data-id='${doc.id}']`);
          this.deleteEvent(doc.id, $childItem);
        });
      }
      deleteDocument(id);
      if ($item !== null) $item.remove();
    });
  },
};

export default aside;

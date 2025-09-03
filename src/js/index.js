import {
  getAllDocuments,
  viewDocument,
  postDocument,
  editDocument,
  deleteDocument,
} from "./core/api.js";

lucide.createIcons();

async function rootDouments() {
  const documents = await getAllDocuments();
}

rootDouments(); // 문서 불러오기

document.addEventListener("DOMContentLoaded", () => {
  // tooltip.init();

  const textarea = document.querySelector("textarea");

  // textarea.addEventListener("input", function () {
  //   this.style.height = "auto";
  //   this.style.height = this.scrollHeight + "px";
  // });
});

// const home = {
//   $rootList: document.querySelector(".home").parentNode,
//   data: [],
//   updatedList: [],
//   async init() {
//     const data = await getAllDocuments();
//     this.data = data ?? [];
//     this.render(this.data);
//   },
//   render(data) {
//     this.getItems(data);
//     this.updatedList = this.sortItems(this.updatedList);
//     this.$rootList.append(this.showItems(this.updatedList));
//   },
//   getItems(documents) {
//     for (const node of documents) {
//       const documentInfo = {
//         id: node.id,
//         title: node.title,
//         updatedAt: node.updatedAt,
//       };
//       this.updatedList.push(documentInfo);

//       const children = node.documents || [];

//       if (children.length > 0) {
//         this.getItems(children);
//       }
//     }
//     console.log(this.updatedList);
//   },

//   sortItems(documents) {
//     //const result = documents.sort((a,b) => b.updatedAt - a.updatedAt);
//     const result = documents.sort(function (a, b) {
//       if (b.updatedAt > a.updatedAt) {
//         return 1;
//       }
//       if (b.updatedAt < a.updatedAt) {
//         return -1;
//       }
//       // a must be equal to b
//       return 0;
//     });
//     return result;
//   },

//   showItems(documents) {
//     const temp = document.createElement("ul");
//     for (let i = 0; i < 5; i++) {
//       const liEl = document.createElement("li");

//       const aEl = document.createElement("a");
//       aEl.href = `/documents/${documents[i].id}`;

//       const titleDiv = document.createElement("div");
//       titleDiv.className = "title";
//       titleDiv.textContent = documents[i].title || "새 페이지";

//       const dateDiv = document.createElement("div");
//       dateDiv.className = "date";
//       dateDiv.textContent = documents[i].updatedAt.slice(0, 10);

//       aEl.append(titleDiv, dateDiv);
//       liEl.append(aEl);

//       temp.append(liEl);
//     }
//     return temp;
//   },
// };

// home.init();

// const home2 = document.querySelector(".home");
// console.log("안녕하세요");
// console.log(home2);

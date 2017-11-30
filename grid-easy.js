(function() {
  //declaring global variables
  var wrap,
    gridContainer,
    grid,
    editorContainer,
    content,
    uploaderEditor,
    editorTabs,
    colControl,
    rowControl,
    currentBlock;

  window.addEventListener("DOMContentLoaded", setUpTheGrid);

  function setUpTheGrid() {
    wrap = document.getElementById("wp-content-wrap");
    uploaderEditor = wrap.getElementsByClassName("uploader-editor")[0];
    editorTabs = wrap.getElementsByClassName("wp-editor-tabs")[0];
    content = wrap.getElementsByTagName("textarea")[0];
    editorContainer = wrap.getElementsByClassName("wp-editor-container")[0];
    gridContainer = document.createElement("div");
    gridContainer.id = "grid-easy-container";

    gridContainer.innerHTML = document.getElementById(
      "tmpl-grid-easy"
    ).innerHTML;
    editorTabs.innerHTML = document.getElementById(
      "tmpl-grid-easy-buttons"
    ).innerHTML;
    uploaderEditor.parentElement.insertBefore(gridContainer, uploaderEditor);
    wrap.classList.remove("html-active");
    wrap.classList.add("grid-active");
    grid = gridContainer.children[1];
    prepareGrid();
    wrap.addEventListener("click", gridActions);
    document
      .getElementById("grid-easy-edit-area-button")
      .addEventListener("click", updateBlock);
    window.addEventListener("keydown", keyboardGridActions);
    window.addEventListener("keyup", keyboardGridActions);
  }

  function gridActions(event) {
    var target = event.target;
    switch (target.textContent) {
      case "Row Settings":
      case "Column Settings":
        showSettings(target);
        break;
      case "Edit":
      case "Edit Column":
        edit(target.parentElement.parentElement.parentElement);
        break;
      case "Grow":
        changeSize(target.parentElement.parentElement.parentElement, "expand");
        break;
      case "Shrink":
        changeSize(target.parentElement.parentElement.parentElement);
        break;
      case "Duplicate":
      case "Duplicate column":
        duplicate(target.parentElement);
        break;
      case "Delete":
      case "Remove column":
        del(target.parentElement);
        break;
      case "Duplicate row":
        duplicate(target.parentElement.parentElement.parentElement);
        break;
      case "Delete row":
        del(target.parentElement.parentElement.parentElement);
        break;
      case "Edit row":
        edit(target.parentElement.parentElement.parentElement);
        break;
      case "Text":
        showHTML();
        break;
      case "Grid":
        showGrid();
        break;
      case "container":
        appendContainer();
        break;
      case "container-fluid":
        appendContainer("fluid");
        break;
    }
  }

  function appendContainer(f) {
    var container = document.createElement("div"),
      row = document.createElement("div"),
      col = document.createElement("div");
    f && f === "fluid"
      ? container.classList.add("container-fluid")
      : container.classList.add("container");
    row.classList.add("row");
    col.classList.add("col-md-12");
    col.innerHTML = colControl;
    row.innerHTML = rowControl;
    row.appendChild(col);
    container.appendChild(row);
    grid.appendChild(container);
  }

  function keyboardGridActions(e) {
    var target = e.target;
    if (e.type == "keydown") {
      switch (e.which) {
        case 17:
          gridContainer.classList.add("ctrl");
      }
    }
    if (e.type == "keyup") {
      switch (e.which) {
        case 17:
          gridContainer.classList.remove("ctrl");
      }
    }
    console.log(e);
    switch (e.which) {
      case 9:
        if (target.matches("#grid-easy-container a.thickbox")) {
          target.click();
        }
        if (
          target.matches(
            ".row-control-list button:last-child,.column-control-list button:last-child"
          )
        ) {
          console.log(target.parentElement.firstElementChild);
          target.parentElement.firstElementChild.focus();
        }
        break;
      case 27:
        if (target.matches("body,#TB_overlay,#TB_window,#TB_window *")) {
          console.log("yeay");
        }
        break;
      case 40:
        if (
          target.matches(".row-control-list button,.column-control-list button")
        ) {
          e.preventDefault();
          target.nextElementSibling.focus();
        }
    }
  }

  function showSettings(el) {
    el.nextElementSibling.style.display = "block";
    el.nextElementSibling.focus();
    el.classList.add("active");
    el.setAttribute("aria-expanded", "true");
    window.addEventListener("click", hideSettings, true);
    window.addEventListener("keyup", hideSettings);
    //window.addEventListener('keyup',gridSettingsActions);
  }

  function hideSettings(e) {
    if (e.type == "keyup" && e.which != 27) return;
    var el = grid.querySelector('[aria-expanded="true"]');
    el.nextElementSibling.style.display = "none";
    el.classList.remove("active");
    el.focus();
    el.setAttribute("aria-expanded", "false");
    window.removeEventListener("click", hideSettings, true);
    window.removeEventListener("keyup", hideSettings);
    //window.removeEventListener('keyup',gridSettingsActions);
  }

  function gridSettingsActions(e) {
    var target = e.target;
    switch (e.which) {
      case 40:
        e.preventDefault();
        e.stopPropagation();
        console.log(e);
    }
  }

  function edit(el) {
    var dupe = el.cloneNode(true);
    var controls = dupe.querySelectorAll(".row-control,.column-control");
    for (var i = 0, l = controls.length; i < l; i++) {
      controls[i].parentElement.removeChild(controls[i]);
    }
    dupe = dupe.outerHTML.replace("/s{2,}/g", "/s");
    var txtarea = grid.nextElementSibling.getElementsByTagName("textarea")[0];
    txtarea.value = dupe;
    currentBlock = el;
    window.addEventListener("keydown", function(e) {
      console.log(e);
    });
  }

  function changeSize(el, x) {
    var className = el.className;
    className = className.match(/\s{0,1}col-md-\d{1,2}\s{0,1}/g)[0].trim();
    el.classList.remove(className);
    if (x == "expand") {
      var n = Number(className.slice(7)) + 1;
      n = n > 12 ? 12 : n;
    } else {
      var n = Number(className.slice(7)) - 1;
      n = n < 1 ? 1 : n;
    }
    className = className.slice(0, 7) + n;
    el.classList.add(className);
  }

  function shrink() {
    var className = el.className;
    className = className.match(/\s{0,1}col-md-\d{1,2}\s{0,1}/g)[0].trim();
    el.classList.remove(className);
    var n = Number(className.slice(7)) + 1;
    n = n > 12 ? 12 : n;
    className = className.slice(0, 7) + n;
    el.classList.add(className);
  }

  function duplicate(el) {
    console.log(el);
    var dupe = el.cloneNode(true);
    var control = dupe.firstElementChild;
    control.lastElementChild.style.display = "none";
    control.firstElementChild.classList.remove("active");
    control.firstElementChild.setAttribute("aria-expanded", "false");
    dupe.classList.add("highlight");
    el.nextElementSibling
      ? el.parentElement.insertBefore(dupe, el.nextElementSibling)
      : el.parentElement.appendChild(dupe);
    setTimeout(function() {
      dupe.classList.remove("highlight");
    }, 200);
  }

  function del(el) {
    el.parentElement.removeChild(el);
  }

  function showHTML() {
    gridContainer.style.display = "none";
    editorContainer.style.display = "block";
    wrap.classList.add("html-active");
    wrap.classList.remove("grid-active");
  }

  function showGrid() {
    prepareGrid();
    gridContainer.style.display = "block";
    editorContainer.style.display = "none";
    wrap.classList.remove("html-active");
    wrap.classList.add("grid-active");
  }

  function prepareGrid() {
    grid.innerHTML = content.value;
    var rows = grid.getElementsByClassName("row");
    colControl = document.getElementById("tmpl-grid-easy-column-control")
      .innerHTML;
    rowControl = document.getElementById("tmpl-grid-easy-row-control")
      .innerHTML;
    addControls(rows);
    /*var cols=document.querySelectorAll('[class^=col-]');
	for(var k=0,l=cols.length;k<l;k++){
console.log(k,cols[k],cols[k].clientWidth);
		cols[k].innerHTML=colControl+cols[k].innerHTML;
	}
console.log(cols);*/
  }

  function addControls(rows) {
    for (var i = 0, l = rows.length; i < l; i++) {
      var ch = rows[i].childNodes;
      for (var j = 0; j < ch.length; ) {
        if (ch[j].nodeType == 3) {
          rows[i].removeChild(ch[j]);
          continue;
        } else {
          ch[j].insertAdjacentHTML("afterbegin", colControl);
          j++;
        }
      }
      rows[i].insertAdjacentHTML("afterbegin", rowControl);
    }
  }

  function updateBlock() {
    var temp = document.createElement("div");
    temp.innerHTML = this.previousElementSibling.value;
    var rows = temp.getElementsByClassName("row");
    if (rows[0]) {
      addControls(rows);
    }
    var col = temp.children[0];
    col.insertAdjacentHTML("afterbegin", colControl);
    col = temp.removeChild(col);
    currentBlock.outerHTML = col.outerHTML;
    tb_remove();
    currentBlock.getElementsByClassName("thickbox")[0].focus();
    /*currentBlock.outerHTML=this.previousElementSibling.value;
	var rows=currentBlock.getElementsByClassName('row');
	if(rows[0]){
		addControls(rows);
	}
	currentBlock.insertAdjacentHTML('afterbegin',colControl);
	tb_remove();*/
  }

  function helpEdit() {}
})();

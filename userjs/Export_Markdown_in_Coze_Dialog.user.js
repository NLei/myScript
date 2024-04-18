// ==UserScript==
// @name         Export_Markdown_in_Coze_Dialog
// @namespace    http://tampermonkey.net/
// @version      2024-04-17
// @description  try to take over the world!
// @author       You
// @match        https://www.coze.com/store/bot/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coze.com
// @updateURL    https://github.com/NLei/myScript/raw/master/userjs/Export_Markdown_in_Coze_Dialog.user.js
// @downloadURL  https://github.com/NLei/myScript/raw/master/userjs/Export_Markdown_in_Coze_Dialog.user.js
// @grant        none
// ==/UserScript==

function convertToMarkdown(html) {
    // 首先使用正则表达式进行简单的标签替换
    let markdown = html
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<code>(.*?)<\/code>/gi, '`$1`');

    // 使用DOM解析处理更复杂的标签和结构
    const parser = new DOMParser();
    const doc = parser.parseFromString(markdown, 'text/html');

    // 处理列表嵌套
    function countParents(node) {
        let depth = 0;
        while (node.parentNode) {
            node = node.parentNode;

            if(node.tagName){
                if (node.tagName.toUpperCase() === 'UL' || node.tagName.toUpperCase() === 'OL') {
                    depth++;
                }
            }
        }
        return depth;
    }

    function processList(element) {
        let md = '';
        let depth = countParents(element);
        let index = null;
        if (element.tagName.toUpperCase() === 'OL'){
            index = 1;
        }
        element.childNodes.forEach(node => {
            if (node.tagName && node.tagName.toLowerCase() === 'li') {
                if(index != null) {
                    md += '<span> </span>'.repeat(depth*2) + `${index++}\. ${node.textContent.trim()}\n`;
                } else {
                    md += '<span> </span>'.repeat(depth*2) + `- ${node.textContent.trim()}\n`;
                }
            }
        });
        return md;
    }

    // 列表
    let listsArray = Array.from( doc.querySelectorAll('ol, ul'));
    listsArray.reverse();
    listsArray.forEach(list => {
        list.outerHTML = processList(list);
    });

    doc.querySelectorAll("div.chat-uikit-multi-modal-file-image-content").forEach(multifile => {
        multifile.innerHTML = multifile.innerHTML
            .replace(/<span class="chat-uikit-file-card__info__size">(.*?)<\/span>/gi, '\n$1');
        multifile.innerHTML = `\n\`\`\`file\n${multifile.textContent}\n\`\`\`\n`;
    });

    // 处理代码块
    doc.querySelectorAll("div[class^=code-block] > div[class^=code-area]").forEach(codearea => {
        let header = codearea.querySelector("div[class^=header]");
        let language = header.textContent;
        header.remove();
        codearea.outerHTML = `\n\`\`\`${language}\n${codearea.textContent}\n\`\`\`\n`;
    });

    // 获取最终Markdown文本
    markdown = doc.body.innerText ||doc.body.textContent;

    return markdown.replaceAll(":", "\\:");;
}

function GetDialogContent() {
    let markdownContent = '';

    let chats = document.querySelectorAll('div[data-scroll-element="scrollable"] div.chat-uikit-message-box-container__message__message-box');

    // 按倒序遍历chats
    Array.from(chats).reverse().forEach(function(chat) {

        let ask = chat.querySelector("div.chat-uikit-message-box-inner--primary");

        let htmlContent = chat.innerHTML;
        let chatMarkdown = convertToMarkdown(htmlContent);

        if (ask) {
            markdownContent += "## Ask: \n"+ chatMarkdown + '\n\n';
        } else {
            markdownContent += "## Anser: \n"+ chatMarkdown + '\n\n';
        }
    });

    return markdownContent;
}

function CopyDialogContent() {
    const mdContent = GetDialogContent();

    navigator.clipboard.writeText(mdContent).then(function() {
        console.log('Markdown content copied to clipboard!');
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
    });
}

function ExportDialogContent() {
    let fileContent = GetDialogContent();

    let blob = new Blob([fileContent], {type: 'text/plain;charset=utf-8'});
    let fileUrl = URL.createObjectURL(blob);
    let tempLink = document.createElement('a');
    tempLink.href = fileUrl;

    let fileTitle = document.title + " ExportDialog.md"
    tempLink.setAttribute('download', fileTitle);
    tempLink.style.display = 'none';
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    URL.revokeObjectURL(fileUrl);
}

function addBtnLoop() {
    if( document.querySelector("#copy_dialog_to_md_button") ==null ) {
        var lhead = document.querySelector("div[class*=semi-col]:last-child > div[class*=semi-space]") ||
            document.querySelector("div.flex.items-center.gap-5.h-6");
        if (lhead) {
            var btn_cp = document.createElement('button');
            lhead.insertBefore(btn_cp, lhead.firstChild);
            btn_cp.className ="semi-button semi-button-primary";
            btn_cp.textContent = 'Copy Dialog to MD';
            btn_cp.id = 'copy_dialog_to_md_button';
            btn_cp.onclick = CopyDialogContent;

            var btn_dl = document.createElement('button');
            lhead.insertBefore(btn_dl, lhead.firstChild);
            btn_dl.className ="semi-button semi-button-primary";
            btn_dl.textContent = 'Export Dialog to MD';
            btn_dl.id = 'export_dialog_to_md_button';
            btn_dl.onclick = ExportDialogContent;
            setTimeout(addBtnLoop, 5000);
        }
    }
    setTimeout(addBtnLoop, 2000);
}

// 启动循环
addBtnLoop();

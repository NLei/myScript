// ==UserScript==
// @name         Textarea 常用语助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在textarea中添加常用语
// @author       Your Name
// @match        */*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 从localStorage中获取常用语，如果没有则使用默认的常用语
    let commonPhrases = JSON.parse(localStorage.getItem('commonPhrases')) || ['你好', '谢谢', '再见', '请稍等'];

    // 保存常用语到localStorage
    function savePhrases() {
        localStorage.setItem('commonPhrases', JSON.stringify(commonPhrases));
    }


    function triggerInput(target, newPhrase){
        target.focus();
        document.execCommand('insertText', false, newPhrase);
        target.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    }

    /*
        setTimeout(() => {
            const value = target.value + newPhrase;
            target.value = value;
            target.innerHTML = value;
            target.textContent = value;

            const inputEvent = new Event('input', { bubbles: true,
                                                   cancelBubble:false,
                                                   cancelable:true,
                                                   composed:false,
                                                   currentTarget:null,
                                                  });
            target.dispatchEvent(inputEvent);

        }, 1);



        function simulateKeyPress(character) {
            const event = new KeyboardEvent('keypress', {
                key: character,
                code: 'Key' + character.toUpperCase(),
                charCode: character.charCodeAt(0),
                keyCode: character.charCodeAt(0),
                bubbles: true
            });
            document.dispatchEvent(event);
        }

        setTimeout(() => {
            target.focus();
            target.click();
            for (let char of newPhrase) {
                simulateKeyPress(char);
            }
          //  target.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        }, 0);



        // 创建并触发 InputEvent

        target.value = value;
        //   target.innerHTML = value;
        //  target.textContent = value;

        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            isComposing: false,
            cancelable: false,
            composed: true,
            isTrusted: true,
            data: newPhrase,
        });

        target.dispatchEvent(inputEvent);

        setTimeout(() => {
            target.dispatchEvent(inputEvent);
        }, 0);



        target.value = value;
        target.innerHTML = value;
        target.textContent = value;
   /*
        setTimeout(() => {
            target.value = value;
            target.innerHTML = value;
            target.textContent = value;

            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });
            inputEvent.stopPropagation = () => {};
            changeEvent.stopPropagation = () => {};
            target.dispatchEvent(inputEvent);
            target.dispatchEvent(changeEvent);

            target.value = value;
            target.innerHTML = value;
            target.textContent = value;
        }, 1);


        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        inputEvent.stopPropagation = () => {};
        changeEvent.stopPropagation = () => {};
        setTimeout(() => {
            target.value = value;
            target.innerHTML = value;
            target.textContent = value;

            target.dispatchEvent(inputEvent);
            target.dispatchEvent(changeEvent);

            target.value = value;
            target.innerHTML = value;
            target.textContent = value;
        }, 0);
*/



    // 创建常用语按钮
    function createPhraseButtons() {
        const textarea = document.querySelector("textarea[data-testid*='chat_input']");
        if (!textarea) return;

        // 检查常用语按钮容器是否已经存在
        if (document.getElementById('common-phrases-container')) return;

        const container = document.createElement('div');
        container.id = 'common-phrases-container';
        container.style = "position:absolute; margin-bottom:100px; left:16px; background-color:white; border:1px solid rgb(204, 204, 204); padding:5px; z-index:1000; box-shadow:rgba(0, 0, 0, 0.1) 0px 2px 10px; display:none;"

        commonPhrases.forEach((phrase, index) => {
            const phraseContainer = document.createElement('span');
            phraseContainer.style.marginRight = '5px';

            const button = document.createElement('button');
            button.innerText = phrase;
            button.style.marginRight = '5px';

            button.onclick = () => {
                triggerInput(textarea, phrase);
            };

            const deleteButton = document.createElement('button');
            deleteButton.innerText = '删除';
            deleteButton.style.marginRight = '5px';
            deleteButton.onclick = () => {
                commonPhrases.splice(index, 1);
                savePhrases();
                container.removeChild(phraseContainer); // 从界面中移除
            };

            phraseContainer.appendChild(button);
            phraseContainer.appendChild(deleteButton);
            container.appendChild(phraseContainer);
        });

        // 增加添加新常用语的按钮和输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '新增常用语';
        input.style.marginRight = '5px';

        const addButton = document.createElement('button');
        addButton.innerText = '添加';
        addButton.onclick = () => {
            const newPhrase = input.value.trim();
            if (newPhrase !== '' && !commonPhrases.includes(newPhrase)) {
                commonPhrases.push(newPhrase);
                savePhrases(); // 保存到localStorage

                const phraseContainer = document.createElement('span');
                phraseContainer.style.marginRight = '5px';

                const newButton = document.createElement('button');
                newButton.innerText = newPhrase;
                newButton.style.marginRight = '5px';
                newButton.onclick = () => {
                    triggerInput(textarea, newPhrase);
                };

                const deleteButton = document.createElement('button');
                deleteButton.innerText = '删除';
                deleteButton.style.marginRight = '5px';
                deleteButton.onclick = () => {
                    const index = commonPhrases.indexOf(newPhrase);
                    if (index > -1) {
                        commonPhrases.splice(index, 1);
                        savePhrases();
                        container.removeChild(phraseContainer); // 从界面中移除
                    }
                };

                phraseContainer.appendChild(newButton);
                phraseContainer.appendChild(deleteButton);
                container.insertBefore(phraseContainer, input);
                input.value = '';
            }
        };

        container.appendChild(input);
        container.appendChild(addButton);

        textarea.parentElement.parentElement.parentElement.appendChild(container);

        // 监听textarea的focus和blur事件
        textarea.addEventListener('focus', () => {
            container.style.display = 'block';
            console.log("+ focus")
        });

        textarea.addEventListener('input', (event) => {
            container.style.display = 'block';
            console.log("+ input " + [ textarea.value, textarea.innerHTML ,textarea.textContent ] );
            console.log("+ event.data: " + [ event.data , event.inputType, event.isComposing]);
            console.log(event);
        });

        textarea.addEventListener('change', () => {
            container.style.display = 'block';
            console.log("+ change " + [ textarea.value, textarea.innerHTML ,textarea.textContent ] );
        });

        textarea.addEventListener('blur', () => {
            //container.style.display = 'none';
            console.log("+ blur")
        });

        textarea.addEventListener('invalid', function(event) {
            console.log("+ invalid")
            // 阻止默认行为（显示默认的验证消息）
            event.preventDefault();
        });

        // 使用MutationObserver监控textarea内容变化
        const observer = new MutationObserver(() => {
            textarea.value = textarea.value; // 强制更新textarea的内容
        });

    }

    function PromptWordsAdd(){
        const inputTextarea = document.querySelector("textarea[data-testid*='chat_input']");
        if (inputTextarea) {
            createPhraseButtons();
        } else {
            setTimeout(PromptWordsAdd, 700);
        }
    }
    PromptWordsAdd();

})();

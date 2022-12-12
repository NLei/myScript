// ==UserScript==
// @name         kernel docs 英/繁/简 切换
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.kernel.org/doc/html/latest/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kernel.org
// @updateURL    https://github.com/NLei/myScript/raw/master/userjs/SwitchTranslationsForkernelDocs.user.js
// @downloadURL  https://github.com/NLei/myScript/raw/master/userjs/SwitchTranslationsForkernelDocs.user.js
// @grant        none
// ==/UserScript==

var zh_s=document.createElement("a");
var zh_t=document.createElement("a");
var raw=document.createElement("a");
document.querySelector(".wy-breadcrumbs-aside").appendChild(zh_s);
document.querySelector(".wy-breadcrumbs-aside").appendChild(zh_t);
document.querySelector(".wy-breadcrumbs-aside").appendChild(raw);

var raw_url;
if(document.URL.search("/translations/") < 0){
    raw_url = document.URL;
} else {
    raw_url = document.URL.replace(/translations\/.*?\//g,"");
}

raw.href = raw_url;
raw.text = "原版"
zh_s.href = raw_url.replace("/doc/html/latest/","/doc/html/latest/translations/zh_CN/");
zh_s.text = "简体";
zh_t.href = raw_url.replace("/doc/html/latest/","/doc/html/latest/translations/zh_TW/");
zh_t.text = "繁體";

if(document.URL == raw.href) {
    raw.style.display="none"
}
if(document.URL == zh_s.href) {
    zh_s.style.display="none"
}
if(document.URL == zh_t.href) {
    zh_t.style.display="none"
}

zh_t.style.cursor = "default";
zh_t.style.color = "#aaa";
zh_s.style.cursor = "default";
zh_s.style.color = "#aaa";

const http_zh_s = new XMLHttpRequest();
http_zh_s.open("GET", zh_s.href);
http_zh_s.send();
http_zh_s.onreadystatechange = (e) => {
    if(http_zh_s.status == 200){
        zh_s.style.cursor = "pointer";
        zh_s.style.color = "";
    }
    else if(http_zh_s.status == 404){
        zh_s.title = "404 Not Found";
        zh_s.style.cursor = "not-allowed";
    }
}

const http_zh_t = new XMLHttpRequest();
http_zh_t.open("GET", zh_t.href);
http_zh_t.send();
http_zh_t.onreadystatechange = (e) => {
    if(http_zh_t.status == 200){
        zh_t.style.cursor = "pointer";
        zh_t.style.color = "";
    }
    else if(http_zh_t.status == 404){
        zh_t.title = "404 Not Found";
        zh_t.style.cursor = "not-allowed";
    }
}

// Your code here...

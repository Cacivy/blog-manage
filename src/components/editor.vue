<template>
    <div id="editor" :class="{'split': isSplit}">   
        <div class="editor-toolbar">
            <a class="icon-bold" @click="toggleBlock('bold', '**')"></a>
            <a class="icon-italic" @click="toggleBlock('italic', '*')"></a>
            <a class="icon-embed2" @click="toggleBlock('code', '`')"></a>
            <i class="separator">|</i>
            <a class="icon-quotes-left" @click="toggleLine('quote')"></a>
            <a class="icon-list2" @click="toggleLine('unordered-list')"></a>
            <a class="icon-list-numbered" @click="toggleLine('ordered-list')"></a>
            <i class="separator">|</i>
            <a class="icon-link" @click="replaceSelection('[', '](http://)')"></a>
            <a class="icon-image" @click="replaceSelection('![', '](http://)')"></a>
            <!-- <a class="icon-table2"></a> -->
            <i class="separator">|</i>
            <a class="icon-columns" :class="{'active': isSplit}" @click="toggleSplit"></a>
            <a class="icon-eye" :class="{'active': isPreview}" @click="togglePreview"></a>
            <a class="icon-enlarge2 icon-fullscreen" @click="toggleFullScreen"></a>
        </div>
        <textarea id="m-editor"></textarea>
        <div class="editor-statusbar">
            <span class="lines">{{status.lines}}</span>
            <span class="words">{{status.words}}</span>
            <span class="cursor">{{status.pos.line}}:{{status.pos.ch}}</span>
        </div>
    </div>
</template>

<script>
import marked from 'marked'
import highlight from 'highlight.js'
import CodeMirror from 'CodeMirror'
import 'CodeMirror/addon/scroll/simplescrollbars'
import "codemirror/addon/display/placeholder.js"
import 'CodeMirror/mode/gfm/gfm.js'
import 'CodeMirror/mode/javascript/javascript.js'
import 'CodeMirror/mode/css/css.js'
import 'CodeMirror/keymap/sublime.js'

import 'CodeMirror/lib/codemirror.css'
import 'CodeMirror/addon/scroll/simplescrollbars.css'
import 'highlight.js/styles/default.css'
import '../assets/style/preview/github.css'

export default {
    data() {
        return {
            content: '',
            status: {
                lines: 0,
                words: 0,
                pos: {
                    line: 0,
                    ch: 0
                }
            },
            isPreview: false,
            isSplit: false,
            placeholder: 'Content'
        }
    },
    props: {
        value: String
    },
    created() {
        let renderer = new marked.Renderer()
        /* Todo列表 */
        renderer.listitem = (text) => {
            if (/^\s*\[[x ]\]\s*/.test(text)) {
                text = text
                    .replace(/^\s*\[ \]\s*/, '<input type="checkbox" class="task-list-item-checkbox" disabled> ')
                    .replace(/^\s*\[x\]\s*/, '<input type="checkbox" class="task-list-item-checkbox" disabled checked> ');
                return '<li style="list-style: none">' + text + '</li>';
            } else {
                return '<li>' + text + '</li>';
            }
        };
        marked.setOptions({
            renderer,
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function (code, lang) {
                return highlight.highlightAuto(code).value
            }
        });
    },
    mounted() {
        let el = document.getElementById('m-editor')
        const config = {
            mode: 'gfm',
            lineNumbers: false,
            theme: "default",
            autofocus: true,
            lineWrapping: true,
            scrollbarStyle: "simple", // overlay
            tabSize: 2,
            allowDropFileTypes: ["text/plain"],
            indentWithTabs: true,
            placeholder: this.placeholder,
            keyMap: 'sublime'
        }
        this.editor = CodeMirror.fromTextArea(el, Object.assign({}, config))
        // 添加preview
        let wrapper = this.editor.getWrapperElement();
        let preview = wrapper.lastChild;
        if (!/editor-preview/.test(preview.className)) {
            preview = document.createElement('div');
            preview.className = 'editor-preview';
            wrapper.appendChild(preview);
        }
        var cScroll = false
	    var pScroll = false
        preview.onscroll = () => {
            if(pScroll) {
                pScroll = false
                return
            }
            cScroll = true
            var height = preview.scrollHeight - preview.clientHeight;
            var ratio = parseFloat(preview.scrollTop) / height;
            var move = (this.editor.getScrollInfo().height - this.editor.getScrollInfo().clientHeight) * ratio;
            this.editor.scrollTo(0, move);
        };
        this.editor.on('scroll', (cm, e) => {
            if(cScroll) {
                cScroll = false
                return
            }
            pScroll = true

            var scroll_info = cm.getScrollInfo()
            var scale = (scroll_info.top) / (scroll_info.height - scroll_info.clientHeight);
            let $preview = document.querySelector('.editor-preview')
            $preview.scrollTop = ($preview.scrollHeight - $preview.clientHeight) * scale
        })
        this.editor.on('change', (cm) => {
            this.onChange(cm)
        })
        this.editor.on('cursorActivity', (cm => {
            let pos = cm.getCursor()
            this.status.pos.line = pos.line
            this.status.pos.ch = pos.ch
        }))
        this.editor.on('drop', (cm, e) => {
            e.preventDefault()
            let fileList = e.dataTransfer.files
            if (!fileList.length) {
                return false
            }
            if (fileList[0].type.indexOf('image') === -1) {
                return false
            }
            var url = (window.webkitURL || window.URL).createObjectURL(fileList[0]); 
            var filename = fileList[0].name; //图片名称 
            var filesize = Math.floor((fileList[0].size)/1024);  
            if(filesize>500){ 
                alert("上传大小不能超过500K."); 
                return false; 
            }
            this.replaceSelection('!['+filename, `](${url})`)
        })
        this.editor.setValue(this.value || this.content)

        this.editor.isLine = (doc, l) => {
            return l >= doc.first && l < doc.first + doc.size
        }
        this.editor.setLine = (line, text) => {
            if (this.editor.isLine(this.editor, line))
                this.editor.replaceRange(this, text, this.editor.Pos(line, 0), this.editor.clipPos(this, this.editor.Pos(line)));
        }
    },
    methods: {
        onChange(cm) {
            this.content = cm.getValue()
            this.status.words = cm.getValue().length
            this.status.lines = cm.lineCount()
            if (!!this.$emit) {
                this.$emit('changed', this.content)
                this.$emit('input', this.content)
            }
        },
        getState(cm, pos) {
            pos = pos || cm.getCursor('start');
            var stat = cm.getTokenAt(pos);
            if (!stat.type) return {};

            var types = stat.type.split(' ');

            var ret = {}, data, text;
            for (var i = 0; i < types.length; i++) {
                data = types[i];
                if (data === 'strong') {
                    ret.bold = true;
                } else if (data === 'variable-2') {
                    text = cm.getLine(pos.line);
                    if (/^\s*\d+\.\s/.test(text)) {
                        ret['ordered-list'] = true;
                    } else {
                        ret['unordered-list'] = true;
                    } 
                } else if (data === 'atom') {
                    ret.quote = true;
                } else if (data === 'em') {
                    ret.italic = true;
                }
            }
            return ret;
        },
        toggleBlock(type, start_chars, end_chars){
            end_chars = (typeof end_chars === 'undefined') ? start_chars : end_chars;
            var cm = this.editor;
            var stat = this.getState(cm);
            var text;
            var start = start_chars;
            var end = end_chars;

            var startPoint = cm.getCursor('start');
            var endPoint = cm.getCursor('end');
            if (stat[type]) {
                text = cm.getLine(startPoint.line);
                start = text.slice(0, startPoint.ch);
                end = text.slice(startPoint.ch);
                startRegex = new RegExp("/^(.*)?(\*|\_){" + start_chars.length + "}(\S+.*)?$/", "g")
                start = start.replace(startRegex, '$1$3');
                endRegex = new RegExp("/^(.*\S+)?(\*|\_){" + end_chars.length + "}(\s+.*)?$/", "g")
                end = end.replace(endRegex, '$1$3');
                startPoint.ch -= start_chars.length;
                endPoint.ch -= end_chars.length;
                cm.setLine(startPoint.line, start + end);
            } else {
                text = cm.getSelection();
                cm.replaceSelection(start + text + end);

                startPoint.ch += start_chars.length;
                endPoint.ch += end_chars.length;
            }
            cm.setSelection(startPoint, endPoint);
            cm.focus();
        },
        toggleLine(name) {
            var cm = this.editor;
            var stat = this.getState(cm);
            var startPoint = cm.getCursor('start');
            var endPoint = cm.getCursor('end');
            var repl = {
                quote: /^(\s*)\>\s+/,
                'unordered-list': /^(\s*)(\*|\-|\+)\s+/,
                'ordered-list': /^(\s*)\d+\.\s+/
            };
            var map = {
                quote: '> ',
                'unordered-list': '* ',
                'ordered-list': '1. '
            };
            for (var i = startPoint.line; i <= endPoint.line; i++) {
                (function(i) {
                    var text = cm.getLine(i);
                    if (stat[name]) {
                        text = text.replace(repl[name], '$1');
                    } else {
                        text = map[name] + text;
                    }
                    cm.replaceRange(text, {line: i, ch:0});
                })(i);
            }
            cm.focus();
        },
        replaceSelection(start, end) {
            var text;
            var cm = this.editor
            var startPoint = cm.getCursor('start');
            var endPoint = cm.getCursor('end');
            text = cm.getSelection();
            cm.replaceSelection(start + text + end);

            startPoint.ch += start.length;
            endPoint.ch += start.length;
            cm.setSelection(startPoint, endPoint);
            cm.focus();
        },
        toggleFullScreen() {
            var el = document.querySelector('#editor') //this.editor.getWrapperElement();
            
            // https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
            var doc = document;
            var isFull = doc.fullScreen || doc.mozFullScreen || doc.webkitIsFullScreen;
            var request = function() {
                if (el.requestFullScreen) {
                    el.requestFullScreen();
                } else if (el.mozRequestFullScreen) {
                    el.mozRequestFullScreen();
                } else if (el.webkitRequestFullScreen) {
                    el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            };
            var cancel = function() {
                if (doc.cancelFullScreen) {
                    doc.cancelFullScreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.webkitCancelFullScreen) {
                    doc.webkitCancelFullScreen();
                }
            };
            if (!isFull) {
                request();
            } else if (cancel) {
                cancel();
            }
        },
        togglePreview() {
            var cm = this.editor;
            var wrapper = cm.getWrapperElement();
            var preview = wrapper.lastChild;
            if (/editor-preview-active/.test(preview.className)) {
                preview.className = preview.className.replace(/\s*editor-preview-active\s*/g, '');
                this.isPreview = false
                if (this.isSplit) {
                    this.isSplit = false
                }
            } else {
                setTimeout(function() {
                    preview.className += ' editor-preview-active'
                }, 1);
                this.isPreview = true
            }
            var text = cm.getValue();
            preview.innerHTML = marked(text);
        },
        toggleSplit() {
            this.isSplit = !this.isSplit
            if (this.isSplit) {
                if (!this.isPreview) {
                    this.togglePreview()
                }
            }
        },
        getHtml() {
            var cm = this.editor
            var text = cm.getValue()
            return marked(text)
        }
    },
    watch: {
         value(newVal, oldVal) {
            const editor_value = this.editor.getValue()
            if (newVal !== editor_value) {
                let scrollInfo = this.editor.getScrollInfo()
                this.editor.setValue(newVal)
                this.content = newVal
                this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
            }
            if (this.isPreview) {
                var cm = this.editor
                var wrapper = cm.getWrapperElement()
                var preview = wrapper.lastChild
                preview.innerHTML = this.getHtml()
            }
        }
    }
}
</script>

<style>
.CodeMirror {
    /*font-family: 'Microsoft Yahei', 'Dosis', 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
    border: 1px solid #eee;*/
    min-height: 500px;
    font-size: 20px;
    border-top: 0;
}

:-webkit-full-screen {
  background: #f9f9f5 !important;
  padding: 0.5em 1em;
  width: 100% !important;
  height: 100% !important;
}

:-webkit-full-screen>.CodeMirror {
    height: calc(100% - 77px);
}

.editor-toolbar {
  position: relative;
  opacity: 0.6;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.editor-toolbar:before, .editor-toolbar:after {
  display: block;
  content: ' ';
  height: 1px;
  background-color: #bdc3c7;
  background: -moz-linear-gradient(45deg, #f9f9f9, #bdc3c7, #f9f9f9);
  background: -webkit-linear-gradient(45deg, #f9f9f9, #bdc3c7, #f9f9f9);
  background: -ms-linear-gradient(45deg, #f9f9f9, #bdc3c7, #f9f9f9);
  background: linear-gradient(45deg, #f9f9f9, #bdc3c7, #f9f9f9);
}
.editor-toolbar:before {
  margin-bottom: 8px;
}
.editor-toolbar:after {
  margin-top: 8px;
}
.editor-toolbar a {
  display: inline-block;
  text-align: center;
  text-decoration: none !important;
  color: #2c3e50 !important;
  width: 24px;
  height: 24px;
  margin: 2px;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
}
.editor-toolbar a:hover, .editor-toolbar a.active {
  background: #fcfcfc;
  border-color: #95a5a6;
}
.editor-toolbar a:before {
  line-height: 24px;
}
.editor-toolbar i.separator {
  display: inline-block;
  width: 0;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid white;
  color: transparent;
  text-indent: -10px;
  margin: 0 6px;
}
.editor-toolbar a.icon-fullscreen {
  position: absolute;
  right: 0;
}

.editor-statusbar {
  border-top: 1px solid #ece9e9;
  padding: 8px 10px;
  font-size: 12px;
  color: #959694;
  text-align: right;
}
.editor-statusbar span {
  display: inline-block;
  min-width: 4em;
  margin-left: 1em;
}
.editor-statusbar .lines:before {
  content: 'lines: ';
}
.editor-statusbar .words:before {
  content: 'words: ';
}

.editor-preview {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 100%;
  background: #fff;
  z-index: 9999;
  overflow: auto;
  -webkit-transition: left 0.2s ease;
  -moz-transition: left 0.2s ease;
  -ms-transition: left 0.2s ease;
  transition: left 0.2s ease;
}
.editor-preview-active {
  left: 0;
}
.editor-preview > p {
  margin-top: 0;
}
#editor.split .CodeMirror-scroll {
    width: 50%;
}
#editor.split .editor-preview {
    width: calc(50% - 15px);
    left: 50%;
    border-left: 1px solid #ddd;
    padding: 0 10px;
    background: #fafafa;
    overflow: auto;
}
</style>
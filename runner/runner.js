
$(document).ready(main);

function main() {
	
	const $time = $("#current-time");
		
		
	const date = new Date();
	let options = {
		// 如果省略某一项（如年份），那么格式化后的字符串不会包含年份
		weekday: "long", // 工作日的呈现方式（长名称）
		year: "numeric", // 年份的呈现方式（数字）
		month: "long",   // 月份的呈现方式（长名称）
		day: "numeric",   // 天的呈现方式（2位数字）
		hour: "numeric"
	};

	let dateMessage = new Intl.DateTimeFormat("zh-cn", options).format(date); 
	let headMessage = "现在是" + dateMessage + "。";
	
	let showMessage = () => headMessage;
	

    const editor = CodeMirror((area) => {
        let codeArea = document.getElementById("code");
        codeArea.parentNode.replaceChild(area, codeArea)
    }, {
        mode: "text/javascript",    //实现 JavaScript 代码高亮
        lineNumbers: true,	//显示行号
        theme: "default",	//设置主题
        lineWrapping: true,	//代码折叠
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
		styleActiveLine: true,
        matchBrackets: true,	//括号匹配
		autoCloseBrackets: true, // 括号补全
		extraKeys: {
			"Ctrl-Space": "autocomplete",
			"Shift-Alt-Enter": function (cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			}
		},
        showCursorWhenSelecting: true,
		
    });
	
	let themeInput = document.getElementById("select-theme");
	themeInput.onchange = selectTheme;
	function selectTheme () {
		var theme = themeInput.options[themeInput.selectedIndex].textContent;
		editor.setOption("theme", theme);
		location.hash = "#" + theme;
	}
	var choice = (location.hash && location.hash.slice(1)) ||
				(document.location.search &&
					decodeURIComponent(document.location.search.slice(1)));
	if (choice) {
		themeInput.value = choice;
		editor.setOption("theme", choice);
	}
	CodeMirror.on(window, "hashchange", function() {
		var theme = location.hash.slice(1);
		if (theme) { themeInput.value = theme; selectTheme(); }
	});
	

    editor.setSize('555px', '800px');     //设置代码框的长宽
	
	if (!Cookies.get("name")) {
		let name =  prompt("初次见面，你好啊~请问你叫什么名字呢？");
		if (name) {
			Cookies.set("name", name, { expires: 14 });
		}
	} else {
		headMessage += "又见面了，" + Cookies.get("name") + "。";
		let dtf = new Intl.DateTimeFormat("zh-cn");
		editor.setOption("value", (() => 
			`/*\n* 作者：${Cookies.get("name")}\n* 日期：${dtf.format(new Date())}\n*/\n\n`)());
	}
	
	$time.text(showMessage());
	
	setInterval(() => $time.text(headerMessage()), 3600 * 1000);

    const output = document.getElementById("output");
	
	const toRun = () => {
        try {
            output.innerText = "";

            document.write = (...args) => {
				let text = args.join("");
                output.innerText += text;
				return text.length;
            }
			
			document.writeln = () => {
				document.write(...arguments, '\n') - 1;				
			}

            eval(editor.getValue());
        } catch (error) {
            alert("捕获错误 - " + error);
        }
    };

    const runButton = document.getElementById("run")
	runButton.addEventListener("click", toRun, false);
	runButton.addEventListener("touchend", toRun, false);

}

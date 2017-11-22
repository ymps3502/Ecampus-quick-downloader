// ==UserScript==
// @name         Ecampus quick downloader
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  add link to quickly download file without open annoying pop-up window.
// @author       chaney
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        *://ecampus2.nchu.edu.tw/eCampus3P/Learn/stu_materials_document_list.aspx
// @updateURL    https://raw.githubusercontent.com/ymps3502/Ecampus-quick-downloader/master/Ecampus%20quick%20downloader.js
// @downloadURL  https://raw.githubusercontent.com/ymps3502/Ecampus-quick-downloader/master/Ecampus%20quick%20downloader.js
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
	/* jshint ignore:end */
	/* jshint esnext: false */
	/* jshint esversion: 6 */

	// Your code here...
	let linkViews = $("a[id$='_linkView']");
	for (let i = 0; i < linkViews.length; i++) {
		let obj = $(linkViews[i]).children();
		let data = obj[0].getAttributeNode('onclick').value;
		let args = /\( *([^)]+?) *\)/.exec(data);
		if (args[1]) {
			args = args[1].replace(new RegExp('\'', 'g'), '').split(/\s*,\s*/);
		}
		let popupPare = args[0];
		let courseId = args[1];

		$(linkViews[i]).parent().append ('<a id="downloadLink' + i + '" data-pop="' + popupPare + '" data-courseid="' + courseId + '" style="display:inline-block;">下載</a>');
		$('#downloadLink' + i).click(downloadFile);
	}

	function downloadFile(event) {
		let courseId = this.dataset.courseid;
		let popup = window.open(this.dataset.pop);
		popup.onload = function() {
			let linkFiles = popup.$("a[id$='_linkFilePreview']");
			for (let i = 0; i < linkFiles.length; i++) {
				let data = popup.$(linkFiles[i])[0].getAttributeNode('onclick').value;
				let args = /\( *([^)]+?) *\)/.exec(data);
				if (args[1]) {
				  args = args[1].replace(new RegExp('\'', 'g'), '').split(/\s*,\s*/);
				}
				let mediaId = args[0].split('?')[1];
				let link = 'common_get_content_media_attach_file.ashx?' + mediaId + '&' + courseId;
				window.location.href = link; // download file
			}
			popup.close();
		};
	}

	/* jshint ignore:start */
]]></>).toString();
				  var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */

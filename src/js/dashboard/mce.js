var $ = jQuery;
const { JX3BOX } = require('@jx3box/jx3box-common');
import Dialog from '../widget/dialog.js';
const dialog_code = new Dialog('.c-dialog-code','code')
const dialog_macro = new Dialog('.c-dialog-macro','macro')
const dialog_qixue = new Dialog('.c-dialog-qixue','qixue')
const dialog_jx3 = new Dialog('.c-dialog-jx3','jx3')

register_new_button()
function register_new_button(){
     /* Register the buttons */
     tinymce.create('tinymce.plugins.newbutton', {
          init : function(ed, url) {

               ed.addButton( 'button_newcode', {
                    title : '语法高亮',
                    image : JX3BOX.__imgPath + 'editor/code.svg',
                    cmd: 'syntax'
               });

               ed.addCommand( `syntax`, function() {
                    //var selected_text = ed.selection.getContent();
                    dialog_code.open()
               });

               ed.addButton( 'button_checklist', {
                    title : '插入checklist',
                    image : JX3BOX.__imgPath + 'editor/checklist.svg',
                    cmd: 'checklist'
               });

               var return_text = '';
               ed.addCommand( `checklist`, function() {
                    var selected_text = ed.selection.getContent();
                    return_text = '<div class="e-checklist">' + selected_text + '<div>';
                    ed.execCommand('mceInsertContent', 0, return_text);
               })

               ed.addButton( 'button_folder', {
                    title : '插入折叠文本',
                    image : JX3BOX.__imgPath + 'editor/unfold.svg',
                    cmd: 'folder'
               });

               var return_text = '';
               ed.addCommand( `folder`, function() {
                    var selected_text = ed.selection.getContent();
                    return_text = `<pre class="e-summary">折叠头文本</pre>
                                   <pre class="e-details">被折叠区域文本${selected_text}</pre>`;
                    ed.execCommand('mceInsertContent', 0, return_text);
               })

               ed.addButton( 'button_macro', {
                    title : '插入剑三宏',
                    image : JX3BOX.__imgPath + 'editor/macro2.svg',
                    cmd: 'macro'
               });

               ed.addCommand( `macro`, function() {
                    //var selected_text = ed.selection.getContent();
                    dialog_macro.open()
               });

               ed.addButton( 'button_qixue', {
                    title : '插入剑三奇穴',
                    image : JX3BOX.__imgPath + 'editor/qixue.svg',
                    cmd: 'qixue'
               });

               ed.addCommand( `qixue`, function() {
                    //var selected_text = ed.selection.getContent();
                    dialog_qixue.open()
               });

               ed.addButton( 'button_jx3', {
                    title : '插入剑三资源',
                    image : JX3BOX.__imgPath + 'editor/jx3.svg',
                    cmd: 'jx3'
               });

               ed.addCommand( `jx3`, function() {
                    //var selected_text = ed.selection.getContent();
                    dialog_jx3.open()
               });

               ed.addButton( 'button_spaceline', {
                    title : '插入绝对空行',
                    image : JX3BOX.__imgPath + 'editor/return.svg',
                    cmd: 'spaceline'
               });

               ed.addCommand( `spaceline`, function() {
                    ed.execCommand('mceInsertContent', 0, '<hr class="e-spaceline" />');
               });

               //绑定弹窗事件
               $(document).on('dialog_ok',function (e,type){
                    if(type == 'code'){
                         let grammar = $('#syntax-grammar').val()
                         let code = $('#syntax-code').val()
                         let return_text = `
                              <pre><code class="e-area-code" data-language="${grammar}">${code}</code></pre>
                         `;
                         ed.execCommand('mceInsertContent', 0, return_text);
                         setTimeout(function (){
                              $('#syntax-code').val('')
                         },2000)
                    }else if(type == 'macro'){
                         let macro = $('#c-dialog-insert-macro').val()
                         let return_text = `<pre class="e-jx3macro-area w-jx3macro">${macro}</pre>`
                         ed.execCommand('mceInsertContent', 0, return_text);
                         setTimeout(function (){
                              $('#c-dialog-insert-macro').val('')
                         },2000)
                    }else if(type == 'qixue'){
                         let qixue = $('#c-dialog-insert-qixue').val()
                         let return_text = `<input class="e-jx3qixue-area" type="text" value='${qixue}' />`
                         ed.execCommand('mceInsertContent', 0, return_text);
                         setTimeout(function (){
                              $('#c-dialog-insert-qixue').val('')
                         },2000)
                    }else if(type == 'jx3'){
                         let return_text = $('#c-dialog-insert-jx3').html()
                         ed.execCommand('mceInsertContent', 0, return_text);
                    }
               })
          },
          createControl : function(n, cm) {
               return null;
          },
     });
     /* Start the buttons */
     tinymce.PluginManager.add( 'my_button_script', tinymce.plugins.newbutton );
     
}

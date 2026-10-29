const plain=s=>s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#(?:39|x27);/g,"'").replace(/\s+/g,' ').trim();
export class FreshDocumentUI {
  constructor(tab,fs,progress,progressPath,render) { Object.assign(this,{tab,fs,progress,progressPath,render}); }
  async apply(doc,{alreadyOpen=false}={}) {
    const record=this.progress.documents.find(d=>d.key===doc.key);
    if (!record) throw new Error('Unknown document '+doc.key);
    if (!alreadyOpen) await this.tab.goto(record.url+'?noRedirect=1');
    const editor=this.tab.playwright.getByRole('textbox',{name:'Document content',exact:true});
    await editor.waitFor({state:'visible',timeoutMs:10000});
    const state=await this.tab.getAXState({disableDiffing:true,emit:false});
    const index=/(\d+) text entry area \(settable\) Description: Document content/.exec(state);
    if (!index) throw new Error('Document editor not available');
    const html=this.render(doc.html);
    const headings=[...html.matchAll(/<h[1-6](?:\s[^>]*)?>([\s\S]*?)<\/h[1-6]>/g)].map(m=>plain(m[1]));
    await this.tab.click(Number(index[1]));
    await this.tab.pressKey(null,'Control_L+a');
    await this.tab.paste(null,html,{format:'html'});
    await this.tab.getAXState({emit:false});
    await this.tab.playwright.getByRole('textbox',{name:'Document title',exact:true}).press('Tab');
    await this.tab.getAXState({emit:false});
    await this.tab.reload();
    await editor.waitFor({state:'visible',timeoutMs:10000});
    if (headings.length) await editor.getByText(headings[0],{exact:true}).waitFor({state:'visible',timeoutMs:10000});
    const saved=await editor.innerText();
    const missing=headings.filter(h=>!plain(saved).includes(h));
    if (missing.length) throw new Error('Saved headings missing: '+missing.join(', '));
    if (saved.length<plain(html).length*.80) throw new Error('Saved document body is unexpectedly short');
    if (/\{\{[^}]+\}\}/.test(saved)||/linear\.app\/ade0033\//.test(saved)) throw new Error('Old or unresolved reference in saved content');
    const folder='D:/study/work/helpdesk_pm/separation';
    await this.fs.writeFile(folder+'/fresh_saved_document_'+doc.key+'_20261029.txt',saved);
    await this.fs.writeFile(folder+'/fresh_saved_document_'+doc.key+'_20261029.ax.txt',await this.tab.getAXState({disableDiffing:true,emit:false}));
    Object.assign(record,{bodyComplete:true,savedVerified:true,headingCount:headings.length,savedCharacters:saved.length});
    await this.fs.writeFile(this.progressPath,JSON.stringify(this.progress,null,2));
    return {key:doc.key,headings:headings.length,savedCharacters:saved.length};
  }
}

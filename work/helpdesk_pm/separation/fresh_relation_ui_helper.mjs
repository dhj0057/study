export class FreshRelationUI {
  constructor(tab,fs,progress,payload,progressPath) { Object.assign(this,{tab,fs,progress,payload,progressPath}); }
  async read() { this.state=await this.tab.getAXState({disableDiffing:true,emit:false}); return this.state; }
  blockedIds() {
    const at=this.state.indexOf('heading Blocked by, Value: 3');
    if (at<0) return [];
    let section=this.state.slice(at);
    const next=/\n\s*\d+ heading [^\n]+, Value: 3/.exec(section);
    if(next)section=section.slice(0,next.index);
    return [...section.matchAll(/link Description: ([^\n]+?), Value: ([^\n]+)/g)].map(m=>{
      const known=this.progress.issues.find(i=>i.title===m[1]);
      const explicit=/\/issue\/(NONONO-\d+)/.exec(m[2]);
      return explicit?explicit[1]:(known?known.id:'UNKNOWN: '+m[1]);
    });
  }
  async verify(item) {
    await this.read();
    const record=this.progress.issues.find(i=>i.key===item.key);
    const expected=item.blockedBy.map(k=>this.progress.issues.find(i=>i.key===k).id);
    const actual=this.blockedIds();
    if(actual.length!==expected.length||expected.some(id=>!actual.includes(id)))throw new Error('Blocked-by mismatch for '+item.key+': '+actual.join(', '));
    const verifiedLinks=[];
    for(const key of item.blockedBy){
      const target=this.progress.issues.find(i=>i.key===key);
      const links=await this.tab.playwright.getByRole('link',{name:target.title,exact:true}).all();
      const paths=await Promise.all(links.map(l=>l.getAttribute('href')));
      if(!paths.length||paths.some(p=>!p.includes('/dhj00570-helpdesk/issue/'+target.id+'/')))throw new Error('Blocked-by link identity mismatch: '+key);
      verifiedLinks.push({key,id:target.id,url:paths[0]});
    }
    Object.assign(record,{relationsComplete:true,blockedBy:[...item.blockedBy],relationsVerified:true,blockedLinks:verifiedLinks});
    await this.fs.writeFile('D:/study/work/helpdesk_pm/separation/fresh_saved_issue_'+item.key+'_20261029.ax.txt',this.state);
    await this.fs.writeFile(this.progressPath,JSON.stringify(this.progress,null,2));
    return {key:item.key,blockedBy:actual};
  }
  async apply(item) {
    const record=this.progress.issues.find(i=>i.key===item.key);
    if(!(await this.tab.url()).includes('/issue/'+record.id+'/'))await this.tab.goto(record.url+'?noRedirect=1');
    await this.tab.playwright.getByRole('link',{name:record.id+' '+record.title,exact:true}).waitFor({state:'visible',timeoutMs:10000});
    await this.read();
    const already=this.blockedIds();
    for(const key of item.blockedBy) {
      const target=this.progress.issues.find(i=>i.key===key);
      if(already.includes(target.id))continue;
      await this.tab.playwright.getByRole('textbox',{name:'Issue title',exact:true}).click();
      await this.tab.playwright.getByRole('button',{name:'Issue options',exact:true}).press('Enter');
      const markAs=this.tab.playwright.getByRole('option',{name:'Mark as',exact:true});
      await markAs.waitFor({state:'visible',timeoutMs:5000});
      const rootMenu=this.tab.playwright.getByRole('dialog',{name:'Menu',exact:true}).filter({has:markAs});
      const rootFilter=rootMenu.getByRole('searchbox',{name:'Filter…',exact:true});
      await rootFilter.fill('Mark as');
      await rootMenu.getByRole('option',{name:'Due date',exact:true}).waitFor({state:'hidden',timeoutMs:5000});
      await rootFilter.press('Enter');
      const blockedBy=this.tab.playwright.getByRole('option',{name:'Blocked by…',exact:true});
      await blockedBy.waitFor({state:'visible',timeoutMs:5000});
      const subMenu=this.tab.playwright.getByRole('dialog',{name:'Menu',exact:true}).filter({has:blockedBy});
      const subFilter=subMenu.getByRole('searchbox',{name:'Filter…',exact:true});
      await subFilter.fill('Blocked by');
      await subMenu.getByRole('option',{name:'Parent of…',exact:true}).waitFor({state:'hidden',timeoutMs:5000});
      await subFilter.press('Enter');
      const combo=this.tab.playwright.getByRole('combobox',{name:'Command menu',exact:true});
      await combo.waitFor({state:'visible',timeoutMs:5000});
      await this.tab.playwright.getByRole('button',{name:'Enter Mark as blocked by',exact:true}).waitFor({state:'visible',timeoutMs:5000});
      await combo.fill(target.id);
      const option=this.tab.playwright.getByRole('option',{name:target.id+' '+target.title,exact:true});
      const focused=option.and(this.tab.playwright.locator('[data-focused="true"]'));
      await focused.waitFor({state:'visible',timeoutMs:5000});
      const path=await focused.getAttribute('href');
      const expected='/dhj00570-helpdesk/issue/'+target.id;
      if(!(path===expected||path.startsWith(expected+'/')))throw new Error('Ambiguous issue result identity');
      if(await focused.getAttribute('id')!==await combo.getAttribute('aria-activedescendant'))throw new Error('Focused issue result does not match the active command');
      await combo.press('Enter');
      await combo.waitFor({state:'hidden',timeoutMs:5000});
      await this.read();
      if(!this.blockedIds().includes(target.id))throw new Error('Blocked-by was not visible: '+item.key+' <- '+key);
      record.addedBlockedBy=[...(record.addedBlockedBy||[]),key];
      await this.fs.writeFile(this.progressPath,JSON.stringify(this.progress,null,2));
    }
    return this.verify(item);
  }
}

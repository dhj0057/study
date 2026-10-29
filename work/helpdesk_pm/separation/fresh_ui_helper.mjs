const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export class FreshIssueUI {
  constructor(tab, fs, progress, progressPath, render) {
    Object.assign(this, {tab, fs, progress, progressPath, render});
  }
  async read() { this.state = await this.tab.getAXState({disableDiffing:true, emit:false}); return this.state; }
  form() {
    const at = this.state.lastIndexOf('container Create issue');
    if (at < 0) {
      const child = this.state.indexOf('pop up button Change status.');
      if (child < 0) throw new Error('Issue form is not open');
      this.inline = true;
      return this.state.slice(this.state.lastIndexOf('\n',child)+1);
    }
    this.inline = false;
    return this.state.slice(at);
  }
  index(regex, text = this.form()) {
    const m = regex.exec(text);
    if (!m) throw new Error('UI control missing: ' + regex);
    return Number(m[1]);
  }
  async clickButton(index) {
    const m = new RegExp('^\\s*'+index+' (?:pop up )?button (.+)$','m').exec(this.state);
    if (!m) throw new Error('Button label unavailable: '+index);
    await this.tab.playwright.getByRole('button',{name:m[1],exact:true}).press('Enter');
  }
  async menuChoice(choice) {
    await this.read();
    const menu = this.state.slice(this.state.lastIndexOf('container Menu'));
    const index = this.index(new RegExp('^\\s*(\\d+) text '+esc(choice)+'\\s*$', 'm'), menu);
    await this.tab.click(index);
    await this.read();
  }
  async pick(buttonRegex, choice) {
    await this.read(); await this.clickButton(this.index(buttonRegex)); await this.menuChoice(choice);
  }
  async setDue(date) {
    await this.read();
    const direct = /^(?:\s*)(\d+) button Change due date\s*$/m.exec(this.form());
    const opener = direct ? /^\s*(\d+) button Change due date\s*$/m : /^\s*(\d+) button More actions\s*$/m;
    await this.clickButton(this.index(opener));
    await this.read();
    if (!this.state.includes('Try: 24h, 7 days, Feb 9')) await this.menuChoice('Set due date');
    await this.read();
    const field = this.index(/focused UI element is (\d+) search text field/, this.state);
    await this.tab.setValue(field, date);
    const parts=new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'}).formatToParts(new Date(date+'T12:00:00Z'));
    const part=type=>parts.find(p=>p.type===type).value;
    const label=part('weekday')+', '+part('day')+' '+part('month');
    await this.tab.playwright.getByText(label,{exact:true}).waitFor({state:'visible',timeoutMs:5000});
    await this.read();
    const menu = this.state.slice(this.state.lastIndexOf('container Menu'));
    const results=[...menu.matchAll(new RegExp('^\\s*(\\d+) text '+esc(label)+'\\s*$','gm'))];
    if (results.length!==1) throw new Error('Due date result did not resolve uniquely: '+date);
    await this.tab.click(Number(results[0][1]));
    await this.read();
  }
  async metadata(item) {
    await this.read(); this.form();
    const status = this.inline ? /pop up button Change status\. (.+) is selected/.exec(this.form())[1] : await this.tab.playwright.getByRole('button',{name:'Change status',exact:true}).textContent();
    if (status.trim() !== item.status) await this.pick(this.inline ? /(\d+) pop up button Change status\./m : /^\s*(\d+) button Change status\s*$/m, item.status);
    const priority = await this.tab.playwright.getByRole('button',{name:/^Change priority\./}).textContent();
    if (priority.trim() !== item.priority.name) await this.pick(/^\s*(\d+) button Change priority\./m, item.priority.name);
    await this.read();
    const own = Boolean(item.assigneeRef);
    const assignee = this.form().match(/^\s*\d+ button Change assignee\.[^\n]*/m)?.[0] || '';
    if (own && !assignee.includes('Currently 도형준 is assigned.')) await this.pick(/^\s*(\d+) button Change assignee\./m,'도형준');
    if (!own && !assignee.includes('Currently no one is assigned.')) await this.pick(/^\s*(\d+) button Change assignee\./m,'No assignee');
    const milestone = this.progress.milestones.find(m=>m.key===item.milestone);
    if (!milestone) throw new Error('Missing milestone '+item.milestone);
    await this.read();
    let milestoneApplied=false;
    if (this.inline && !this.form().includes('button Choose milestone.')) {
      await this.clickButton(this.index(/^\s*(\d+) button More actions\s*$/m));
      await this.menuChoice('Milestone');
      await this.menuChoice(milestone.name);
      milestoneApplied=true;
    }
    if (!milestoneApplied && !this.form().includes('Choose milestone. '+milestone.name+' is selected')) await this.pick(/^\s*(\d+) button Choose milestone\./m,milestone.name);
    await this.setDue(item.dueDate);
    const projectControl=this.tab.playwright.getByRole('button',{name:'Change project',exact:true});
    if (await projectControl.count()) {
      const project=await projectControl.textContent();
      if (!project.includes(this.progress.projectName)) throw new Error('Unexpected project in form: '+project);
    } else if (!(this.inline && this.currentParentKey && await this.tab.playwright.getByRole('button',{name:this.progress.projectName,exact:true}).count()===1)) throw new Error('Inherited project could not be verified');
  }
  async fill(item) {
    await this.read();
    this.form();
    if (this.inline && item.parentId !== this.currentParentKey) throw new Error('Child form has wrong parent context');
    const title = this.index(/(\d+) text field \(settable\) Description: Issue title/);
    const body = this.index(/(\d+) text entry area \(settable\) Description: Issue description/);
    await this.tab.setValue(title,item.title);
    await this.tab.paste(body,this.render(item.html),{format:'html'});
    await this.read();
    await this.metadata(item);
  }
  async submit(item) {
    await this.read();
    const createMore = /^(?:\s*)(\d+) checkbox [^\n]*Description: Create more, Value: 1/m.exec(this.form());
    if (createMore) { await this.tab.click(Number(createMore[1])); await this.read(); }
    const button = this.index(this.inline ? /^\s*(\d+) button Create\s*$/m : /^\s*(\d+) button Create issue\s*$/m);
    await this.clickButton(button);
    return this.recordCreated(item);
  }
  async recordCreated(item) {
    if (this.inline) await this.tab.playwright.getByRole('link',{name:new RegExp('^Select issue .*'+esc(item.title))}).and(this.tab.playwright.locator('[href*="/issue/NONONO-"]')).waitFor({state:'visible',timeoutMs:5000});
    let found;
    for (let n=0;n<3;n++) {
      await this.read();
      if (this.inline) {
        const line=this.state.split('\n').find(l=>l.includes('link Description: Select issue ')&&l.includes(item.title));
        const row=line&&/Value: (linear\.app\/dhj00570-helpdesk\/issue\/(NONONO-\d+)\/[^\n]+)/.exec(line);
        if (row) found=[null,row[2],row[1]];
      } else {
        const matches = [...this.state.matchAll(/link Description: (NONONO-\d+) [^\n]*?, Value: (linear\.app\/dhj00570-helpdesk\/issue\/[0-9a-f-]{36})/g)];
        found = matches.at(-1);
      }
      if (found) break;
    }
    if (!found) throw new Error('Creation result was not visible');
    if (this.progress.issues.some(i=>i.key===item.key)) throw new Error('This item is already recorded: '+item.key);
    const record = {key:item.key,kind:item.kind,title:item.title,id:found[1],url:'https://'+found[2],uuid:this.inline?null:found[2].split('/').at(-1),role:item.role,parentKey:item.parentId,parentComplete:item.kind==='role'||Boolean(this.inline&&this.currentParentKey===item.parentId),dueDate:item.dueDate,status:item.status,priority:item.priority.name,milestone:item.milestone,assignedToLead:Boolean(item.assigneeRef),bodyComplete:true,propertiesComplete:true,relationsComplete:item.blockedBy.length===0};
    this.progress.issues.push(record);
    await this.fs.writeFile(this.progressPath,JSON.stringify(this.progress,null,2));
    const expected = this.progress.plannedIssueIds[item.key];
    if (found[1] !== expected) throw new Error('Identifier changed; expected '+expected+' got '+found[1]);
    const notice = /text Issue created\s+(\d+) button Dismiss/m.exec(this.state);
    if (notice) { await this.tab.click(Number(notice[1])); await this.read(); }
    return record;
  }
  async openFromProject() {
    await this.read();
    const control = this.tab.playwright.getByLabel('Create new issue in project',{exact:true}).getByRole('button',{name:'Create new issue',exact:true});
    if (await control.count() !== 1) throw new Error('Project-scoped create button is unavailable');
    await control.click(); await this.read();
    if (!this.form().includes('Issue title')) throw new Error('Issue form not ready');
  }
  async openChild(parentKey) {
    const parent=this.progress.issues.find(i=>i.key===parentKey);
    const url=await this.tab.url();
    if (!parent || !(url.includes('/issue/'+parent.uuid)||url.includes('/issue/'+parent.id+'/'))) throw new Error('Navigate to the intended parent before adding children');
    await this.read();
    if (this.state.includes('pop up button Change status.')) {
      if (!/Description: Issue title, Value: ?\n/.test(this.state)) throw new Error('Existing child draft is not empty');
      this.currentParentKey=parentKey; this.form(); return;
    }
    const add=this.tab.playwright.getByRole('button',{name:'Create new sub-issue',exact:true});
    if (await add.count()) await add.click();
    else await this.tab.playwright.getByRole('button',{name:'Add sub-issues',exact:true}).click();
    await this.read(); this.form();
    if (!this.inline) throw new Error('Inline child form not ready');
    this.currentParentKey=parentKey;
  }
}

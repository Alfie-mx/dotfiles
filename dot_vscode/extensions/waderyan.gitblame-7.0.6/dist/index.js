Object.defineProperty(exports,"__esModule",{value:!0})
var t=require("vscode"),e=require("fs"),i=require("child_process"),s=require("path"),n=require("url")
const o=t=>"file"===(null==t?void 0:t.document.uri.scheme)
function r(t,e){return`${t} ${e}${1===t?"":"s"} ago`}const a=(e,i)=>{var s
return null!==(s=t.workspace.getConfiguration("gitblame").get(e))&&void 0!==s?s:i}
function c(t,e,i){const s=e.valueOf()-i.valueOf()
return Math.round(s/t)}function m(t,e){const i=t.indexOf(","),s=t.indexOf("|"),n=(e,i=-1)=>t.substring(e,-1===i?void 0:i),o=n(0,Math.max(i,s))
return{func:e[o]||o,param:i===s?"":n(i+1,s),mod:-1===s?"":n(s+1)}}function u(t,e){const i=c(6e4,t,e)
if(i<5)return"right now"
if(i<60)return`${i} minutes ago`
const s=c(36e5,t,e)
if(s<24)return r(s,"hour")
const n=c(864e5,t,e)
if(n<31)return r(n,"day")
const o=c(26298e5,t,e)
return o<12?r(o,"month"):r(((t,e)=>c(315576e5,t,e))(t,e),"year")}function l({author:t,committer:e,hash:i,summary:s}){const n=new Date,o=new Date(1e3*t.time),r=new Date(1e3*e.time),a=u(n,o),c=u(n,r),m=(t,e)=>(i="")=>t.substr(0,parseInt(i||e,10))
return{"author.mail":t.mail,"author.name":t.name,"author.timestamp":t.time.toString(),"author.tz":t.tz,"author.date":o.toISOString().slice(0,10),"commit.hash":i,"commit.hash_short":m(i,"7"),"commit.summary":m(s,"65536"),"committer.mail":e.mail,"committer.name":e.name,"committer.timestamp":e.time.toString(),"committer.tz":e.tz,"committer.date":r.toISOString().slice(0,10),"time.ago":a,"time.c_ago":c,"time.from":a,"time.c_from":c}}function h(t,e){let i=""
for(const o of function*(t,e){let i=0,s=0
for(let n=0;n<t.length;n++)0===s&&"${"===t.substr(n,2)?(s=1,yield t.substring(i,n),i=n,n+=1):1===s&&"}"===t[n]&&(s=0,yield m(t.substring(i+2,n),e),i=n+1)
yield t.substring(i)}(t,e))i+="string"==typeof o?o:(s="function"==typeof o.func?o.func(o.param):o.func,"u"===(n=o.mod)?s.toUpperCase():"l"===n?s.toLowerCase():n?`${s}|${n}`:s)
var s,n
return i}function d(t){return/^0{40}$/.test(t.hash)}class f{constructor(){this.out=t.window.createStatusBarItem(1,a("statusBarPositionPriority")),this.out.show()}update(t){t?d(t)?this.setText(a("statusBarMessageNoCommit","Not Committed Yet"),!1):this.setText((t=>h(a("statusBarMessageFormat",""),l(t)))(t),!0):this.setText("",!1)}activity(){this.setText("$(sync~spin) Waiting for git blame response",!1)}dispose(){this.out.dispose()}setText(t,e){this.out.text="$(git-commit) "+t.trimEnd(),this.out.tooltip="git blame"+(e?"":" - No info about the current line"),this.out.command=e?"gitblame.quickInfo":void 0}}const p=(t,e=" ")=>{const i=t.indexOf(e[0])
return-1===i?[t,""]:[t.substr(0,i),t.substr(i+1).trim()]}
function w(t,e,i){"time"===e?t.time=parseInt(i,10):"tz"===e||"mail"===e?t[e]=i:""===e&&(t.name=i)}function g(t){return/^\w{40}$/.test(t)}function v(t,e){return g(t)&&/^\d+ \d+ \d+$/.test(e)}function y(t,e,i){return v(t,e)&&/^(author|committer)/.test(i)}function b(t,e,i){"summary"===t?i.summary=e:g(t)?i.hash=t:((t,e,i)=>{const[s,n]=p(t,"-")
"author"===s?w(i.author,n,e):"committer"===s&&w(i.committer,n,e)})(t,e,i)}function*$(t,e){const[,i,s]=e.split(" ").map(Number)
for(let e=0;e<s;e++)yield[i+e,t]}function*x(t,e,i){"EMPTY"!==t.hash&&(void 0===i[t.hash]&&(i[t.hash]=t),yield[i[t.hash],e])}function*T(t,e){let i={author:{mail:"",name:"",time:0,tz:""},committer:{mail:"",name:"",time:0,tz:""},hash:"EMPTY",summary:""},s=function*(){}()
for(const[n,o,r]of function*(t){for(let e=0;e<t.length;e++){const i=t.indexOf("\n",e),s=i+1,n=t.indexOf("\n",s)
yield[...p(t.slice(e,i).toString("utf8")),t.slice(s,n).toString("utf8")],e=i}}(t))v(n,o)&&(yield*x(i,s,e),s=$(n,o),y(n,o,r)&&(i={author:{mail:"",name:"",time:0,tz:""},committer:{mail:"",name:"",time:0,tz:""},hash:"EMPTY",summary:""})),b(n,o,i)
yield*x(i,s,e)}class C{constructor(){this.out=t.window.createOutputChannel("gitblame")}static getInstance(){return C.instance||(C.instance=new C),C.instance}static info(t){C.write("info",t)}static command(t){C.write("command",t)}static error(t){C.write("error",t.toString())}dispose(){C.instance=void 0,this.out.dispose()}static write(t,e){const i=(new Date).toTimeString().substr(0,8)
C.getInstance().out.appendLine(`[ ${i} | ${t} ] ${e.trim()}`)}}const M=()=>t.window.activeTextEditor,S=({document:t,selection:e})=>"file"!==t.uri.scheme?"no-file:-1":`${t.fileName}:${e.active.line}`
function U(){const e=t.extensions.getExtension("vscode.git")
return(null==e?void 0:e.exports.enabled)?e.exports.getAPI(1).git.path:"git"}async function z(t,...e){return(async(t,e,s={})=>{let n
C.command(`${t} ${e.join(" ")}`)
try{n=i.execFile(t,e,{...s,encoding:"utf8"})}catch(t){return C.error(t),""}if(!n.stdout)return""
let o=""
for await(const t of n.stdout)o+=t
return o.trim()})(U(),e,{cwd:s.dirname(t)})}class E{constructor(t){this.terminated=!1,this.blame=this.runBlame(t)}dispose(){var t
null===(t=this.process)||void 0===t||t.kill(),this.terminated=!0}async*runProcess(t){this.process=(t=>{const e=["blame","--incremental","--",t]
a("ignoreWhitespace")&&e.splice(1,0,"-w")
const n=U()
return C.command(`${n} ${e.join(" ")}`),i.spawn(n,e,{cwd:s.dirname(t)})})(t)
const e={}
if(this.process.stdout&&this.process.stderr){for await(const t of this.process.stdout)yield*T(t,e)
for await(const t of this.process.stderr)throw new Error(t)}}async runBlame(t){const e={},i=new Map
try{for await(const[s,n]of this.runProcess(t)){i.set(s.hash,s)
for(const t of n)e[t[0]]=i.get(t[1])}}catch(t){C.error(t),this.dispose()}if(!this.terminated)return C.info(`Blamed "${t}": ${i.size} commits`),e}}function L(t){C.info(`Will not try to blame file "${t}" as it is outside of the current workspace`)}class N{constructor(){this.files=new Map,this.fsWatchers=new Map}async file(t){return this.get(t)}async getLine(t,e){const i=e+1,s=await this.get(t)
return null==s?void 0:s[i]}async remove(t){const e=await this.files.get(t),i=this.fsWatchers.get(t)
this.files.delete(t),this.fsWatchers.delete(t),null==e||e.dispose(),null==i||i.close()}dispose(){for(const[t]of this.files)this.remove(t)}async get(t){var i
if(!this.files.has(t)){const i=this.create(t)
i.then((i=>{i&&this.fsWatchers.set(t,e.watch(t.fileName,(()=>this.remove(t))))})),this.files.set(t,i)}return null===(i=await this.files.get(t))||void 0===i?void 0:i.blame}async create({fileName:t}){try{await e.promises.access(t)}catch{return void L(t)}if(await(async t=>!!await z(t,"rev-parse","--git-dir"))(t))return new E(t)
L(t)}}function P(t){return t.replace(/(^[a-z-]+:\/\/|\.git$)/gi,"").replace(/:([a-z_.~+%-][a-z0-9_.~+%-]+)\/?/i,"/$1/")}function D(t,e){const i=(t=>{const e=/^(https?):/.exec(t)
if(null!==e)return e[1]})(t),s=P(t)
let o
try{o=new n.URL(`${i||"https"}://${s}`)}catch(t){return""}const r="commit"+((t=>{const e=a("isWebPathPlural"),i=a("pluralWebPathSubstrings",[])
return e||i.some((e=>t.includes(e)))})(t)?"s":"")
return`${o.protocol}//${o.hostname}${i&&o.port?`:${o.port}`:""}${o.pathname}/${r}/${e}`}const I=(e,...i)=>Promise.resolve(t.window.showInformationMessage(e,...i)),O=(e,...i)=>Promise.resolve(t.window.showErrorMessage(e,...i))
function k(t){try{const{hostname:e}=new n.URL(t)
return t=>""===t?e:e.split(".")[Number(t)]||"invalid-index"}catch{return()=>"no-origin-url"}}function W(t){if(/^[a-z]+?@/.test(t)){const[,e]=p(t,":")
return t=>""===t?"":e.split("/").filter((t=>!!t))[Number(t)]||"invalid-index"}try{const{pathname:e}=new n.URL(t)
return t=>""===t?e:e.split("/").filter((t=>!!t))[Number(t)]||"invalid-index"}catch{return()=>"no-remote-url"}}async function _(e){if(!e||d(e))return
const i=a("commitUrl",""),[r,c]=await(async t=>{const e=a("remoteName","origin"),i=(async t=>{const e=M()
if(!o(e))return""
const{fileName:i}=e.document,s=await z(i,"symbolic-ref","-q","--short","HEAD"),n=await z(i,"config",`branch.${s}.remote`)
return z(i,"config",`remote.${n||t}.url`)})(e),n=await(async t=>{const e=M()
return o(e)?await z(e.document.fileName,"ls-remote","--get-url",t):""})(e),r=await(async()=>{const t=M()
if(!o(t))return""
const{fileName:e}=t.document
return await z(e,"ls-files","--full-name",s.basename(e))})(),c=(t=>{var e
const i=/(([a-zA-Z0-9_~%+.-]*?)(\.git)?)$/.exec(t)
return null!==(e=null==i?void 0:i[2])&&void 0!==e?e:""})(n),m=P(await i)
return[n,{hash:t.hash,"project.name":c,"project.remote":m,"gitorigin.hostname":k(D(m,"")),"gitorigin.path":W(m),"file.path":r}]})(e),m=h(i,c)
return(t=>{let e
try{e=new n.URL(t)}catch(t){return!1}return e.href===t&&("http:"===e.protocol||"https:"===e.protocol)&&!(!e.hostname||!e.pathname)})(m)?t.Uri.parse(m,!0):!m&&r?((e,i)=>{const s=D(e,i.hash)
if(s)return t.Uri.parse(s,!0)})(r,e):void(r&&O(`Malformed gitblame.commitUrl. Expands to: '${m}'`))}class q{constructor(){this.blame=new N,this.view=new f,this.disposable=this.setupListeners(),this.updateView()}async blameLink(){const e=await this.commit(),i=await _(e)
i?t.commands.executeCommand("vscode.open",i):O("Empty gitblame.commitUrl")}async showMessage(){const e=await this.commit()
if(!e||d(e))return void this.view.update()
const i=h(a("infoMessageFormat",""),l(e)),s=await _(e),n=[];(null==s?void 0:s.toString())&&n.push({title:"View",action(){t.commands.executeCommand("vscode.open",s)}}),this.view.update(e)
const o=await I(i,...n)
null==o||o.action()}async copyHash(){const e=await this.commit(!0)
e&&!d(e)&&(await t.env.clipboard.writeText(e.hash),I("Copied hash"))}async copyToolUrl(){const e=await this.commit(!0),i=await _(e)
i?(await t.env.clipboard.writeText(i.toString()),I("Copied tool URL")):O("gitblame.commitUrl config empty")}dispose(){this.view.dispose(),this.disposable.dispose(),this.blame.dispose()}setupListeners(){const e=t=>{const{scheme:e}=t.document.uri
"file"!==e&&"untitled"!==e||this.updateView(t)}
return t.Disposable.from(t.window.onDidChangeActiveTextEditor((t=>{"file"===(null==t?void 0:t.document.uri.scheme)?(this.view.activity(),this.blame.file(t.document),e(t)):this.view.update()})),t.window.onDidChangeTextEditorSelection((({textEditor:t})=>{e(t)})),t.workspace.onDidSaveTextDocument((()=>{this.updateView()})),t.workspace.onDidCloseTextDocument((t=>{this.blame.remove(t)})))}async updateView(t=M()){if(!o(t))return void this.view.update()
this.view.activity()
const e=S(t),i=await this.blame.getLine(t.document,t.selection.active.line),s=S(t)
e!==s&&"no-file:-1"!==s||this.view.update(i)}async commit(t=!1){const e=()=>{O("Unable to blame current line")},i=M()
if(!o(i))return void e()
t||this.view.activity()
const s=await this.blame.getLine(i.document,i.selection.active.line)
return s||e(),s}}const B=(e,i)=>t.commands.registerCommand(`gitblame.${e}`,i)
exports.activate=t=>{const e=new q
t.subscriptions.push(e,C.getInstance(),B("quickInfo",(()=>{e.showMessage()})),B("online",(()=>{e.blameLink()})),B("addCommitHashToClipboard",(()=>{e.copyHash()})),B("addToolUrlToClipboard",(()=>{e.copyToolUrl()})))}

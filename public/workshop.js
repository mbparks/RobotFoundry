(function(){
  "use strict";
  const {groups,palettes,defs,drawing,patterns,paperColors,stockNames}=PaperParts;
  const $=id=>document.getElementById(id);
  const NS="http://www.w3.org/2000/svg", KEY="gsg.paperbot-foundry.project.v1", PREF="gsg.paperbot-foundry.appearance", MAX=160;
  const glyphs={
    search:"M17 17l5 5M19 10a8 8 0 1 1 -16 0 8 8 0 1 1 16 0",paint:"M3 4h14v6H3zM17 7h3v6l-9 2v6H8v-8l9-2",flipY:"M2 12h3m3 0h3m3 0h3m3 0h2M8 9l9-6v6zm0 6 9 6v-6z",
    new:"M12 4v16M4 12h16",folder:"M3 18V6h7l2 3h9v3M3 19l3-7h16l-3 7Z",
    settings:"M3 7h18M3 17h18M8 4v6m9 4v6",sliders:"M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-6 0v6",
    drawer:"M3 5h18v15H3zM3 10h18m-12 4h6",download:"M12 3v12m-5-5 5 5 5-5M4 15v5h16v-5",
    pointer:"m5 3 14 9-7 1-3 7z",crop:"M3 9V4h5m8 0h5v5m0 7v5h-5m-8 0H3v-5",
    undo:"m8 5-5 5 5 5m-5-5h11a6 6 0 0 1 0 12",redo:"m16 5 5 5-5 5m5-5H10a6 6 0 0 0 0 12",
    grid:"M3 3h18v18H3zM9 3v18m6-18v18M3 9h18M3 15h18",flip:"M12 2v3m0 3v3m0 3v3m0 3v2M9 8l-6 9h6zm6 0 6 9h-6z",
    copy:"M8 8h12v13H8zM16 8V3H3v13h5",up:"M5 4h14m-7 17V8m-5 5 5-5 5 5",down:"M5 20h14m-7-17v13m-5-5 5 5 5-5",
    trash:"M4 6h16M8 6V3h8v3M6 6l1 15h10l1-15M10 10v7m4-7v7",check:"m4 12 5 5L20 6",close:"M5 5l14 14M19 5 5 19",
    nut:"m8 3 8 0 5 9-5 9H8l-5-9Zm7.5 9a3.5 3.5 0 1 0-7 0 3.5 3.5 0 1 0 7 0",warning:"m12 3 10 18H2ZM12 9v5m0 3v1"
  };
  const icon=n=>`<svg class="ui-ic" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${glyphs[n]}"/></svg>`;
  document.querySelectorAll("[data-icon]").forEach(el=>el.outerHTML=icon(el.dataset.icon));
  const escape=s=>String(s).replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"}[c]));
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const empty=()=>({format:"paperbot-foundry",schemaVersion:2,name:"Untitled robot",colors:[...palettes[0].colors],parts:[]});
  const freshId=()=> "p"+Math.random().toString(36).slice(2,11)+Date.now().toString(36);
  function makePart(group,variant,side="center"){
    const g=groups[group],right=side==="right";
    return {id:freshId(),group,variant,side,x:right?600-g.x:g.x,y:g.y,angle:0,scale:1,flip:right,flipY:false,colors:null,pattern:"plain",ink:"#39554c"};
  }
  function starter(){
    const p=empty();p.name="Chip Boardman Gearhart III";
    Object.keys(groups).filter(k=>!groups[k].optional).sort((a,b)=>groups[a].depth-groups[b].depth).forEach(k=>{
      (groups[k].paired?["left","right"]:["center"]).forEach(s=>p.parts.push(makePart(k,0,s)));
    });return p;
  }
  function validate(data){
    if(!data || data.format!=="paperbot-foundry"||![1,2].includes(data.schemaVersion))throw Error("Choose a Paperbot Foundry JSON project with schema version 1 or 2.");
    if(typeof data.name!=="string"||data.name.length>80||!Array.isArray(data.colors)||data.colors.length!==3||!data.colors.every(c=>typeof c==="string"&&/^#[a-fA-F0-9]{6}$/.test(c))||!Array.isArray(data.parts)||data.parts.length>MAX)throw Error("The project has invalid colors, name, or part count.");
    const ids=new Set(),num=(n,a,b)=>Number.isFinite(n)&&n>=a&&n<=b;
    const parts=data.parts.map(p=>{
      if(!p||typeof p.group!=="string"||!Object.hasOwn(groups,p.group))throw Error("The file contains an unknown part family.");
      const g=groups[p.group];
      if(typeof p.id!=="string"||!/^[a-zA-Z0-9_-]{1,64}$/.test(p.id)||ids.has(p.id)||!Number.isInteger(p.variant)||!g.names[p.variant]||!(g.paired?["left","right"]:["center"]).includes(p.side)||typeof p.flip!=="boolean"||!num(p.x,0,600)||!num(p.y,0,600)||!num(p.angle,-180,180)||!num(p.scale,.3,2.2))throw Error("A part has invalid position, shape, or identity data.");
      const style=data.schemaVersion===1?{flipY:false,colors:null,pattern:"plain",ink:"#39554c"}:p;
      const validHex=c=>typeof c==="string"&&/^#[a-f0-9]{6}$/i.test(c);
      if(typeof style.flipY!=="boolean"||typeof style.pattern!=="string"||!Object.hasOwn(patterns,style.pattern)||!validHex(style.ink)||(style.colors!==null&&!(Array.isArray(style.colors)&&style.colors.length===6&&style.colors.every(validHex))))throw Error("A piece has an invalid mirror, paper stock, or printed pattern.");
      ids.add(p.id);return {id:p.id,group:p.group,variant:p.variant,side:p.side,x:p.x,y:p.y,angle:p.angle,scale:p.scale,flip:p.flip,flipY:style.flipY,colors:style.colors?[...style.colors]:null,pattern:style.pattern,ink:style.ink};
    });return {format:"paperbot-foundry",schemaVersion:2,name:data.name,colors:[...data.colors],parts};
  }
  let project=starter(),selected=null,category="heads",side="left",theme="workshop",grid=true,startError="",saveReady=true;
  try{
    const raw=localStorage.getItem(KEY);
    if(raw!==null){project=validate(JSON.parse(raw))}
    const prefs=JSON.parse(localStorage.getItem(PREF)||"{}");
    if(["workshop","night","contrast"].includes(prefs.theme))theme=prefs.theme;
    grid=prefs.grid!==false;
  }catch{startError="Local storage could not be read. Open a JSON backup or begin a new build.";saveReady=false}
  let past=[],future=[],noticeTimer=0,drag=null,format="png",rasterSize=1200,background="transparent",generation=0;
  const current=()=>project.parts.find(p=>p.id===selected);
  const snapshot=()=>JSON.stringify(project);
  function notify(message){$("notice").textContent=message;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$("notice").textContent="",6500)}
  function nameOf(p){return `${p.side==="center"?"":p.side+" "}${groups[p.group].single} · ${groups[p.group].names[p.variant]}`}
  function storeProject(){
    try{localStorage.setItem(KEY,snapshot());saveReady=true}
    catch{saveReady=false}
    $("save-state").innerHTML=icon(saveReady?"check":"warning")+`<span>${saveReady?"Saved on this device":"Local save unavailable · export JSON"}</span>`;
  }
  function prefs(){try{localStorage.setItem(PREF,JSON.stringify({theme,grid}))}catch{notify("Appearance preferences could not be saved on this device.")}}
  function history(before){
    if(before===snapshot())return;
    past.push(before);if(past.length>60)past.shift();future=[];storeProject();syncUndo();
  }
  const syncUndo=()=>{$("undo").disabled=!past.length;$("redo").disabled=!future.length};
  function change(fn){const before=snapshot();fn();history(before);render()}
  function travel(reverse){
    const source=reverse?past:future,target=reverse?future:past;if(!source.length)return;
    target.push(snapshot());project=JSON.parse(source.pop());selected=current()?.id||null;storeProject();render();
  }
  const partStocks=p=>p?.colors||paperColors(project.colors);
  const customPrint=p=>p&&(p.colors||p.pattern!=="plain");
  const paintId=(p,base)=>customPrint(p)?`${base}-part-${p.id}`:base;
  function paperDefs(base,pieces){
    const seen=new Set();
    let svg=defs(project.colors,base);
    for(const p of pieces){
      if(!customPrint(p)||seen.has(p.id))continue;
      seen.add(p.id);svg+=defs(partStocks(p),paintId(p,base),p,base);
    }
    return svg;
  }
  function transform(p){
    return `translate(${p.x} ${p.y}) rotate(${p.angle}) scale(${p.scale*(p.flip?-1:1)} ${p.scale*(p.flipY?-1:1)})`;
  }
  function drawPiece(group,variant,p,base){
    return drawing(group,variant,paintId(p,base),partStocks(p),p||{},base);
  }
  function art(p,base){
    return `<g data-id="${p.id}" transform="${transform(p)}">${drawPiece(p.group,p.variant,p,base)}</g>`;
  }
  let finishKey="";
  function drawStage(){
    const key=JSON.stringify([project.colors,project.parts.filter(customPrint).map(p=>[p.id,p.colors,p.pattern,p.ink])]);
    if(key!==finishKey||!$("model")){
      $("stage").innerHTML=paperDefs("stagepaint",project.parts)+'<g id="model"></g><g id="selection" pointer-events="none"></g>';
      finishKey=key;
    }
    $("model").innerHTML=project.parts.map(p=>art(p,"stagepaint")).join("");
    outline();$("mat-empty").hidden=!!project.parts.length;
  }
  function outline(){
    const p=current();const g=$("selection");if(!p){g.innerHTML="";return}
    const box=document.querySelector(`#model [data-id="${p.id}"]`).getBBox(),m=4;
    g.innerHTML=`<g transform="${transform(p)}"><rect x="${box.x-m}" y="${box.y-m}" width="${box.width+2*m}" height="${box.height+2*m}" fill="none" stroke="#ffe0a0" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-dasharray="5 4"/></g>`;
  }
  function drawGrid(){
    let ticks="",nums="";
    for(let v=30;v<=570;v+=10){const len=v%50===0?7:3;
      ticks+=`M${v} 12v${len}M12 ${v}h${len}`;
      if(v%100===0)nums+=`<text x="${v+3}" y="27">${v}</text><text transform="translate(26 ${v-3}) rotate(-90)">${v}</text>`;
    }
    $("mat-grid").innerHTML=`<defs><pattern id="fine" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-opacity=".20" stroke-width=".8"/></pattern><pattern id="major" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="url(#fine)"/><path d="M100 0H0V100" fill="none" stroke="currentColor" stroke-opacity=".43" stroke-width="1.25"/></pattern></defs>
    ${grid?'<rect width="600" height="600" fill="url(#major)"/><path d="'+ticks+'" fill="none" stroke="currentColor" opacity=".69"/><g fill="currentColor" opacity=".8" font-family="monospace" font-size="8">'+nums+'</g>':""}
    <g fill="none" stroke="currentColor" opacity=".72" stroke-width="1.35"><path d="M31 46V32h14m510 0h14v14M31 554v14h14m510 0h14v-14"/></g>`;
    $("grid-btn").setAttribute("aria-pressed",String(grid));document.documentElement.dataset.theme=theme;
  }
  const catalog=Object.entries(groups).flatMap(([group,g])=>g.names.map((name,variant)=>({group,variant,name})));
  const pageSize=6;
  let drawerPage=0;
  function slot(group=category){
    const matches=p=>p&&p.group===group&&(!groups[group].paired||p.side===side);
    return matches(current())?current():project.parts.find(matches);
  }
  function renderDrawer(){
    const term=$("part-search").value.trim().toLowerCase();
    const items=catalog.filter(a=>term?(a.name+" "+groups[a.group].name).toLowerCase().includes(term):a.group===category);
    const pages=Math.ceil(items.length/pageSize);
    drawerPage=clamp(drawerPage,0,Math.max(0,pages-1));
    const visible=items.slice(drawerPage*pageSize,(drawerPage+1)*pageSize);
    $("category").value=category;$("sides").hidden=!visible.some(a=>groups[a.group].paired);
    document.querySelectorAll('[name="side"]').forEach(r=>r.checked=r.value===side);
    $("category-count").textContent=`${items.length} ${term?"found":"designs"}`;
    $("pages").hidden=pages<2;$("page-info").textContent=`${drawerPage+1} / ${pages}`;
    $("prev-page").disabled=drawerPage===0;$("next-page").disabled=drawerPage>=pages-1;
    const face=project.parts.find(p=>p.group==="faces"),styles=[];
    const thumbs=visible.map(({name,group,variant})=>{
      const g=groups[group],target=slot(group),active=target?.variant===variant;
      const width=group==="heads"?285:g.w*1.4,height=group==="heads"?143:g.h*1.22;
      if(target)styles.push(target);
      if(face&&group==="heads")styles.push(face);
      const preview=group==="heads"&&face?drawPiece("faces",face.variant,face,"tilepaint"):"";
      return `<button class="tile" data-group="${group}" data-variant="${variant}" aria-pressed="${active}" title="${target?"Swap to":"Add"} ${name}"><svg class="tile-art" aria-hidden="true" viewBox="${-width/2} ${-height/2} ${width} ${height}"><g transform="scale(${g.paired&&side==="right"?-1:1} 1)">${drawPiece(group,variant,target,"tilepaint")}${preview}</g></svg><span>${name}</span>${active?`<span class="tile-check">${icon("check")}</span>`:""}</button>`;
    }).join("");
    $("tiles").innerHTML=`<svg aria-hidden="true" width="0" height="0" style="position:absolute">${paperDefs("tilepaint",styles)}</svg>${thumbs}`;
    const target=slot(),g=groups[category],limb=g.paired?side+" ":"";
    $("drawer-hint").lastElementChild.textContent=term?(items.length?"Choose a design to add or swap that piece.":"No matching parts. Try a shape, tool, or category name."):target?`Choose a design to swap the ${limb}${g.single.toLowerCase()}.`:`Choose a design to add ${g.paired?"the "+side:"a"+(/^[aeiou]/i.test(g.single)?"n":"")} ${g.single.toLowerCase()}.`;
  }
  function renderPalettes(){
    $("palettes").innerHTML=palettes.map((p,i)=>`<button class="palette" data-palette="${i}" aria-pressed="${p.colors.join("")===project.colors.join("")}"><span class="swatch" aria-hidden="true">${p.colors.map(c=>`<b style="background:${c}"></b>`).join("")}</span>${p.name}</button>`).join("");
  }
  function inspector(){
    const p=current();$("piece").innerHTML='<option value="">Select a piece…</option>'+project.parts.map(a=>`<option value="${a.id}">${escape(nameOf(a))}</option>`).reverse().join("");$("piece").value=p?.id||"";
    $("adjustments").hidden=!p;$("selection-empty").hidden=!!p;
    if(!p)return;
    $("finish-summary").textContent=(p.colors?"Own colors":"Robot colors")+" · "+patterns[p.pattern];
    $("flip").setAttribute("aria-pressed",String(p.flip));$("flip-y").setAttribute("aria-pressed",String(p.flipY));
    $("angle").value=p.angle;$("angle-out").value=p.angle+"°";$("scale").value=Math.round(100*p.scale);$("scale-out").value=$("scale").value+"%";
    $("raise").disabled=project.parts.at(-1)===p;$("lower").disabled=project.parts[0]===p;
  }
  function render(){
    if($("robot-name").value!==project.name)$("robot-name").value=project.name;
    $("part-count").textContent=project.parts.length+" "+(project.parts.length===1?"piece":"pieces");drawStage();renderDrawer();renderPalettes();inspector();syncUndo();
  }
  function select(id,match=false){
    selected=id;const p=current();if(match&&p){category=p.group;$("part-search").value="";drawerPage=Math.floor(p.variant/pageSize);if(p.side!=="center")side=p.side}outline();inspector();renderDrawer();
  }
  function applyPart(i){
    const target=slot(),g=groups[category];if(!target&&project.parts.length>=MAX){notify(`This mat holds up to ${MAX} parts.`);return}
    change(()=>{
      if(target){target.variant=i;selected=target.id;return}
      const p=makePart(category,i,g.paired?side:"center");let index=project.parts.findIndex(other=>groups[other.group].depth>g.depth);
      if(index<0)index=project.parts.length;project.parts.splice(index,0,p);selected=p.id;
    });
    $("tiles").querySelector(`[data-group="${category}"][data-variant="${i}"]`)?.focus({preventScroll:true});
  }
  function duplicate(){
    const p=current();if(!p)return;if(project.parts.length>=MAX){notify(`This mat holds up to ${MAX} parts.`);return}
    change(()=>{const clone={...p,colors:p.colors?[...p.colors]:null,id:freshId(),x:clamp(p.x+16,0,600),y:clamp(p.y+16,0,600)};project.parts.splice(project.parts.indexOf(p)+1,0,clone);selected=clone.id});
  }
  function remove(){const p=current();if(p)change(()=>{project.parts.splice(project.parts.indexOf(p),1);selected=null})}
  function moveLayer(direction){
    const p=current(),idx=project.parts.indexOf(p),next=idx+direction;if(!p||next<0||next>=project.parts.length)return;
    change(()=>{project.parts.splice(idx,1);project.parts.splice(next,0,p)});
  }
  function coordinates(e){
    const point=$("stage").createSVGPoint();point.x=e.clientX;point.y=e.clientY;return point.matrixTransform($("stage").getScreenCTM().inverse());
  }
  $("stage").onpointerdown=e=>{
    if(!e.isPrimary||e.button!==0||drag)return;
    const hit=e.target.closest("[data-id]");select(hit?.dataset.id||null,true);$("stage").focus({preventScroll:true});
    if(!hit)return;
    e.preventDefault();const p=current(),at=coordinates(e);drag={id:e.pointerId,at,x:p.x,y:p.y,before:snapshot()};$("stage").setPointerCapture(e.pointerId);$("stage").classList.add("moving");
  };
  $("stage").onpointermove=e=>{
    if(!drag||drag.id!==e.pointerId)return;const at=coordinates(e),p=current();if(!p)return;
    p.x=clamp(Math.round(drag.x+at.x-drag.at.x),0,600);p.y=clamp(Math.round(drag.y+at.y-drag.at.y),0,600);
    const el=$("model").querySelector(`[data-id="${p.id}"]`);el.setAttribute("transform",transform(p));outline();
  };
  function endDrag(){if(!drag)return;const before=drag.before;drag=null;$("stage").classList.remove("moving");history(before)}
  $("stage").onpointerup=endDrag;$("stage").onpointercancel=endDrag;$("stage").onlostpointercapture=endDrag;
  $("category").innerHTML=Object.entries(groups).map(([key,g])=>`<option value="${key}">${g.name}</option>`).join("");
  $("category").onchange=e=>{category=e.target.value;$("part-search").value="";drawerPage=0;renderDrawer()};
  $("part-search").oninput=()=>{drawerPage=0;renderDrawer()};
  $("prev-page").onclick=()=>{drawerPage--;renderDrawer()};
  $("next-page").onclick=()=>{drawerPage++;renderDrawer()};
  $("sides").onchange=e=>{side=e.target.value;renderDrawer()};
  $("tiles").onclick=e=>{const tile=e.target.closest("[data-variant]");if(tile){category=tile.dataset.group;applyPart(+tile.dataset.variant)}};
  $("palettes").onclick=e=>{const tile=e.target.closest("[data-palette]");if(tile){change(()=>{project.colors=[...palettes[+tile.dataset.palette].colors]});$("palettes").querySelector(`[data-palette="${tile.dataset.palette}"]`).focus({preventScroll:true})}};
  $("piece").onchange=e=>select(e.target.value||null,true);
  let textBefore=null;
  $("robot-name").onfocus=()=>textBefore=snapshot();
  $("robot-name").oninput=e=>{project.name=e.target.value;storeProject()};
  $("robot-name").onchange=()=>{if(textBefore!==null)history(textBefore);textBefore=null};
  $("robot-name").onblur=()=>{textBefore=null};
  const rangeBefore={};
  for(const key of ["angle","scale"]){
    $(key).oninput=e=>{const p=current();if(!p)return;rangeBefore[key]??=snapshot();p[key]=Number(e.target.value)/(key==="scale"?100:1);$(key+"-out").value=e.target.value+(key==="scale"?"%":"°");drawStage();storeProject()};
    $(key).onchange=()=>{if(rangeBefore[key])history(rangeBefore[key]);delete rangeBefore[key]};
  }
  $("flip-y").onclick=()=>{if(current())change(()=>current().flipY=!current().flipY)};
  $("flip").onclick=()=>{if(current())change(()=>current().flip=!current().flip)};$("copy").onclick=duplicate;$("remove").onclick=remove;$("raise").onclick=()=>moveLayer(1);$("lower").onclick=()=>moveLayer(-1);
  $("undo").onclick=()=>travel(true);$("redo").onclick=()=>travel(false);$("grid-btn").onclick=()=>{grid=!grid;drawGrid();prefs()};
  document.addEventListener("keydown",e=>{
    if(e.defaultPrevented||$("modal").open||/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)||drag)return;
    if((e.ctrlKey||e.metaKey)&&["z","y"].includes(e.key.toLowerCase())){e.preventDefault();travel(e.shiftKey||e.key.toLowerCase()==="y"?false:true);return}
    if(e.target!==$("stage")||!current())return;
    const offsets={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
    if(offsets[e.key]){e.preventDefault();const [dx,dy]=offsets[e.key],p=current(),step=e.shiftKey?10:1;change(()=>{p.x=clamp(p.x+dx*step,0,600);p.y=clamp(p.y+dy*step,0,600)})}
    if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();remove()}
  });
  function modal(title,content){$("dialog-title").textContent=title;$("dialog-content").innerHTML=content;$("modal").setAttribute("aria-labelledby","dialog-title");if(!$("modal").open)$("modal").showModal()}
  $("close").onclick=()=>$("modal").close();
  $("modal").onclick=e=>{if(e.target===$("modal")){const b=$("modal").getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)$("modal").close()}};
  function loadProject(p){selected=null;drawerPage=0;$("part-search").value="";category="heads";side="left";change(()=>project=p);$("modal").close()}
  $("new").onclick=()=>{
    modal("Start a build",`<p class="modal-copy">Choose your starting point. Undo brings back your current build.</p><div class="choice-list"><button id="blank" class="choice"><strong>Empty mat</strong><small>Assemble a robot one piece at a time.</small></button><button id="chip" class="choice"><strong>Chip Boardman Gearhart III</strong><small>Remix the workshop’s mint-and-marigold starter robot.</small></button></div>`);
    $("blank").onclick=()=>loadProject(empty());$("chip").onclick=()=>loadProject(starter());
  };
  $("open").onclick=()=>$("import-file").click();$("import-file").onchange=async e=>{
    const file=e.target.files[0];e.target.value="";if(!file)return;
    try{
      if(file.size>2*1024*1024)throw Error("Choose a project smaller than 2 MB.");
      let parsed;try{parsed=JSON.parse(await file.text())}catch{throw Error("This file is not readable JSON. Choose a Paperbot Foundry project.")}
      const p=validate(parsed);loadProject(p);notify("Project opened. Undo restores your previous build.");
    }catch(err){modal("Couldn’t open project",'<p class="modal-copy">'+escape(err.message)+'</p><p class="note">Your current build is still on the mat.</p>')}
  };
  $("custom").onclick=()=>{
    modal("Mix paper colors",`<p class="modal-copy">Choose the three stocks shared by pieces that use robot colors.</p>${["Chassis","Trim","Lamps"].map((n,i)=>`<label class="color-row">${n}<input id="color-${i}" type="color" value="${project.colors[i]}"></label>`).join("")}<div class="dialog-foot"><button class="primary" id="apply-colors">Apply colors</button></div>`);
    $("apply-colors").onclick=()=>{change(()=>project.colors=[0,1,2].map(i=>$("color-"+i).value));$("modal").close()};
  };
  function editFinish(){
  const p=current();if(!p)return;
  const draft={...p,colors:p.colors?[...p.colors]:null};
  const original=drawPiece(p.group,p.variant,p,"rolecheck");
  const roles=stockNames.map((name,i)=>({name,i})).filter(({i})=>original.includes(`-${i})`)||(p.group==="faces"&&p.variant===4&&i===2));
  const g=groups[p.group];
  modal("Piece colors & pattern",`<div class="finish-lead"><svg id="finish-preview" role="img" aria-label="Live paper finish preview" viewBox="${-g.w*.65} ${-g.h*.69} ${g.w*1.3} ${g.h*1.38}"></svg><div><strong>${escape(g.names[p.variant])}</strong><div class="mini">${escape((p.side==="center"?"":p.side+" ")+g.single)}</div></div></div>
    <label class="link-stock"><input id="inherit-stock" type="checkbox"> Use robot colors</label>
    <div class="stocks">${roles.map(({name,i})=>`<label>${name}<input id="stock-${i}" type="color" aria-label="${name} paper for this piece" value="${partStocks(p)[i]}"></label>`).join("")}</div>
    <label for="paper-print" class="label">Printed pattern</label><select id="paper-print">${Object.entries(patterns).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select>
    <label class="color-row" id="ink-row">Pattern ink<input type="color" id="print-ink" value="${draft.ink}"></label>
    <div class="dialog-foot"><button id="cancel-finish">Cancel</button><button class="primary" id="apply-finish">Apply to piece</button></div>`);
  function preview(){
    $("finish-preview").innerHTML=defs(partStocks(draft),"sample",draft)+drawing(p.group,p.variant,"sample",partStocks(draft),draft);
    $("inherit-stock").checked=!draft.colors;$("ink-row").hidden=draft.pattern==="plain";
  }
  $("paper-print").value=draft.pattern;
  $("paper-print").onchange=e=>{draft.pattern=e.target.value;preview()};
  $("print-ink").oninput=e=>{draft.ink=e.target.value;preview()};
  for(const {i} of roles)$("stock-"+i).oninput=e=>{
    draft.colors??=[...paperColors(project.colors)];draft.colors[i]=e.target.value;preview();
  };
  $("inherit-stock").onchange=e=>{
    draft.colors=e.target.checked?null:[...paperColors(project.colors)];
    for(const {i} of roles)$("stock-"+i).value=partStocks(draft)[i];
    preview();
  };
  $("cancel-finish").onclick=()=>$("modal").close();
  $("apply-finish").onclick=()=>{change(()=>{p.colors=draft.colors;p.pattern=draft.pattern;p.ink=draft.ink});$("modal").close()};
  preview();
}
  $("part-finish").onclick=editFinish;
  $("settings").onclick=()=>{
    modal("Workshop settings",`<label class="label" for="appearance">Appearance</label><select id="appearance"><option value="workshop">Workshop light</option><option value="night">Night mode</option><option value="contrast">High contrast</option></select><p class="modal-copy">Drag individual pieces on the mat. Use Part adjustment to select overlapping pieces, change their size or angle, duplicate them, or change their layer order.</p><p class="note">With the mat focused, arrow keys move a selected piece by one unit. Hold Shift for ten. Delete removes the piece. Use Ctrl or ⌘ Z to undo.</p><p class="note">Your browser saves the current build on this device. Export JSON to keep a backup or edit on another device.</p>`);
    $("appearance").value=theme;$("appearance").onchange=e=>{theme=e.target.value;drawGrid();prefs()};
  };
  // Download artwork and editable project data independently of the editor chrome.
  function exportSvg(bg){
    return `<svg xmlns="${NS}" width="600" height="600" viewBox="0 0 600 600"><title>${escape(project.name||"Paper robot")}</title>${paperDefs("paint",project.parts)}${bg==="transparent"?"":`<rect width="600" height="600" fill="${bg==="white"?"#ffffff":"#f6f0df"}"/>`}${project.parts.map(p=>art(p,"paint")).join("")}</svg>`;
  }
  function download(blob,ext){
    const a=document.createElement("a"),url=URL.createObjectURL(blob);a.href=url;a.download=(project.name.trim().replace(/[<>:"/\\|?*\x00-\x1f]+/g,"-").replace(/^\.+|\.+$/g,"").slice(0,80)||"Paper-robot")+"."+ext;
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  }
  async function raster(source,size,ext){
    const url=URL.createObjectURL(new Blob([source],{type:"image/svg+xml;charset=utf-8"}));
    try{
      const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error("Your browser could not render this artwork. Try exporting SVG."));img.src=url});
      const canvas=document.createElement("canvas");canvas.width=canvas.height=size;const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas rendering is unavailable. Try SVG.");
      ctx.drawImage(img,0,0,size,size);const mime=ext==="jpg"?"image/jpeg":"image/png";
      return await new Promise((resolve,reject)=>canvas.toBlob(b=>b&&b.type===mime?resolve(b):reject(Error("Your browser could not encode this image. Try SVG or a smaller size.")),mime,.95));
    }finally{URL.revokeObjectURL(url)}
  }
  function exportOptions(){
    const image=format!=="json",rasterFile=["jpg","png"].includes(format);
    const descriptions={svg:"Scalable vector artwork with paper textures and cut edges.",png:"Lossless artwork for stickers, layouts, and transparent cutouts.",jpg:"A compact image with a solid background.",json:"An editable project with every part, color, pose, and layer."};
    modal("Export robot",`<div class="format-row" aria-label="File format">${["svg","png","jpg","json"].map(f=>`<button data-format="${f}" aria-pressed="${f===format}">${f.toUpperCase()}</button>`).join("")}</div><p class="modal-copy">${descriptions[format]}</p>${rasterFile?'<label class="modal-field"><span class="label">Image dimensions</span><select id="size"><option value="600">600 × 600 px</option><option value="1200">1200 × 1200 px</option><option value="2400">2400 × 2400 px</option></select></label>':""}${image?`<label class="modal-field"><span class="label">Background</span><select id="bg">${format==="jpg"?"":'<option value="transparent">Transparent</option>'}<option value="paper">Warm paper</option><option value="white">White</option></select></label>`:""}<div class="dialog-foot"><button id="download" class="primary">${icon("download")}Download ${format.toUpperCase()}</button></div>`);
    if($("size")){$("size").value=rasterSize;$("size").onchange=e=>rasterSize=+e.target.value}
    if($("bg")){$("bg").value=format==="jpg"&&background==="transparent"?"paper":background;$("bg").onchange=e=>background=e.target.value}
    document.querySelectorAll("[data-format]").forEach(b=>b.onclick=()=>{format=b.dataset.format;exportOptions();document.querySelector(`[data-format="${format}"]`).focus()});
    $("download").onclick=async()=>{
      const ext=format,button=$("download"),gen=++generation,bg=$("bg")?.value;button.disabled=true;button.textContent="Preparing…";
      try{
        const blob=ext==="json"?new Blob([JSON.stringify(project,null,2)+"\n"],{type:"application/json"}):ext==="svg"?new Blob([exportSvg(bg)],{type:"image/svg+xml"}):await raster(exportSvg(bg),rasterSize,ext);
        download(blob,ext);if(gen===generation){$("modal").close();notify(ext.toUpperCase()+" download started.")}
      }catch(err){if(gen===generation){button.disabled=false;button.textContent="Try again";let msg=document.getElementById("export-error");if(!msg){msg=document.createElement("p");msg.id="export-error";msg.setAttribute("role","alert");button.parentNode.before(msg)}msg.textContent=err.message}}
    };
  }
  $("export").onclick=exportOptions;
  drawGrid();render();
  if(saveReady)storeProject();else{$("save-state").innerHTML=icon("warning")+"<span>Check local storage · export JSON</span>";notify(startError)}
})();

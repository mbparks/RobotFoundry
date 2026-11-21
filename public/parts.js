"use strict";
const PaperParts = (function(){
  const groups = {
    heads: {name:"Heads", single:"Head", x:300,y:218,w:224,h:120,depth:4,names:["Boxcar","Portside","Trapezoid","Roundhouse","Tin can","Rivet box"]},
    faces: {name:"Faces",single:"Face",x:300,y:218,w:150,h:58,depth:5,names:["Twin lamps","Cyclops","Scanner","Dial eyes","Sleepy","Pixel pane"]},
    bodies: {name:"Bodies",single:"Body",x:300,y:344,w:150,h:125,depth:3,names:["Gearbox","Apron","Boiler","Console","Tapered","Flight case"]},
    arms: {name:"Arms",single:"Arm",x:213,y:344,w:70,h:82,depth:1,paired:true,names:["Fold joint","Accordion","Piston","Bent tube","Linkage","Box sleeve"]},
    hands: {name:"Hands",single:"Hand",x:178,y:393,w:61,h:67,depth:6,paired:true,names:["C-claw","Pincers","Mittens","Magnet","Gripper","Spanner"]},
    legs: {name:"Legs & feet",single:"Leg",x:263,y:444,w:68,h:116,depth:0,paired:true,names:["Work boots","Rollers","Moon boots","Treads","Peg feet","Spring heels"]},
    aerials: {name:"Antennas",single:"Antenna",x:300,y:128,w:96,h:92,depth:2,names:["Beacon","Twin prongs","Coil","Dish","Lightning","Flagpole"]},
    badges: {name:"Badges",single:"Badge",x:300,y:348,w:65,h:65,depth:7,names:["Drive gear","Power bolt","Little heart","Speaker","Compass","Wing nut"]}
  };
  groups.hats={name:"Headwear",single:"Hat",x:300,y:158,w:202,h:139,depth:8,optional:true,names:[]};
  groups.backs={name:"Back gear",single:"Back piece",x:300,y:345,w:300,h:134,depth:-1,optional:true,names:[]};
  const originalCounts={};
  for(const [key,g] of Object.entries(groups)){
    originalCounts[key]=g.names.length;
    g.names.push(...ExtraCutouts[key].map(d=>d.name));
  }
  const patterns={plain:"Plain paper",stripes:"Diagonal stripes",dots:"Polka dots",checks:"Checkerboard",chevrons:"Chevrons",stars:"Stars",scales:"Fish scales",circuit:"Circuit traces"};
  const stockNames=["Chassis","Trim","Lamps","Dark panel","Hardware","Cream paper"];
  const paperColors=colors=>colors.length===6?colors:[...colors,"#343b3e","#b5a485","#ebdcb9"];
  function printPattern(id,pattern,ink){
    if(pattern==="plain")return "";
    const shapes={
      stripes:'<path d="M-4 4l8 -8M-2 14L14 -2m-4 16 4 -4" fill="none" stroke-width="3"/>',
      dots:'<circle cx="3" cy="3" r="1.9"/><circle cx="9" cy="9" r="1.9"/>',
      checks:'<path d="M0 0h6v6H0zM6 6h6v6H6z"/>',
      chevrons:'<path d="M-1 2l7 5 7 -5m-14 6 7 5 7 -5" fill="none" stroke-width="2"/>',
      stars:'<path d="M6 .7l1.3 3.6 3.8.1 -3 2.3 1 3.7L6 8.1 2.9 10.4l1 -3.7 -3 -2.3 3.8-.1Z"/>',
      scales:'<path d="M0 0q3 9 6 0 3 9 6 0M-3 6q3 9 6 0 3 9 6 0 3 9 6 0" fill="none" stroke-width="1.3"/>',
      circuit:'<path d="M0 2h4l3 4v3h5M1 12V9l2 -2" fill="none" stroke-width="1.2"/><circle cx="3.5" cy="6.5" r="1.4"/>'
    };
    return `<pattern id="${id}-print" patternUnits="userSpaceOnUse" width="12" height="12"><g fill="${ink}" stroke="${ink}" stroke-width="0">${shapes[pattern]}</g></pattern>`;
  }
  const palettes = [
    {name:"Workshop",colors:["#91ada1","#ed9822","#f8cd32"]},
    {name:"Blueprint",colors:["#789bb7","#d76748","#e8c678"]},
    {name:"Orchard",colors:["#b4b578","#896f9d","#f0bd6e"]},
    {name:"Ember",colors:["#b96852","#698a8a","#f6c75a"]}
  ];
  function mix(a,b,f){const n=h=>parseInt(h.slice(1),16);const aa=n(a),bb=n(b);return "#"+[16,8,0].map(i=>Math.round(((aa>>i)&255)*(1-f)+((bb>>i)&255)*f).toString(16).padStart(2,"0")).join("")}
  function defs(colors,id,part={},shared=id){
    let seed=91;
    const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
    let fibers="";
    for(let i=0;i<(shared===id?188:0);i++){
      const x=(rand()*52).toFixed(2),y=(rand()*52).toFixed(2),l=(.3+rand()*2.8).toFixed(2),dy=((rand()-.6)*1.7).toFixed(2);
      fibers+=`<path d="M${x} ${y}l${l} ${dy}" stroke="${i%3?'#392e23':'#fff4d6'}" stroke-opacity="${i%3?'.19':'.6'}" stroke-width="${(.2+rand()*.8).toFixed(2)}"/>`;
    }
    const gradient=(name,c)=>`<linearGradient id="${id}-${name}" x2=".82" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="${mix(c,"#fff5d9",.31)}"/><stop offset=".44" stop-color="${c}"/><stop offset="1" stop-color="${mix(c,"#392c29",.17)}"/></linearGradient>`;
    const textures=shared!==id?"":`<pattern id="${id}-grain" width="52" height="52" patternUnits="userSpaceOnUse">${fibers}</pattern><pattern id="${id}-edge" width="4.2" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(15)"><rect width="4.2" height="4" fill="#978562"/><path d="M0 0v4" stroke="#564d3d" stroke-width="1.5"/><path d="M2.3 0v4" stroke="#dfc79c" stroke-width="1"/></pattern>`;
    return `<defs>${paperColors(colors).map((c,i)=>gradient(i,c)).join("")}${textures}${printPattern(id,part.pattern||"plain",part.ink||"#39554c")}</defs>`;
  }
  function drawing(group,i,id,colors,part={},shared=id){
    const ink="#48473d",light="#f7e9c8";
    const fill=n=>`url(#${n==="edge"||n==="grain"?shared:id}-${n})`;
    const path=(d,attrs)=>`<path d="${d}" ${attrs}/>`;
    const line=(d,c=ink,w=1.35,extra="")=>path(d,`fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}`);
    function sheet(d,c=0,depth=3){
      return path(d,`transform="translate(1.2 ${depth+1})" fill="#252924" opacity=".66"`)+path(d,`transform="translate(.9 ${depth})" fill="${fill("edge")}" stroke="#554d3b" stroke-width="1.6" stroke-linejoin="round"`)+path(d,`fill="${fill(c)}" stroke="${light}" stroke-width="1.6" stroke-linejoin="round"`)+(part.pattern&&part.pattern!=="plain"?path(d,`fill="${fill("print")}" opacity=".69"`):"")+path(d,`fill="${fill("grain")}"`);
    }
    const disc=(x,y,r,c=1)=>sheet(`M${x-r} ${y}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0Z`,c,2.6);
    const rivet=(x,y)=>`<circle cx="${x+.7}" cy="${y+1}" r="2" fill="#5e5e4d"/><circle cx="${x}" cy="${y}" r="1.5" fill="#eee1c0"/>`;
    const vent=(x,y,n=3)=>Array.from({length:n},(_,k)=>line(`M${x} ${y+k*4.4}l14 -1`,"#454a43",1.8)).join("");
    const scuff=(x,y)=>line(`M${x} ${y}l5 -1.5m-3 3l8 -2m-2 -2l4 -1`,"#f5e9cb",1.4)+line(`M${x+1} ${y+3.1}l3 -1`,"#686352",1.1);
    if(i>=originalCounts[group]){
      function renderLayers(layers){
        return layers.map(l=>{
          if(l.reflect){const half=renderLayers(l.reflect);return half+`<g transform="scale(-1 1)">${half}</g>`}
          if(l.turn)return `<g transform="rotate(${l.turn.join(" ")})">${renderLayers(l.layers)}</g>`;
          if(l.fold)return line(l.fold,ink,1.6);
          if(l.path)return `<g fill-rule="evenodd">${sheet(l.path,l.stock)}</g>`;
          return disc(l.x,l.y,l.r,l.stock);
        }).join("");
      }
      return renderLayers(ExtraCutouts[group][i-originalCounts[group]].layers);
    }
    if(group==="heads"){
      const d=["M-93 -46L-87 -52 87 -54 94 -49 95 44 89 50 -92 52Z","M-91 -29L-68 -51 57 -50 94 -30 94 30 68 49 -64 51 -93 32Z","M-74 -51L69 -51 98 39 91 48 -89 51 -99 42Z","M-94 33Q-99 -44 -32 -53Q35 -64 79 -31Q98 -13 93 39L85 47 -85 49Z","M-76 -44Q-8 -64 77 -46L80 40Q0 58 -79 43Z","M-95 -37L-82 -51 80 -52 96 -38 95 36 81 48 -83 51 -96 35Z"][i];
      let ears=sheet("M-104 -22l20 -1v49l-19 -1 -5 -7V-14Z",1)+sheet("M85 -25l19 2 4 6v32l-5 7 -19 1Z",1);
      if(i===3) ears=disc(-90,13,12,1)+disc(91,12,12,1);
      const details=[
        "",
        sheet("M-93 -24l14 -14 6 6 -12 15 1 36 12 11 -7 7 -15 -14Z",4,1)+disc(85,0,7,4),
        line("M-65 -40l-17 68m145 -70 20 66",light,2)+vent(-86,28,2),
        sheet("M-48 -39q48 -29 92 -1l-3 5q-39 -20 -87 1Z",4,1)+disc(-73,14,5,1)+disc(73,14,5,1),
        sheet("M-78 -46q72 -18 155 -2l1 10q-77 -17 -156 2Z",4,1)+sheet("M-78 35q71 13 156 -2l-1 10q-76 15 -154 1Z",4,1),
        ["M-93 -36l13 -14h17l-29 29Z","M71 -49h10l14 12v13Z","M-92 26l23 24h-14l-10 -12Z","M70 46l24 -22v12l-12 12Z"].map(c=>sheet(c,1,1)).join("")
      ][i];
      return ears+sheet(d,0,5)+details+line("M-78 -44l51 -1m43 -2l38 -.6",light,1.4)+scuff(-84,38)+scuff(53,-43)+(i===5?rivet(-76,-34)+rivet(76,-35)+rivet(-76,33)+rivet(75,32):"")+(i===4?vent(-71,26,2):"");
    }
    if(group==="faces"){
      const panel=sheet("M-66 -26L62 -28Q69 -28 69 -19L70 17Q70 25 62 25L-62 27Q-69 27 -69 19L-70 -17Q-70 -25 -66 -26Z",3,2);
      const lamp=(x,r)=>disc(x,0,r+1.9,3)+disc(x,-1,r,2)+line(`M${x-r*.55} ${-r*.54}q2 -3 5 -3`,light,2.5);
      const contents=[()=>lamp(-35,16)+lamp(35,16),()=>disc(0,0,22,4)+lamp(0,16),()=>sheet("M-49 -7h97l-4 13h-92Z",2,1)+line("M-29 -7v13m15 -13v13m16 -13v13m16 -13v13m15 -13v13","#6c694a",2),
        ()=>disc(-35,0,18,5)+disc(35,0,18,5)+line("M-46 8l12 -10 6 -10m52 15l13 -8 9 3",ink,3),
        ()=>line("M-54 3q17 13 34 -3m39 3q17 13 35 -3",colors[2],6),
        ()=>[-42,-30,25,37].map(x=>sheet(`M${x} -9h11v18h-11Z`,2,1)).join("")];
      return panel+line("M-65 15l-1 -31q0 -6 7 -6l119 -3","#171f20",3)+contents[i]();
    }
    if(group==="bodies"){
      const d=["M-64 -51L61 -53 66 47 -60 51 -65 45Z","M-47 -52L42 -53 73 41 59 51 -62 50 -72 38Z","M-54 -42Q-3 -62 52 -44Q76 -4 54 44Q0 56 -53 43Q-72 -2 -54 -42Z","M-61 -48L56 -52 70 -30 62 46 -61 50 -67 25Z","M-69 -47L65 -50 48 50 -44 51Z","M-65 -43L-55 -52 56 -52 66 -43 66 40 54 50 -53 50 -64 41Z"][i];
      return sheet("M-17 -72l35 -1 -1 29h-33Z",4)+sheet(d,0,5)+line("M-51 -44l50 -1m-52 82l1 -20",light,1.6)+vent(31,28,2)+scuff(-54,38)+rivet(-49,-36)+rivet(48,-38)+(i===3?disc(46,-22,4,1)+disc(46,-10,4,2):"");
    }
    if(group==="aerials"){
      if(i===0)return sheet("M-5 39L-5 -20 2 -21 5 40Z",4,2)+disc(-1,-23,20,1)+line("M-13 -30q4 -7 11 -7",light,2);
      if(i===1)return sheet("M-4 39L-28 -19 -23 -21 0 23 22 -27 27 -25 3 39Z",4)+disc(-26,-22,8,1)+disc(25,-29,8,2);
      if(i===2)return sheet("M-5 40v-12l17 -8 -32 -10 31 -11 -27 -10 25 -9 -13 -8 5 -5 23 14 -20 8 26 10 -28 11 25 9 -22 12v9Z",1);
      if(i===3)return sheet("M-6 38l5 -46 9 1 -4 45Z",4)+sheet("M-36 -22l67 -16Q24 16 -3 10Q-21 8 -36 -22Z",0)+line("M-2 -1l-9 -30",ink,3)+disc(-12,-32,4,2);
      if(i===4)return sheet("M-5 39l5 -36 -16 3 21 -47 15 -1 -13 30 17 -1 -24 52Z",2);
      return sheet("M-5 39l-1 -79 5 -1 3 80Z",4)+sheet("M1 -40l39 9 -13 7 13 9 -39 -4Z",1);
    }
    if(group==="arms"){
      const arm=sheet("M14 -40l18 19 -30 30 -18 -18Z",4)+disc(-7,1,11,4);
      const lower=["M-15 -7l21 12 -27 34 -21 -12Z","M-18 -9l24 12 -5 9 -6 1 2 6 -6 1 1 6 -7 1 1 6 -8 6 -21 -12Z","M-12 -6l16 11 -23 34 -17 -12Z","M-15 -7l22 14 -12 13 -11 18 -22 -11Z","M-14 -5q8 -8 16 0t-2 16l-17 23q-7 7 -14 0t1 -15Z","M-18 -12l27 16 -23 38 -28 -16Z"][i];
      return arm+sheet(lower,0)+line("M-34 24l12 7",light,1.4)+(i===1?line("M-21 1l16 10m-22 -3l16 10m-22 -3l16 10",ink,1.5):"")+rivet(16,-23)+(i===4?disc(-16,12,5,3):"");
    }
    if(group==="hands"){
      const d=["M-18 24C-35 14 -34 -9 -22 -23C-11 -36 10 -36 23 -24C37 -10 35 10 20 24L11 16C27 0 18 -18 3 -18C-11 -18 -25 -4 -10 15Z","M-5 -28l20 -1 15 22 -7 28 -10 -4 5 -20 -12 -10 -15 10 2 22 -10 3 -8 -28Z","M-12 -28l21 -2 5 13 9 -5 8 6 -5 22 -15 18 -25 -2 -10 -18Z","M-27 -21l13 -1 2 21q5 17 18 2l2 -23 14 1 -1 25q-3 23 -24 24 -24 -3 -24 -27Z","M-20 -22h40v15h-5v30H4V0h-9v23h-11V-7h-4Z","M-8 -28h17v19q23 7 16 28l-13 -11 -14 5 -4 13q-27 -12 -4 -35Z"][i];
      return sheet(d,1,4)+scuff(-16,-17);
    }
    if(group==="legs"){
      const shank=sheet("M-15 -54l31 -2 -1 69 -33 1Z",4)+sheet("M-15 -24l30 -2 1 29 -33 2Z",0);
      if(i===1)return shank+disc(-3,29,24,3)+disc(-3,29,14,1)+disc(-3,29,4,5);
      if(i===3)return shank+sheet("M-22 8l34 -2 17 21 -2 16 -53 3 -9 -13Z",3)+disc(-14,29,9,1)+disc(10,29,9,1);
      const foot=["M-27 0l50 -1 3 44 -58 1Z","","M-25 -1l43 -1 9 23 7 6 -1 18 -67 1 -3 -15Z","","M-13 4l26 -1 1 30 16 7 -2 7 -53 1 -2 -7 15 -9Z","M-25 0l45 -1 4 21 -23 8 23 7 -4 11 -50 1 1 -10 18 -6 -18 -6Z"][i];
      return shank+sheet(foot,1,4)+line("M-24 38l41 -2",light,2)+scuff(-20,5);
    }
    if(group==="badges"){
      if(i===0){
        const pts=[];for(let k=0;k<10;k++)for(const [a,r] of [[-.48,22],[-.25,22],[-.21,29],[.16,29],[.23,22]]){const t=(k+a)*Math.PI/5;pts.push(`${(Math.sin(t)*r).toFixed(1)} ${(Math.cos(t)*r).toFixed(1)}`)}
        const d="M"+pts.join("L")+"ZM-11 0a11 11 0 1 0 22 0a11 11 0 1 0 -22 0Z";
        return `<g fill-rule="evenodd">${sheet(d,1,3)}</g>`;
      }
      if(i===1)return sheet("M0 -28l22 1 -16 22 15 -1 -33 36 9 -26 -17 1Z",2);
      if(i===2)return sheet("M0 -11q-16 -25 -26 -5 -8 14 26 40 36 -28 25 -42 -12 -16 -25 7Z",1);
      if(i===3)return disc(0,0,25,4)+[-12,-4,4,12].map((y,k)=>line(`M${k===0||k===3?-13:-17} ${y}h${k===0||k===3?26:34}`,ink,3)).join("");
      if(i===4)return disc(0,0,26,1)+disc(0,0,21,5)+sheet("M11 -17l-8 21 -14 12 8 -20Z",3,1);
      return sheet("M-7 -4l-18 -16 -5 6 9 21 16 1 1 10h9l1 -11 18 -3 6 -21 -7 -4 -17 16Z",1)+disc(1,0,7,4);
    }
  }
  return {groups,palettes,defs,drawing,patterns,paperColors,stockNames};
})();

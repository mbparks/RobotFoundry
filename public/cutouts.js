"use strict";
// Each design lists its paper layers from back to front. Stock numbers match the editor’s six paper roles.
const ExtraCutouts = (function(){
  const layer=(path,stock=0)=>({path,stock});
  const disk=(x,y,r,stock)=>({x,y,r,stock});
  const fold=path=>({fold:path});
  const both=(...layers)=>({reflect:layers});
  const design=(name,...layers)=>({name,layers});
  const head=(name,shell,...layers)=>design(name,layer(shell),...layers);
  const badge=(name,shell,...layers)=>design(name,layer(shell,1),...layers);
  const visor=layer("M-68 -19 Q-68 -26 -58 -25 L60 -26 Q69 -26 69 -16 L68 18 Q68 25 57 25 L-60 26 Q-69 24 -68 15Z",3);
  const face=(name,...layers)=>design(name,visor,...layers);
  const neck=layer("M-16 -72L17 -72 16 -43 -15 -42Z",4);
  const body=(name,shell,...layers)=>design(name,neck,layer(shell),...layers);
  const joint=disk(19,-29,9,4);
  const arm=(name,shell,...layers)=>design(name,layer(shell),joint,...layers);
  const hand=(name,shell,...layers)=>design(name,layer(shell,1),...layers);
  const shin=layer("M-13 -52l27 -1 2 72 -31 1Z",4);
  const foot=(name,shell,...layers)=>design(name,shin,layer(shell,1),...layers);
  const mast=layer("M-4 41l1 -69 6 -1 2 70Z",4);
  const aerial=(name,...layers)=>design(name,mast,...layers);
  const brim=layer("M-88 15q70 -8 169 -4l9 6 -4 6 -165 5 -13 -5Z",1);
  return {
    heads:[
      head("Cat ears","M-86 46l-6 -101 37 22q49 -15 94 -2l45 -29 5 108 -26 11 -122 -1Z",both(layer("M-82 -46l18 15 -16 8Z",1)),fold("M-72 38l28 3m90 -3 22 -5")),
      head("Deep diver","M-92 8q0 -69 92 -72 91 1 96 70l-7 37 -174 3Z",both(disk(-88,3,15,4)),layer("M-69 39h139l-3 12 -132 2Z",1)),
      head("Gramophone","M-97 -38l28 -13 145 4 19 29 -5 62 -173 6 -14 -16Z",layer("M-102 -12l-23 -20 1 57 25 -10Z",1),both(disk(-75,35,4,4))),
      head("Crescent","M-101 -44Q0 -19 96 -53L87 35Q0 67 -88 39Z",both(layer("M-90 -34l14 3 -7 46Z",1))),
      head("Bakelite radio","M-98 -33q0 -23 22 -23l153 2q21 0 21 22l-2 64q-2 19 -20 19l-151 1q-22 -2 -23 -21Z",both(disk(-80,25,8,1)),fold("M-61 -41h116m-113 5h109")),
      head("Cabover","M-98 33l7 -55 35 -34 99 -2 41 20 14 79 -185 8Z",layer("M-65 -35l21 -16 86 1 23 13Z",4),both(disk(-83,25,7,2))),
      head("Bell housing","M-102 31Q-79 14 -77 -23Q-62 -61 0 -60Q67 -60 80 -18L88 14 103 32 99 46 -99 48Z",layer("M-99 33l197 -2 2 10 -195 4Z",1)),
      head("Folded letter","M-100 -33l24 -18 159 -2 19 17 -9 74 -168 10 -26 -26Z",fold("M-97 -31l37 25m153 -31L63 -12m-147 49 26 -18"),disk(79,23,5,1)),
      head("Bellows mask","M-90 -37l12 -15 151 -2 16 12 3 82 -181 7Z",both(layer("M-91 -31l-15 5 7 7 -11 7 9 6 -9 9 10 6 -7 9 17 5Z",4))),
      head("Hex nut","M-104 0l31 -51 141 -3 35 52 -30 50 -145 4Z",both(layer("M-99 0l25 -40 4 9 -15 33 13 33 -7 4Z",4))),
      head("Signal tower","M-83 46l3 -81 36 -23 89 2 35 24 8 76Z",both(layer("M-91 -24h12v54h-12Z",1)),layer("M-15 -49h29l-3 10h-24Z",2)),
      head("Moth mask","M-101 -48l51 12 48 -13 54 9 51 -18 -14 65 -34 35 -118 -1 -32 -34Z",both(layer("M-96 -39l17 6 -9 17Z",2)),both(fold("M-79 21l23 16")))
    ],
    faces:[
      face("Binoculars",both(disk(-32,0,22,4),disk(-32,0,16,2),disk(-29,-3,7,3))),
      face("Wink",disk(-32,0,16,2),layer("M13 1q19 -22 39 -1l-3 4q-16 -10 -31 3Z",2)),
      face("Starstruck",both(layer("M-31 -19l5 13 14 1 -10 9 3 13 -12 -7 -13 7 4 -14 -11 -8 15 -1Z",2))),
      face("Oscilloscope",layer("M-58 2h18l6 -10 7 17 10 -29 12 38 10 -23 7 11 7 -8h39v5H21l-8 11 -7 -10 -11 25 -12 -37 -9 27 -8 -18 -4 8h-20Z",2)),
      face("Odd couple",disk(-32,0,18,1),disk(-32,0,9,2),disk(32,0,11,2)),
      face("Aperture",disk(0,0,23,4),disk(0,0,18,2),layer("M-8 -6l11 -4 8 7 -2 11 -12 1 -6 -8Z",3),fold("M-17 -1l14 -15m9 0 9 15m-8 13 -16 2")),
      face("Heart eyes",both(layer("M-33 16q-24 -16 -19 -28 8 -11 19 1 10 -12 17 -2 8 12 -17 29Z",1))),
      face("Trioptic",...[-40,0,40].map((x,i)=>disk(x,0,i===1?17:11,2))),
      face("Cross stitch",both(layer("M-46 -12l6 -4 10 12 10 -12 6 4 -11 13 11 12 -6 4 -10 -12 -11 12 -6 -4 12 -12Z",2))),
      face("Periscope",both(layer("M-54 9v-23h27l9 9v14h-8V-4l-6 -4h-13V9Z",4),disk(-45,6,8,2))),
      face("Sun and moon",disk(-34,0,15,2),layer("M43 -16q-21 16 1 32 -28 0 -25 -19 2 -11 24 -13Z",5)),
      face("Equalizer",...[-48,-32,-16,0,16,32,48].map((x,j)=>layer(`M${x} 14v-${[10,20,28,16,24,33,14][j]}h8v${[10,20,28,16,24,33,14][j]}Z`,j%2?1:2)))
    ],
    bodies:[
      body("Mail pouch","M-66 -42l20 -11 100 3 15 18 -8 75 -112 8 -15 -11Z",layer("M-60 -42l117 1 -53 38Z",4),both(fold("M-53 32l12 -9"))),
      body("Pressure tank","M-47 -49q50 -16 94 0 26 19 22 52 -4 32 -22 46 -42 13 -93 0 -27 -19 -24 -54 0 -26 23 -44Z",both(layer("M-56 -38l9 -4 1 86 -10 -6Z",4))),
      body("Kite frame","M0 -66l73 47 -22 60 -50 16 -57 -17 -17 -58Z",fold("M0 -57v101m-62 -58 49 39m73 -39L17 25"),both(disk(-48,22,4,1))),
      body("Waistcoat","M-49 -55l20 4 27 22 30 -24 22 1 18 38 -7 58 -41 10 -21 -14 -21 15 -40 -10 -5 -64Z",both(layer("M-35 -46l24 22 -9 12 -23 -30Z",4))),
      body("Field pack","M-56 -48l102 -5 22 19 -4 77 -121 7 -12 -13 1 -68Z",both(layer("M-50 -43h11v90h-12Z",1)),layer("M-28 27h54v14h-53Z",4)),
      body("Tea kettle","M-48 -43q52 -28 98 -1 15 8 16 36l16 -17 10 4 -16 37 -12 3 -7 22q-60 23 -111 2 -18 -18 -15 -54Z",layer("M-40 -46l79 -2 4 8 -84 3Z",4)),
      body("Engine block","M-60 -45l104 -8 20 18v66l-13 15 -114 5 -5 -82Z",both(layer("M-67 -24h15v8h-15zm0 17h15v8h-15zm0 17h15v8h-15Z",4))),
      body("Tool chest","M-67 -45l129 -4 6 92 -131 7Z",layer("M-59 20l115 -3v24l-115 4Z",1),layer("M-14 25h30v6h-30Z",5)),
      body("Hourglass","M-65 -52l128 1 -23 38 -1 22 24 40 -125 2 23 -43 -2 -22Z",both(layer("M-49 -43l15 9 10 17 -14 -11Z",1))),
      body("Lantern cage","M-46 -55l91 1 22 25 -6 65 -19 16 -87 -2 -15 -18 -6 -61Z",both(layer("M-51 -35l13 -6 -2 80 -11 -7Z",4)),layer("M-45 34l88 1 -4 8h-80Z",1)),
      body("Lobster shell","M-64 -26q5 -33 64 -35 52 1 66 32l-7 55 -19 25 -80 1 -20 -29Z",both(layer("M-59 -21l22 -13 -10 17 -14 7Zm1 22 21 -16 -10 17 -12 7Z",1))),
      body("Cassette deck","M-66 -42l7 -10 119 1 6 11v77l-8 11 -117 -1 -7 -12Z",layer("M-52 -38h102v22H-52Z",3),disk(-33,-27,8,5),disk(33,-27,8,5),fold("M-33 -32h66"))
    ],
    arms:[
      arm("Scissor lift","M12 -38l15 10 -16 30 4 8 -32 28 -9 -8 26 -26 -3 -6Z",layer("M28 -28l5 5 -22 33 -29 -12 5 -9 20 9Z",1),disk(-4,4,5,4)),
      arm("Padded elbow","M14 -38l16 13 -24 41 -27 24 -15 -14 26 -28Z",disk(-3,5,15,1),disk(-3,5,6,4)),
      arm("Steam hose","M12 -36q27 -5 17 16L9 3Q1 18 -18 38l-17 -8Q-10 -1 0 -14Z",...[-2,8,18].map((v,j)=>fold(`M${1-j*8} ${v}l11 7`))),
      arm("Crankshaft","M14 -37l15 8 -5 28 -19 4 -4 18 -17 4 -6 15 -13 -8 10 -23 15 -4 4 -15 16 -5Z",disk(11,-3,6,1),disk(-10,16,5,2)),
      arm("Leaf spring","M15 -38l14 12Q20 8 -26 42l-8 -10Q0 0 15 -38Z",layer("M15 -24q-7 27 -40 56l-4 -3Q-5 4 15 -24Z",1)),
      arm("Ball socket","M17 -34l12 7 -19 33 -12 1 -16 31 -13 -9 20 -35 10 -2Z",disk(-3,1,15,4),disk(-3,1,9,1)),
      arm("Toggle lever","M13 -40l17 9 -12 31 -25 3 -12 35 -16 -8 18 -44 23 1Z",disk(7,-5,8,1)),
      arm("Cable braid","M11 -36l14 8q-3 27 -22 34 -17 13 -22 33l-14 -6q6 -25 26 -38 13 -11 18 -31Z",fold("M14 -22l2 11 -12 2 2 11 -12 1 1 10 -11 1")),
      arm("Paddle sleeve","M19 -38l13 7 -13 27 -2 15 -25 30 -22 1 -6 -17 21 -30 14 -7Z",layer("M-9 3l14 7 -18 22 -10 -1Z",1)),
      arm("Skeleton link","M14 -36l14 8 -17 31 -9 4 -18 31 -15 -7 17 -34 11 -5Z",disk(-5,1,10,4),disk(-5,1,4,3)),
      arm("Bell cuff","M16 -38l14 11 -22 30 -1 16 2 11 -25 12 -18 -16 19 -20 6 -14Z",layer("M-31 25l19 12 -4 6 -20 -13Z",1)),
      arm("Ladder rail","M12 -36l8 5 -39 69 -9 -6Z",layer("M28 -30l6 5 -41 70 -8 -6Z",1),layer("M7 -19l13 8 -4 6 -12 -8Zm-11 18 14 8 -4 6 -14 -8Zm-11 19 14 7 -4 5 -14 -7Z",4))
    ],
    hands:[
      hand("Paint brush","M-10 -31h18l1 23 13 7 -2 30 -12 -3 -5 5 -5 -5 -8 3 -9 -5 -3 -25 13 -7Z",layer("M-21 -2l42 -1 -1 9 -40 1Z",4),fold("M-11 12l2 12m9 -11v13m9 -14 -2 10")),
      hand("Suction cup","M-6 -31h12v25q18 3 23 22l-2 7h-54l-2 -7q5 -17 23 -22Z",layer("M-30 17h60v8h-60Z",4)),
      hand("Fork tine","M-9 -30h18v15h15v40h-7V0h-9v28H0V0h-10v25h-8v-39h9Z"),
      hand("Stamp pad","M-9 -30q9 -10 19 0l-4 12 1 10 16 8 5 17 -53 1 4 -18 17 -8Z",layer("M-28 15l58 -1 -1 12 -57 1Z",3)),
      hand("Horseshoe","M-22 -28l11 4 -1 30q12 16 22 -1l-2 -28 12 -5 4 34q-2 18 -23 23 -24 -2 -26 -22Z",both(disk(-17,-11,3,5),disk(-15,10,3,5))),
      hand("Three-finger wave","M-19 -30l13 -1 5 17 4 -2 4 -17 8 2 -2 21 4 2 8 -14 6 4 -9 24 -9 15 -27 8 -13 -15 -4 -18 8 -3 8 13Z",disk(-1,8,5,4)),
      hand("Net scoop","M-5 -32h9l1 13q24 -3 25 24 -4 23 -29 24 -24 -1 -27 -24 1 -20 21 -24Z",layer("M-17 -3q14 -20 32 -3 10 15 -5 24 -18 10 -28 -7Z",4),fold("M-14 -3l24 22m-9 -29 17 16m-30 9 23 -23m-12 27 18 -18")),
      hand("Pipette","M-8 -30q14 -6 17 7l1 13 -4 6 -3 24 -4 13 -4 -12 -2 -24 -6 -6Z",layer("M-7 -4H7L5 3H-6Z",4)),
      hand("Broom","M-5 -33H5v24l14 8 9 26 -55 1 8 -27 14 -8Z",fold("M-12 3l-6 17m14 -16 -2 17m9 -17 4 17m6 -18 6 17")),
      hand("Spool","M-18 -24h36v7h-5v30h6v8h-40v-8h6v-30h-3Z",layer("M-14 -12h28v21h-28Z",0),fold("M-12 -7l24 4m-24 2 24 4")),
      hand("Camera","M-25 -17h11l4 -7h16l5 7h13v38h-49Z",disk(0,2,13,4),disk(0,2,8,3),disk(17,-10,3,2)),
      hand("Little lantern","M-11 -16q-1 -24 12 -22 13 0 13 22h7l7 8 -5 32h-44l-5 -32 7 -8Z",layer("M-15 -7h31l-2 24h-27Z",2),fold("M0 -6v22"))
    ],
    legs:[
      foot("Ice skate","M-19 -5h34l1 18 14 8v9h-59l5 -21Z",layer("M-23 32h7v7l27 -1v-7h7v7l13 -7q3 15 -15 16h-47v-8h8Z",4)),
      foot("Duck foot","M-12 0h26l6 17 16 20 -20 -3 -9 12 -11 -12 -18 8 2 -13 -13 5 9 -22Z",fold("M-3 9l-12 20m19 -20 2 22m3 -20 13 16")),
      foot("Caster","M-15 -7h30l-1 17 -7 11 -17 2 -9 -10Z",disk(-1,30,18,3),disk(-1,30,8,1)),
      foot("Cloven hoof","M-19 0h33l17 31 -2 13 -26 1 -5 -19 -5 19 -24 -1 -2 -10Z",fold("M-19 6l31 -1")),
      foot("Ski runner","M-15 2h30l8 19 4 9 -45 1 -2 -11Z",layer("M-37 27l5 7 47 1 17 -8 -4 12 -13 5 -51 -1 -8 -8Z",4)),
      foot("Stilt","M-12 -6h24l-4 39 13 4v8h-43v-9l13 -4Z",disk(0,2,6,4)),
      foot("Bell bottom","M-19 -6l33 -1 6 24 13 21 -1 7 -65 -1 9 -21Z",layer("M-31 35l61 1 1 7 -62 -1Z",0)),
      foot("Crawler","M-13 4h25l23 18 -9 18 -52 2 -10 -11 3 -11Z",...[-20,0,21].map(x=>disk(x,29,8,3))),
      foot("Saddle shoe","M-18 -7l31 1 2 22 14 5 5 17 -62 2 -2 -22Z",layer("M-12 0h18l-3 20 -15 4Z",5),fold("M-9 4l11 6m-12 -1 11 6")),
      foot("Splayed tripod","M-12 -4h24v15l20 23 -6 7 -18 -17 -3 22H-5l-2 -22 -18 16 -7 -7 22 -24Z",disk(0,9,7,4)),
      foot("Pogo coil","M-16 -8h32v9l-23 9 22 5 -23 10 22 6 -7 6 -28 -8 20 -11 -21 -6 23 -11h-17Z",layer("M-27 36h51v9h-51Z",3)),
      foot("Paw pad","M-15 -6h29l9 18q21 5 12 24 -8 12 -20 5 -9 9 -20 2 -17 6 -23 -5 -10 -16 9 -25Z",both(disk(-15,28,6,4)),disk(0,34,6,4))
    ],
    aerials:[
      aerial("Pinwheel",...Array.from({length:4},(_,j)=>({turn:[j*90,0,-17],layers:[layer("M0 -17l-27 -10 8 -16Z",j%2?0:1)]})),disk(0,-17,5,2)),
      aerial("Tulip",layer("M-24 -40l12 10 11 -14 11 14 13 -11q5 36 -23 36 -24 -3 -24 -35Z",1),layer("M-1 16q11 -23 28 -19 -6 19 -28 24Z",0)),
      aerial("Tuning fork",layer("M-20 -42h7v27q12 12 24 -1v-27h7v30q-4 16 -15 17H-3q-16 -2 -17 -19Z",1)),
      aerial("Weather vane",layer("M-35 -25l11 -9v6H12l12 -11v10l13 -3 -7 8 6 7 -12 -2 1 8 -14 -11h-37v7Z",1)),
      aerial("Wire loop",layer("M0 -43a24 21 0 1 1 0 42 24 21 0 1 1 0 -42ZM0 -36a17 14 0 1 0 0 28 17 14 0 1 0 0 -28Z",1)),
      aerial("Paper plane",layer("M-40 -15l80 -24 -20 38 -20 -10 -11 7 3 -13Z",5),fold("M-8 -17l45 -20 -36 26")),
      aerial("Signal pennants",layer("M2 -27l34 6 -30 12Z",1),layer("M2 -5l-29 8 27 9Z",0)),
      aerial("Marquee star",layer("M0 -49l8 18 19 1 -14 13 5 19 -18 -10 -18 10 5 -19 -15 -13 20 -1Z",2)),
      aerial("Firefly",disk(0,-18,18,2),both(layer("M-9 -15q-34 -26 -29 -5 3 14 29 9Z",0)),disk(0,-35,7,3)),
      aerial("Semaphore",layer("M-6 2l-29 -28 7 -6L4 -5Z",1),layer("M-3 0l24 -36 9 6L4 7Z",0),disk(0,1,6,4)),
      aerial("Planet dish",disk(0,-18,19,2),layer("M-34 -8q9 -15 25 -21 -12 7 -14 12 27 -3 51 -18 1 -4 -5 -4 10 -3 11 2 1 13 -51 31 -18 6 -17 -2Z",1)),
      aerial("Whirligig",layer("M-3 -24q-33 -24 -42 -6 -2 11 42 13Zm6 0q33 -24 42 -6 2 11 -42 13Z",0),disk(0,-19,7,1))
    ],
    badges:[
      badge("Acorn","M-18 -10q15 -16 35 -1 1 23 -17 33 -15 -7 -18 -32Z",layer("M-22 -13q17 -17 40 -3l4 8 -43 3Z",4),layer("M-3 -20l6 -13 5 2 -4 12Z",0)),
      badge("Keyhole","M0 -30l25 10v18Q24 17 0 30 -24 17 -25 -3v-17Z",disk(0,-6,7,3),layer("M-3 -3h6l4 15H-7Z",3)),
      badge("Hour dial","M-19 -25h38v6L6 -1l13 17v8h-39v-8L-6 -1l-13 -18Z",layer("M-12 -16h24L0 -3Z",2),layer("M-12 16L0 6l13 10Z",2)),
      badge("Shamrock","M-2 3q-30 -3 -22 -18 7 -12 18 0 -8 -23 9 -23 16 2 6 22 17 -11 23 3 3 16 -25 18l4 18 -8 2Z",fold("M-15 -10L0 1m6 -24L1 -3m20 -7L4 1")),
      badge("Sprocket sun","M0 -31l6 12 14 -8 -1 15 13 4 -12 8 9 13 -15 -1 -2 16 -12 -10 -12 10 -2 -16 -15 1 9 -13 -12 -8 14 -4 -1 -15 14 8Z",disk(0,0,13,2)),
      badge("Moonrise","M12 -26q-21 25 6 43 -28 10 -38 -12 -10 -23 17 -32Z",disk(18,-14,5,2)),
      badge("Winged wheel","M-28 -15l25 7 4 14 -17 -2 -9 -6 10 1 -12 -7Z",layer("M28 -15L3 -8 -1 6l17 -2 9 -6 -10 1 12 -7Z",1),disk(0,4,13,4),disk(0,4,6,2)),
      badge("Envelope","M-27 -17l53 -1 1 35 -54 1Z",fold("M-25 -14L0 5l24 -21m-49 32 17 -14m34 13 -16 -14")),
      badge("Paper boat","M-30 -4l60 -1 -14 20 -31 1Z",layer("M-13 -6l15 -20L18 -6Z",5),fold("M-27 -3l27 13 27 -14")),
      badge("Mushroom","M-27 2q0 -28 27 -30 25 2 29 29Z",layer("M-7 3H8l3 22q-10 6 -22 0Z",5),disk(-9,-13,4,5),disk(9,-8,5,5)),
      badge("Cassette","M-27 -19h54v38h-54Z",layer("M-21 -13h42v17h-42Z",5),disk(-12,-4,5,3),disk(12,-4,5,3),fold("M-18 13h36")),
      badge("Mountain patch","M-29 15l17 -25 6 8 11 -23 25 40Z",layer("M-1 -13l6 -12 10 17 -6 -3 -5 3Z",5),disk(-19,-16,5,2))
    ],
    hats:[
      design("Engineer cap",layer("M-69 12l4 -25 37 -20 63 1 30 13 7 26Z"),brim,layer("M-64 2l126 -3 6 9 -132 4Z",4)),
      design("Top hat",layer("M-50 15l-9 -65 111 -1 -5 64Z"),layer("M-51 -3l100 -2 -1 16 -98 3Z",1),brim),
      design("Paper crown",layer("M-71 16l-6 -48 35 22 17 -35 23 28 23 -34 19 34 36 -24 -9 55Z",2),layer("M-69 5l136 -4 -2 12 -132 6Z",1),disk(0,4,7,1)),
      design("Beret",layer("M-79 6q-14 -20 28 -36 44 -22 96 -5 39 12 37 26L61 8l-119 9Z"),layer("M-58 9l119 -10 -2 12 -115 10Z",4),layer("M-4 -38l7 -16 8 4 -6 14Z",1)),
      design("Propeller cap",layer("M-67 13q4 -47 65 -46 57 0 65 43Z"),brim,layer("M-4 -30v-16h6v16Z",4),layer("M0 -44q-57 -22 -58 -6t58 6q48 -18 52 -9t-52 9Z",1)),
      design("Sou’wester",layer("M-60 8q-8 -49 52 -54 61 -4 67 46l29 11 -2 15 -160 -1 -16 -7Z",2),fold("M-48 -1q28 -19 90 -8")),
      design("Cat hood",layer("M-72 21l-1 -64 35 22q36 -12 64 0l42 -27 1 68 -20 4 -2 -17 -96 2 -1 15Z"),both(layer("M-64 -31l16 13 -15 3Z",1))),
      design("Wizard cone",layer("M-52 13l57 -73 12 5 -1 26 38 38Z"),brim,layer("M-13 -2l4 -13 4 6 10 -1 -6 8 2 8 -8 -4 -8 4Z",2)),
      design("Flat cap",layer("M-79 9q25 -64 105 -47 43 8 45 41l-132 18Z"),layer("M-13 6l84 -8 25 12 -4 6 -70 6Z",1),fold("M-56 0q30 -39 66 -35")),
      design("Miner helmet",layer("M-65 14q-4 -50 62 -55 63 -1 70 52Z"),brim,disk(0,-9,18,4),disk(0,-9,12,2)),
      design("Chef toque",layer("M-52 15v-37q-34 -7 -17 -32 12 -16 35 -7 28 -28 58 -7 38 -11 50 15 10 22 -20 32l-4 37Z",5),layer("M-52 0l104 -2 -3 18 -100 1Z",0)),
      design("Fez",layer("M-61 16l14 -58q47 -13 87 -1l17 55Z"),layer("M-45 -40q38 -14 84 -2l-3 6q-39 -8 -80 1Z",1),layer("M7 -42q47 -6 47 21l9 2 3 21 -16 1 1 -23q-2 -15 -42 -15Z",2))
    ],
    backs:[
      design("Moth wings",both(layer("M-10 -10Q-61 -73 -147 -64Q-148 -17 -101 8Q-120 22 -99 49Q-52 54 -11 13Z"),disk(-109,-35,14,1),disk(-109,-35,6,2),fold("M-23 -4l-99 -44m97 51 -67 36"))),
      design("Biplane wings",both(layer("M-8 -9l-22 -27 -120 7 -1 18 107 1 18 13Z",1),layer("M-13 18l-30 -10 -100 7 2 14 104 2Z"),layer("M-118 -12h6l4 27 -7 1Z",4))),
      design("Twin tanks",both(layer("M-101 -46q13 -20 30 0V34l-7 15h-15l-8 -13Z"),layer("M-102 -31h34v9h-34Zm1 52h33v9h-33Z",4),layer("M-92 -46v-13h13v13Z",1))),
      design("Clockwork wings",both(layer("M-13 -11l-42 -29 -91 7 30 12 -17 8 38 3 -12 12 62 -5 33 10Z",4),layer("M-26 -12l-37 -18 -49 5 43 6Z",1),disk(-65,-13,8,0))),
      design("Solar sails",both(layer("M-16 4l-68 -8 -47 -36 -4 78 51 -26 69 5Z",4),layer("M-89 -6l-36 -23 -2 51 38 -18Z",0),fold("M-115 -17v29m11 -22v15m-21 -11 31 3"))),
      design("Dragon fins",both(layer("M-15 -10l-44 -23 -7 -31 -25 20 -47 -20 24 38 -13 13 30 8 -10 17 48 -9 -9 22 50 -17Z"),fold("M-25 1l-94 -47m59 47 -26 -31"))),
      design("Rolled maps",both(layer("M-106 -50l20 -7 30 94 -21 9Z",5),disk(-95,-52,11,4),disk(-95,-52,6,5),layer("M-97 -21l22 -6 4 12 -22 6Z",1))),
      design("Battery rack",both(layer("M-111 -34h46v73h-46Z",4),layer("M-105 -27h33v57h-33Z",0),layer("M-96 -43h17v11h-17Z",3),layer("M-83 -18l-15 19h10l-5 16 16 -22h-11Z",2))),
      design("Paper feathers",both(layer("M-13 7q-51 -51 -129 -54 23 29 72 50 -41 -5 -62 -12 19 27 67 32 -25 0 -40 -3 28 21 68 12Z",5),fold("M-24 11l-95 -47"))),
      design("Satchel straps",both(layer("M-16 5l-58 -28 -29 11 -7 37 37 17 28 -27 25 2Z",4),layer("M-104 -7l37 -5 -5 28 -31 10Z",0),disk(-86,12,4,1))),
      design("Kite wings",both(layer("M-18 7l-96 -63 -25 69 79 23Z"),layer("M-113 -52l-21 61 51 -5Z",1),fold("M-115 -44l52 70"))),
      design("Folding fans",both(layer("M-18 9l-61 -62 -14 14 -24 -2 -6 22 -21 8 8 22 -5 13 29 7 51 -2Z",1),fold("M-23 11l-57 -57m57 57 -87 -44m87 44 -97 -24m97 24 -107 -1m107 1 -99 17"))),
    ]
  };
})();

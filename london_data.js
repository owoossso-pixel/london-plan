var SAT="#2563eb", SUN="#e11d48";

var satCore=[
 {t:"11:55",n:"Finchley Road 버스 하차",o:"FlixBus 도착지, 'Subway' 매장 앞(Stop CL) — 출발점",a:"Finchley Road Station, London NW3",y:51.5479,x:-0.1938},
 {t:"12:30",n:"노팅힐북샵",o:"영화 노팅힐 실제 서점, 포토벨로 로드",a:"13 Blenheim Crescent, London W11 2EE",y:51.5170,x:-0.2055},
 {t:"13:10",n:"패딩턴 베어샵",o:"패딩턴역 The Lawn, 기념품",a:"Paddington Station, The Lawn, London W2 1HB",y:51.5154,x:-0.1755},
 {t:"13:40",n:"리버티 백화점 4층",o:"Oxford Circus 도보 2분",a:"Regent Street, London W1B 5AH",y:51.5142,x:-0.1400},
 {t:"16:00",n:"코벤트가든 (Neal's Yard)",o:"컬러풀한 포토스팟",a:"Neal's Yard, Covent Garden, London WC2H 9DP",y:51.5142,x:-0.1265},
 {t:"17:30",n:"St Pancras 국제역",o:"19:02 셰필드행 기차 전 여유있게 도착, 역 안 식당가 있음",a:"St Pancras International, London N1C 4QP",y:51.5320,x:-0.1262}
];

var satCatA={title:"소호 거리 쇼핑",hint:"리버티 근처, 13:50~14:35쯤",color:SAT,code:"S",items:[
 {n:"Hamleys",o:"장난감가게, 젤리캣 매대 있음",a:"188-196 Regent Street, London W1B 5BT",y:51.5136,x:-0.1402},
 {n:"디즈니 스토어",o:"Oxford St",a:"350-352 Oxford Street, London W1C 1JH",y:51.5154,x:-0.1447}
]};

var satCatB={title:"간식 · 식사 후보",hint:"14:45~15:30쯤, 편한 곳 1~2곳만",color:SAT,code:"F",items:[
 {n:"B Bagel Soho",o:"베이글",a:"54 Wardour Street, London W1D 4JF",y:51.5136,x:-0.1329},
 {n:"Maison Bertaux",o:"런던 최고(最古) 파티세리, 스콘",a:"28 Greek Street, London W1D 5DQ",y:51.5138,x:-0.1317},
 {n:"Italian Bear Chocolate",o:"초콜릿 카페",a:"41 Broadwick Street, London W1F 9QL",y:51.5136,x:-0.1358},
 {n:"Flat Iron Covent Garden",o:"스테이크, 정찬용",a:"17-18 Henrietta Street, London WC2E 8QH",y:51.5117,x:-0.1240},
 {n:"버거 앤 랍스터 소호",o:"정찬용",a:"36-38 Dean Street, London W1D 4PS",y:51.5133,x:-0.1322}
]};

var satCatD={title:"코벤트가든 쇼핑",hint:"16:00~17:15쯤, Neal's Yard랑 묶어서",color:SAT,code:"C",items:[
 {n:"글로시에 (Glossier)",o:"런던 상설 매장",a:"43 King Street, London WC2E 8JY",y:51.5117,x:-0.1257},
 {n:"로얄발레&오페라 샵",o:"에코백!",a:"Bow Street, Covent Garden, London WC2E 9DB",y:51.5129,x:-0.1220}
]};

var sunCore=[
 {t:"",n:"웨스트민스터 사원 · 빅벤",o:"국회의사당 바로 옆 (대성당 아님, 사원)",a:"Westminster Abbey, 20 Deans Yd, London SW1P 3PA",y:51.4995,x:-0.1259},
 {t:"",n:"버킹엄궁전",o:"세인트제임스파크 경유 도보 가능",a:"Buckingham Palace, London SW1A 1AA",y:51.5014,x:-0.1419},
 {t:"",n:"런던아이",o:"Westminster Bridge 건너 사진",a:"Riverside Building, County Hall, London SE1 7PB",y:51.5033,x:-0.1195},
 {t:"",n:"내셔널갤러리 · 트라팔가광장",o:"갤러리는 하이라이트만",a:"Trafalgar Square, London WC2N 5DN",y:51.5089,x:-0.1283},
 {t:"",n:"대영박물관",o:"시간 되는 만큼만 관람",a:"Great Russell Street, London WC1B 3DG",y:51.5194,x:-0.1270}
];

var sunCatA={title:"예상 하차 지점 3가지 (선생님께 확인 필수)",hint:"어디서 내리든 위 5곳 루프에 가까운 순서로 합류하면 됨",color:SUN,code:"D",items:[
 {n:"① Victoria 코치역 근처",o:"버킹엄궁전 → 사원·빅벤 → 런던아이 → 갤러리 → 박물관 순 추천",a:"Victoria Coach Station, London SW1W 9TP",y:51.4930,x:-0.1449},
 {n:"② Marble Arch / 하이드파크코너",o:"하이드파크 경유 버킹엄궁전부터 시작 추천",a:"Marble Arch, London W1H 7EJ",y:51.5131,x:-0.1590},
 {n:"③ 트라팔가광장 / 노섬벌랜드애비뉴",o:"관광버스 흔한 정차지 — 갤러리부터 시작해 역순 추천",a:"Northumberland Avenue, London WC2N 5BW",y:51.5069,x:-0.1236}
]};

var sunCatB={title:"선택 (시간 되면)",hint:"별도 이동 필요, 학교 스케줄 확인 후",color:SUN,code:"X",items:[
 {n:"캠든락마켓",o:"컬러풀한 마켓+운하, 중심가에서 지하철로 20~25분 별도",a:"Camden Lock Place, London NW1 8AF",y:51.5414,x:-0.1465}
]};

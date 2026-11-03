/* ==================================================================
   업무 프로세스 (디자인 / 아날로그 / 포세린) — 관리자 OS 확장 모듈
   · hr-dashboard.html 맨 아래(</body> 바로 위)에 아래 한 줄만 추가하면 동작합니다.
       <script src="wp-module.js"></script>
   · 사이드 메뉴에 "업무 프로세스" 그룹과 하위 메뉴 3개(디자인·아날로그·포세린)를 자동으로 만듭니다.
   · 1단계: 기본 가이드(읽기용). 체크리스트 체크 상태만 이 브라우저에 저장됩니다.
   · 가이드의 수치는 "일반적인 참고값"입니다. 재료 제조사 지침(IFU)과 거래처 요구가 항상 우선입니다.
   ================================================================== */
(function(){
'use strict';

/* ---------------------------- 가이드 데이터 ---------------------------- */
const GUIDES = {

/* ======================= 1. 디자인 (3Shape) ======================= */
design: {
  title: '디자인 파트 (3Shape)',
  sub: '스캔 데이터를 받아 보철물을 설계해 밀링 가능한 STL로 넘기는 단계입니다. 형태·교합·마진이 여기서 80% 결정됩니다.',
  flow: ['처방 확인','스캔 품질 점검','다이/마진 설정','삽입로·언더컷','파라미터 설정','외형 설계','인접 접촉','교합 설계','두께·연결부 검증','출력(STL) 전달'],
  sections: [
    { t:'1. 공통 기준: 정중선 · 치축 · 비율 (심미)', tag:'esth', rows:[
      ['정중선', '상악 정중선은 얼굴 정중선(미간–인중–턱 중앙)과 일치시키는 것이 이상적입니다. 1~2mm 이내의 어긋남은 대부분 눈에 띄지 않지만, 정중선이 기울어지면 바로 티가 납니다. 하악 정중선은 상악과 일치하지 않는 경우가 흔하므로 억지로 맞추지 않습니다.'],
      ['치축(장축) 경사', '상악 전치의 장축은 정중선에서 멀어질수록 원심으로 기울어집니다(중절치 < 측절치 < 견치 순으로 경사 증가). 하악 전치는 거의 수직에 가깝습니다. 좌우 대칭 여부를 정면·교합면 두 방향에서 모두 확인합니다.'],
      ['치관 비율', '상악 중절치 폭:길이는 약 75~80%가 기준입니다. 평균 크기(Wheeler 참고값): 상악 중절치 길이 약 10.5mm / 폭 약 8.5mm, 측절치 길이 약 9.0 / 폭 약 6.5, 견치 길이 약 10.0 / 폭 약 7.5. 개인차가 크므로 반대편 자연치·인접치를 1순위 기준으로 삼습니다.'],
      ['절단연 · 미소선', '상악 전치 절단연 곡선은 아랫입술 곡선을 따라가야 합니다(smile arc). 중절치가 측절치보다 약간 길고, 견치 끝은 중절치와 비슷한 높이입니다.'],
      ['치은연 높이', '상악 중절치·견치의 치은 정점(zenith)은 측절치보다 약간 더 치근단 쪽(높게)에 위치하고, 측절치는 그보다 약간 낮습니다. 좌우 같은 치아끼리는 높이를 대칭으로 맞춥니다.'],
      ['순면 형태', '순면은 근심·중앙·원심으로 3분할되는 면의 반사를 만들어 입체감을 줍니다. 풍융(convexity)은 치은 1/3에서 과하게 튀어나오지 않게 합니다.']
    ]},
    { t:'2. 공통 기준: 교합 · 기능', tag:'func', rows:[
      ['정중교합(MIP)', '다물었을 때 대합치와의 접촉이 안정적으로 여러 점에서 균등하게 생기게 합니다. 보철물만 먼저 닿거나 반대로 아예 닿지 않는(open) 상태는 모두 불량입니다.'],
      ['지지교두 vs 절단교두', '상악 설측교두 + 하악 협측교두가 지지교두(교합 접촉을 담당)입니다. 이 교두 끝이 대합치 중심와·변연융선에 점 접촉하도록 설계합니다. 상악 협측·하악 설측교두(절단교두)는 접촉을 최소화합니다.'],
      ['전방유도 · 측방유도', '전방 운동 시 전치가 구치를 이개(disclusion)시키고, 측방 운동 시 견치유도(또는 그룹기능)로 구치 간섭이 없어야 합니다. 구치 보철물에서 측방 간섭(작업측·비작업측 모두)은 가장 흔한 재조정 원인입니다.'],
      ['교합평면 · 만곡', '인접치와 교합평면을 맞추고 Spee 만곡(전후)·Wilson 만곡(좌우)을 자연스럽게 이어갑니다. 한 개 치아만 튀어나오거나 가라앉지 않게 합니다.'],
      ['수직 · 수평 피개', '전치부 수평피개(overjet)와 수직피개(overbite)는 보통 각각 2~3mm 전후가 기준입니다. 기존 상태를 존중하되 발음(f/v/s) 문제가 생기지 않게 합니다.'],
      ['교합 여유(clearance)', '대합치와의 거리는 재료의 최소 두께를 확보할 수 있어야 합니다. 공간이 부족하면 임의로 줄이지 말고 치과에 삭제량 부족을 알립니다.']
    ]},
    { t:'3. 작업 순서', tag:'step', list:[
      '처방서 확인: 치식, 보철 종류(크라운/브릿지/인레이/온레이/임플란트 어버트먼트), 재료(지르코니아·e.max·PFM 등), 셰이드, 특이사항(훅·메탈 마진·치은 모양 요청 등)',
      '스캔 데이터 점검: 마진이 선명한지, 인접면이 충분히 스캔됐는지, 대합치·바이트(교합) 스캔이 정확한지 확인. 불량이면 즉시 치과에 재스캔 요청',
      '다이 설정·트리밍 후 마진 라인 지정: 마진이 흐릿한 구간은 임의로 추정하지 말고 확인 요청',
      '삽입 방향(path of insertion) 설정: 인접치와 평행하게, 언더컷이 최소가 되는 방향으로 잡습니다. 브릿지는 지대치 간 평행도 확인',
      '파라미터 적용: 시멘트 갭, 마진 위 갭 제외 구간, 최소 두께, 인접·교합 접촉 강도 (거래처별 저장값이 있으면 그 값 우선)',
      '외형 설계: 인접치 크기·형태·축에 맞춰 제안 형태를 수정(모핑)하고 변연융선 높이, 발육구·소와 위치를 맞춥니다',
      '인접면 접촉: 접촉 위치와 강도를 설정(아래 4번 참고)',
      '교합 설계: 가상 교합기로 정중교합 + 전방/측방 운동 접촉 확인, 과접촉 부위 조정',
      '두께·연결부 검증: 최소 두께 맵(두께 분석)에서 얇은 부위가 없는지, 브릿지 연결부 면적 확인',
      '밀링/출력 파일 전달: 훅(스프루) 위치·블록 배치가 거래처 요구와 맞는지 확인 후 전달'
    ]},
    { t:'4. 파라미터 · 두께 기준 (참고값)', tag:'func', rows:[
      ['시멘트 갭(내면)', '일반적으로 약 0.05~0.08mm에서 시작합니다. 밀링기·재료·시멘트 종류·치과 선호에 따라 달라지므로 거래처별로 기록하고 계속 보정합니다.'],
      ['마진 부위 갭', '마진 위 약 0.5~1.0mm 구간은 갭을 0 또는 매우 작게(약 0~0.02mm) 두어 변연 적합을 확보합니다. 마진이 뜨면 시멘트 노출·이차우식 위험이 큽니다.'],
      ['최소 두께 – 모노리식 지르코니아', '축벽 약 0.5mm 이상, 교합면 약 0.5~0.7mm 이상(권장은 0.8~1.0mm). 고투광 지르코니아는 강도가 낮아 더 두껍게 잡습니다.'],
      ['최소 두께 – 지르코니아 코핑(레이어링용)', '코핑 약 0.4~0.5mm. 포세린이 올라갈 공간을 위해 교합면·순면을 컷백해 포세린이 균일한 두께(약 1.0~1.5mm)로 지지되게 설계합니다.'],
      ['최소 두께 – e.max(리튬디실리케이트)', '축벽 약 0.8~1.0mm, 교합면 약 1.0~1.5mm.'],
      ['최소 두께 – PFM 메탈 코핑', '약 0.3~0.5mm. 포세린 두께는 균일하게, 접촉점 부위 포세린 단독 지지 구간은 피합니다.'],
      ['브릿지 연결부 면적', '지르코니아 기준 대략 전치 약 7mm², 구치 약 9mm² 이상이 일반 기준입니다. 고투광 지르코니아·긴 스팬은 더 크게. 제조사 지침이 우선입니다.'],
      ['인접 접촉 강도', '접촉 강도는 "임상에서 약간 힘을 주어 들어가는 정도"가 목표입니다. 디자인 단계에서는 살짝 여유 있게 두고, 아날로그 파트에서 접촉지로 마무리합니다. 접촉 위치는 전치는 절단 1/3, 구치는 교합면 1/3(협측으로 약간 치우침).'],
      ['교합 접촉 강도', '디자인에서는 정중교합 점접촉을 확보하되 약간 낮게(대합치와 미세한 여유) 잡고, 아날로그에서 교합지로 최종 조정하는 방식이 안전합니다.']
    ]},
    { t:'5. 보철 종류별 포인트', tag:'func', rows:[
      ['전치 크라운 / 브릿지', '정중선·치축·절단연 곡선이 최우선. 순면 형태(발육엽·질감), 접촉점 위치, 설측 오목(전방유도 면)을 대합 하악 전치와 맞춰 설계합니다.'],
      ['구치 크라운 / 브릿지', '교두 높이·경사, 중심와 깊이, 변연융선 높이 맞춤이 핵심. 협측으로 접촉점이 치우치게 잡아 음식물 끼임을 줄입니다.'],
      ['인레이 / 온레이', '교두 덮는 범위, 마진 위치(교합 접촉점이 마진 위에 놓이지 않게), 내면 갭 보정이 중요합니다.'],
      ['임플란트 크라운', '출현 형태(emergence profile)를 치은 연결부에서 부드럽게 이어가고, 치은 압박·청소 용이성(embrasure) 확보. 스크류 홀 위치는 교합면 중심와 안쪽(전치는 설측 치경부 쪽)에 오게 합니다. 어버트먼트 각도·마진 깊이 확인.'],
      ['폰틱 형태', '하악 구치는 위생형(sanitary/modified), 상악 전치는 치은 접촉이 부드러운 ovate/modified ridge-lap을 많이 씁니다. 치은 접촉면은 매끈한 볼록면으로 청소가 쉽게 합니다.']
    ]},
    { t:'6. 디자인 체크리스트', tag:'check', list:[
      '처방서 · 셰이드 · 재료를 확인했다',
      '스캔 마진이 선명하고 대합치/바이트 스캔이 정확하다',
      '삽입 방향이 인접치와 평행하고 언더컷이 없다',
      '정중선 · 치축 · 절단연 곡선이 인접치와 조화된다',
      '인접 접촉 위치 · 강도가 설정돼 있다',
      '정중교합 · 전방 · 측방 운동에서 교합 간섭이 없다',
      '최소 두께 · 연결부 면적을 확인했다',
      '거래처별 저장된 내면값 · 훅 위치 요구를 적용했다',
      '파일명/환자명/치식이 처방서와 일치한다'
    ]},
    { t:'7. 자주 생기는 불량 원인', tag:'fail', list:[
      '마진 부정확 → 변연 들뜸: 스캔 불량 구간을 추정으로 잡은 경우',
      '내면 간섭(안 들어감): 시멘트 갭 부족, 언더컷 미처리, 삽입 방향 오류',
      '인접 접촉 과강/부족: 접촉 강도 설정값이 거래처 기준과 다른 경우',
      '교합 높음/낮음: 바이트 스캔 오류, 가상 교합기 미사용, 대합치 데이터 누락',
      '파절(chipping·crack): 최소 두께 미달, 연결부 면적 부족, 얇은 포세린 지지 구간',
      '형태 불일치: 반대편 자연치 비교 없이 제안 형태를 그대로 사용'
    ]},
    { t:'8. 거래처(치과)별로 꼭 기록할 항목 (다음 단계에서 입력 UI 제작 예정)', tag:'client', list:[
      '시멘트 갭 값(내면) · 마진 위 갭 구간 — 변경 이력',
      '인접 접촉 강도 선호(타이트/보통/여유) · 교합 선호(약하게/보통)',
      '훅(스프루) 위치 · 블록 배치 · 파일 전달 형식',
      '임플란트 시스템/어버트먼트 정보, 스크류 홀 위치 선호',
      '재제작/수정 이력과 그 원인'
    ]}
  ]
},

/* ======================= 2. 아날로그 ======================= */
analog: {
  title: '아날로그 파트 (아답 · 컨투어링 등)',
  sub: '밀링·소결 후 보철물을 모델에 적합(아답)시키고, 접촉·교합·형태(컨투어링)를 다듬어 임상에서 그대로 들어가는 상태로 만드는 수작업 단계입니다.',
  flow: ['입고 확인','모델/다이 준비','내면 아답','마진 적합','인접 접촉','교합 조정','컨투어링','연마·표면','최종 검수','포세린/출고 전달'],
  sections: [
    { t:'1. 기능적 기준 (적합 · 접촉 · 교합)', tag:'func', rows:[
      ['내면 적합(아답)', '다이에 완전히 안착해야 합니다. 걸리는 곳은 무리하게 누르지 말고 얇은 실리콘(핏 체커 등) 또는 접촉 표시제로 간섭 부위를 찾아 조금씩만 삭제합니다. 내면을 너무 많이 갈면 시멘트 두께가 달라져 탈락·마진 불량이 생깁니다.'],
      ['마진 적합', '다이 마진과 보철물 마진이 단차 없이 이어져야 합니다. 마진 끝은 얇고 약하므로 바로 그 부위는 가공하지 않는 것이 원칙입니다. 확대경으로 360° 확인합니다.'],
      ['인접 접촉', '접촉 위치는 전치 절단 1/3, 구치 교합면 1/3(협측으로 약간 치우침)이 기본이고, 접촉 강도는 얇은 접촉지(약 8~12μm 정도의 얇은 포일/접촉지)가 "약간 저항을 받으며" 빠지는 정도가 일반 기준입니다. 완전히 느슨하면 음식물 끼임, 너무 강하면 안 들어가거나 치주 문제가 생깁니다.'],
      ['정중교합 조정', '교합지(보통 약 40μm 전후)로 접촉점을 표시해 점접촉으로 다듬습니다. 보철물만 진한 큰 면으로 찍히면 높은 것이므로 줄이고, 아예 안 찍히면 대합치와의 접촉을 확인합니다.'],
      ['측방·전방 운동', '미끄럼 운동에서 구치 간섭이 남지 않도록 설측/협측 경사면을 정리합니다. 견치·전치 유도면을 훼손하지 않습니다.'],
      ['두께 보존', '조정 중에도 최소 두께(모노리식 지르코니아 교합면 약 0.5~0.7mm 이상, e.max 약 1.0mm 이상)를 지킵니다. 얇아지면 파절 위험이 급증합니다.']
    ]},
    { t:'2. 컨투어링(형태 수정) – 심미적 기준', tag:'esth', rows:[
      ['외형 곡률', '치은 1/3 풍융은 과하지 않게, 설측은 자연스러운 오목을 유지합니다. 풍융이 크면 치은염·청소 불량, 너무 평평하면 음식물이 치은 쪽으로 밀립니다.'],
      ['접촉점 · 외형 이개(embrasure)', '이개 공간은 절단 → 치은 방향으로 갈수록 커지고, 전치는 절단 이개가 가장 작고 치은 이개가 가장 큽니다.'],
      ['변연융선 높이', '인접치의 변연융선 높이와 맞춥니다. 높으면 음식물이 눌려 끼이고, 낮으면 접촉이 약해집니다.'],
      ['치축 · 정중선', '컨투어링 중에도 치축과 정중선을 눈으로 재확인합니다. 한쪽을 깎다가 축이 틀어지지 않도록 반대편 치아·모델 전체를 봐가며 작업합니다.'],
      ['전치 순면 질감', '발육엽(수직 융기)과 수평 질감(페리키마타)을 연령에 맞게 부여합니다. 젊은 환자는 질감이 뚜렷, 고령 환자는 마모되어 평평합니다.'],
      ['구치 교합면 형태', '발육구·보조구·소와를 인접치와 비슷한 깊이로 새깁니다. 교두 경사가 너무 가파르면 측방 간섭, 너무 평평하면 저작 효율이 떨어집니다.']
    ]},
    { t:'3. 작업 순서', tag:'step', list:[
      '입고 확인: 처방서, 모델, 소결된 보철물, 파일과 치식 일치 여부, 파손·크랙 유무(밝은 곳에서 투과 확인)',
      '모델·다이 점검: 다이 마진 손상 여부, 인접치·대합 모델 안정성. 교합기 장착 상태 확인',
      '내면 아답: 실리콘/표시제로 간섭 부위 확인 → 소량씩 삭제 → 재확인 반복',
      '마진 적합: 확대경으로 단차 확인. 마진 쪽 두께는 건드리지 않는 것이 원칙',
      '인접 접촉 조정: 접촉지로 확인하며 접촉점 위치를 맞추고 강도 조절',
      '교합 조정: 교합지로 정중교합 점접촉 확보 → 전방·측방 운동 간섭 제거',
      '컨투어링: 형태 수정(풍융, 변연융선, 이개, 질감)',
      '연마·표면 처리: 지르코니아는 수냉 또는 약한 압으로 열 발생을 줄이고, 조연마 → 중연마 → 고광택 단계로 진행',
      '최종 검수 후 포세린 파트 또는 출고로 전달'
    ]},
    { t:'4. 연마 · 가공 시 주의', tag:'func', list:[
      '지르코니아는 열에 의한 미세 크랙이 생길 수 있으므로 가벼운 압력, 수냉, 간헐 가공으로 작업합니다',
      '다이아몬드 버는 입자 굵기별로 구분해 사용하고, 사용한 버는 교차오염되지 않게 분리합니다',
      '고광택 부위(모노리식)는 마지막 단계에서 다이아몬드 페이스트로 마무리하고, 글레이즈 전용 제품과 병용하는 경우 제조사 순서를 따릅니다',
      '조정 후 접촉 부위가 변색되거나 표면이 거칠어지면 다시 연마합니다(거친 면은 대합치 마모·착색의 원인)',
      '재료마다 연마 단계가 다릅니다: 지르코니아 · e.max · 메탈의 연마재를 섞어 쓰지 않습니다'
    ]},
    { t:'5. 아날로그 체크리스트', tag:'check', list:[
      '입고 시 크랙·결손이 없다',
      '다이에 완전히 안착한다 (흔들림/기울어짐 없음)',
      '마진 단차가 없고 360° 확대 확인했다',
      '인접 접촉 강도 · 위치가 적절하다',
      '정중교합 점접촉 + 측방/전방 간섭 없음',
      '최소 두께를 확인했다',
      '정중선 · 치축 · 형태가 인접치와 조화된다',
      '표면 연마/질감이 거래처 요구와 맞다',
      '처방서 · 셰이드 · 치식과 일치하는지 최종 확인했다'
    ]},
    { t:'6. 자주 생기는 불량 원인', tag:'fail', list:[
      '안 들어감: 내면 과삭제/미삭제, 다이 마진 손상, 인접 접촉 과강',
      '마진 불량: 마진을 연마하다 얇아져 결손, 또는 다이 파손으로 안착 오류',
      '교합 높음: 정중교합만 맞추고 측방·전방 운동 확인 누락',
      '파절: 조정으로 과도하게 얇아짐, 가공 중 열 크랙',
      '형태 불일치: 접촉점·변연융선·치축을 인접치와 비교하지 않고 단독 작업'
    ]},
    { t:'7. 거래처별 기록 항목 (다음 단계에서 입력 UI 제작 예정)', tag:'client', list:[
      '접촉 강도 선호 · 교합 선호(약하게/보통)',
      '표면 질감·광택 선호(전치 질감 강도, 광택 높음/낮음)',
      '자주 발생한 조정 사례와 해결법'
    ]}
  ]
},

/* ======================= 3. 포세린 ======================= */
porcelain: {
  title: '포세린 파트 (빌드업 · 글레이징 · 스테인)',
  sub: '프레임 위에 도재(포세린)를 쌓아 올려 자연치와 같은 색·투명도·질감을 만드는 심미 완성 단계입니다. 마지막에 색과 광택이 결정됩니다.',
  flow: ['셰이드 확인','프레임 점검','프레임 처리·라이너','덴틴 빌드업','컷백·인엔멜','소성','형태·질감 수정','2차 소성','스테인·글레이즈','최종 검수'],
  sections: [
    { t:'1. 심미적 기준 (색 · 투명도 · 질감)', tag:'esth', rows:[
      ['색의 3요소', '색상(Hue) · 채도(Chroma) · 명도(Value). 명도가 가장 중요합니다. 명도가 높거나 낮으면 주변 치아와 가장 먼저 구분됩니다.'],
      ['치경부 → 절단', '치경부는 채도가 높고 불투명(덴틴 색이 진함), 중간부는 덴틴과 법랑질이 섞이며, 절단 1/3은 투명도가 높고 약간 푸르스름한 오팔 효과가 납니다.'],
      ['절단부 구조', '젊은 치아는 마메론(절단 돌기 3개) 구조와 투명한 절단연이 보입니다. 연령이 높을수록 마모되어 절단이 평평하고 덴틴 노출 색이 강합니다.'],
      ['인접치 매칭', '처방서 셰이드만 믿지 말고 사진·셰이드 가이드를 보고 인접치와 맞춥니다. 너무 균일한 색은 인공적으로 보입니다.'],
      ['표면 질감·광택', '전치 순면의 수평 질감(페리키마타)과 발육엽을 부여하고 광택은 인접치와 같은 정도로 맞춥니다. 번쩍이는 글레이즈는 가짜처럼 보입니다.'],
      ['정중선 · 치축 · 형태', '포세린 단계에서도 치축·정중선·절단연 곡선을 다시 확인합니다. 형태가 크게 어긋나면 포세린으로 수정하지 말고 디자인/아날로그 파트에 되돌립니다.']
    ]},
    { t:'2. 기능적 기준 (강도 · 교합 · 접촉)', tag:'func', rows:[
      ['포세린 두께', '프레임 위 포세린이 균일한 두께(약 1.0~1.5mm, 최대 약 2mm 이하)가 되도록 컷백·빌드업합니다. 두께 편차·지지 없는 두꺼운 포세린은 칩핑(chipping)의 가장 큰 원인입니다.'],
      ['교합 접촉 위치', '교합 접촉점은 가능하면 프레임이 지지하는 포세린 위에 두고, 얇은 포세린 가장자리나 프레임-포세린 경계에 걸리지 않게 합니다.'],
      ['인접 접촉', '소성 수축으로 접촉이 약해지므로 빌드업 시 접촉 부위를 약간 과충전하고, 소성 후 접촉지로 확인해 조정합니다.'],
      ['소성 수축', '포세린은 소성 시 부피가 약 15~20% 수축합니다. 형태를 그대로 쌓지 말고 약간 크게(over-build) 쌓은 뒤 수축 후 보정합니다.'],
      ['교합 조정 후 재글레이즈', '교합 조정한 면은 거칠어지므로 반드시 다시 글레이즈하거나 연마해 광택을 회복시킵니다. 거친 포세린은 대합치를 마모시킵니다.']
    ]},
    { t:'3. 작업 순서 (지르코니아 레이어링 기준)', tag:'step', list:[
      '셰이드 확인: 처방서 + 사진 + 셰이드 가이드. 치경부/중간/절단 셰이드 분리 기록',
      '프레임 점검: 크랙·오염·이물질(기름기) 제거. 샌드블라스트·스팀 세척 여부는 재료 제조사 지침대로',
      '프레임 처리: 필요한 경우 라이너/프레임 컬러링을 도포하고 제조사 소성표대로 1회 소성',
      '덴틴 빌드업: 치경부~중간부 덴틴을 쌓고 절단부는 컷백(절단 1/3 정도) — 마메론 구조 부여',
      '법랑질·투명층(인엔멜/트랜스) 빌드업: 절단 1/3과 인접면에 얹어 투명도·깊이감 부여. 과충전해 수축에 대비',
      '1차 소성: 건조(예열)를 충분히 한 뒤 제조사 소성표 온도·진공 조건으로 소성',
      '형태·질감 수정: 교합·접촉·치축·정중선·표면 질감을 다이아몬드 버로 다듬기',
      '2차(보정) 소성: 부족한 부분(접촉부·치경부·색)을 추가 빌드업하고 소성',
      '스테인 & 글레이즈: 최소 스테인으로 색 보정 → 글레이즈 소성으로 광택 마무리',
      '연마·최종 검수: 접촉·교합·색·질감 확인 후 출고'
    ]},
    { t:'4. 소성 · 스테인 · 글레이즈 (참고값)', tag:'func', rows:[
      ['건조/예열', '쌓은 직후 바로 고온에 넣으면 수분이 급하게 증발해 기포·크랙이 생깁니다. 오븐 앞에서 충분히 건조(수 분)시킨 뒤 천천히 들어갑니다.'],
      ['소성 온도', '제조사·재료별로 달라 정확한 값은 제품 소성표를 따릅니다. 대략적으로 덴틴/인엔멜 소성은 약 900℃ 전후, 스테인·글레이즈 소성은 약 750~850℃ 범위가 흔합니다. 오븐 온도 보정(캘리브레이션)을 정기적으로 합니다.'],
      ['냉각', '소성 후 급냉하면 내부 응력이 생겨 칩핑·크랙이 납니다. 소성 종료 후 오븐 문을 서서히 열거나 제조사가 권장하는 서냉(롱 쿨링)을 따릅니다. 특히 지르코니아 레이어링에서는 중요합니다.'],
      ['스테인 사용', '내부 스테인(치경부·크랙·균열 라인 등)은 최소량으로 쓰고, 외부 스테인은 마지막 색 보정에만 사용합니다. 스테인으로 색 전체를 바꾸려 하면 두께가 부족해 금방 마모됩니다.'],
      ['글레이즈', '얇고 균일하게 도포합니다. 두꺼우면 형태가 뭉개지고 질감이 사라집니다. 글레이즈 전에 질감과 형태를 확정해야 합니다.'],
      ['오븐 관리', '진공 펌프, 머플 내부 청결, 소성 트레이(핀/허니콤) 청결을 정기 점검합니다. 오븐 상태가 불량하면 같은 방식으로 작업해도 색·기포가 달라집니다.']
    ]},
    { t:'5. 메탈 프레임(PFM) 참고', tag:'func', list:[
      '메탈 프레임은 산화(옥사이드) 처리 후 오파크 포세린을 2회(워시 + 본 오파크) 도포해 메탈 색을 가립니다',
      '오파크 두께가 부족하면 메탈 색이 비치고, 과하면 투명도·깊이감이 줄어듭니다',
      '마진 부위 메탈 처리(메탈 마진/포세린 마진) 요청을 처방서에서 확인합니다',
      '메탈과 포세린의 열팽창 계수(CTE) 호환성을 지키는 제조사 조합을 사용합니다'
    ]},
    { t:'6. 포세린 체크리스트', tag:'check', list:[
      '셰이드(치경부/중간/절단)를 사진·가이드로 확인했다',
      '프레임에 크랙·오염이 없다',
      '포세린 두께가 균일하고(약 1.0~1.5mm) 지지 없는 두꺼운 구간이 없다',
      '소성 수축을 고려해 접촉·교합을 확인했다',
      '정중선 · 치축 · 절단연 곡선이 자연치와 맞다',
      '표면 질감·광택이 인접치와 어울린다',
      '교합 조정한 면을 다시 글레이즈/연마했다',
      '냉각을 충분히 거쳤고 크랙·기포가 없다',
      '처방서 셰이드와 최종 색이 일치한다'
    ]},
    { t:'7. 자주 생기는 불량 원인', tag:'fail', list:[
      '칩핑(떨어져 나감): 두께 편차, 지지 없는 포세린, 급냉, 교합 과접촉',
      '기포/하얀 반점: 건조 부족, 오븐 진공 불량, 오염된 프레임',
      '색 불일치: 명도 오판(너무 밝거나 어둠), 스테인 과다 사용, 두께 부족으로 프레임 색이 비침',
      '형태 뭉개짐: 글레이즈 과다 도포, 수축을 고려하지 않은 빌드업',
      '교합 높음/접촉 약함: 소성 수축 미고려, 2차 소성 후 확인 누락'
    ]},
    { t:'8. 거래처별 기록 항목 (다음 단계에서 입력 UI 제작 예정)', tag:'client', list:[
      '선호 광택(낮음/보통/높음)과 질감 강도',
      '셰이드 선호(약간 밝게/자연스럽게) 및 특이 요청',
      '자주 요청되는 스테인(치경부 착색 등)',
      '칩핑·색 불일치 등 재제작 이력'
    ]}
  ]
}

};

/* ---------------------------- 렌더링 ---------------------------- */
const TAGS = { func:['기능','#3b6bf5','#eaf0ff'], esth:['심미','#b3720a','#fff4e0'], step:['순서','#17a673','#e6f7ef'],
               check:['체크','#7c5cf0','#f1ecff'], fail:['불량','#e5484d','#fdecec'], client:['거래처','#0aa5b0','#e1f6f8'] };
function esc(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function store(k, v){ try{ if(v===undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(e){ return null; } }

function sectionHtml(partKey, sec, idx){
  const tg = TAGS[sec.tag] || TAGS.func;
  let body = '';
  if(sec.rows){
    body = '<table class="wp-tbl"><tbody>' + sec.rows.map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('') + '</tbody></table>';
  } else if(sec.tag==='check'){
    body = '<div class="wp-checks">' + sec.list.map((x,i)=>{
      const id = `${partKey}-${idx}-${i}`;
      const on = store('wp_chk_'+id)==='1' ? 'checked' : '';
      return `<label class="wp-chk"><input type="checkbox" data-id="${id}" ${on}><span>${esc(x)}</span></label>`;
    }).join('') + '<div class="wp-chk-actions"><button class="btn ghost sm" data-reset="'+partKey+'-'+idx+'">체크 초기화</button></div></div>';
  } else if(sec.tag==='step'){
    body = '<ol class="wp-ol">' + sec.list.map(x=>`<li>${esc(x)}</li>`).join('') + '</ol>';
  } else {
    body = '<ul class="wp-ul">' + sec.list.map(x=>`<li>${esc(x)}</li>`).join('') + '</ul>';
  }
  return `<details class="wp-sec" ${idx<3?'open':''}>
    <summary><span class="wp-tag" style="color:${tg[1]};background:${tg[2]}">${tg[0]}</span>${esc(sec.t)}</summary>
    <div class="wp-body">${body}</div></details>`;
}

function panelHtml(key, g){
  return `
    <div class="card wp-head">
      <h2 style="margin:0 0 6px;">${esc(g.title)}</h2>
      <div class="small-note" style="line-height:1.6;">${esc(g.sub)}</div>
      <div class="wp-flow">${g.flow.map((f,i)=>`<span class="wp-step"><b>${i+1}</b>${esc(f)}</span>`).join('')}</div>
      <div class="wp-note">※ 수치는 일반적인 참고값입니다. 재료 제조사 지침(IFU)과 거래처 요구가 항상 우선이며, 우리 기공소 기준이 확정되면 이 가이드를 수정합니다.</div>
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn ghost sm" data-wp-toggle="open">모두 펼치기</button>
        <button class="btn ghost sm" data-wp-toggle="close">모두 접기</button>
        <button class="btn ghost sm" onclick="window.print()">인쇄</button>
      </div>
    </div>
    <div class="card" style="padding:8px 22px;">${g.sections.map((s,i)=>sectionHtml(key,s,i)).join('')}</div>`;
}

const CSS = `
.wp-step{display:inline-flex;align-items:center;gap:6px;background:#f3f5fa;border-radius:999px;padding:5px 11px 5px 6px;font-size:12px;font-weight:600;color:#3a4460;margin:4px 6px 0 0;}
.wp-step b{width:18px;height:18px;border-radius:50%;background:var(--accent,#3b6bf5);color:#fff;font-size:10.5px;display:inline-flex;align-items:center;justify-content:center;}
.wp-note{margin-top:12px;padding:9px 12px;border-radius:10px;background:#fff8e6;color:#8a5a00;font-size:12px;line-height:1.5;}
.wp-sec{border-bottom:1px solid #eef0f5;}
.wp-sec:last-child{border-bottom:none;}
.wp-sec summary{cursor:pointer;padding:15px 0;font-weight:700;font-size:14.5px;list-style:none;display:flex;align-items:center;gap:10px;}
.wp-sec summary::-webkit-details-marker{display:none;}
.wp-sec summary::after{content:'▾';margin-left:auto;color:#9aa5c0;transition:transform .15s;}
.wp-sec[open] summary::after{transform:rotate(180deg);}
.wp-tag{font-size:11px;font-weight:800;padding:3px 9px;border-radius:999px;flex-shrink:0;}
.wp-body{padding:0 0 16px;}
.wp-tbl{width:100%;border-collapse:collapse;}
.wp-tbl th{width:150px;text-align:left;vertical-align:top;padding:10px 12px 10px 0;font-size:13px;color:#2c3550;}
.wp-tbl td{padding:10px 0;font-size:13.5px;line-height:1.7;color:#333c52;}
.wp-tbl tr+tr th,.wp-tbl tr+tr td{border-top:1px solid #f0f2f7;}
.wp-ol,.wp-ul{margin:0;padding-left:22px;font-size:13.5px;line-height:1.75;color:#333c52;}
.wp-ol li,.wp-ul li{margin-bottom:6px;}
.wp-checks{display:flex;flex-direction:column;gap:8px;}
.wp-chk{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;line-height:1.55;cursor:pointer;}
.wp-chk input{margin-top:4px;width:16px;height:16px;flex-shrink:0;}
.wp-chk input:checked + span{color:#9aa5c0;text-decoration:line-through;}
.wp-chk-actions{margin-top:6px;}
@media(max-width:700px){ .wp-tbl th{display:block;width:auto;padding-bottom:2px;} .wp-tbl td{display:block;padding-top:0;} .wp-tbl tr+tr th{border-top:1px solid #f0f2f7;} .wp-tbl tr+tr td{border-top:none;} }
@media print{ .wp-sec{break-inside:avoid;} .wp-sec .wp-body{display:block !important;} }
`;

/* ---------------------------- 메뉴/패널 주입 ---------------------------- */
function init(){
  if(document.getElementById('wpGroup')) return;                     // 중복 방지
  const group = document.querySelector('.navgroup');
  const content = document.querySelector('.content');
  if(!group || !content){ console.warn('[업무프로세스] 사이드바/콘텐츠 영역을 찾지 못했습니다.'); return; }

  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  const items = [['design','디자인 (3Shape)'],['analog','아날로그 (아답·컨투어링)'],['porcelain','포세린 (빌드업·글레이징)']];
  const wrap = document.createElement('div'); wrap.id='wpGroup';
  wrap.innerHTML = '<div class="navlabel">업무 프로세스</div>' + items.map(([k,l])=>`<div class="navitem" data-tab="wp-${k}"><span class="dot"></span>${l}</div>`).join('');
  group.appendChild(wrap);

  items.forEach(([k,l])=>{
    const p = document.createElement('div');
    p.id = 'tab-wp-'+k; p.className = 'tab-panel hidden';
    p.innerHTML = panelHtml(k, GUIDES[k]);
    content.appendChild(p);
  });

  // 메뉴 클릭: 기존 탭 전환 로직과 충돌하지 않도록 이 메뉴만 따로 처리
  wrap.querySelectorAll('.navitem').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      try{ if(typeof closeSidebar==='function') closeSidebar(); }catch(e){}
      document.querySelectorAll('.navitem').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p=>p.classList.add('hidden'));
      const key = btn.dataset.tab;
      document.getElementById('tab-'+key).classList.remove('hidden');
      const t = document.getElementById('topTitle');
      if(t) t.textContent = '업무 프로세스 · ' + GUIDES[key.replace('wp-','')].title.split(' (')[0];
      window.scrollTo(0,0);
    });
  });

  // 체크박스 저장 · 초기화 · 펼치기/접기
  content.addEventListener('change', e=>{
    const el = e.target;
    if(el && el.matches && el.matches('.wp-chk input[data-id]')) store('wp_chk_'+el.dataset.id, el.checked?'1':'0');
  });
  content.addEventListener('click', e=>{
    const rs = e.target.closest && e.target.closest('[data-reset]');
    if(rs){
      const pre = rs.dataset.reset;
      rs.closest('.wp-checks').querySelectorAll('input[data-id]').forEach(i=>{ i.checked=false; store('wp_chk_'+i.dataset.id,'0'); });
      return;
    }
    const tg = e.target.closest && e.target.closest('[data-wp-toggle]');
    if(tg){
      const panel = tg.closest('.tab-panel');
      panel.querySelectorAll('details.wp-sec').forEach(d=>{ d.open = tg.dataset.wpToggle==='open'; });
    }
  });
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

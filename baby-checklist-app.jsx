import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Check, ExternalLink, ArrowLeft, Sprout } from "lucide-react";

const DATA = {
  stages: [
    {
      id: "0-1m",
      label: "신생아",
      sub: "0~1개월",
      categories: [
        {
          id: "feeding",
          label: "수유",
          items: [
            { id: "bottle", name: "젖병 (2~4개)", required: true, condition: "new_not_recommended", price: "5천 ~ 3만원", reason: "실리콘 마모, 세균 잔존 우려", newQ: "젖병 세트", usedQ: "젖병" },
            { id: "breast-pump", name: "유축기", required: true, note: "모유수유 시", condition: "new_strong", price: "3만 ~ 40만원", reason: "모터 수명, 위생 문제로 렌탈이 대안", newQ: "전동 유축기", usedQ: null },
            { id: "formula-maker", name: "분유포트/조유기", required: false, condition: "used_ok", price: "5만 ~ 15만원", reason: "세척만 잘 되면 무방", newQ: "분유포트", usedQ: "분유포트" },
            { id: "nursing-pillow", name: "수유쿠션", required: false, condition: "used_ok", price: "2만 ~ 5만원", reason: "커버만 새로 세탁하면 OK", newQ: "수유쿠션", usedQ: "수유쿠션" },
            { id: "burp-cloth", name: "가제/엠보 손수건", required: true, condition: "new_ok", price: "세트 1만~2만원대", reason: "다다익선 아이템, 거즈 30~40장+엠보 20~30장 정도는 준비하는 경우가 많음", newQ: "가제손수건 세트", usedQ: null },
            { id: "bottle-sterilizer", name: "젖병소독기", required: false, condition: "used_ok", price: "5만 ~ 15만원", reason: "전자기기, 작동만 확인되면 무방. 냄비 열탕소독으로 대체 가능", newQ: "젖병소독기", usedQ: "젖병소독기" },
            { id: "night-light", name: "수유등", required: false, condition: "used_ok", price: "1만~3만원", reason: "밤중 수유·기저귀 교체 시 은은한 조명용", newQ: "수유등", usedQ: "수유등" },
            { id: "bottle-rack", name: "젖병건조대", required: false, condition: "used_ok", price: "1만~2만원", reason: "세척만 잘 되면 무방", newQ: "젖병건조대", usedQ: "젖병건조대" },
          ],
        },
        {
          id: "sleep",
          label: "수면",
          items: [
            { id: "crib", name: "아기침대/요람 프레임", required: true, condition: "used_ok", price: "10만 ~ 30만원", reason: "구조 안전(간격 6cm 이내) 확인", newQ: "아기침대", usedQ: "아기침대" },
            { id: "mattress", name: "매트리스", required: true, condition: "new_strong", price: "5만 ~ 15만원", reason: "처짐·위생 확인 어려움, 안전과 직결", newQ: "아기 매트리스", usedQ: null },
            { id: "swaddle", name: "속싸개", required: true, condition: "used_ok", price: "세트 2만원대", reason: "세탁 후 사용 무방", newQ: "속싸개 세트", usedQ: "속싸개" },
            { id: "wrap", name: "겉싸개/우주복", required: true, condition: "used_ok", price: "개당 1만원대", reason: "성장 빨라 중고 활용도 높음", newQ: "신생아 우주복", usedQ: "신생아 우주복" },
            { id: "blanket", name: "이불/블랭킷", required: true, condition: "used_ok", price: "1만~3만원", reason: "세탁 후 사용 무방, 계절별로 여러 장 필요", newQ: "아기 이불 블랭킷", usedQ: "아기 이불" },
          ],
        },
        {
          id: "hygiene",
          label: "위생",
          items: [
            { id: "tub", name: "아기욕조", required: true, condition: "used_ok", price: "2만 ~ 4만원", reason: "파손·변형만 없으면 무방", newQ: "아기욕조", usedQ: "아기욕조" },
            { id: "hooded-towel", name: "후드타올", required: true, condition: "used_ok", price: "1만~2만원", reason: "세탁 후 사용 무방, 2~3장 있으면 편함", newQ: "아기 후드타올", usedQ: "아기 후드타올" },
            { id: "thermo", name: "체온계", required: true, condition: "new_strong", price: "1만 ~ 5만원", reason: "정확도가 중요, 중고는 오차 우려", newQ: "아기 체온계", usedQ: null },
            { id: "diapers", name: "기저귀(신생아용)", required: true, condition: "new_consumable", price: "팩당 2만원대", reason: "소모품", newQ: "신생아 기저귀", usedQ: null },
            { id: "wipes", name: "물티슈", required: true, condition: "new_consumable", price: "팩당 5천원대", reason: "소모품", newQ: "아기 물티슈", usedQ: null },
            { id: "changing-pad", name: "기저귀갈이대", required: false, condition: "used_ok", price: "3만 ~ 15만원", reason: "구조만 튼튼하면 무방, 이케아 제품도 많이 씀", newQ: "기저귀갈이대", usedQ: "기저귀갈이대" },
            { id: "waterproof-pad", name: "방수패드", required: true, condition: "used_ok", price: "개당 5천~1만원", reason: "세탁 후 사용 무방, 여러 장 있으면 편함", newQ: "방수패드", usedQ: "방수패드" },
          ],
        },
        {
          id: "clothing0",
          label: "의류",
          items: [
            { id: "baenaetjeogori", name: "배냇저고리", required: true, condition: "used_ok", price: "3~4벌 세트 1만~3만원", reason: "세탁 후 사용 무방, 선물로 많이 받는 아이템", newQ: "배냇저고리", usedQ: "배냇저고리" },
            { id: "swaddle-up", name: "스와들업", required: false, condition: "used_ok", price: "3만 ~ 6만원", reason: "속싸개 대체용, 필수는 아니지만 편하다는 후기 많음", newQ: "스와들업", usedQ: "스와들업" },
            { id: "mittens-socks", name: "손싸개/발싸개", required: true, condition: "used_ok", price: "세트 1만원대", reason: "세탁 후 사용 무방", newQ: "신생아 손싸개 발싸개", usedQ: "손싸개 발싸개" },
            { id: "newborn-hat", name: "신생아 모자", required: false, condition: "used_ok", price: "1만원대", reason: "체온 조절용, 병원/조리원에서 주는 경우도 많음", newQ: "신생아 모자", usedQ: "신생아 모자" },
          ],
        },
        {
          id: "health0",
          label: "건강/상비약",
          items: [
            { id: "fever-med", name: "해열제(2계열)", required: true, condition: "new_ok", price: "각 5천~1만원", reason: "교차복용 대비 두 계열 준비 권장, 소모품", newQ: "유아 해열제", usedQ: null },
            { id: "diaper-rash-cream", name: "기저귀발진크림", required: true, condition: "new_ok", price: "1만~2만원", reason: "자주 쓰는 구급용품, 소모품", newQ: "기저귀발진크림", usedQ: null },
            { id: "nasal-aspirator", name: "콧물흡입기", required: true, condition: "new_ok", price: "1만~5만원", reason: "위생상 새것 권장, 전동식은 사용 편의성 높음", newQ: "콧물흡입기", usedQ: null },
            { id: "hygrothermometer", name: "온습도계", required: false, condition: "used_ok", price: "1만~2만원", reason: "적정 실내온도(20~22도)·습도(40~60%) 확인용", newQ: "온습도계", usedQ: "온습도계" },
          ],
        },
        {
          id: "not-recommended-0",
          label: "구매 비추천",
          items: [
            { id: "bumper-guard", name: "침대 범퍼가드", required: false, condition: "not_recommended", price: "-", reason: "질식·끼임 위험으로 미국소아과학회(AAP)가 사용을 권고하지 않음", newQ: null, usedQ: null },
            { id: "newborn-pillow", name: "신생아 베개/옆잠쿠션", required: false, condition: "not_recommended", price: "-", reason: "영아돌연사증후군(SIDS) 위험으로 비권장", newQ: null, usedQ: null },
            { id: "wipe-warmer", name: "물티슈워머", required: false, condition: "not_recommended", price: "-", reason: "실사용 후기에서 자주 '돈 아까운 템'으로 꼽힘", newQ: null, usedQ: null },
            { id: "bottle-warmer", name: "젖병워머", required: false, condition: "not_recommended", price: "-", reason: "전자레인지·중탕으로 대체 가능, 실사용 후기에서 비추천 많음", newQ: null, usedQ: null },
          ],
        },
        {
          id: "safety",
          label: "안전",
          items: [
            { id: "carseat", name: "카시트", required: true, condition: "new_strong", price: "15만 ~ 50만원", reason: "사고이력 확인 불가, 제조 6년 이내만 사용 권장", newQ: "신생아 카시트", usedQ: null },
            { id: "monitor", name: "아기모니터", required: false, condition: "used_ok", price: "5만 ~ 15만원", reason: "전자기기, 작동 확인 필수", newQ: "아기모니터", usedQ: "아기모니터" },
            { id: "bed-guard", name: "베드가드", required: false, note: "성인 침대 같이 쓸 경우", condition: "used_ok", price: "2만~5만원", reason: "침대에서 떨어짐 방지, 고정 상태만 확인되면 중고 무방", newQ: "베드가드", usedQ: "베드가드" },
          ],
        },
      ],
    },
    {
      id: "1-3m",
      label: "1~3개월",
      sub: "성장기",
      categories: [
        {
          id: "sleep1",
          label: "수면",
          items: [
            { id: "sleep-sack", name: "수면조끼(슬립색)", required: true, note: "뒤집기 시작(보통 2~4개월)하면 속싸개 대신 필수 전환", condition: "new_ok", price: "2만~4만원", reason: "뒤집기 시작 후에도 속싸개를 계속 쓰면 질식 위험이 있어, 팔이 자유로운 수면조끼로 전환 필요", newQ: "아기 수면조끼", usedQ: "수면조끼" },
          ],
        },
        {
          id: "outing",
          label: "외출",
          items: [
            { id: "stroller", name: "유모차", required: true, condition: "used_ok", price: "20만 ~ 80만원", reason: "바퀴·브레이크·프레임 뒤틀림 확인", newQ: "신생아 유모차", usedQ: "유모차" },
            { id: "carrier", name: "아기띠(신생아용)", required: true, condition: "used_ok", price: "5만 ~ 15만원", reason: "버클·봉제 상태 확인, 세탁 후 사용", newQ: "신생아 아기띠", usedQ: "아기띠" },
            { id: "diaper-bag", name: "기저귀가방", required: false, condition: "used_ok", price: "3만 ~ 10만원", reason: "가방 형태만 괜찮으면 중고도 무방", newQ: "기저귀가방", usedQ: "기저귀가방" },
            { id: "car-mirror", name: "카시트 후방거울", required: false, condition: "used_ok", price: "1만~2만원", reason: "뒷좌석 카시트 아기 확인용", newQ: "카시트 후방거울", usedQ: "카시트 후방거울" },
            { id: "stroller-net", name: "유모차 방충망", required: false, condition: "new_consumable", price: "1만~2만원", reason: "계절용품, 저렴한 소모품", newQ: "유모차 방충망", usedQ: null },
          ],
        },
        {
          id: "play",
          label: "놀이",
          items: [
            { id: "bouncer", name: "바운서", required: false, condition: "used_ok", price: "5만 ~ 15만원", reason: "사용기간 짧아 중고 활용도 높음", newQ: "아기 바운서", usedQ: "바운서" },
            { id: "mobile", name: "딸랑이/모빌", required: false, condition: "used_ok", price: "1만 ~ 3만원", reason: "소독 후 사용", newQ: "아기 모빌", usedQ: "모빌" },
            { id: "flat-head-pillow", name: "짱구베개", required: false, note: "목 가누기 시작 후", condition: "used_ok", price: "1만 ~ 3만원", reason: "두상 관리용, 3~6개월경 사용하는 경우가 많음", newQ: "짱구베개", usedQ: "짱구베개" },
            { id: "tummy-mat", name: "터미타임 매트", required: false, note: "생후 2개월경부터", condition: "used_ok", price: "3만~8만원", reason: "엎드려 놀기 연습용, 목·어깨 근력 발달에 도움", newQ: "터미타임 매트", usedQ: "터미타임 매트" },
          ],
        },
        {
          id: "hygiene1",
          label: "위생",
          items: [
            { id: "lotion", name: "아기로션/바디워시", required: true, condition: "new_ok", price: "세트 2만~4만원", reason: "피부 자극 적은 저자극 제품 권장, 소모품", newQ: "아기 로션 바디워시", usedQ: null },
            { id: "hairbrush", name: "헤어브러시/빗", required: false, condition: "used_ok", price: "5천~1만원", reason: "소독 후 사용 가능", newQ: "아기 헤어브러시", usedQ: "아기 헤어브러시" },
            { id: "nail-file", name: "손톱줄(에머리보드)", required: false, condition: "new_ok", price: "5천원 미만", reason: "가위보다 안전하게 다듬을 수 있음", newQ: "아기 손톱줄", usedQ: null },
          ],
        },
        {
          id: "clothing1",
          label: "의류",
          items: [
            { id: "bodysuit", name: "우주복(60~70)", required: true, condition: "used_ok", price: "개당 1만원대", reason: "빠른 성장으로 새것 낭비", newQ: "아기 우주복 60 70", usedQ: "아기옷 60 70" },
            { id: "socks", name: "양말", required: false, condition: "used_ok", price: "세트 1만원대", reason: "세탁 후 사용 무방", newQ: "아기 양말", usedQ: "아기 양말" },
          ],
        },
        {
          id: "not-recommended-1",
          label: "구매 비추천",
          items: [
            { id: "baby-shoes", name: "아기 신발(보행 전)", required: false, condition: "not_recommended", price: "-", reason: "아직 걷지 않는 시기라 발 성장에 방해될 수 있어 불필요, 양말이면 충분", newQ: null, usedQ: null },
          ],
        },
      ],
    },
    {
      id: "3-6m",
      label: "3~6개월",
      sub: "이유식 준비기",
      categories: [
        {
          id: "solid",
          label: "이유식 (보통 6개월부터, 분유수유아는 4~6개월부터 시작 가능)",
          items: [
            { id: "highchair", name: "하이체어", required: true, note: "이유식 시작 시 필요, 미리 사둘 필요는 없음", condition: "used_ok", price: "10만 ~ 30만원", reason: "벨트·잠금장치 작동 확인, 목 가누고 앉기 시작한 후 사용", newQ: "이유식 하이체어", usedQ: "하이체어" },
            { id: "tools", name: "이유식 조리도구", required: true, note: "이유식 시작 1~2주 전 준비", condition: "used_ok", price: "3만 ~ 8만원", reason: "세척 잘 되는 소재면 무방", newQ: "이유식 조리도구 세트", usedQ: "이유식 조리기" },
            { id: "dishes", name: "이유식 식기(실리콘)", required: true, note: "이유식 시작 1~2주 전 준비", condition: "new_strong", price: "1만 ~ 3만원", reason: "입에 직접 닿음, 마모된 실리콘 위험", newQ: "이유식 실리콘 식기", usedQ: null },
            { id: "freezer-tray", name: "이유식 냉동트레이", required: false, condition: "new_ok", price: "1만~2만원", reason: "위생상 새것 권장, 소분 보관에 유용", newQ: "이유식 냉동트레이", usedQ: null },
            { id: "feeding-apron", name: "이유식 방수앞치마", required: false, condition: "used_ok", price: "1만~2만원", reason: "놀이형 이유식(BLW) 시작하면 옷 버림 방지에 유용", newQ: "이유식 방수앞치마", usedQ: "이유식 방수앞치마" },
          ],
        },
        {
          id: "play2",
          label: "놀이",
          items: [
            { id: "bumbo", name: "범보의자", required: false, condition: "used_ok", price: "2만 ~ 4만원", reason: null, newQ: "범보의자", usedQ: "범보의자" },
            { id: "jumperoo", name: "쏘서/점퍼루", required: false, condition: "used_ok", price: "5만 ~ 15만원", reason: "사용기간 짧아 중고 최적", newQ: "쏘서 점퍼루", usedQ: "점퍼루" },
            { id: "teether", name: "치발기", required: false, condition: "new_ok", price: "5천 ~ 2만원", reason: "입에 직접 닿음, 소재 노화 우려", newQ: "치발기", usedQ: null },
            { id: "playmat", name: "플레이매트", required: false, condition: "used_ok", price: "5만 ~ 15만원", reason: "터미타임·뒤집기 연습용, 오염만 없으면 중고 무방", newQ: "플레이매트", usedQ: "플레이매트" },
          ],
        },
        {
          id: "hygiene2",
          label: "위생",
          items: [
            { id: "bib", name: "턱받이", required: true, condition: "used_ok", price: "세트 1만원대", reason: "세탁 후 사용", newQ: "이유식 턱받이", usedQ: "턱받이" },
            { id: "gum-brush", name: "잇몸 마사지 실리콘 칫솔", required: false, note: "침 흘림·잇몸 가려움 시작 시", condition: "new_ok", price: "5천~1만원", reason: "입에 직접 닿음, 새것 권장", newQ: "유아 잇몸 마사지 칫솔", usedQ: null },
          ],
        },
        {
          id: "outing2",
          label: "외출",
          items: [
            { id: "hipseat", name: "힙시트", required: false, condition: "used_ok", price: "3만 ~ 8만원", reason: "아기띠보다 짧은 외출에 편함, 세탁 후 사용", newQ: "힙시트", usedQ: "힙시트" },
          ],
        },
        {
          id: "safety2",
          label: "안전",
          items: [
            { id: "outlet-cover", name: "콘센트 안전커버", required: true, condition: "new_consumable", price: "세트 5천~1만원", reason: "뒤집기·기어다니기 전에 미리 설치하면 편함", newQ: "콘센트 안전커버", usedQ: null },
            { id: "corner-guard", name: "모서리 보호대", required: false, condition: "new_consumable", price: "세트 1만원대", reason: "가구 모서리 부딪힘 방지, 활동 반경 넓어지기 전 준비", newQ: "모서리 보호대", usedQ: null },
          ],
        },
        {
          id: "not-recommended-3",
          label: "구매 비추천",
          items: [
            { id: "walker", name: "보행기", required: false, condition: "not_recommended", price: "-", reason: "안전·발달 관련 논란으로 비권장하는 의견이 많음", newQ: null, usedQ: null },
            { id: "food-maker", name: "이유식제조기", required: false, condition: "not_recommended", price: "-", reason: "가성비 낮다는 후기 많음, 조리도구 조합으로 대체 가능", newQ: null, usedQ: null },
          ],
        },
      ],
    },
  ],
};

const CONDITION = {
  new_strong: { label: "새것 필수", cls: "bg-amber-100 text-amber-800 border-amber-200" },
  new_ok: { label: "새것 권장", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  new_consumable: { label: "소모품", cls: "bg-stone-100 text-stone-600 border-stone-200" },
  new_not_recommended: { label: "중고 비권장", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  used_ok: { label: "중고 가능", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  not_recommended: { label: "구매 비추천", cls: "bg-rose-50 text-rose-700 border-rose-200" },
};

function ConditionBadge({ condition }) {
  const c = CONDITION[condition];
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${c.cls}`}>
      {c.label}
    </span>
  );
}

function Ruler({ stages, selected, onSelect }) {
  return (
    <div className="flex flex-col gap-0">
      {stages.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`text-left flex items-center gap-4 py-4 px-4 border-l-4 transition-colors ${
            selected === s.id
              ? "border-emerald-600 bg-emerald-50"
              : "border-stone-200 hover:bg-stone-50"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
              selected === s.id ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-600"
            }`}
          >
            {i + 1}
          </div>
          <div>
            <div className="font-semibold text-stone-800">{s.label}</div>
            <div className="text-sm text-stone-500">{s.sub}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function BabyChecklistApp() {
  const [screen, setScreen] = useState("landing");
  const [stageId, setStageId] = useState(null);
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [requiredOnly, setRequiredOnly] = useState(false);
  const [collapsedCats, setCollapsedCats] = useState({});

  const stage = useMemo(() => DATA.stages.find((s) => s.id === stageId), [stageId]);

  const allItems = useMemo(() => {
    if (!stage) return [];
    return stage.categories.flatMap((c) => c.items.map((it) => ({ ...it, cat: c.label })));
  }, [stage]);

  const toggleCheck = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleCat = (id) =>
    setCollapsedCats((prev) => ({ ...prev, [id]: !prev[id] }));

  const coupangUrl = (q) => `https://www.coupang.com/np/search?q=${encodeURIComponent(q)}`;
  const daangnUrl = (q) => `https://www.daangn.com/kr/buy-sell/?in=&search=${encodeURIComponent(q)}`;

  return (
    <div className="w-full min-h-[600px] bg-stone-50 text-stone-800 font-sans">
      {screen === "landing" && (
        <div className="flex flex-col items-center justify-center min-h-[600px] px-8 py-16 text-center">
          <div className="mb-8 flex items-end gap-1" aria-hidden="true">
            {[24, 34, 44, 54].map((h, i) => (
              <div
                key={i}
                className="w-3 bg-emerald-600 rounded-t"
                style={{ height: `${h}px`, opacity: 0.4 + i * 0.2 }}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-emerald-700 tracking-wide mb-3">
            월령별 준비물 가이드
          </p>
          <h1 className="text-3xl font-bold text-stone-900 mb-4 leading-snug">
            우리 아기,
            <br />
            이번 달엔 뭐가 필요할까?
          </h1>
          <p className="text-stone-500 mb-10 max-w-xs leading-relaxed">
            새것으로 사야 할 것과 중고로 사도 되는 것을 구분해서 알려드려요.
          </p>
          <button
            onClick={() => setScreen("stage")}
            className="bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            월령 선택하고 시작하기 <ChevronRight size={18} />
          </button>
        </div>
      )}

      {screen === "stage" && (
        <div className="max-w-md mx-auto py-10 px-6">
          <div className="flex items-center gap-2 mb-2 text-emerald-700">
            <Sprout size={20} />
            <span className="text-sm font-medium">성장 기록표</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-6">아기가 몇 개월인가요?</h2>
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
            <Ruler
              stages={DATA.stages}
              selected={stageId}
              onSelect={(id) => {
                setStageId(id);
                setScreen("checklist");
                const target = DATA.stages.find((s) => s.id === id);
                if (target) {
                  const initial = {};
                  target.categories.forEach((cat, i) => {
                    initial[cat.id] = i !== 0; // 첫 카테고리만 펼침
                  });
                  setCollapsedCats(initial);
                }
              }}
            />
          </div>
        </div>
      )}

      {screen === "checklist" && stage && (
        <div className="max-w-md mx-auto py-8 px-6">
          <button
            onClick={() => setScreen("stage")}
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 mb-4"
          >
            <ArrowLeft size={16} /> 월령 다시 선택
          </button>
          <h2 className="text-xl font-bold text-stone-900 mb-1">
            {stage.label} <span className="text-stone-400 font-normal">· {stage.sub}</span>
          </h2>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-stone-500">
              {allItems.filter((it) => checked[it.id]).length} / {allItems.length}개 준비됨
            </p>
            <button
              onClick={() => setRequiredOnly((v) => !v)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                requiredOnly
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-white border-stone-200 text-stone-500"
              }`}
            >
              필수만 보기
            </button>
          </div>

          {stage.categories.map((cat) => {
            const isNotRecCat = cat.id.startsWith("not-recommended");
            const items = requiredOnly && !isNotRecCat ? cat.items.filter((it) => it.required) : cat.items;
            if (items.length === 0) return null;
            const isCollapsed = !!collapsedCats[cat.id];
            const doneCount = items.filter((it) => checked[it.id]).length;
            return (
              <div key={cat.id} className="mb-4">
                <button
                  onClick={() => toggleCat(cat.id)}
                  className="w-full flex items-center justify-between px-1 py-2"
                >
                  <h3 className="text-sm font-semibold text-stone-500">{cat.label}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">
                      {doneCount}/{items.length}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-stone-400 transition-transform ${
                        isCollapsed ? "" : "rotate-180"
                      }`}
                    />
                  </div>
                </button>
                {!isCollapsed && (
                  <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100">
                    {items.map((it) => (
                      <div key={it.id}>
                        <div className="flex items-start gap-3 p-4">
                          <button
                            onClick={() => toggleCheck(it.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                              checked[it.id]
                                ? "bg-emerald-600 border-emerald-600"
                                : "border-stone-300"
                            }`}
                            aria-label="이미 있음으로 표시"
                          >
                            {checked[it.id] && <Check size={14} className="text-white" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div
                              className="flex items-center gap-2 flex-wrap cursor-pointer"
                              onClick={() => setExpanded(expanded === it.id ? null : it.id)}
                            >
                              <span
                                className={`font-medium ${
                                  checked[it.id] ? "text-stone-400 line-through" : "text-stone-800"
                                }`}
                              >
                                {it.name}
                              </span>
                              {it.required && (
                                <span className="text-xs text-rose-600 font-medium">필수</span>
                              )}
                              <ConditionBadge condition={it.condition} />
                            </div>
                            {it.note && <p className="text-xs text-stone-400 mt-1">{it.note}</p>}

                            {expanded === it.id && (
                              <div className="mt-3 pt-3 border-t border-stone-100 text-sm">
                                {it.reason && <p className="text-stone-500 mb-1">{it.reason}</p>}
                                <p className="text-stone-400 mb-3">시세: {it.price}</p>
                                <div className="flex gap-2 flex-wrap">
                                  {it.newQ && (
                                  <a
                                    href={coupangUrl(it.newQ)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-amber-100"
                                  >
                                    새것 구매 <ExternalLink size={12} />
                                  </a>
                                  )}
                                  {it.usedQ && (
                                    <a
                                      href={daangnUrl(it.usedQ)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-emerald-100"
                                    >
                                      중고 찾기 <ExternalLink size={12} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => setExpanded(expanded === it.id ? null : it.id)}
                            className="text-stone-300 mt-1"
                            aria-label="자세히 보기"
                          >
                            <ChevronDown
                              size={18}
                              className={`transition-transform ${
                                expanded === it.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={() => setScreen("summary")}
            className="w-full bg-stone-800 text-white font-semibold py-3 rounded-lg mt-2 hover:bg-stone-900 transition-colors"
          >
            아직 없는 것만 모아보기
          </button>
        </div>
      )}

      {screen === "summary" && stage && (
        <div className="max-w-md mx-auto py-8 px-6">
          <button
            onClick={() => setScreen("checklist")}
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 mb-4"
          >
            <ArrowLeft size={16} /> 전체 목록으로
          </button>
          <h2 className="text-xl font-bold text-stone-900 mb-1">아직 준비 안 된 것</h2>
          <p className="text-sm text-stone-500 mb-6">
            {stage.label} · {allItems.filter((it) => !checked[it.id]).length}개 남음
          </p>
          <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100">
            {allItems
              .filter((it) => !checked[it.id])
              .map((it) => (
                <div key={it.id} className="flex items-center gap-3 p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-stone-800">{it.name}</span>
                      <ConditionBadge condition={it.condition} />
                    </div>
                    <p className="text-xs text-stone-400 mt-1">{it.cat} · {it.price}</p>
                  </div>
                </div>
              ))}
            {allItems.filter((it) => !checked[it.id]).length === 0 && (
              <div className="p-8 text-center text-stone-400 text-sm">
                모두 준비됐어요. 다음 달을 확인해보세요.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronRight, Check, ExternalLink, ArrowLeft, Sprout } from "lucide-react";
import { track } from "@vercel/analytics";

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
            { id: "formula-case", name: "분유케이스(외출용)", required: false, condition: "used_ok", price: "1만~2만원", reason: "외출 시 1회분씩 소분 휴대용, 세척 후 사용 무방", newQ: "분유케이스", usedQ: "분유케이스" },
            { id: "bottle-brush", name: "젖병솔/세정제", required: true, condition: "new_consumable", price: "1만원대", reason: "위생용품, 소모품", newQ: "젖병솔 세정제", usedQ: null },
            { id: "nursing-pillow", name: "수유쿠션", required: false, condition: "used_ok", price: "2만 ~ 5만원", reason: "커버만 새로 세탁하면 OK", newQ: "수유쿠션", usedQ: "수유쿠션" },
            { id: "burp-cloth", name: "가제/엠보 손수건", required: true, condition: "new_ok", price: "세트 1만~2만원대", reason: "다다익선 아이템, 거즈 30~40장+엠보 20~30장 정도는 준비하는 경우가 많음", newQ: "가제손수건 세트", usedQ: null },
            { id: "bottle-sterilizer", name: "젖병소독기(스팀 또는 UV 방식)", required: false, condition: "used_ok", price: "5만 ~ 15만원", reason: "스팀 방식은 전자기기, 작동만 확인되면 무방. UV 방식도 환경호르몬 우려는 근거가 약하다고 알려져 있으며, 반복 노출 시 소재 변색 정도만 참고하면 됨. 냄비 열탕소독으로도 대체 가능", newQ: "젖병소독기", usedQ: "젖병소독기" },
            { id: "night-light", name: "수유등", required: false, condition: "used_ok", price: "1만~3만원", reason: "밤중 수유·기저귀 교체 시 은은한 조명용", newQ: "수유등", usedQ: "수유등" },
            { id: "bottle-rack", name: "젖병건조대", required: false, condition: "used_ok", price: "1만~2만원", reason: "세척만 잘 되면 무방", newQ: "젖병건조대", usedQ: "젖병건조대" },
          ],
        },
        {
          id: "sleep",
          label: "수면",
          items: [
            { id: "crib", name: "아기침대/요람 프레임", required: true, condition: "used_ok", price: "10만 ~ 30만원", reason: "구조 안전(간격 6cm 이내) 확인", newQ: "아기침대", usedQ: "아기침대" },
            { id: "mattress", name: "매트리스", required: true, condition: "new_strong", price: "5만 ~ 15만원", reason: "대한소아청소년과학회 권고상 단단한 매트리스가 SIDS 예방에 중요, 중고는 처짐 정도 확인이 어려움", newQ: "아기 매트리스", usedQ: null },
            { id: "pacifier", name: "공갈젖꼭지", required: false, note: "모유수유 익숙해진 생후 1개월부터", condition: "new_strong", price: "5천~1만원", reason: "대한소아청소년과학회 권고상 SIDS 예방에 도움, 입에 직접 닿아 새것 필수", newQ: "공갈젖꼭지", usedQ: null },
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
            { id: "nail-scissors", name: "신생아 손톱가위", required: true, note: "생후 1~2주부터 첫 손질 필요", condition: "new_ok", price: "5천~1만원", reason: "신생아 손톱은 빠르게 자라 날카로워지고 얼굴을 긁을 수 있어 위생상 새것 권장", newQ: "신생아 손톱가위", usedQ: null },
            { id: "lotion", name: "아기로션/바디워시", required: true, condition: "new_ok", price: "세트 2만~4만원", reason: "피부 자극 적은 저자극 제품 권장, 소모품", newQ: "아기 로션 바디워시", usedQ: null },
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
          id: "play0",
          label: "놀이",
          items: [
            { id: "bw-book", name: "흑백/고대비 그림책", required: false, note: "신생아 때부터 사용 가능", condition: "used_ok", price: "1만~2만원", reason: "신생아는 초점이 흐릿해 고대비 패턴에 더 잘 반응, 생후 1~3개월경 시각 발달에 특히 활용도 높음. 오염만 없으면 중고 무방", newQ: "흑백 그림책 신생아", usedQ: "흑백 그림책" },
          ],
        },
        {
          id: "not-recommended-0",
          label: "구매 비추천",
          items: [
            { id: "newborn-pillow", name: "신생아 베개/옆잠쿠션", required: false, condition: "not_recommended", price: "1만 ~ 2만원", reason: "영아돌연사증후군(SIDS) 위험으로 비권장", newQ: null, usedQ: null },
            { id: "carseat-accessory", name: "카시트 애프터마켓 액세서리(장식 스트랩커버 등)", required: false, condition: "not_recommended", price: "1만~3만원", reason: "제조사 크래시테스트를 거치지 않은 비순정 액세서리는 충돌 시 안전성이 검증되지 않아 카시트 제조사 대부분이 비권장", newQ: null, usedQ: null },
            { id: "wipe-warmer", name: "물티슈워머", required: false, condition: "not_recommended", price: "3만 ~ 6만원", reason: "작동 온도 자체는 무해하지만, 보존력이 약한 제품·관리 소홀 시 세균 번식 가능성이 있어 청소·물 교체가 필요", newQ: null, usedQ: null },
            { id: "bottle-warmer", name: "젖병워머", required: false, condition: "not_recommended", price: "2만 ~ 4만원", reason: "전자레인지·중탕으로 대체 가능, 실사용 후기에서 비추천 많음", newQ: null, usedQ: null },
          ],
        },
        {
          id: "safety",
          label: "안전",
          items: [
            { id: "carseat", name: "카시트", required: true, condition: "new_strong", price: "15만 ~ 50만원", reason: "사고이력·미세균열 확인 불가, 제조일 기준 보통 5~6년 지나면 소재 노후화로 교체 권장", newQ: "신생아 카시트", usedQ: null },
            { id: "carseat-blanket", name: "카시트 전용 무릎담요", required: false, condition: "used_ok", price: "2만~4만원", reason: "겨울철 카시트에서 두꺼운 패딩·우주복을 입히는 대신, 얇은 옷을 입히고 하네스를 채운 뒤 위에 덮는 용도로 권장됨", newQ: "카시트 무릎담요", usedQ: "카시트 담요" },
            { id: "monitor", name: "아기모니터", required: false, condition: "used_ok", price: "5만 ~ 15만원", reason: "전자기기, 작동 확인 필수", newQ: "아기모니터", usedQ: "아기모니터" },
            { id: "bed-guard", name: "베드가드", required: false, note: "성인 침대 같이 쓸 경우", condition: "used_ok", price: "2만~5만원", reason: "침대에서 떨어짐 방지, 고정 상태만 확인되면 중고 무방", newQ: "베드가드", usedQ: "베드가드" },
          ],
        },
        {
          id: "outing0",
          label: "외출",
          items: [
            { id: "carrier", name: "아기띠(신생아용)", required: true, condition: "used_ok", price: "5만 ~ 15만원", reason: "병원 진료·예방접종 등으로 이른 시기부터 외출이 필요할 수 있음. 버클·봉제 상태 확인, 세탁 후 사용", newQ: "신생아 아기띠", usedQ: "아기띠" },
            { id: "car-mirror", name: "카시트 후방거울", required: false, condition: "used_ok", price: "1만~2만원", reason: "카시트를 쓰기 시작하는 시점(퇴원길)부터 함께 필요, 뒷좌석 카시트 아기 확인용", newQ: "카시트 후방거울", usedQ: "카시트 후방거울" },
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
            { id: "diaper-bag", name: "기저귀가방", required: false, condition: "used_ok", price: "3만 ~ 10만원", reason: "가방 형태만 괜찮으면 중고도 무방", newQ: "기저귀가방", usedQ: "기저귀가방" },
            { id: "stroller-net", name: "유모차 방충망", required: false, condition: "new_consumable", price: "1만~2만원", reason: "계절용품, 저렴한 소모품", newQ: "유모차 방충망", usedQ: null },
          ],
        },
        {
          id: "play",
          label: "놀이",
          items: [
            { id: "bouncer", name: "바운서", required: false, condition: "used_ok", price: "5만 ~ 15만원", reason: "사용기간 짧아 중고 활용도 높음", newQ: "아기 바운서", usedQ: "바운서" },
            { id: "mobile", name: "딸랑이/모빌", required: false, condition: "used_ok", price: "1만 ~ 3만원", reason: "소독 후 사용", newQ: "아기 모빌", usedQ: "모빌" },
            { id: "tummy-mat", name: "터미타임 매트", required: false, note: "터미타임 자체는 생후 1~2주부터 짧게(1~2분) 시작 가능, 매트는 목을 좀 더 가누는 시기부터 활용도 높음", condition: "used_ok", price: "3만~8만원", reason: "엎드려 놀기 연습용, 목·어깨 근력 발달에 도움. 초기엔 매트 없이 보호자 가슴 위에서 시작해도 됨", newQ: "터미타임 매트", usedQ: "터미타임 매트" },
          ],
        },
        {
          id: "hygiene1",
          label: "위생",
          items: [
            { id: "hairbrush", name: "헤어브러시/빗", required: false, condition: "used_ok", price: "5천~1만원", reason: "소독 후 사용 가능", newQ: "아기 헤어브러시", usedQ: "아기 헤어브러시" },
            { id: "nail-file", name: "손톱줄(에머리보드)", required: false, condition: "new_ok", price: "5천원 미만", reason: "가위보다 안전하게 다듬을 수 있음, 손톱가위에 익숙해진 후 대체용으로도 활용", newQ: "아기 손톱줄", usedQ: null },
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
            { id: "baby-shoes", name: "아기 신발(보행 전)", required: false, condition: "not_recommended", price: "1만 ~ 3만원", reason: "아직 걷지 않는 시기라 발 성장에 방해될 수 있어 불필요, 양말이면 충분", newQ: null, usedQ: null },
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
            { id: "flat-head-pillow", name: "짱구베개", required: false, note: "목 가누기 안정된 후", condition: "used_ok", price: "1만 ~ 3만원", reason: "두상 관리용, 3~6개월경 사용하는 경우가 많음", newQ: "짱구베개", usedQ: "짱구베개" },
          ],
        },
        {
          id: "hygiene2",
          label: "위생",
          items: [
            { id: "bib", name: "턱받이", required: true, condition: "used_ok", price: "세트 1만원대", reason: "세탁 후 사용", newQ: "이유식 턱받이", usedQ: "턱받이" },
            { id: "sippy-cup", name: "물컵/빨대컵", required: false, note: "6개월 근접 시", condition: "new_ok", price: "1만~2만원", reason: "입에 직접 닿음, 새것 권장", newQ: "아기 빨대컵", usedQ: null },
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
            { id: "safety-gate", name: "안전문(주방/계단)", required: false, note: "기어다니기 시작 전 미리 준비하면 편함", condition: "used_ok", price: "3만 ~ 8만원", reason: "고정 상태만 확인되면 중고 무방", newQ: "안전문", usedQ: "안전문" },
          ],
        },
        {
          id: "not-recommended-3",
          label: "구매 비추천",
          items: [
            { id: "walker", name: "보행기", required: false, condition: "not_recommended", price: "5만 ~ 10만원", reason: "안전·발달 관련 논란으로 비권장하는 의견이 많음", newQ: null, usedQ: null },
            { id: "food-maker", name: "이유식제조기", required: false, condition: "not_recommended", price: "5만 ~ 15만원", reason: "가성비 낮다는 후기 많음, 조리도구 조합으로 대체 가능", newQ: null, usedQ: null },
            { id: "teething-gel", name: "이앓이젤(벤조카인 성분)", required: false, condition: "not_recommended", price: "5천~1만원", reason: "메트헤모글로빈혈증 위험으로 식약처가 24개월 미만 영아 사용을 금지함", newQ: null, usedQ: null },
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

// 컴포넌트 바깥에 정의: 렌더링마다 다시 생성될 필요 없는 순수 함수/상수
const STORAGE_KEY = "baby-checklist-state-v1";
const coupangUrl = (q) => `https://www.coupang.com/np/search?q=${encodeURIComponent(q)}`;
const daangnUrl = (q) => `https://www.daangn.com/kr/buy-sell/?in=&search=${encodeURIComponent(q)}`;

export default function BabyChecklistApp() {
  const [screen, setScreen] = useState("landing");
  const [stageId, setStageId] = useState(null);
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [requiredOnly, setRequiredOnly] = useState(false);
  const [collapsedCats, setCollapsedCats] = useState({});
  const [loaded, setLoaded] = useState(false);

  // 처음 열릴 때 저장된 상태 불러오기
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.checked) setChecked(saved.checked);
      }
    } catch (e) {
      // 저장된 데이터가 없거나 읽기 실패 시 그냥 빈 상태로 시작
    }
    setLoaded(true);
  }, []);

  // 체크 상태가 바뀔 때마다 저장 (최초 로딩 전에는 덮어쓰지 않도록 방지)
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ checked }));
    } catch (e) {
      // 저장 실패해도 앱 사용에는 지장 없도록 무시
    }
  }, [checked, loaded]);

  const stage = useMemo(() => DATA.stages.find((s) => s.id === stageId), [stageId]);

  const allItems = useMemo(() => {
    if (!stage) return [];
    return stage.categories.flatMap((c) => c.items.map((it) => ({ ...it, cat: c.label })));
  }, [stage]);

  const toggleCheck = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleCat = (id) =>
    setCollapsedCats((prev) => ({ ...prev, [id]: !prev[id] }));

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
                track("stage_selected", { stage: id });
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
                                    onClick={() => track("click_buy_new", { item: it.id })}
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
                                      onClick={() => track("click_find_used", { item: it.id })}
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
          <button
            onClick={() => {
              if (window.confirm("체크한 내용을 모두 초기화할까요?")) {
                setChecked({});
              }
            }}
            className="w-full text-center text-xs text-stone-400 mt-6 hover:text-stone-600"
          >
            체크 내용 초기화
          </button>
        </div>
      )}
    </div>
  );
}

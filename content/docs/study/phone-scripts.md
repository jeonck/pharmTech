---
title: "전화 응대 스크립트"
weight: 7
---

전화는 표정도 손짓도 없이 **소리만으로** 처리해야 해서 카운터보다 어렵습니다. 대신 상황이 정해져 있어서 스크립트를 외워두면 그대로 굴러갑니다.

{{< callout type="warning" >}}
전화로 **처방 내용을 받아 적는 일(구두 처방 접수)은 약사의 업무**입니다. 테크니션은 리필 요청 접수, 상태 확인, 연결까지만 합니다. 처방자가 새 처방을 불러 주려 하면 약사에게 넘기세요.
{{< /callout >}}

## 1. 전화 받기

```text
"Thank you for calling [약국 이름] Pharmacy, this is [이름] speaking.
 How can I help you?"
```

| 상황 | 문장 |
|---|---|
| 대기 요청 | "Can you hold for just a moment, please?" |
| 대기 후 복귀 | "Thank you for holding." |
| 오래 걸릴 때 | "This is going to take a few minutes. Can I call you back?" |
| 번호 확인 | "What's the best number to reach you?" |
| 잘 안 들릴 때 | "I'm having a hard time hearing you — could you speak up a little?" |
| 다시 말해 달라 | "I'm sorry, could you repeat that?" |
| 철자 요청 | "Could you spell the last name for me?" |

## 2. 환자 확인 (HIPAA)

전화로는 상대가 누구인지 볼 수 없으므로 **확인 절차가 더 중요합니다.**

```text
"Before we go any further, can I get the patient's full name and date of birth?"
"And can you verify the address we have on file?"
```

| 상황 | 문장 |
|---|---|
| 본인 아님 | "Are you calling on behalf of the patient?" |
| 정보 제공 불가 | "I'm not able to share that information without the patient's permission." |
| 확인 실패 | "That doesn't match what we have on file. Can you double-check the date of birth?" |

## 3. 리필 요청 접수

가장 자주 받는 전화입니다.

```text
환자: "Hi, I need to refill my blood pressure medication."

테크: "Sure, I can help with that. Can I get your name and date of birth?"
      "Thank you. And which medication is it?"
      "Let me pull that up... Okay, I see lisinopril 10 milligrams.
       Is that the one?"
      "You have two refills left. I can have it ready by three o'clock today."
      "We'll send you a text when it's ready. Anything else?"
```

| 상황 | 문장 |
|---|---|
| 약 이름을 모를 때 | "Do you know what it's for? Blood pressure, cholesterol?" |
| 여러 개 | "Would you like me to refill all of them?" |
| 리필 없음 | "That one's out of refills. I'll send a request to Dr. Lee's office today." |
| 처방자 응답 대기 | "Once they respond, we'll fill it and let you know." |
| 규제약물 | "For that medication we can't request a refill — you'll need a new prescription from your doctor." |
| 너무 이름 | "Your insurance won't cover it until the 20th. Do you want me to fill it then?" |

## 4. 상태 확인 전화

| 상황 | 문장 |
|---|---|
| 준비 완료 | "Yes, that's ready for pickup whenever you can come by." |
| 조제 중 | "It's in process right now — about twenty minutes." |
| 보험 대기 | "We're waiting on your insurance. I'll call you as soon as we hear back." |
| PA 대기 | "Your doctor's office is working on the prior authorization. We haven't heard back yet." |
| 처방 미도착 | "We haven't received anything from your doctor yet. Would you like me to call them?" |

## 5. 처방자 사무실에 거는 전화

리필 요청을 팩스가 아니라 전화로 해야 할 때가 있습니다.

```text
"Hi, this is [이름] calling from [약국 이름] Pharmacy.
 I'm calling about a refill request for a patient.

 Patient name is Maria Garcia, date of birth 03/14/1968.
 The medication is metformin 500 milligrams, twice daily.
 Her last fill was on August 2nd and she's out of refills.

 Could you have Dr. Kim authorize a refill when she gets a chance?
 Our fax number is 713-555-0198. Thank you."
```

**말하는 순서를 고정하세요**: 소속 → 용건 → 환자(이름·생년월일) → 약(이름·규격·용법) → 마지막 조제일 → 요청 → 연락처.

| 상황 | 문장 |
|---|---|
| 담당자 연결 요청 | "Could I speak with someone about a refill request?" |
| 음성사서함 | "This is [이름] from [약국] Pharmacy calling about a refill for..." |
| 처방 확인 | "We received a prescription and just want to verify the directions." |
| 재촉 | "We sent a request on Monday and haven't heard back. The patient is out of medication." |
| 감사 인사 | "Great, thank you so much for your help." |

{{< callout type="error" >}}
처방자 측에서 **새 처방이나 용법 변경을 구두로 불러 주려 하면** 받아 적지 말고 "Let me get the pharmacist for you"라고 한 뒤 넘기세요. 규제약물이면 더욱 그렇습니다.
{{< /callout >}}

## 6. 보험사에 거는 전화

```text
"Hi, I'm calling from [약국 이름] Pharmacy, NPI [번호].
 I have a rejection on a claim and need some help.

 Member ID is [번호], date of birth [날짜].
 The rejection says 'prior authorization required' for [약 이름].
 Can you tell me what the plan needs?"
```

| 상황 | 문장 |
|---|---|
| 거절 사유 확인 | "Can you tell me why this claim is rejecting?" |
| 처리 가능 여부 | "Is there an override we can run for this?" |
| 대체 약 확인 | "What's the preferred alternative on this plan?" |
| 수량 제한 | "What's the quantity limit for this drug?" |
| 참조 번호 | "Can I get a reference number for this call?" |

{{< callout type="info" >}}
보험사 통화는 **참조 번호(reference number)를 반드시 받아 적으세요.** 나중에 같은 건으로 다시 걸었을 때 처음부터 설명하지 않아도 됩니다.
{{< /callout >}}

## 7. 숫자와 이름을 정확히 전달하기

전화에서 사고가 나는 지점은 대부분 숫자와 철자입니다.

**숫자는 한 자리씩 부른 뒤 전체를 말합니다.**

```text
"Fifty milligrams — that's five, zero."
"Fifteen, one-five, not fifty."
```

**철자는 단어로 확인합니다.**

| 글자 | 단어 | 글자 | 단어 |
|---|---|---|---|
| B | Bravo / Boy | M | Mike |
| C | Charlie | N | November / Nancy |
| D | Delta / David | P | Papa / Peter |
| E | Echo | S | Sierra / Sam |
| F | Foxtrot / Frank | T | Tango / Tom |
| G | Golf | V | Victor |

> "That's Levetiracetam — L as in Lima, E, V as in Victor..."

**복창(read-back)은 통화의 마지막 절차입니다.**

```text
"Let me read that back to you: metformin 500 milligrams,
 one tablet by mouth twice daily with meals, quantity 60, two refills. Correct?"
```

## 8. 통화를 끝내는 문장

| 상황 | 문장 |
|---|---|
| 마무리 | "Is there anything else I can help you with?" |
| 감사 | "Thank you for calling. Have a good day." |
| 다시 연락 약속 | "I'll call you back as soon as I hear something." |
| 잘못 걸린 전화 | "I think you have the wrong number, but let me give you the right one." |

## 9. 연습 방법

1. **소리 내어 읽으세요.** 눈으로만 보면 전화에서 입이 안 떨어집니다.
2. 스크립트 세 개(리필 접수, 상태 확인, 처방자 통화)를 **보지 않고** 말할 수 있을 때까지 반복합니다.
3. 숫자 복창은 매일 다섯 개씩 연습하세요. `15/50`, `13/30`, `16/60`이 가장 자주 헷갈립니다.
4. 실제 근무에서는 **메모 양식을 미리 그려 두세요** — 이름, 생년월일, 약, 규격, 용법, 콜백 번호 칸.

## 다음

{{< cards >}}
  {{< card link="../talk-play/" title="회화 문장 플레이" subtitle="롤플레이로 통화 연습" >}}
  {{< card link="../patient-phrases/" title="환자 응대 문장" subtitle="카운터에서 쓰는 문장" >}}
  {{< card link="../order-entry/" title="처방 입력·처리" subtitle="보험 거절 코드의 의미" >}}
  {{< card link="../reading/" title="처방 읽는 법" subtitle="숫자·철자 읽기 규칙" >}}
{{< /cards >}}

{{< pagedone >}}

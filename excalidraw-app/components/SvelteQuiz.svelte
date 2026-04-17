<script lang="ts">
  type Question = {
    question: string;
    options: string[];
    answer: number;
  };

  const QUESTIONS: Question[] = [
    {
      question: "Màu nào được tạo ra khi pha trộn Đỏ và Vàng?",
      options: ["Xanh lá", "Cam", "Tím", "Nâu"],
      answer: 1,
    },
    {
      question: "Màu nào đối diện với Đỏ trên vòng tròn màu sắc?",
      options: ["Xanh lam", "Xanh lá (Cyan)", "Vàng", "Tím"],
      answer: 1,
    },
    {
      question: "CMYK là viết tắt của?",
      options: [
        "Cyan, Magenta, Yellow, Key (Black)",
        "Color, Mix, Yellow, Key",
        "Cyan, Mix, Yellow, Khaki",
        "Color, Magenta, Yellow, Khaki",
      ],
      answer: 0,
    },
    {
      question: "Giá trị hex của màu trắng thuần là?",
      options: ["#000000", "#FFFFFF", "#EEEEEE", "#F0F0F0"],
      answer: 1,
    },
    {
      question: "Màu nào có bước sóng dài nhất trong quang phổ ánh sáng?",
      options: ["Tím", "Xanh lam", "Xanh lá", "Đỏ"],
      answer: 3,
    },
  ];

  let currentIndex = 0;
  let selectedOption: number | null = null;
  let answered = false;
  let score = 0;
  let finished = false;

  $: question = QUESTIONS[currentIndex];
  $: isLast = currentIndex === QUESTIONS.length - 1;

  function handleSelect(idx: number) {
    if (answered) return;
    selectedOption = idx;
    answered = true;
    if (idx === question.answer) {
      score += 1;
    }
  }

  function handleNext() {
    if (isLast) {
      finished = true;
    } else {
      currentIndex += 1;
      selectedOption = null;
      answered = false;
    }
  }

  function handleRestart() {
    currentIndex = 0;
    selectedOption = null;
    answered = false;
    score = 0;
    finished = false;
  }

  function getOptionClass(idx: number): string {
    let base = "svelte-quiz__option";
    if (!answered) {
      if (idx === selectedOption) return base + " selected";
      return base;
    }
    if (idx === question.answer) return base + " correct";
    if (idx === selectedOption) return base + " wrong";
    return base;
  }

  function getResultEmoji(): string {
    if (score === QUESTIONS.length) return "🎨";
    if (score >= QUESTIONS.length / 2) return "👏";
    return "🖌️";
  }

  function getResultMessage(): string {
    if (score === QUESTIONS.length) return "Tuyệt vời! Bạn là chuyên gia màu sắc!";
    if (score >= QUESTIONS.length / 2) return "Không tệ! Hãy tìm hiểu thêm về lý thuyết màu sắc!";
    return "Hãy khám phá thêm về màu sắc và thiết kế nhé!";
  }
</script>

<div class="svelte-quiz">
  <div class="svelte-quiz__badge">Svelte</div>
  <div class="svelte-quiz__header">Quiz Màu Sắc & Thiết Kế</div>

  {#if finished}
    <div class="svelte-quiz__result">
      <div class="svelte-quiz__result-emoji">{getResultEmoji()}</div>
      <div class="svelte-quiz__result-score">{score} / {QUESTIONS.length}</div>
      <div class="svelte-quiz__result-message">{getResultMessage()}</div>
      <button class="svelte-quiz__btn primary" on:click={handleRestart}>
        Chơi lại
      </button>
    </div>
  {:else}
    <div class="svelte-quiz__progress">
      Câu {currentIndex + 1} / {QUESTIONS.length} · Điểm: {score}
    </div>
    <div class="svelte-quiz__question">{question.question}</div>
    <div class="svelte-quiz__options">
      {#each question.options as opt, idx}
        <button
          class={getOptionClass(idx)}
          on:click={() => handleSelect(idx)}
          disabled={answered}
        >
          <span class="svelte-quiz__letter">{String.fromCharCode(65 + idx)}.</span>
          {opt}
        </button>
      {/each}
    </div>
    {#if answered}
      <div class="svelte-quiz__feedback {selectedOption === question.answer ? 'correct' : 'wrong'}">
        {#if selectedOption === question.answer}
          ✓ Chính xác!
        {:else}
          ✗ Sai rồi! Đáp án đúng: {question.options[question.answer]}
        {/if}
      </div>
      <div class="svelte-quiz__actions">
        <button class="svelte-quiz__btn primary" on:click={handleNext}>
          {isLast ? "Xem kết quả" : "Câu tiếp theo →"}
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .svelte-quiz {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.875rem;
    font-family: inherit;
  }

  .svelte-quiz__badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 99px;
    background: #ff3e00;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    width: fit-content;
  }

  .svelte-quiz__header {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .svelte-quiz__progress {
    font-size: 0.8rem;
    opacity: 0.65;
  }

  .svelte-quiz__question {
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.5;
    padding: 0.75rem;
    border-radius: 8px;
    background: rgba(128, 128, 128, 0.08);
    border: 1px solid rgba(128, 128, 128, 0.2);
  }

  .svelte-quiz__options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .svelte-quiz__option {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    border: 1.5px solid rgba(128, 128, 128, 0.25);
    background: transparent;
    cursor: pointer;
    font-size: 0.875rem;
    text-align: left;
    transition: border-color 0.15s, background 0.15s;
    font-family: inherit;
  }

  .svelte-quiz__option:hover:not(:disabled) {
    border-color: #ff3e00;
    background: rgba(255, 62, 0, 0.08);
  }

  .svelte-quiz__option.selected {
    border-color: #ff3e00;
    background: rgba(255, 62, 0, 0.08);
  }

  .svelte-quiz__option.correct {
    border-color: #2da44e;
    background: #d1f0dc;
    color: #1a7f37;
  }

  .svelte-quiz__option.wrong {
    border-color: #d1242f;
    background: #ffe8e8;
    color: #d1242f;
  }

  .svelte-quiz__option:disabled {
    cursor: not-allowed;
  }

  .svelte-quiz__letter {
    font-weight: 700;
    min-width: 20px;
  }

  .svelte-quiz__feedback {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-weight: 600;
  }

  .svelte-quiz__feedback.correct {
    background: #d1f0dc;
    color: #1a7f37;
  }

  .svelte-quiz__feedback.wrong {
    background: #ffe8e8;
    color: #d1242f;
  }

  .svelte-quiz__actions {
    display: flex;
    gap: 0.5rem;
  }

  .svelte-quiz__btn {
    flex: 1;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    border: 1.5px solid rgba(128, 128, 128, 0.25);
    background: transparent;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s, border-color 0.15s;
  }

  .svelte-quiz__btn.primary {
    background: #ff3e00;
    color: #fff;
    border-color: #ff3e00;
  }

  .svelte-quiz__btn.primary:hover {
    background: #cc3200;
    border-color: #cc3200;
  }

  .svelte-quiz__result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    text-align: center;
  }

  .svelte-quiz__result-emoji {
    font-size: 3rem;
  }

  .svelte-quiz__result-score {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .svelte-quiz__result-message {
    font-size: 0.9rem;
    opacity: 0.75;
    max-width: 220px;
  }
</style>

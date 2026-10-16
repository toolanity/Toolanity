/**
 * word-counter.js
 * Processes text inputs and computes word, char, sentence, paragraph counts,
 * and reading/speaking times client-side.
 */

document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("word-counter-textarea");
  const clearBtn = document.getElementById("clear-text-btn");

  const wordCountVal = document.getElementById("count-words");
  const charCountVal = document.getElementById("count-chars");
  const charNoSpaceVal = document.getElementById("count-chars-nospace");
  const sentenceCountVal = document.getElementById("count-sentences");
  const paragraphCountVal = document.getElementById("count-paragraphs");
  const readTimeVal = document.getElementById("count-readtime");
  const speakTimeVal = document.getElementById("count-speaktime");

  if (!textarea) return;

  // Listen to inputs
  textarea.addEventListener("input", performCounts);

  // Clear button action
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      textarea.value = "";
      performCounts();
      textarea.focus();
    });
  }

  function performCounts() {
    const text = textarea.value;

    // 1. Character count (with spaces)
    const totalChars = text.length;

    // 2. Character count (no spaces)
    const charsNoSpace = text.replace(/\s/g, "").length;

    // 3. Word count
    // Trim whitespace and split by any whitespace character(s)
    const wordsArray = text.trim().split(/\s+/).filter(word => word.length > 0);
    const totalWords = wordsArray.length;

    // 4. Sentence count
    // Matches groups ending with sentence markers (. ! ?) followed by whitespace or end of string
    const sentenceArray = text.split(/[.!?]+(?:[\s\n]|$)/).filter(s => s.trim().length > 0);
    const totalSentences = sentenceArray.length;

    // 5. Paragraph count
    // Split by newlines, filtering out empty entries
    const paragraphArray = text.split(/\n+/).filter(p => p.trim().length > 0);
    const totalParagraphs = paragraphArray.length;

    // 6. Reading Time (based on 200 WPM)
    let readMinutes = 0;
    if (totalWords > 0) {
      readMinutes = Math.ceil(totalWords / 200);
    }
    const readTimeStr = totalWords > 0 ? `${readMinutes} min` : "0 min";

    // 7. Speaking Time (based on 130 WPM)
    let speakMinutes = 0;
    let speakSeconds = 0;
    if (totalWords > 0) {
      const totalSpeakSeconds = Math.round((totalWords / 130) * 60);
      speakMinutes = Math.floor(totalSpeakSeconds / 60);
      speakSeconds = totalSpeakSeconds % 60;
    }
    const speakTimeStr = totalWords > 0 
      ? `${speakMinutes} min${speakMinutes !== 1 ? 's' : ''}, ${speakSeconds} sec${speakSeconds !== 1 ? 's' : ''}`
      : "0 minutes, 0 seconds";

    // Inject results into UI DOM
    wordCountVal.textContent = totalWords;
    charCountVal.textContent = totalChars;
    charNoSpaceVal.textContent = charsNoSpace;
    sentenceCountVal.textContent = totalSentences;
    paragraphCountVal.textContent = totalParagraphs;
    readTimeVal.textContent = readTimeStr;
    speakTimeVal.textContent = speakTimeStr;
  }
});

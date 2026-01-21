let WORDS = [];

console.log("MAIN.JS LOADED");

fetch("wordle-list.json")
  .then(r => {
    console.log("FETCH STATUS:", r.status);
    return r.json();
  })
  .then(list => {
    console.log("LIST RECEIVED:", list);
    WORDS = list
      .map(w => w.toUpperCase())
      .filter(w => w.length === 5);
    console.log("WORDS LOADED:", WORDS.length);
  })
  .catch(e => console.error("FETCH ERROR:", e));

document
  .getElementById("searchBtn")
  .addEventListener("click", update);

function update() {
  const constraints = getConstraints();
  const results = WORDS.filter(w => matches(w, constraints));
  render(results);
}

function enableAutoTab() {
  document.querySelectorAll(".row").forEach(row => {
    const inputs = [...row.querySelectorAll("input")];

    inputs.forEach((input, idx) => {
      input.addEventListener("input", (e) => {
        // transforma letra a mayúscula
        input.value = input.value.toUpperCase();

        // mover al siguiente input de la misma fila
        if (input.value && idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && idx > 0) {
          inputs[idx - 1].focus();
        }
      });
    });
  });
}

// Llamar después de cargar la página
enableAutoTab();

document.getElementById("resetBtn").addEventListener("click", () => {
  document.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById("results").innerHTML = "";
});

function getConstraints() {
  const correct = [...document.querySelectorAll("#correct-row input")]
    .map(i => i.value.toUpperCase() || null);

  const misplaced = {};

document.querySelectorAll("#misplaced .row").forEach(row => {
  const inputs = [...row.children];
  const letter = inputs.find(i => i.value)?.value.toUpperCase();
  if (!letter) return;

  if (!misplaced[letter]) misplaced[letter] = [];

  inputs.forEach((input, idx) => {
    if (input.value.toUpperCase() === letter) {
      misplaced[letter].push(idx);
    }
  });
});


  const incorrectInput = document.getElementById("incorrect").value.toUpperCase();
  const incorrect = new Set(
    incorrectInput
      .split("")
      .filter(l => !misplaced[l] && !correct.includes(l))
  );

  return { correct, misplaced, incorrect };
}

function matches(word, c) {
  // verdes
  for (let i = 0; i < 5; i++) {
    if (c.correct[i] && word[i] !== c.correct[i]) return false;
  }

  // grises
  for (const l of c.incorrect) {
    if (word.includes(l)) return false;
  }

  // amarillas
  for (const [letter, badPos] of Object.entries(c.misplaced)) {
    if (!word.includes(letter)) return false;
    for (const p of badPos) {
      if (word[p] === letter) return false;
    }
  }

  return true;
}

function render(words) {
  const div = document.getElementById("results");
  div.innerHTML = "";

  words.forEach(w => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = w;
    span.addEventListener("click", () => {
     const url =
    "https://dictionary.cambridge.org/dictionary/english/" +
    w.toLowerCase();
  window.open(url, "_blank");
});
    div.appendChild(span);
  });
}

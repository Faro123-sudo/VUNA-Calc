var currentExpression = '';
var left = '';
var operator = '';
var right = '';
var steps = [];
var MAX_STEPS = 6;

// Mode flags
var shiftMode = false;
var alphaMode = false;
var hypMode   = false;
var angleMode = 'deg'; // 'deg' | 'rad'
var lastAnswer = 0;

// DOM references
var languageSelect = null;
var stepsDiv       = null;

document.addEventListener('DOMContentLoaded', function () {
  languageSelect = document.getElementById('language-select');
  stepsDiv       = document.getElementById('steps');

  if (languageSelect) {
    languageSelect.addEventListener('change', updateResult);
  }

  updateStepsDisplay();
});

function toggleShift() {
  shiftMode = !shiftMode;
  // SHIFT cancels ALPHA
  if (shiftMode) alphaMode = false;
  syncModeUI();
}

function toggleAlpha() {
  alphaMode = !alphaMode;
  if (alphaMode) shiftMode = false;
  syncModeUI();
}

function toggleHyp() {
  hypMode = !hypMode;
  syncModeUI();
}

function setAngleMode(mode) {
  angleMode = mode;
  document.getElementById('deg-btn').classList.toggle('active', mode === 'deg');
  document.getElementById('rad-btn').classList.toggle('active', mode === 'rad');
}

function syncModeUI() {
  // Buttons
  document.getElementById('shift-btn').classList.toggle('active', shiftMode);
  document.getElementById('alpha-btn').classList.toggle('active', alphaMode);
  document.getElementById('btn-hyp').classList.toggle('active', hypMode);

  // Indicator badges
  document.getElementById('shift-indicator').style.display = shiftMode ? 'inline-block' : 'none';
  document.getElementById('alpha-indicator').style.display = alphaMode ? 'inline-block' : 'none';
  document.getElementById('hyp-indicator').style.display   = hypMode   ? 'inline-block' : 'none';
}

function toRad(val) {
  return angleMode === 'deg' ? val * Math.PI / 180 : val;
}

function fromRad(val) {
  return angleMode === 'deg' ? val * 180 / Math.PI : val;
}

function handleSin() {
  const val = parseFloat(currentExpression);
  if (isNaN(val)) { _flashError('Enter a number first'); return; }

  let result, label;

  if (shiftMode && hypMode) {
    result = Math.log(val + Math.sqrt(val * val + 1)); // asinh
    label  = 'sinh⁻¹(' + val + ')';
  } else if (shiftMode) {
    result = fromRad(Math.asin(val));
    label  = 'sin⁻¹(' + val + ')';
  } else if (hypMode) {
    result = (Math.exp(val) - Math.exp(-val)) / 2; // sinh
    label  = 'sinh(' + val + ')';
  } else {
    result = Math.sin(toRad(val));
    label  = 'sin(' + val + (angleMode === 'deg' ? '°' : 'ʳ') + ')';
  }

  _applyFunctionResult(result, label);
}

function handleCos() {
  const val = parseFloat(currentExpression);
  if (isNaN(val)) { _flashError('Enter a number first'); return; }

  let result, label;

  if (shiftMode && hypMode) {
    result = Math.log(val + Math.sqrt(val * val - 1)); // acosh
    label  = 'cosh⁻¹(' + val + ')';
  } else if (shiftMode) {
    result = fromRad(Math.acos(val));
    label  = 'cos⁻¹(' + val + ')';
  } else if (hypMode) {
    result = (Math.exp(val) + Math.exp(-val)) / 2; // cosh
    label  = 'cosh(' + val + ')';
  } else {
    result = Math.cos(toRad(val));
    label  = 'cos(' + val + (angleMode === 'deg' ? '°' : 'ʳ') + ')';
  }

  _applyFunctionResult(result, label);
}

function handleTan() {
  const val = parseFloat(currentExpression);
  if (isNaN(val)) { _flashError('Enter a number first'); return; }

  let result, label;

  if (shiftMode && hypMode) {
    result = 0.5 * Math.log((1 + val) / (1 - val)); // atanh
    label  = 'tanh⁻¹(' + val + ')';
  } else if (shiftMode) {
    result = fromRad(Math.atan(val));
    label  = 'tan⁻¹(' + val + ')';
  } else if (hypMode) {
    result = (Math.exp(val) - Math.exp(-val)) / (Math.exp(val) + Math.exp(-val)); // tanh
    label  = 'tanh(' + val + ')';
  } else {
    result = Math.tan(toRad(val));
    label  = 'tan(' + val + (angleMode === 'deg' ? '°' : 'ʳ') + ')';
  }

  _applyFunctionResult(result, label);
}

function _applyFunctionResult(result, label) {
  if (isNaN(result) || !isFinite(result)) {
    currentExpression = 'Error';
    _addStep(label + ' = Error');
  } else {
    const rounded = parseFloat(result.toFixed(10));
    currentExpression = rounded.toString();
    left = currentExpression;
    operator = '';
    right = '';
    lastAnswer = rounded;
    _addStep(label + ' = ' + rounded);
  }

  // Reset modes after use
  shiftMode = false;
  hypMode   = false;
  syncModeUI();
  updateResult();
}

function insertFraction() {
  // Prompt user for numerator and denominator
  var num = prompt('Enter the numerator:');
  if (num === null || num.trim() === '') return;
  var den = prompt('Enter the denominator:');
  if (den === null || den.trim() === '') return;

  var n = parseFloat(num);
  var d = parseFloat(den);

  if (isNaN(n) || isNaN(d)) { _flashError('Invalid fraction'); return; }
  if (d === 0) { _flashError('Denominator cannot be zero'); return; }

  var fractionResult = n / d;
  var label = '(' + n + '/' + d + ')';

  currentExpression = fractionResult.toString();
  left = currentExpression;
  operator = '';
  right = '';
  _addStep(label + ' = ' + fractionResult);
  updateResult();
}

function handleAlphaInput(key) {
  if (!alphaMode) return false;
  switch (key) {
    case 'pi': appendToResult(Math.PI.toString()); break;
    case 'e':  appendToResult(Math.E.toString()); break;
    case 'ans': appendToResult(lastAnswer.toString()); break;
    default: return false;
  }
  alphaMode = false;
  syncModeUI();
  return true;
}

function appendToResult(value) {
<<<<<<< Updated upstream
    if (operator.length === 0) {
        left += value.toString();
    } else {
        right += value.toString();
    }
    updateResult();
}

function bracketToResult(value) {
    if (operator.length === 0) {
        left += value;
    } else {
        right += value;
    }
    updateResult();
=======
  currentExpression += value.toString();
  _parseExpression();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  _parseExpression();
  updateResult();
}

function operatorToResult(value) {
  if (value === '^') {
    currentExpression += '**';
  } else {
    currentExpression += value;
  }
  _parseExpression();
  updateResult();
}

function clearResult() {
  currentExpression = '';
  left = ''; operator = ''; right = '';
  document.getElementById('word-result').innerHTML = '';
  document.getElementById('word-area').style.display = 'none';
  updateResult();
>>>>>>> Stashed changes
}

function backspace() {
    if (right.length > 0) {
        right = right.slice(0, -1);
    } else if (operator.length > 0) {
        operator = '';
    } else if (left.length > 0) {
        left = left.slice(0, -1);
    }
    updateResult();
}

function operatorToResult(value) {
    if (left.length === 0) return;
    if (right.length > 0) {
        calculateResult();
    }
    operator = value;
    updateResult();
}

function clearResult() {
  left = "";
  right = "";
  operator = "";
  steps = [];

  document.getElementById("word-result").innerHTML = "";
  document.getElementById("word-area").style.display = "none";
  document.getElementById("steps").innerText = "";

  updateResult();
}

function calculateResult() {
  if (left.length === 0 || operator.length === 0 || right.length === 0) return;

  const l = parseFloat(left);
  const r = parseFloat(right);
  let result;

  switch (operator) {
    case '+': result = l + r; break;
    case '-': result = l - r; break;
    case '*': result = l * r; break;
    case '/': result = r !== 0 ? l / r : 'Error'; break;
    default: return;
  }

  _addStep('Step ' + (steps.length + 1) + ': ' + l + ' ' + operator + ' ' + r + ' = ' + result);

  lastAnswer = typeof result === 'number' ? result : 0;
  left = result.toString();
  operator = '';
  right = '';
  currentExpression = left;

  updateStepsDisplay();
  updateResult();

  // Explicitly show the result in words after calculation
  const wordResult = document.getElementById('word-result');
  const wordArea = document.getElementById('word-area');
  const language = languageSelect ? languageSelect.value : 'english';
  const words = language === 'hausa' ? numberToWordsHausa(left) : numberToWords(left);
  wordResult.innerHTML = '<span class="small-label">Result in words</span><strong>' + words + '</strong>';
  wordArea.style.display = 'flex';
  enableSpeakButton();
}

// Simple expression parser to keep left/operator/right in sync
function _parseExpression() {
  var expr = currentExpression;
  var match = expr.match(/^(-?[\d.]+)([+\-*/])(-?[\d.]*)$/);
  if (match) {
    left     = match[1];
    operator = match[2];
    right    = match[3];
  } else if (/^-?[\d.]+$/.test(expr)) {
    left = expr; operator = ''; right = '';
  }
}

function _addStep(text) {
  if (steps.length >= MAX_STEPS) steps.shift();
  steps.push(text);
  updateStepsDisplay();
}

<<<<<<< Updated upstream
function updateResult() {
    const display = left + (operator ? ' ' + operator + ' ' : '') + right;
    document.getElementById('result').value = display || '0';
=======
function _flashError(msg) {
  var el = document.getElementById('result');
  var prev = currentExpression;
  el.value = msg;
  setTimeout(function () {
    el.value = prev || '0';
  }, 1200);
}

function updateResult() {
  document.getElementById('result').value = currentExpression || '0';
>>>>>>> Stashed changes

  const wordResult = document.getElementById('word-result');
  const wordArea   = document.getElementById('word-area');

<<<<<<< Updated upstream
    // Show words when we have a complete number (left is set and no operator/right in progress)
    if (left && !operator && !right) {
        const language = languageSelect ? languageSelect.value : 'english';
        const words = language === 'hausa' ? numberToWordsHausa(left) : numberToWords(left);
        wordResult.innerHTML = '<span class="small-label">Result in words</span><strong>' + words + '</strong>';
        wordArea.style.display = 'flex';
    } else {
        wordResult.innerHTML = '';
        wordArea.style.display = 'none';
=======
  if (left && !operator && !right && !/Error/.test(left)) {
    const language = languageSelect ? languageSelect.value : 'english';
    let words = '';

    switch (language) {
      case 'french':  words = numberToWordsFrench(left);   break;
      case 'spanish': words = numberToWordsSpanish(left);  break;
      case 'hausa':   words = numberToWordsHausa(left);    break;
      default:        words = numberToWords(left);
>>>>>>> Stashed changes
    }

    wordResult.innerHTML = '<span class="small-label">Result in words</span><strong>' + words + '</strong>';
    wordArea.style.display = 'flex';
  } else {
    wordResult.innerHTML = '';
    wordArea.style.display = 'none';
  }
  enableSpeakButton();
}

function updateStepsDisplay() {
  if (stepsDiv) {
    stepsDiv.innerHTML = steps.map(function (s) {
      return '<div class="step">' + s + '</div>';
    }).join('');
    stepsDiv.scrollTop = stepsDiv.scrollHeight;
  }
}

function speakResult() {
  const speakBtn     = document.getElementById('speak-btn');
  const wordResultEl = document.getElementById('word-result');
  const words        = wordResultEl.querySelector('strong')?.innerText || '';

<<<<<<< Updated upstream
    // Get text content only (strips the <span class="small-label"> part if needed)
    const words = wordResultEl.querySelector('strong')?.innerText || '';
=======
  if (!words) return;
>>>>>>> Stashed changes

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    speakBtn.classList.remove('speaking');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(words);
  const language  = languageSelect ? languageSelect.value : 'english';

<<<<<<< Updated upstream
    const utterance = new SpeechSynthesisUtterance(words);
    utterance.rate = 0.9;
    utterance.onstart = () => speakBtn.classList.add('speaking');
    utterance.onend = () => speakBtn.classList.remove('speaking');
    window.speechSynthesis.speak(utterance);
=======
  switch (language) {
    case 'french':  utterance.lang = 'fr-FR'; break;
    case 'spanish': utterance.lang = 'es-ES'; break;
    case 'hausa':   utterance.lang = 'ha-NG'; break;
    default:        utterance.lang = 'en-US';
  }

  utterance.rate  = 0.9;
  utterance.onstart = function () { speakBtn.classList.add('speaking'); };
  utterance.onend   = function () { speakBtn.classList.remove('speaking'); };
  window.speechSynthesis.speak(utterance);
>>>>>>> Stashed changes
}

function enableSpeakButton() {
  const speakBtn = document.getElementById('speak-btn');
  if (!speakBtn) return;
  const hasContent = document.getElementById('word-result').querySelector('strong')?.innerText.trim().length > 0;
  speakBtn.disabled = !hasContent;
}

function numberToWords(num) {
  if (num === 'Error') return 'Error';
  if (num === '') return '';
  const n = parseFloat(num);
  if (isNaN(n)) return '';
  if (n === 0) return 'Zero';

  const ones  = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens  = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

  function convertGroup(val) {
    let res = '';
    if (val >= 100) { res += ones[Math.floor(val / 100)] + ' Hundred '; val %= 100; }
    if (val >= 10 && val <= 19) res += teens[val - 10] + ' ';
    else if (val >= 20) res += tens[Math.floor(val / 10)] + (val % 10 !== 0 ? '-' + ones[val % 10] : '') + ' ';
    else if (val > 0) res += ones[val] + ' ';
    return res.trim();
  }

  let sign = n < 0 ? 'Negative ' : '';
  let absN = Math.abs(n);
  let parts = absN.toString().split('.');
  let integerPart = parseInt(parts[0]);
  let decimalPart = parts[1];
  let wordArr = [];

  if (integerPart === 0) { wordArr.push('Zero'); }
  else {
    let scaleIdx = 0;
    while (integerPart > 0) {
      let chunk = integerPart % 1000;
      if (chunk > 0) wordArr.unshift(convertGroup(chunk) + (scales[scaleIdx] ? ' ' + scales[scaleIdx] : ''));
      integerPart = Math.floor(integerPart / 1000);
      scaleIdx++;
    }
  }

  let result = sign + wordArr.join(', ').trim();
  if (decimalPart) {
    result += ' Point';
    for (let digit of decimalPart)
      result += ' ' + (digit === '0' ? 'Zero' : ones[parseInt(digit)]);
  }
  return result.trim();
}

function numberToWordsSpanish(num) {
  if (num === 'Error') return 'Error';
  if (num === '') return '';
  const n = parseFloat(num);
  if (isNaN(n)) return '';
  if (n === 0) return 'Cero';

  const ones     = ['', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'];
  const tens     = ['', 'Diez', 'Veinte', 'Treinta', 'Cuarenta', 'Cincuenta', 'Sesenta', 'Setenta', 'Ochenta', 'Noventa'];
  const teens    = ['Diez', 'Once', 'Doce', 'Trece', 'Catorce', 'Quince', 'Dieciséis', 'Diecisiete', 'Dieciocho', 'Diecinueve'];
  const twenties = ['Veinte', 'Veintiuno', 'Veintidós', 'Veintitrés', 'Veinticuatro', 'Veinticinco', 'Veintiséis', 'Veintisiete', 'Veintiocho', 'Veintinueve'];
  const hundreds = ['', 'Ciento', 'Doscientos', 'Trescientos', 'Cuatrocientos', 'Quinientos', 'Seiscientos', 'Setecientos', 'Ochocientos', 'Novecientos'];
  const scales   = ['', 'Mil', 'Millón', 'Mil Millones', 'Billón'];

  function convertGroup(val) {
    let res = '';
    if (val >= 100) {
      res += (val === 100 ? 'Cien' : hundreds[Math.floor(val / 100)]) + ' ';
      val %= 100;
    }
    if (val >= 10 && val <= 19) res += teens[val - 10] + ' ';
    else if (val >= 20 && val <= 29) res += twenties[val - 20] + ' ';
    else if (val >= 30) {
      const t = Math.floor(val / 10), o = val % 10;
      res += tens[t] + (o > 0 ? ' y ' + ones[o] : '') + ' ';
    } else if (val > 0) res += ones[val] + ' ';
    return res.trim();
  }

  let sign = n < 0 ? 'Negativo ' : '';
  let absN = Math.abs(n);
  let parts = absN.toString().split('.');
  let integerPart = parseInt(parts[0]);
  let decimalPart = parts[1];
  let wordArr = [];

  if (integerPart === 0) { wordArr.push('Cero'); }
  else {
    let scaleIdx = 0;
    while (integerPart > 0) {
      let chunk = integerPart % 1000;
      if (chunk > 0) {
        let cw = convertGroup(chunk);
        if (scaleIdx === 0) wordArr.unshift(cw);
        else if (scaleIdx === 1) wordArr.unshift(chunk === 1 ? scales[scaleIdx] : cw + ' ' + scales[scaleIdx]);
        else if (scaleIdx === 2) wordArr.unshift(chunk === 1 ? 'Un Millón' : cw + ' Millones');
        else wordArr.unshift(cw + ' ' + scales[scaleIdx]);
      }
      integerPart = Math.floor(integerPart / 1000);
      scaleIdx++;
    }
  }

  let result = sign + wordArr.join(' ').trim();
  if (decimalPart) {
    result += ' Punto';
    for (let digit of decimalPart)
      result += ' ' + (digit === '0' ? 'Cero' : ones[parseInt(digit)]);
  }
  return result.trim();
}

function numberToWordsFrench(num) {
  if (num === 'Error') return 'Erreur';
  if (num === '') return '';
  const n = parseFloat(num);
  if (isNaN(n)) return '';
  if (n === 0) return 'Zéro';

  const ones  = ['', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf'];
  const tens  = ['', 'Dix', 'Vingt', 'Trente', 'Quarante', 'Cinquante', 'Soixante', 'Soixante', 'Quatre-vingt', 'Quatre-vingt'];
  const teens = ['Dix', 'Onze', 'Douze', 'Treize', 'Quatorze', 'Quinze', 'Seize', 'Dix-sept', 'Dix-huit', 'Dix-neuf'];
  const scales = ['', 'Mille', 'Million', 'Milliard', 'Billion'];

  function convertGroup(val) {
    let res = '';
    if (val >= 100) {
      const h = Math.floor(val / 100);
      res += (h === 1 ? 'Cent' : ones[h] + ' Cent' + (val % 100 === 0 ? 's' : '')) + ' ';
      val %= 100;
    }
    if (val >= 10 && val <= 19) res += teens[val - 10] + ' ';
    else if (val >= 20) {
      const t = Math.floor(val / 10), o = val % 10;
      if (t === 7 || t === 9) {
        res += tens[t] + '-' + (o === 0 ? 'Dix' : teens[o]) + ' ';
      } else if (t === 8) {
        res += 'Quatre-vingt' + (o === 0 ? 's' : '-' + ones[o]) + ' ';
      } else {
        res += tens[t] + (o === 1 ? ' et Un' : o > 0 ? '-' + ones[o] : '') + ' ';
      }
    } else if (val > 0) res += ones[val] + ' ';
    return res.trim();
  }

  let sign = n < 0 ? 'Négatif ' : '';
  let absN = Math.abs(n);
  let parts = absN.toString().split('.');
  let integerPart = parseInt(parts[0]);
  let decimalPart = parts[1];
  let wordArr = [];

  if (integerPart === 0) { wordArr.push('Zéro'); }
  else {
    let scaleIdx = 0;
    while (integerPart > 0) {
      let chunk = integerPart % 1000;
      if (chunk > 0) {
        let cw = convertGroup(chunk);
        if (scaleIdx === 0) wordArr.unshift(cw);
        else if (scaleIdx === 1) wordArr.unshift(cw + ' ' + scales[scaleIdx]);
        else wordArr.unshift(cw + ' ' + scales[scaleIdx] + (chunk > 1 ? 's' : ''));
      }
      integerPart = Math.floor(integerPart / 1000);
      scaleIdx++;
    }
  }

  let result = sign + wordArr.join(' ').trim();
  if (decimalPart) {
    result += ' Virgule';
    for (let digit of decimalPart)
      result += ' ' + (digit === '0' ? 'Zéro' : ones[parseInt(digit)]);
  }
  return result.trim();
}

function numberToWordsHausa(num) {
  if (num === 'Error') return 'Error';
  if (num === '') return '';
  const n = parseFloat(num);
  if (isNaN(n)) return '';
  if (n === 0) return 'Sifili';

  const ones  = ['', 'Daya', 'Biyu', 'Uku', 'Huɗu', 'Biyar', 'Shida', 'Bakwai', 'Takwas', 'Tara'];
  const tens  = ['', '', 'Ashirin', 'Talatin', 'Arba\'in', 'Hamsin', 'Sittin', 'Sab\'in', 'Tamanin', 'Tisa\'in'];
  const teens = ['Goma', 'Goma sha daya', 'Goma sha biyu', 'Goma sha uku', 'Goma sha huɗu', 'Goma sha biyar', 'Goma sha shida', 'Goma sha bakwai', 'Goma sha takwas', 'Goma sha tara'];
  const scales = ['', 'Dubu', 'Miliyan', 'Biliyan', 'Tiriliyan'];

  function convertGroup(val) {
    let res = '';
    if (val >= 100) { res += ones[Math.floor(val / 100)] + ' Dari '; val %= 100; }
    if (val >= 10 && val <= 19) res += teens[val - 10] + ' ';
    else if (val >= 20) res += tens[Math.floor(val / 10)] + (val % 10 !== 0 ? ' da ' + ones[val % 10] : '') + ' ';
    else if (val > 0) res += ones[val] + ' ';
    return res.trim();
  }

  let sign = n < 0 ? 'Negative ' : '';
  let absN = Math.abs(n);
  let parts = absN.toString().split('.');
  let integerPart = parseInt(parts[0]);
  let decimalPart = parts[1];
  let wordArr = [];

  if (integerPart === 0) { wordArr.push('Sifili'); }
  else {
    let scaleIdx = 0;
    while (integerPart > 0) {
      let chunk = integerPart % 1000;
      if (chunk > 0) wordArr.unshift(convertGroup(chunk) + (scales[scaleIdx] ? ' ' + scales[scaleIdx] : ''));
      integerPart = Math.floor(integerPart / 1000);
      scaleIdx++;
    }
  }

  let result = sign + wordArr.join(', ').trim();
  if (decimalPart) {
    result += ' Point';
    for (let digit of decimalPart)
      result += ' ' + (digit === '0' ? 'Sifili' : ones[parseInt(digit)]);
  }
  return result.trim();
}

<<<<<<< Updated upstream
function updateStepsDisplay() {
  const stepsDiv = document.getElementById("steps");
  if (!stepsDiv) return;

  stepsDiv.innerText = steps.join("\n");
}
=======
function copyResult() {
  const text = document.getElementById('result').value;
  if (!text) return;
  navigator.clipboard.writeText(text);
}

// Init
document.addEventListener('DOMContentLoaded', updateStepsDisplay);
>>>>>>> Stashed changes

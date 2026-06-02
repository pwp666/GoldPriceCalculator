
    // ---------- تنظیمات اولیه ----------
    const DEFAULT_TAB = 'sell';    // 'sell' یا 'buy'
    const DEFAULT_THEME = 'light';  // 'dark' یا 'light'

    function formatNumber(num) {
      return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(num);
    }

    // جداکننده هزارگان با کاما (برای ورودی قیمت)
    function addCommasToNumberString(str) {
      // فقط رقم‌ها را نگه دار
      const digits = String(str).replace(/[^\d]/g, '');
      if (!digits) return '';
      return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function parseCommaNumber(str) {
      // "1,234,567" -> 1234567
      const digits = String(str).replace(/,/g, '').replace(/[^\d.]/g, '');
      return digits ? parseFloat(digits) : NaN;
    }

    function attachPriceCommaFormatting(inputId) {
      const el = document.getElementById(inputId);
      if (!el) return;

      el.addEventListener('input', () => {
        const formatted = addCommasToNumberString(el.value);
        el.value = formatted;
      });

      // اختیاری: وقتی از فیلد خارج شد هم تمیزش کن
      el.addEventListener('blur', () => {
        el.value = addCommasToNumberString(el.value);
      });
    }

    function switchTab(tab) {
      document.getElementById('buyBtn').classList.remove('active');
      document.getElementById('sellBtn').classList.remove('active');
      document.getElementById('buyTab').classList.remove('active');
      document.getElementById('sellTab').classList.remove('active');

      if (tab === 'buy') {
        document.getElementById('buyBtn').classList.add('active');
        document.getElementById('buyTab').classList.add('active');
      } else {
        document.getElementById('sellBtn').classList.add('active');
        document.getElementById('sellTab').classList.add('active');
      }
    }

    function setTheme(theme) {
      document.body.setAttribute('data-theme', theme);
      document.getElementById('themeLabel').textContent = (theme === 'light') ? 'لایت' : 'دارک';
    }

    function toggleTheme() {
      const current = document.body.getAttribute('data-theme') || 'dark';
      const next = (current === 'dark') ? 'light' : 'dark';
      setTheme(next);
    }

    function calculateBuy() {
      const basePrice = parseFloat(document.getElementById("buyBasePrice").value);
      const weight = parseFloat(document.getElementById("buyWeight").value);
      const karat = parseFloat(document.getElementById("buyKarat").value);

      if (isNaN(basePrice) || isNaN(weight) || isNaN(karat)) {
        alert("لطفاً همه فیلدهای بخش خرید را به‌درستی پر کنید.");
        return;
      }

      const final = weight * basePrice * (karat / 24);

      document.getElementById("buyFinalPrice").innerText = formatNumber(final) + " تومان";
      document.getElementById("buyResultBox").style.display = "block";
    }

    function calculateSell() {
      // قیمت را با حذف کاما می‌خوانیم
      const price = parseCommaNumber(document.getElementById("sellPrice").value);
      const weight = parseFloat(document.getElementById("sellWeight").value);
      const feeRaw = document.getElementById("sellFee").value.trim();
      const feePercent = feeRaw === "" ? 0 : parseFloat(feeRaw);
      const profitPercent = parseFloat(document.getElementById("sellProfit").value);

      if (isNaN(price) || isNaN(weight) || isNaN(profitPercent) || isNaN(feePercent)) {
        alert("لطفاً همه فیلدهای بخش فروش را به‌درستی پر کنید.");
        return;
      }

      const baseAmount = price * weight;
      const afterFee = baseAmount * (1 + feePercent / 100);
      const finalAmount = afterFee * (1 + profitPercent / 100);

      const feeAmount = afterFee - baseAmount;
      const profitAmount = finalAmount - afterFee;

      document.getElementById("sellFinalPrice").innerText = formatNumber(finalAmount) + " تومان";
      document.getElementById("sellDetails").innerHTML = `
        مبلغ پایه (قیمت × وزن): ${formatNumber(baseAmount)} تومان<br>
        مبلغ کارمزد (${feePercent}%): ${formatNumber(feeAmount)} تومان<br>
        بعد از کارمزد: ${formatNumber(afterFee)} تومان
        <hr>
        مبلغ سود (${profitPercent}%): ${formatNumber(profitAmount)} تومان<br>
        قیمت نهایی: ${formatNumber(finalAmount)} تومان
      `;

      document.getElementById("sellResultBox").style.display = "block";
    }
// ===================================================================================
    function enableEnterToCalculate() {
      const buyInputs = document.querySelectorAll('#buyTab input');
      const sellInputs = document.querySelectorAll('#sellTab input');

      buyInputs.forEach(input => {
        input.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
            event.preventDefault();
            calculateBuy();
          }
        });
      });

      sellInputs.forEach(input => {
        input.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
            event.preventDefault();
            calculateSell();
          }
        });
      });
    }
// ===================================================================================
    function enableFastZeroShortcut(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('keydown', function(e) {
            // اگر کلید زده شده "." (نقطه) باشد
            if (e.key === '.') {
                e.preventDefault(); // جلوگیری از تایپ نقطه
                // اضافه کردن سه صفر به مقدار فعلی
                const rawValue = parseCommaNumber(input.value);
                input.value = addCommasToNumberString((rawValue * 1000).toString());
            }
        });
    }
// ===================================================================================
    function enableZeroBeforeDecimalForWeight() {
      const weightInputs = [
        document.getElementById('sellWeight'),
        document.getElementById('buyWeight')
      ].filter(Boolean);

      weightInputs.forEach(input => {
        input.addEventListener('input', () => {
          let value = input.value;

          // اگر کاربر فقط "." نوشت => "0."
          if (value === '.') {
            input.value = '0.';
            return;
          }

          // اگر اول عدد "." بود مثل ".5" => "0.5"
          if (value.startsWith('.')) {
            input.value = '0' + value;
          }
        });
      });
    }
// ===================================================================================
    function enableAutoSelectOnFocus(inputId) {
      const input = document.getElementById(inputId);
      if (!input) return;

      input.addEventListener('focus', () => {
        input.select();
      });
    }
// ===================================================================================
    function enableAutoSelectOnFocus(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            // استفاده از رویداد focus
            input.addEventListener('focus', function() {
                // ایجاد یک تاخیر بسیار کم (0 میلی ثانیه) 
                // باعث می‌شود انتخاب متن بعد از تمام شدن کلیک مرورگر انجام شود
                setTimeout(() => {
                    this.select();
                }, 0);
            });
        }
    }

// ===================================================================================
    (function init() {
        setTheme(DEFAULT_THEME);
        switchTab(DEFAULT_TAB);
        attachPriceCommaFormatting('sellPrice');
        enableEnterToCalculate();
        enableFastZeroShortcut('sellPrice');
        enableZeroBeforeDecimalForWeight();

        enableAutoSelectOnFocus('sellWeight');
        enableAutoSelectOnFocus('buyWeight');
        enableAutoSelectOnFocus('sellFee');
        enableAutoSelectOnFocus('sellProfit');
        enableAutoSelectOnFocus('sellPrice');
    })();
  
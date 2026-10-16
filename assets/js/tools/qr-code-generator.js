/**
 * qr-code-generator.js
 * Drives the multi-type QR code generator using the local QRious library.
 * Features live-updating on form changes and client-side PNG downloads.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Tab selectors
  const tabWifi = document.getElementById("qr-tab-wifi");
  const tabUrl = document.getElementById("qr-tab-url");
  const tabText = document.getElementById("qr-tab-text");
  const tabEmail = document.getElementById("qr-tab-email");
  const tabVcard = document.getElementById("qr-tab-vcard");
  const tabSocial = document.getElementById("qr-tab-social");
  const tabPayment = document.getElementById("qr-tab-payment");
  const tabSms = document.getElementById("qr-tab-sms");

  // Form panels selectors
  const formWifi = document.getElementById("qr-form-wifi");
  const formUrl = document.getElementById("qr-form-url");
  const formText = document.getElementById("qr-form-text");
  const formEmail = document.getElementById("qr-form-email");
  const formVcard = document.getElementById("qr-form-vcard");
  const formSocial = document.getElementById("qr-form-social");
  const formPayment = document.getElementById("qr-form-payment");
  const formSms = document.getElementById("qr-form-sms");

  // Input elements
  // WiFi
  const wifiSsid = document.getElementById("wifi-ssid");
  const wifiPassword = document.getElementById("wifi-password");
  // URL
  const qrUrl = document.getElementById("qr-url");
  // Text
  const qrText = document.getElementById("qr-text");
  // Email
  const qrEmailTo = document.getElementById("qr-email-to");
  const qrEmailSub = document.getElementById("qr-email-sub");
  const qrEmailBody = document.getElementById("qr-email-body");
  // vCard
  const vcardFn = document.getElementById("vcard-fn");
  const vcardLn = document.getElementById("vcard-ln");
  const vcardPhone = document.getElementById("vcard-phone");
  const vcardEmail = document.getElementById("vcard-email");
  const vcardOrg = document.getElementById("vcard-org");
  const vcardUrl = document.getElementById("vcard-url");
  // Social
  const socialPlatform = document.getElementById("social-platform");
  const socialHandle = document.getElementById("social-handle");
  // Payment
  const paymentMethod = document.getElementById("payment-method");
  const paymentHandle = document.getElementById("payment-handle");
  const paymentAmount = document.getElementById("payment-amount");
  const zelleName = document.getElementById("zelle-name");
  // SMS
  const smsPhone = document.getElementById("sms-phone");
  const smsMessage = document.getElementById("sms-message");

  // Size & Transparency controls
  const sizeSlider = document.getElementById("qr-size-slider");
  const sizeVal = document.getElementById("qr-size-val");
  const transparentToggle = document.getElementById("qr-transparent-toggle");

  // Canvas and Download
  const canvas = document.getElementById("qr-canvas");
  const downloadBtn = document.getElementById("download-qr-btn");

  let activeType = "wifi"; // wifi, url, text, email, vcard
  let qrInstance = null;

  // List of all forms and tabs for easy iteration
  const tabMap = [
    { type: "wifi", tab: tabWifi, form: formWifi },
    { type: "url", tab: tabUrl, form: formUrl },
    { type: "text", tab: tabText, form: formText },
    { type: "email", tab: tabEmail, form: formEmail },
    { type: "vcard", tab: tabVcard, form: formVcard },
    { type: "social", tab: tabSocial, form: formSocial },
    { type: "payment", tab: tabPayment, form: formPayment },
    { type: "sms", tab: tabSms, form: formSms }
  ];

  // --- INITIALIZE EVENT LISTENERS ---

  // Bind tab switches
  tabMap.forEach(item => {
    item.tab.addEventListener("click", () => {
      switchTab(item.type);
    });
  });

  // Slider change
  sizeSlider.addEventListener("input", (e) => {
    sizeVal.textContent = e.target.value;
    updateQrCode();
  });

  // Bind input listeners for live updates
  const inputsToBind = [
    wifiSsid, wifiPassword, qrUrl, qrText,
    qrEmailTo, qrEmailSub, qrEmailBody,
    vcardFn, vcardLn, vcardPhone, vcardEmail, vcardOrg, vcardUrl,
    socialHandle, paymentHandle, paymentAmount, zelleName, smsPhone, smsMessage
  ];
  inputsToBind.forEach(input => {
    if (input) {
      input.addEventListener("input", updateQrCode);
    }
  });

  // Bind selector change observers
  if (socialPlatform) {
    socialPlatform.addEventListener("change", () => {
      const plat = socialPlatform.value;
      const label = document.getElementById("social-handle-label");
      if (plat === "facebook") {
        label.textContent = "Facebook URL or Page Link";
        socialHandle.placeholder = "https://facebook.com/username";
      } else if (plat === "instagram") {
        label.textContent = "Instagram URL or Username";
        socialHandle.placeholder = "https://instagram.com/username";
      } else if (plat === "linkedin") {
        label.textContent = "LinkedIn Profile URL";
        socialHandle.placeholder = "https://linkedin.com/in/username";
      } else if (plat === "spotify") {
        label.textContent = "Spotify Profile or Song URL";
        socialHandle.placeholder = "https://open.spotify.com/artist/id";
      } else if (plat === "tiktok") {
        label.textContent = "TikTok Profile Link";
        socialHandle.placeholder = "https://tiktok.com/@username";
      }
      updateQrCode();
    });
  }

  if (paymentMethod) {
    paymentMethod.addEventListener("change", () => {
      const method = paymentMethod.value;
      const label = document.getElementById("payment-handle-label");
      const zelleNameGroup = document.getElementById("zelle-name-group");
      const paymentAmountGroup = document.getElementById("payment-amount-group");
      
      if (method === "paypal") {
        label.textContent = "PayPal Username or PayPal.me Link";
        paymentHandle.placeholder = "https://paypal.me/username";
        zelleNameGroup.classList.add("hidden");
        paymentAmountGroup.classList.remove("hidden");
      } else if (method === "venmo") {
        label.textContent = "Venmo Username or Profile Link";
        paymentHandle.placeholder = "https://venmo.com/username";
        zelleNameGroup.classList.add("hidden");
        paymentAmountGroup.classList.remove("hidden");
      } else if (method === "zelle") {
        label.textContent = "Zelle Registered Email or Phone Number";
        paymentHandle.placeholder = "recipient@example.com or +15551234567";
        zelleNameGroup.classList.remove("hidden");
        paymentAmountGroup.classList.add("hidden");
      }
      updateQrCode();
    });
  }

  if (transparentToggle) {
    transparentToggle.addEventListener("change", updateQrCode);
  }

  // Bind WiFi security radio changes
  document.querySelectorAll("input[name='wifi-security']").forEach(radio => {
    radio.addEventListener("change", updateQrCode);
  });

  // Download trigger
  if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadQrCode);
  }

  // WiFi password show/hide eye icon toggle
  const togglePassBtn = document.getElementById("toggle-wifi-pass-btn");
  const wifiPassInput = document.getElementById("wifi-password");
  if (togglePassBtn && wifiPassInput) {
    togglePassBtn.addEventListener("click", () => {
      const isPass = wifiPassInput.getAttribute("type") === "password";
      if (isPass) {
        wifiPassInput.setAttribute("type", "text");
        togglePassBtn.setAttribute("aria-label", "Hide password");
        togglePassBtn.innerHTML = `
          <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        `;
      } else {
        wifiPassInput.setAttribute("type", "password");
        togglePassBtn.setAttribute("aria-label", "Show password");
        togglePassBtn.innerHTML = `
          <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
        `;
      }
    });
  }

  // --- ACTIONS ---

  function switchTab(type) {
    activeType = type;
    tabMap.forEach(item => {
      if (item.type === type) {
        item.tab.classList.add("active");
        item.form.classList.remove("hidden");
      } else {
        item.tab.classList.remove("active");
        item.form.classList.add("hidden");
      }
    });
    updateQrCode();
  }

  // Escape special WiFi credentials symbols
  function escapeWifi(str) {
    if (!str) return "";
    return str.replace(/\\/g, "\\\\")
              .replace(/;/g, "\\;")
              .replace(/:/g, "\\:")
              .replace(/,/g, "\\,");
  }

  function getQrString() {
    let result = "";

    switch (activeType) {
      case "wifi":
        const ssid = escapeWifi(wifiSsid.value.trim());
        const password = escapeWifi(wifiPassword.value);
        const securityInput = document.querySelector("input[name='wifi-security']:checked");
        const security = securityInput ? securityInput.value : "WPA";
        
        if (!ssid) {
          return "WIFI:S:WiFi-Network;T:nopass;;"; // Placeholder for scanning demo
        }

        if (security === "nopass") {
          result = `WIFI:S:${ssid};T:nopass;;`;
        } else {
          result = `WIFI:S:${ssid};T:${security};P:${password};;`;
        }
        break;

      case "url":
        let url = qrUrl.value.trim();
        if (!url) {
          return "https://toolanity.com";
        }
        // Force protocol prepending
        if (!/^https?:\/\//i.test(url)) {
          url = "https://" + url;
        }
        result = url;
        break;

      case "text":
        result = qrText.value;
        if (!result) {
          return "Toolanity - Free Secure Online Tools";
        }
        break;

      case "email":
        const to = qrEmailTo.value.trim();
        const sub = qrEmailSub.value.trim();
        const body = qrEmailBody.value;
        if (!to) {
          return "mailto:hello@toolanity.com";
        }
        result = `mailto:${to}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
        break;

      case "vcard":
        const fn = vcardFn.value.trim();
        const ln = vcardLn.value.trim();
        const phone = vcardPhone.value.trim();
        const email = vcardEmail.value.trim();
        const org = vcardOrg.value.trim();
        const web = vcardUrl.value.trim();

        if (!fn && !ln) {
          return "BEGIN:VCARD\nVERSION:3.0\nFN:Toolanity Support\nEMAIL:hello@toolanity.com\nURL:https://toolanity.com\nEND:VCARD";
        }

        result = `BEGIN:VCARD
VERSION:3.0
N:${ln};${fn};;;
FN:${fn} ${ln}
ORG:${org}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
URL:${web}
END:VCARD`;
        break;

      case "social":
        let socialUrl = socialHandle.value.trim();
        if (!socialUrl) {
          const plat = socialPlatform.value;
          return `https://toolanity.com/placeholder-${plat}`;
        }
        // Prepend platform domain if simple username typed
        if (!/^https?:\/\//i.test(socialUrl)) {
          const plat = socialPlatform.value;
          if (plat === "facebook") {
            socialUrl = "https://facebook.com/" + socialUrl;
          } else if (plat === "instagram") {
            socialUrl = "https://instagram.com/" + socialUrl;
          } else if (plat === "linkedin") {
            socialUrl = "https://linkedin.com/in/" + socialUrl;
          } else if (plat === "spotify") {
            socialUrl = "https://open.spotify.com/user/" + socialUrl;
          } else if (plat === "tiktok") {
            const handle = socialUrl.startsWith("@") ? socialUrl : "@" + socialUrl;
            socialUrl = "https://tiktok.com/" + handle;
          }
        }
        result = socialUrl;
        break;

      case "payment":
        const payMethod = paymentMethod.value;
        const payHandle = paymentHandle.value.trim();
        const payAmt = paymentAmount.value.trim();
        
        if (!payHandle) {
          return "https://toolanity.com/placeholder-payment";
        }

        if (payMethod === "paypal") {
          let handle = payHandle;
          if (!/^https?:\/\//i.test(handle)) {
            handle = handle.replace(/paypal\.me\//i, "");
            handle = `https://paypal.me/${handle}`;
          }
          if (payAmt) {
            handle = handle.endsWith("/") ? handle.slice(0, -1) : handle;
            result = `${handle}/${payAmt}`;
          } else {
            result = handle;
          }
        } else if (payMethod === "venmo") {
          let handle = payHandle;
          if (!/^https?:\/\//i.test(handle)) {
            handle = handle.replace(/^@/, "");
            handle = `https://venmo.com/${handle}`;
          }
          if (payAmt) {
            result = `${handle}?txn=pay&amount=${payAmt}`;
          } else {
            result = handle;
          }
        } else if (payMethod === "zelle") {
          const recipientName = zelleName.value.trim();
          const jsonStr = JSON.stringify({
            name: recipientName || "",
            token: payHandle
          });
          let base64Payload = "";
          try {
            base64Payload = btoa(unescape(encodeURIComponent(jsonStr)));
          } catch(e) {
            base64Payload = btoa(jsonStr);
          }
          result = `https://enroll.zellepay.com/qr-codes?data=${base64Payload}`;
        }
        break;

      case "sms":
        const smsTel = smsPhone.value.trim();
        const smsMsg = smsMessage.value;
        if (!smsTel) {
          return "sms:+15551234567";
        }
        if (smsMsg) {
          result = `sms:${smsTel}?body=${encodeURIComponent(smsMsg)}`;
        } else {
          result = `sms:${smsTel}`;
        }
        break;
    }

    return result;
  }

  function updateQrCode() {
    if (typeof QRious === "undefined") {
      console.error("QRious library is missing!");
      return;
    }

    const value = getQrString();
    const size = parseInt(sizeSlider.value);
    const isTransparent = transparentToggle && transparentToggle.checked;
    const bgAlpha = isTransparent ? 0 : 1;

    if (!qrInstance) {
      qrInstance = new QRious({
        element: canvas,
        value: value,
        size: size,
        level: "M", // Medium error correction level
        background: "#ffffff",
        backgroundAlpha: bgAlpha,
        foreground: "#000000"
      });
    } else {
      qrInstance.set({
        value: value,
        size: size,
        backgroundAlpha: bgAlpha
      });
    }
  }

  function downloadQrCode() {
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `toolanity_qrcode_${activeType}.png`;
    link.href = dataURL;
    link.click();
  }

  // Run on load
  updateQrCode();
});

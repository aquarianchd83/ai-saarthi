(function () {
  var C = window.AiSaarthi;
  var $ = function (id) { return document.getElementById(id); };

  // ---- links into the app ----
  document.querySelectorAll("[data-app]").forEach(function (a) {
    a.href = C.APP_URL.replace(/\/$/, "") + (C.PATHS[a.dataset.app] || "/");
  });
  $("yr").textContent = new Date().getFullYear();

  // ---- mobile menu ----
  var burger = $("burger"), links = $("links");
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", function () { links.classList.remove("open"); });

  // ---- pricing by country ----
  var sel = $("country");
  C.REGIONS.forEach(function (r) {
    var o = document.createElement("option");
    o.value = r.code; o.textContent = r.name; sel.appendChild(o);
  });
  function guess() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (/Kolkata|Calcutta/.test(tz)) return "IN";
      var m = (navigator.language || "").split("-")[1];
      if (m && C.REGIONS.some(function (r) { return r.code === m.toUpperCase(); })) return m.toUpperCase();
    } catch (e) {}
    return "US";
  }
  function showPrice() {
    var r = C.REGIONS.filter(function (x) { return x.code === sel.value; })[0];
    var amt = r.rate === 1 ? C.PREMIUM_USD : Math.round(C.PREMIUM_USD * r.rate);
    $("premiumPrice").textContent = r.cur + amt.toLocaleString(r.code === "IN" ? "en-IN" : "en-US");
    var base = C.APP_URL.replace(/\/$/, "") + C.PATHS.checkout;
    $("buy").href = base + (base.indexOf("?") > -1 ? "&" : "?") + "country=" + r.code;
  }
  sel.value = guess();
  sel.addEventListener("change", showPrice);
  showPrice();

  // ---- problem-solver demo ----
  var SCN = {
    estate: {
      title: "Home buyer, 11:02 PM",
      before: ["Message sits unread all night", "Buyer asks another builder", "Agent re-asks budget and location"],
      after: ["Answered in seconds, at night", "Budget and timeline collected", "Agent gets a summary and just confirms the visit"],
      chat: [
        ["in", "Do you have 2BHK flats near Baner? What is the price?"],
        ["out", "Yes! We have 2BHK flats in Baner from Rs 85 lakh. Are you looking to buy soon, and what is your approximate budget?"],
        ["in", "Around 90 lakh, planning in 2 months. Can I visit this weekend?"],
        ["sys", "🔥 Hot lead detected. Handing over to a human."],
        ["out", "Great! I have passed your details to our sales agent, who will confirm your visit."]
      ],
      summary: [["Wants", "2BHK in Baner"], ["Budget", "Rs 90 lakh"], ["Timeline", "Within 2 months"], ["Next step", "Site visit this weekend"], ["Lead score", "Hot"]]
    },
    solar: {
      title: "Rahul, 1 December, 10:00 AM",
      before: ["\"After Diwali\" is forgotten", "Rahul buys from someone else", "No record of the promise"],
      after: ["AI suggests a follow-up, manager confirms", "Message sent on the right morning", "Never at night, never more than 3 times"],
      chat: [
        ["in", "I am interested in solar, but please contact me after Diwali."],
        ["sys", "📅 AiSaarthi suggests: follow up on 1 December. Manager confirms."],
        ["out", "Hi Rahul, a quick hello as promised. Shall we plan your solar installation?"],
        ["in", "Yes, I am ready now. Please send the quote."],
        ["sys", "🔥 Customer ready. Handing over to a human."]
      ],
      summary: [["Wants", "Solar installation"], ["Waited", "Since Diwali, by choice"], ["Status", "Ready for quote"], ["Next step", "Send the quote"], ["Lead score", "Hot"]]
    },
    bakery: {
      title: "Bakery owner in Video Studio",
      before: ["Agency quote: slow and costly", "No ideas for a script", "Posts get skipped"],
      after: ["Idea to video in one flow", "Cost shown before you confirm", "Script approved by you first"],
      chat: [
        ["in", "Promote our eggless birthday cakes. Friendly and fun."],
        ["out", "Here is a 30-second story: a child is sad that her friend cannot eat cake because of allergies. A baker offers an eggless cake. Everyone smiles."],
        ["in", "Love it. Approve."],
        ["sys", "💰 Estimated cost shown. Owner confirms."],
        ["out", "Done! Your 1080x1920 video with voice-over and subtitles is ready. Ends with: \"Eggless cakes, baked fresh. Order on WhatsApp.\""]
      ],
      summary: [["Video", "30 seconds, vertical"], ["Format", "1080 x 1920 MP4"], ["Extras", "Voice-over + subtitles"], ["Use it on", "Reels, WhatsApp Status"], ["Approval", "Owner approved script"]]
    }
  };

  var cur = "estate", timers = [];
  function clear() { timers.forEach(clearTimeout); timers = []; }
  function lists() {
    var s = SCN[cur];
    $("demoTitle").textContent = s.title;
    $("beforeList").innerHTML = s.before.map(function (t) { return "<li>" + t + "</li>"; }).join("");
    $("afterList").innerHTML = s.after.map(function (t) { return "<li>" + t + "</li>"; }).join("");
  }
  function reset() {
    clear();
    $("chat").innerHTML = "";
    $("summary").hidden = true;
    $("play").disabled = false;
    lists();
  }
  function play() {
    reset();
    $("play").disabled = true;
    var s = SCN[cur];
    s.chat.forEach(function (m, i) {
      timers.push(setTimeout(function () {
        var d = document.createElement("div");
        d.className = "bubble " + m[0];
        d.textContent = m[1];
        $("chat").appendChild(d);
        if (i === s.chat.length - 1) {
          $("summaryBody").innerHTML = s.summary.map(function (p) { return "<dt>" + p[0] + "</dt><dd>" + p[1] + "</dd>"; }).join("");
          $("summary").hidden = false;
          $("play").disabled = false;
        }
      }, 900 * (i + 1)));
    });
  }
  document.querySelectorAll(".tab").forEach(function (t) {
    t.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (x) { x.classList.remove("on"); });
      t.classList.add("on");
      cur = t.dataset.scn;
      reset();
      play();
    });
  });
  $("play").addEventListener("click", play);
  $("reset").addEventListener("click", reset);
  reset();

  // autoplay when the demo scrolls into view
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { play(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe($("example"));
  }
})();

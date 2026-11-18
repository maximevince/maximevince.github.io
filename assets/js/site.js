/* Light/dark toggle. The stored choice is applied by an inline script in
   <head> before first paint; without a stored choice the OS preference
   (prefers-color-scheme) applies through CSS alone. */
(function () {
  var root = document.documentElement;
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;

  var mq = null;
  try { mq = window.matchMedia("(prefers-color-scheme: dark)"); } catch (e) {}

  function current() {
    var m = root.getAttribute("data-mode");
    if (m === "light" || m === "dark") return m;
    return mq && mq.matches ? "dark" : "light";
  }

  function sync() {
    var next = current() === "dark" ? "light" : "dark";
    btn.textContent = next;
    btn.setAttribute("aria-label", "Switch to " + next + " mode");
  }

  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-mode", next);
    try { localStorage.setItem("veemax-mode", next); } catch (e) {}
    sync();
  });

  if (mq && mq.addEventListener) mq.addEventListener("change", sync);
  btn.hidden = false;
  sync();
})();

#!/usr/bin/env python3
"""
restore-preloader.py -- re-enable the Synthetix logo preloader animation.

The theme's original animation sweeps the .inner-bar elements two at a time
(0.3s to a random width, 0.3s to 100%), then wipes the overlay away via
--preloader-clip. With 8 bars that is roughly 2.7s.

Someone had disabled it in the live site by short-circuiting the method:

    preloader: function () {
      $(".preloader").remove();     <- instant, no animation
      return;                        <- everything below became dead code
      ...

Almost certainly because the original bound only to $(window).on("load").
If load had already fired by the time main.js ran, the handler never fired and
the overlay stayed on screen forever.

This restores the animation and removes that failure mode:
  * starts immediately when document.readyState is already "complete"
  * otherwise waits for load, as before
  * finish() is idempotent
  * an 8s failsafe removes the overlay no matter what, so a visitor can never
    be trapped behind it again
"""
import pathlib, sys

TARGET = pathlib.Path('wp-content/themes/agenio/assets/js/main.js')

NEW = '''preloader: function () {
      if (!$(".preloader").length) { return; }
      var innerBars = document.querySelectorAll(".inner-bar");
      var increment = 0;
      var finished = false;

      function finish() {
        if (finished) { return; }
        finished = true;
        $(".preloader").remove();
      }

      function animateBars() {
        for (var i = 0; i < 2; i++) {
          if (!innerBars[i + increment]) { continue; }
          var randomWidth = Math.floor(Math.random() * 101);
          gsap.to(innerBars[i + increment], {
            width: randomWidth + "%",
            duration: 0.3,
            ease: "none",
          });
        }

        gsap.delayedCall(0.3, function () {
          for (var i = 0; i < 2; i++) {
            if (!innerBars[i + increment]) { continue; }
            gsap.to(innerBars[i + increment], {
              width: "100%",
              duration: 0.3,
              ease: "none",
            });
          }

          increment += 2;

          if (increment < innerBars.length) {
            animateBars();
          } else {
            gsap.timeline({ onComplete: finish }).to(".preloader", {
              "--preloader-clip": "100%",
              duration: 0.3,
              ease: "none",
            });
          }
        });
      }

      function start() {
        if (!innerBars.length) { finish(); return; }
        animateBars();
      }

      // Original bound only to window load; if load had already fired the
      // animation never ran and the overlay never went away.
      if (document.readyState === "complete") {
        start();
      } else {
        $(window).on("load", start);
      }

      // Failsafe: never trap the visitor behind the overlay.
      setTimeout(finish, 8000);
    }'''


def find_method(t):
    i = t.find('preloader: function ()')
    if i == -1:
        return None, None
    depth = 0
    started = False
    for j in range(i, len(t)):
        if t[j] == '{':
            depth += 1
            started = True
        elif t[j] == '}':
            depth -= 1
            if started and depth == 0:
                return i, j + 1
    return None, None


def main():
    t = TARGET.read_text(errors='ignore')
    if 'Failsafe: never trap the visitor' in t:
        print("    already restored")
        return 0
    i, j = find_method(t)
    if i is None:
        print("    ERROR: preloader method not found", file=sys.stderr)
        return 1
    old = t[i:j]
    if '$(".preloader").remove();\n      return;' not in old:
        print("    ERROR: expected short-circuit not present; refusing to patch", file=sys.stderr)
        return 1
    TARGET.write_text(t[:i] + NEW + t[j:])
    print(f"    replaced preloader method ({len(old)} -> {len(NEW)} chars)")
    print("    animation re-enabled, race fixed, 8s failsafe added")
    return 0


if __name__ == '__main__':
    sys.exit(main())

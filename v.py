"""
Pizza Jones — get_popup_toppings.php FIXED (Playwright version)
================================================================
PROBLEM WITH OLD VERSION:
  Item IDs are NOT in the raw HTML. They are injected by JavaScript
  after the page loads — that's why data-* and onclick scanning found nothing.

THIS VERSION:
  Uses Playwright (real Chromium browser) to:
  1. Load the full page (JS runs, menu renders completely)
  2. Click every single menu item <li>
  3. Intercept the real POST to get_popup_toppings.php
     → captures the exact item_id the browser sends
     → captures the exact JSON response (sizes, toppings, extras)
  4. Closes the popup, moves to next item
  5. Saves everything to JSON + CSV

INSTALL (one time):
  pip install playwright beautifulsoup4
  playwright install chromium

RUN:
  python get_popup_toppings_playwright.py

OUTPUTS:
  toppings_all_items.json   full structured data per item
  toppings_all_items.csv    flat spreadsheet
  toppings_raw/             raw response per item
"""

import json
import csv
import time
import re
from pathlib import Path
from bs4 import BeautifulSoup

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
except ImportError:
    print("ERROR: Playwright not installed.")
    print("Run:  pip install playwright && playwright install chromium")
    exit(1)

# ─── Config ──────────────────────────────────────────────────────────────────

BASE_URL = "https://orderonline.pizzajones.com.au/"
ENDPOINT = "get_popup_toppings.php"

OUTPUT_DIR = Path("toppings_raw")
OUTPUT_DIR.mkdir(exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
# CORE: Intercept network + click every item
# ─────────────────────────────────────────────────────────────────────────────

def scrape_all_toppings() -> list[dict]:
    """
    Opens a real Chromium browser, loads the page, clicks every menu <li>,
    intercepts the POST to get_popup_toppings.php, and collects all responses.
    """
    all_results = []

    with sync_playwright() as p:
        print("→ Launching Chromium...")
        browser = p.chromium.launch(
            headless=True,          # set False to watch it run
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            locale="en-AU",
            viewport={"width": 1280, "height": 900},
        )
        page = context.new_page()

        # ── Intercept responses from the toppings endpoint ──────────────────
        # We store them keyed by item_id so we can match request ↔ response
        intercepted: dict[str, dict] = {}

        def on_response(response):
            if ENDPOINT in response.url:
                try:
                    body = response.json()
                except Exception:
                    try:
                        body = response.text()
                    except Exception:
                        body = None
                # Get the POST body that triggered this response
                try:
                    req_body = response.request.post_data or ""
                except Exception:
                    req_body = ""

                intercepted[len(intercepted)] = {
                    "url":          response.url,
                    "status":       response.status,
                    "request_body": req_body,
                    "response":     body,
                }

        page.on("response", on_response)

        # ── Load page ────────────────────────────────────────────────────────
        print(f"→ Loading {BASE_URL}")
        page.goto(BASE_URL, wait_until="networkidle", timeout=30000)
        print("  ✓ Page loaded")

        # Dismiss any modal/popup that appears on load (order type selection etc.)
        for selector in [
            "button:has-text('Pickup')",
            "button:has-text('pickup')",
            ".close", "[data-dismiss='modal']",
            "button:has-text('×')",
        ]:
            try:
                btn = page.locator(selector).first
                if btn.is_visible(timeout=2000):
                    btn.click(timeout=2000)
                    page.wait_for_timeout(500)
                    break
            except Exception:
                pass

        # Wait for menu items to be present
        page.wait_for_selector("li", timeout=15000)
        page.wait_for_timeout(2000)   # let JS fully settle

        # ── Collect all clickable menu <li> items ────────────────────────────
        # Menu items live inside category blocks ending in "-block"
        page_html = page.content()
        soup = BeautifulSoup(page_html, "html.parser")

        menu_items_info = []  # [{category, name, selector_index}]
        global_li_index = 0

        for block in soup.find_all("div", id=lambda x: x and x.endswith("-block")):
            cat_el = block.find(["h1", "h2", "h3"])
            category = cat_el.get_text(strip=True) if cat_el else "Unknown"

            for li in block.find_all("li"):
                texts = [t.strip() for t in li.stripped_strings if t.strip()]
                name = texts[0] if texts else ""
                noise = {"×", "choose one", "required", "add", "1", "0",
                         "okay", "cancel", "out of stock"}
                if not name or name.lower() in noise or len(name) < 2:
                    global_li_index += 1
                    continue

                menu_items_info.append({
                    "category":    category,
                    "name":        name,
                    "li_index":    global_li_index,
                })
                global_li_index += 1

        print(f"  ✓ Found {len(menu_items_info)} menu items to click")

        # ── Click each item and capture the AJAX response ────────────────────
        li_elements = page.locator("li").all()

        for i, info in enumerate(menu_items_info):
            name     = info["name"]
            category = info["category"]
            li_idx   = info["li_index"]

            print(f"  [{i+1:02d}/{len(menu_items_info):02d}] {category} → {name}")

            before_count = len(intercepted)

            try:
                li = li_elements[li_idx]

                # Scroll into view + click
                li.scroll_into_view_if_needed(timeout=3000)
                li.click(timeout=4000, force=True)

                # Wait for AJAX response (up to 4 seconds)
                page.wait_for_timeout(400)
                deadline = time.time() + 4.0
                while len(intercepted) == before_count and time.time() < deadline:
                    page.wait_for_timeout(200)

                # Close any opened modal/popup
                for close_sel in [
                    ".modal .close",
                    "[data-dismiss='modal']",
                    ".popup-close",
                    "button:has-text('×')",
                    ".overlay-close",
                    "text=×",
                ]:
                    try:
                        btn = page.locator(close_sel).first
                        if btn.is_visible(timeout=500):
                            btn.click(timeout=1000)
                            break
                    except Exception:
                        pass

                page.keyboard.press("Escape")
                page.wait_for_timeout(300)

            except PWTimeout:
                print(f"         ⚠ timeout clicking item")
            except Exception as e:
                print(f"         ⚠ {e}")

            # Collect what was intercepted
            new_calls = {
                k: v for k, v in intercepted.items()
                if k >= before_count
            }
            if new_calls:
                for call in new_calls.values():
                    # Parse item_id from request body: "item_id=123&..."
                    item_id = None
                    for part in (call["request_body"] or "").split("&"):
                        if "item_id" in part:
                            val = part.split("=")[-1].strip()
                            if val.isdigit():
                                item_id = int(val)
                                break

                    parsed = parse_response(call["response"])
                    result = {
                        "item_id":      item_id,
                        "name":         name,
                        "category":     category,
                        "request_body": call["request_body"],
                        "sizes":        parsed["sizes"],
                        "toppings":     parsed["toppings"],
                        "extras":       parsed["extras"],
                        "raw_response": call["response"],
                    }
                    all_results.append(result)

                    # Save individual file
                    fname = f"item_{item_id or f'idx{i}'}.json"
                    (OUTPUT_DIR / fname).write_text(
                        json.dumps(result, indent=2, ensure_ascii=False, default=str),
                        encoding="utf-8"
                    )
                    sizes_str    = ", ".join(str(s) for s in parsed["sizes"][:2])
                    toppings_str = str(len(parsed["toppings"])) + " toppings"
                    print(f"         ✓ item_id={item_id}  {sizes_str}  {toppings_str}")
            else:
                print(f"         ✗ no AJAX call captured")
                all_results.append({
                    "item_id":      None,
                    "name":         name,
                    "category":     category,
                    "request_body": None,
                    "sizes":        [],
                    "toppings":     [],
                    "extras":       [],
                    "raw_response": None,
                })

        browser.close()
        print(f"\n  Browser closed. Total AJAX calls captured: {len(intercepted)}")

    return all_results


# ─────────────────────────────────────────────────────────────────────────────
# Parse the toppings JSON response
# ─────────────────────────────────────────────────────────────────────────────

def parse_response(data) -> dict:
    """
    Handle every response format the Deliverit platform might return:
      • dict with keys: sizes, toppings, extras, data, items, options
      • list of items
      • HTML string with <option> / <input> elements
      • null / empty
    """
    result = {"sizes": [], "toppings": [], "extras": []}

    if not data:
        return result

    # ── JSON dict ────────────────────────────────────────────────────────────
    if isinstance(data, dict):
        # Unwrap "data" wrapper
        root = data.get("data", data)

        for key in ["sizes", "size", "size_options", "size_list"]:
            if key in root:
                result["sizes"] = _normalize_list(root[key])
                break

        for key in ["toppings", "topping_list", "ingredients",
                    "current_toppings", "options"]:
            if key in root:
                result["toppings"] = _normalize_list(root[key])
                break

        for key in ["extras", "extra_options", "add_ons", "addons",
                    "modifiers", "optional_extras"]:
            if key in root:
                result["extras"] = _normalize_list(root[key])
                break

        return result

    # ── JSON list ────────────────────────────────────────────────────────────
    if isinstance(data, list):
        result["toppings"] = data
        return result

    # ── HTML string (Deliverit sometimes returns HTML fragments) ─────────────
    if isinstance(data, str) and ("<" in data):
        soup = BeautifulSoup(data, "html.parser")

        for opt in soup.find_all("option"):
            val   = opt.get("value", "")
            label = opt.get_text(strip=True)
            price_match = re.search(r'\$([0-9.]+)', label)
            result["sizes"].append({
                "value": val,
                "label": label,
                "price": price_match.group(1) if price_match else "",
            })

        for inp in soup.find_all("input", type=lambda t: t in ("checkbox","radio")):
            lbl_el = soup.find("label", {"for": inp.get("id","__")})
            label  = lbl_el.get_text(strip=True) if lbl_el else inp.get("value","")
            result["toppings"].append({
                "type":  inp.get("type",""),
                "name":  label,
                "value": inp.get("value",""),
                "name_attr": inp.get("name",""),
            })

    return result


def _normalize_list(obj) -> list:
    if isinstance(obj, list):
        return obj
    if isinstance(obj, dict):
        return list(obj.values())
    return []


# ─────────────────────────────────────────────────────────────────────────────
# Save outputs
# ─────────────────────────────────────────────────────────────────────────────

def save_json(data: list, path="toppings_all_items.json"):
    clean = []
    for d in data:
        clean.append({k: v for k, v in d.items() if k != "raw_response"})
    with open(path, "w", encoding="utf-8") as f:
        json.dump(clean, f, indent=2, ensure_ascii=False, default=str)
    print(f"  ✓ JSON → {path}")


def save_csv(data: list, path="toppings_all_items.csv"):
    rows = []
    for item in data:
        base = {
            "item_id":  item.get("item_id", ""),
            "category": item.get("category", ""),
            "name":     item.get("name", ""),
        }
        added = False
        for s in item.get("sizes", []):
            label = s.get("label") or s.get("size_name") or s.get("name") or str(s)
            price = s.get("price") or s.get("price_cents","")
            rows.append({**base, "type": "size", "option": label, "price": price})
            added = True
        for t in item.get("toppings", []):
            label = t.get("name") or t.get("topping_name") or t.get("label") or str(t)
            price = t.get("price","")
            rows.append({**base, "type": "topping", "option": label, "price": price})
            added = True
        for e in item.get("extras", []):
            label = e.get("name") or e.get("label") or str(e)
            price = e.get("price","")
            rows.append({**base, "type": "extra", "option": label, "price": price})
            added = True
        if not added:
            rows.append({**base, "type": "", "option": "no data returned", "price": ""})

    if not rows:
        print("  ⚠ No rows to write")
        return

    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["item_id","category","name","type","option","price"])
        w.writeheader()
        w.writerows(rows)
    print(f"  ✓ CSV  → {path}  ({len(rows)} rows)")


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 62)
    print("  get_popup_toppings.php — Playwright Edition")
    print("=" * 62)

    results = scrape_all_toppings()

    # Summary
    success = sum(1 for r in results if r["sizes"] or r["toppings"] or r["extras"])
    total   = len(results)
    print(f"\n  Items with data: {success} / {total}")

    # Show a sample
    for r in results[:3]:
        if r["sizes"]:
            print(f"\n  Sample → {r['name']} (id={r['item_id']})")
            for s in r["sizes"]:
                print(f"    size:    {s}")
            for t in r["toppings"][:4]:
                print(f"    topping: {t}")
            for e in r["extras"][:3]:
                print(f"    extra:   {e}")

    # Save
    print("\n→ Saving outputs...")
    save_json(results)
    save_csv(results)
    print(f"  Raw files → {OUTPUT_DIR}/")

    print("\n" + "=" * 62)
    print("  Done!")
    print("  toppings_all_items.json — all sizes + toppings + extras")
    print("  toppings_all_items.csv  — flat spreadsheet")
    print(f"  {OUTPUT_DIR}/           — raw response per item")
    print("=" * 62)
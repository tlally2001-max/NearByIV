"""Import confirmed-mobile IV providers from enriched CSV into Supabase."""

import csv
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://hebqdkpbuwuuhnwwfnpv.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "NearbyIV_Step3_Enriched.csv")


def clean_hero_image(val: str) -> str | None:
    """Clean up hero image URLs — strip markdown artifacts."""
    if not val:
        return None
    val = val.strip().strip("]()")
    if val.startswith("http"):
        return val
    return None


def main():
    rows = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("Is_Confirmed_Mobile", "").strip().lower() != "true":
                continue

            rows.append(
                {
                    "name": row["name"].strip(),
                    "city": row.get("city", "").strip() or None,
                    "state": row.get("state", "").strip() or None,
                    "website": row.get("website", "").strip() or None,
                    "rating": float(row["rating"]) if row.get("rating") else None,
                    "reviews": int(float(row["reviews"])) if row.get("reviews") else None,
                    "hero_image": clean_hero_image(row.get("Hero_Image", "")),
                    "treatments": row.get("Treatments", "").strip() or None,
                    "is_confirmed_mobile": True,
                }
            )

    if not rows:
        print("No confirmed-mobile rows found.")
        return

    # Deduplicate by (name, website)
    seen = set()
    unique_rows = []
    for r in rows:
        key = (r["name"], r["website"])
        if key not in seen:
            seen.add(key)
            unique_rows.append(r)
    rows = unique_rows

    print(f"Found {len(rows)} unique confirmed-mobile providers. Uploading...")

    BATCH = 50
    inserted = 0
    for i in range(0, len(rows), BATCH):
        batch = rows[i : i + BATCH]
        supabase.table("providers").upsert(batch, on_conflict="name,website").execute()
        inserted += len(batch)
        print(f"  Upserted {inserted}/{len(rows)} ...")

    print(f"Done! {len(rows)} providers imported.")


if __name__ == "__main__":
    main()

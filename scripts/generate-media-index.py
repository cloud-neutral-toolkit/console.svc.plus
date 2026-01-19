#!/usr/bin/env python3
import os
import json
import io
import datetime

# Configuration
PUBLIC_DIR = "public"
OUTPUT_DIR = "public/_media"
MEDIA_TYPES = {
    "images": {
        "extensions": {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"},
        "type": "image"
    },
    "videos": {
        "extensions": {".mp4", ".webm", ".mov"},
        "type": "video"
    }
}

def generate_index(category, config):
    base_dir = os.path.join(PUBLIC_DIR, category)
    valid_extensions = config["extensions"]
    media_type = config["type"]
    items = []

    if not os.path.exists(base_dir):
        print(f"Directory not found: {base_dir}. Skipping.")
        return None

    has_files = False
    # Walk directory
    for root, _, files in os.walk(base_dir):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in valid_extensions:
                has_files = True
                # Calculate relative path from public/{category}
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, base_dir)
                
                # Normalize path separators to forward slash
                rel_path = rel_path.replace(os.path.sep, "/")
                
                # Remove leading slash if present (os.path.relpath usually doesn't add one, but for safety)
                rel_path = rel_path.lstrip("/")
                
                # Get file modification time in ISO format
                mtime = os.path.getmtime(full_path)
                updated_at = datetime.datetime.fromtimestamp(mtime).isoformat()

                # Parse location from path (heuristic: use parent folders)
                # e.g. china/shanghai/pudong/landscape/xxx.jpg -> "Pudong, Shanghai"
                # Simplified: take the last two directory segments if available, reverse them, and capitalize
                path_parts = rel_path.split('/')[:-1] # Exclude filename
                location = None
                if path_parts:
                    # Filter out purely structural folders if known? For now just take decent parts
                    # Let's try to take up to 2 meaningful parts.
                    # e.g. china/shanghai/huangpu/citywalk -> Huangpu, Shanghai
                    
                    # Remove common prefix words if any, or just take last 2
                    meaningful_parts = [p for p in path_parts if p not in ['drone', 'landscape', 'citywalk', 'architecture']]
                    if meaningful_parts:
                        # Take last 2
                        loc_parts = meaningful_parts[-2:]
                        # Capitalize and reverse
                        loc_parts = [p.title() for p in loc_parts]
                        location = ", ".join(reversed(loc_parts))


                # Generate random views for demo purposes (100 - 5000)
                # make it deterministic based on filename hash so it doesn't change on every run
                import hashlib
                hash_obj = hashlib.md5(rel_path.encode())
                hash_int = int(hash_obj.hexdigest(), 16)
                views = 100 + (hash_int % 4900)

                items.append({
                    "path": rel_path,
                    "ext": ext.lstrip("."),
                    "type": media_type,
                    "updatedAt": updated_at,
                    "location": location,
                    "views": views
                })
    
    if not has_files:
        print(f"No files found in {base_dir}. Skipping generation to preserve existing index if any.")
        return None


    # Sort lexicographically by path
    items.sort(key=lambda x: x["path"])
    return items

def load_existing_index(output_file):
    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return None
    return None

def main():
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Check if running on Vercel
    if os.environ.get('VERCEL'):
        print("Running on Vercel. Skipping media index generation to preserve repository files.")
        return

    for category, config in MEDIA_TYPES.items():
        print(f"Scanning {category}...")
        items = generate_index(category, config)
        
        output_file = os.path.join(OUTPUT_DIR, f"{category}.json")
        existing_items = load_existing_index(output_file)

        # Protection Logic:
        # If we have an existing index with many items, and the new scan returned very few (or None),
        # assume we are in an environment missing assets (like CI) and PRESERVE existing index.
        if existing_items and len(existing_items) > 10:
             # If new items is None (directory missing/empty) or drastically fewer
             new_count = len(items) if items else 0
             if new_count < len(existing_items) * 0.1: # Less than 10% of original
                 print(f"WARNING: Protection triggered for {category}. Existing index has {len(existing_items)} items, scan found {new_count}. Preserving existing index.")
                 continue

        if items is None:
             # If no existing index to protect, strict behavior might be to do nothing or write empty.
             # Current logic: continue (do nothing)
            continue

        
        # Write JSON with deterministic formatting
        with io.open(output_file, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
            f.write('\n') # Add trailing newline
            
        print(f"Generated {output_file} with {len(items)} items")

if __name__ == "__main__":
    main()

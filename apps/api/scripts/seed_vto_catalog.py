import os
import sys
import asyncio
from pathlib import Path

# Add parent directory to path to enable app imports
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

from app.core.config import settings
from app.models.wardrobe import WardrobeItem
from app.models.user import User

VTO_DIR = Path(__file__).resolve().parent.parent.parent.parent / "vto and more"


async def seed_catalog():
    print(f"Scanning VTO Asset Catalog at: {VTO_DIR}")
    if not VTO_DIR.exists():
        print(f"Error: Directory {VTO_DIR} does not exist.")
        return

    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as db:
        # Get or identify system/admin user
        result = await db.execute(select(User).limit(1))
        user = result.scalars().first()
        if not user:
            print("No system user found in database. Please run DB migrations/user creation first.")
            return

        items_created = 0
        
        for root, dirs, files in os.walk(VTO_DIR):
            folder_name = Path(root).name
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png')) and not file.startswith('.'):
                    rel_path = os.path.relpath(os.path.join(root, file), VTO_DIR.parent)
                    
                    # Determine category & taxonomy based on folder name
                    category = "outerwear"
                    subcategory = "suit"
                    formality = "Business Formal"
                    gender = "unisex"
                    
                    if "footwear" in folder_name:
                        category = "footwear"
                        subcategory = "shoes"
                        formality = "Business Formal" if "oxford" in file or "loafer" in file else "Casual"
                    elif "accessories" in folder_name:
                        category = "accessories"
                        if "watch" in file:
                            subcategory = "watch"
                        elif "tie" in file:
                            subcategory = "tie"
                        elif "hat" in file or "cap" in file:
                            subcategory = "headwear"
                        elif "bag" in file:
                            subcategory = "bag"
                        else:
                            subcategory = "jewelry"
                    elif "hairstyles" in folder_name:
                        category = "hairstyles"
                        subcategory = "hair"
                        gender = "male" if "men" in file else "female"
                    elif "professional" in folder_name:
                        category = "clothing"
                        formality = "Business Formal"
                    
                    item_name = file.rsplit('.', 1)[0].replace('_', ' ').title()
                    
                    # Check if already exists
                    existing = await db.execute(
                        select(WardrobeItem).where(
                            WardrobeItem.user_id == user.id,
                            WardrobeItem.name == item_name,
                            WardrobeItem.source_type == "personaiq_catalog"
                        )
                    )
                    if existing.scalars().first():
                        continue

                    new_item = WardrobeItem(
                        user_id=user.id,
                        name=item_name,
                        category=category,
                        subcategory=subcategory,
                        formality=formality,
                        gender_target=gender,
                        photo_url=f"/{rel_path}",
                        source_type="personaiq_catalog",
                        vto_supported=True,
                        vto_category=category,
                        occasions=["interview", "meeting", "conference", "formal"],
                        style_tags=["executive", "curated"],
                    )
                    db.add(new_item)
                    items_created += 1

        await db.commit()
        print(f"Successfully seeded {items_created} new VTO Catalog items into database.")

if __name__ == "__main__":
    asyncio.run(seed_catalog())

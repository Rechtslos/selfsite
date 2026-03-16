from fastapi import FastAPI, APIRouter
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
import zipfile
import tempfile
import shutil


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.get("/download-source")
async def download_source_code():
    """Download the complete frontend source code as a ZIP file"""
    frontend_dir = Path("/app/frontend")
    
    # Create a temporary directory for the zip
    temp_dir = tempfile.mkdtemp()
    zip_path = os.path.join(temp_dir, "urheberrechtslos-website.zip")
    
    # Directories and files to exclude
    exclude_dirs = {'node_modules', '.git', 'build', '.cache'}
    exclude_files = {'.env'}
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(frontend_dir):
            # Filter out excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file in exclude_files:
                    continue
                    
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, frontend_dir)
                zipf.write(file_path, f"urheberrechtslos-website/{arcname}")
        
        # Add a README with instructions
        readme_content = """# Urheberrechtslos - Social Media Link Page

## So startest du die Website lokal:

### Voraussetzungen
- Node.js (v18 oder höher)
- npm oder yarn

### Installation

1. Öffne ein Terminal in diesem Ordner

2. Installiere die Abhängigkeiten:
   ```bash
   yarn install
   # oder
   npm install
   ```

3. Erstelle eine `.env` Datei mit folgendem Inhalt:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

4. Starte die Entwicklungsumgebung:
   ```bash
   yarn start
   # oder
   npm start
   ```

5. Öffne http://localhost:3000 in deinem Browser

### Deine Links anpassen

Bearbeite die Datei `src/App.js` und ändere die `socialLinks` Array mit deinen echten URLs.

---
Made with ♡ by Urheberrechtslos
"""
        zipf.writestr("urheberrechtslos-website/README.md", readme_content)
    
    return FileResponse(
        zip_path,
        media_type="application/zip",
        filename="urheberrechtslos-website.zip",
        headers={"Content-Disposition": "attachment; filename=urheberrechtslos-website.zip"}
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
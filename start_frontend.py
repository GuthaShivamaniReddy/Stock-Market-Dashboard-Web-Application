#!/usr/bin/env python3
"""
Startup script for the Stock Market Dashboard Frontend
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    # Change to frontend directory
    frontend_dir = Path(__file__).parent / "frontend"
    os.chdir(frontend_dir)
    
    print("🚀 Starting Stock Market Dashboard Frontend...")
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Check if node_modules exists
    node_modules_path = frontend_dir / "node_modules"
    if not node_modules_path.exists():
        print("📦 Installing npm dependencies...")
        subprocess.run(["npm", "install"], check=True)
    
    # Start the development server
    print("🌐 Starting React development server...")
    print("📍 App will be available at: http://localhost:3000")
    print("🔄 Press Ctrl+C to stop the server")
    
    try:
        subprocess.run(["npm", "start"])
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Goodbye!")

if __name__ == "__main__":
    main()

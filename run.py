#!/usr/bin/env python3
"""
Main runner script for Stock Market Dashboard
Starts both backend and frontend servers
"""

import os
import sys
import time
import subprocess
import threading
from pathlib import Path

def run_backend():
    """Run the backend server"""
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    # Check if virtual environment exists
    venv_path = backend_dir / "venv"
    if not venv_path.exists():
        print("📦 Creating backend virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
    
    # Determine python path
    if os.name == 'nt':  # Windows
        python_path = venv_path / "Scripts" / "python.exe"
        pip_path = venv_path / "Scripts" / "pip.exe"
    else:  # Unix/Linux/Mac
        python_path = venv_path / "bin" / "python"
        pip_path = venv_path / "bin" / "pip"
    
    # Install dependencies
    print("📦 Installing backend dependencies...")
    subprocess.run([str(pip_path), "install", "-r", "requirements.txt"], check=True)
    
    # Start server
    print("🌐 Starting backend server...")
    subprocess.run([str(python_path), "-m", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])

def run_frontend():
    """Run the frontend server"""
    frontend_dir = Path(__file__).parent / "frontend"
    os.chdir(frontend_dir)
    
    # Install dependencies if needed
    node_modules_path = frontend_dir / "node_modules"
    if not node_modules_path.exists():
        print("📦 Installing frontend dependencies...")
        subprocess.run(["npm", "install"], check=True)
    
    # Start server
    print("🌐 Starting frontend server...")
    subprocess.run(["npm", "start"])

def main():
    print("🚀 Starting Stock Market Dashboard...")
    print("=" * 50)
    
    # Check if Node.js is installed
    try:
        subprocess.run(["node", "--version"], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Node.js is not installed. Please install Node.js first.")
        print("📥 Download from: https://nodejs.org/")
        sys.exit(1)
    
    # Check if npm is installed
    try:
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ npm is not installed. Please install npm first.")
        sys.exit(1)
    
    print("✅ Node.js and npm are available")
    print()
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    # Wait a bit for backend to start
    print("⏳ Waiting for backend to start...")
    time.sleep(5)
    
    # Start frontend
    run_frontend()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Shutting down Stock Market Dashboard...")
        print("Goodbye!")

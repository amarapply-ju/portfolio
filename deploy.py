#!/usr/bin/env python3
"""
Portfolio Deployment Script
Automates git operations to update main branch and deploy to GitHub Pages
"""

import subprocess
import sys
from datetime import datetime


def run_command(command, description):
    """Execute a shell command and handle errors"""
    print(f"\n{'='*60}")
    print(f"🔄 {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        )
        
        if result.stdout:
            print(result.stdout)
        
        print(f"✅ {description} - SUCCESS")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - FAILED")
        print(f"Error: {e.stderr}")
        return False


def get_commit_message():
    """Get commit message from user or use default"""
    if len(sys.argv) > 1:
        return " ".join(sys.argv[1:])
    else:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return f"Update portfolio - {timestamp}"


def deploy():
    """Main deployment function"""
    print("\n" + "="*60)
    print("🚀 PORTFOLIO DEPLOYMENT SCRIPT")
    print("="*60)
    
    commit_message = get_commit_message()
    print(f"\n📝 Commit Message: {commit_message}")
    
    # Step 1: Check git status
    if not run_command("git status --short", "Checking git status"):
        print("\n⚠️  No changes detected or error occurred")
        return
    
    # Step 2: Add all changes
    if not run_command("git add -A", "Adding all changes"):
        return
    
    # Step 3: Commit changes
    if not run_command(f'git commit -m "{commit_message}"', "Committing changes"):
        print("\n⚠️  Nothing to commit or commit failed")
        # Continue anyway as there might be previous commits to push
    
    # Step 4: Push to main
    if not run_command("git push origin main", "Pushing to main branch"):
        return
    
    # Step 5: Sync gh-pages with main (Force Update)
    if not run_command("git checkout gh-pages", "Switching to gh-pages branch"):
        return

    if not run_command("git reset --hard main", "Syncing gh-pages with main"):
        run_command("git checkout main", "Returning to main branch")
        return
    
    # Step 6: Push gh-pages
    if not run_command("git push -f origin gh-pages", "Force pushing to gh-pages"):
        run_command("git checkout main", "Returning to main branch")
        return
    
    # Step 8: Return to main branch
    if not run_command("git checkout main", "Returning to main branch"):
        return
    
    print("\n" + "="*60)
    print("✨ DEPLOYMENT COMPLETE!")
    print("="*60)
    print("\n📦 Changes pushed to main branch")
    print("🌐 GitHub Pages updated")
    print("⏱️  Site will be live in 1-2 minutes")
    print("\n" + "="*60 + "\n")


if __name__ == "__main__":
    try:
        deploy()
    except KeyboardInterrupt:
        print("\n\n⚠️  Deployment cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        sys.exit(1)

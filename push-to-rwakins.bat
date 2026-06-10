@echo off
REM One-click push of this repo to leobergjackson/RWAkins
cd /d "%~dp0"
echo Pointing 'rwakins' remote at leobergjackson/RWAkins...
git remote remove rwakins 2>nul
git remote add rwakins https://github.com/leobergjackson/RWAkins.git
echo.
echo Pushing current branch to main...
git push -u rwakins HEAD:main
if errorlevel 1 (
  echo.
  echo Normal push failed. If the repo already has a commit/README, force-push instead:
  echo     git push -u rwakins HEAD:main --force
)
echo.
pause

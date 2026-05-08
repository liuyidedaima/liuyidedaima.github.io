@echo off
setlocal
chcp 65001 >nul

set "SOURCE_DIR=E:\simola"
set "PAGES_REPO=E:\simola-pages-repo"
set "TARGET_DIR=%PAGES_REPO%\simola"

echo [1/4] Checking folders...
if not exist "%SOURCE_DIR%\index.html" (
  echo Source file not found: %SOURCE_DIR%\index.html
  pause
  exit /b 1
)

if not exist "%PAGES_REPO%\.git" (
  echo Pages repo not found: %PAGES_REPO%
  echo Please confirm E:\simola-pages-repo exists and is a git repository.
  pause
  exit /b 1
)

echo [2/4] Copying site files...
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
if not exist "%TARGET_DIR%\vendor" mkdir "%TARGET_DIR%\vendor"

copy /Y "%SOURCE_DIR%\index.html" "%TARGET_DIR%\index.html" >nul
copy /Y "%SOURCE_DIR%\styles.css" "%TARGET_DIR%\styles.css" >nul
copy /Y "%SOURCE_DIR%\app.js" "%TARGET_DIR%\app.js" >nul
if exist "%SOURCE_DIR%\vendor" (
  xcopy "%SOURCE_DIR%\vendor" "%TARGET_DIR%\vendor" /E /I /Y >nul
)

echo [3/4] Creating local commit...
git -C "%PAGES_REPO%" add simola
git -C "%PAGES_REPO%" diff --cached --quiet
if errorlevel 1 (
  git -C "%PAGES_REPO%" commit -m "Update Simola site"
) else (
  echo No changes detected. Nothing to commit.
)

echo [4/4] Done.
echo Local commit is ready, but it has not been pushed.
echo Run this manually when you want to publish:
echo git -C "%PAGES_REPO%" push origin main
echo.
echo Published URL:
echo https://liuyidedaima.github.io/simola/
pause

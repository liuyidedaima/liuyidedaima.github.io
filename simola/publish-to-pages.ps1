$ErrorActionPreference = "Stop"

$sourceDir = "E:\simola"
$pagesRepo = "E:\simola-pages-repo"
$targetDir = Join-Path $pagesRepo "simola"

Write-Host "[1/4] Checking folders..."
if (-not (Test-Path (Join-Path $sourceDir "index.html"))) {
  throw "Source file not found: $sourceDir\index.html"
}

if (-not (Test-Path (Join-Path $pagesRepo ".git"))) {
  throw "Pages repo not found: $pagesRepo"
}

Write-Host "[2/4] Copying site files..."
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $targetDir "vendor") | Out-Null
Copy-Item -LiteralPath (Join-Path $sourceDir "index.html") -Destination (Join-Path $targetDir "index.html") -Force
Copy-Item -LiteralPath (Join-Path $sourceDir "styles.css") -Destination (Join-Path $targetDir "styles.css") -Force
Copy-Item -LiteralPath (Join-Path $sourceDir "app.js") -Destination (Join-Path $targetDir "app.js") -Force
if (Test-Path (Join-Path $sourceDir "vendor")) {
  Copy-Item -Path (Join-Path $sourceDir "vendor\\*") -Destination (Join-Path $targetDir "vendor") -Recurse -Force
}

Write-Host "[3/4] Creating local commit..."
git -C $pagesRepo add simola

$status = git -C $pagesRepo status --short
if (-not $status) {
  Write-Host "No changes detected. Nothing to commit."
}
else {
  git -C $pagesRepo commit -m "Update Simola site"
}

Write-Host "[4/4] Done."
Write-Host "Local commit is ready, but it has not been pushed."
Write-Host "Run this manually when you want to publish:"
Write-Host "git -C `"$pagesRepo`" push origin main"
Write-Host ""
Write-Host "Published URL:"
Write-Host "https://liuyidedaima.github.io/simola/"

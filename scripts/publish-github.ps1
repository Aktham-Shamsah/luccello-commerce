param(
  [Parameter(Mandatory = $true)]
  [string]$RepositoryUrl,

  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path ".git")) {
  throw "Run this script from the repository root."
}

$status = git status --short
if ($status) {
  throw "Working tree is not clean. Commit or discard local changes before publishing."
}

$hasOrigin = (git remote) -contains "origin"
if (-not $hasOrigin) {
  git remote add origin $RepositoryUrl
} else {
  $remote = git remote get-url origin
  if ($remote -ne $RepositoryUrl) {
    git remote set-url origin $RepositoryUrl
  }
}

git branch -M $Branch
git push -u origin $Branch

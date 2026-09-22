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
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to add origin remote."
  }
} else {
  $remote = git remote get-url origin
  if ($remote -ne $RepositoryUrl) {
    git remote set-url origin $RepositoryUrl
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to update origin remote."
    }
  }
}

git branch -M $Branch
if ($LASTEXITCODE -ne 0) {
  throw "Failed to rename local branch to $Branch."
}

git push -u origin $Branch
if ($LASTEXITCODE -ne 0) {
  throw "Failed to push $Branch to $RepositoryUrl."
}

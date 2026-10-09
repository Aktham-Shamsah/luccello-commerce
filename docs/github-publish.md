# GitHub Publish

The repository is committed locally and ready to publish once a GitHub repository exists.

Confirm the commit being published:

```powershell
git rev-parse HEAD
```

Create a destination repository in your GitHub account or organization, then use its HTTPS URL:

```text
https://github.com/Aktham-Shamsah/luccello-commerce.git
```

Publish from the repository root:

```powershell
.\scripts\publish-github.ps1 -RepositoryUrl "https://github.com/Aktham-Shamsah/luccello-commerce.git"
```

If GitHub prompts for authentication, use a GitHub account or token with push access to the destination repository. The full store runs on a local Ubuntu server using Docker Compose; GitHub Pages is only a static preview.

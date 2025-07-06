# GitHub Setup Guide

This guide explains how to configure the GitHub repository with the provided configuration files.

## 🚀 Quick Setup

### 1. Push Configuration Files
First, push all the configuration files to your repository:
```bash
git add .github/
git commit -m "feat: add GitHub configuration files"
git push origin main
```

### 2. Configure Branch Protection Rules

1. Go to your repository: https://github.com/HiGeorges/NestJs-Telescope
2. Navigate to **Settings** → **Branches**
3. Click **Add rule** for the `main` branch
4. Configure the following settings:
   - ✅ **Require a pull request before merging**
   - ✅ **Require approvals** (set to 1)
   - ✅ **Dismiss stale PR approvals when new commits are pushed**
   - ✅ **Require review from code owners**
   - ✅ **Require status checks to pass before merging**
     - Add: `build`, `test`, `lint`
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Require linear history**
   - ✅ **Require signed commits**
   - ✅ **Restrict pushes that create files**
   - ✅ **Restrict pushes that create tags**
   - ✅ **Allow force pushes** (for maintainers)
   - ✅ **Allow deletions** (for maintainers)

### 3. Configure Tag Protection Rules

1. Go to **Settings** → **Tags**
2. Click **Add rule** for pattern `v*`
3. Configure the following settings:
   - ✅ **Require signed commits**
   - ✅ **Restrict pushes that create tags**
   - ✅ **Allow force pushes** (for maintainers)
   - ✅ **Allow deletions** (for maintainers)

### 4. Set Up Labels

1. Go to **Issues** → **Labels**
2. Click **New label** for each label in `.github/labels.yml`
3. Or use a GitHub Action to automatically create labels (recommended)

### 5. Configure Issue Templates

1. Go to **Settings** → **General** → **Features**
2. Enable **Issues**
3. The templates in `.github/ISSUE_TEMPLATE/` will be automatically used

### 6. Set Up CODEOWNERS

1. Go to **Settings** → **Code owners**
2. The `.github/CODEOWNERS` file will be automatically used
3. Ensure you have the necessary permissions

## 🔧 Detailed Configuration

### Branch Protection Rules

#### Main Branch
- **Pattern**: `main`
- **Protection**: High
- **Reviews**: Required (1 approval)
- **Status Checks**: Required (build, test, lint)
- **History**: Linear required
- **Signing**: Commits must be signed

#### Development Branch
- **Pattern**: `develop`
- **Protection**: Medium
- **Reviews**: Required (1 approval)
- **Status Checks**: Required
- **Force Push**: Allowed for maintainers

#### Feature Branches
- **Pattern**: `feature/*`
- **Protection**: Medium
- **Reviews**: Required
- **Status Checks**: Required

### Tag Protection Rules

#### Version Tags
- **Pattern**: `v*`
- **Signing**: Required
- **Creation**: Restricted to maintainers
- **Force Push**: Allowed for maintainers
- **Deletion**: Allowed for maintainers

## 📋 Labels Setup

### Automatic Setup (Recommended)
Create a GitHub Action to automatically set up labels:

```yaml
# .github/workflows/setup-labels.yml
name: Setup Labels
on:
  push:
    paths:
      - '.github/labels.yml'
jobs:
  setup-labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const yaml = require('js-yaml');
            
            const labels = yaml.load(fs.readFileSync('.github/labels.yml', 'utf8'));
            
            for (const label of labels) {
              try {
                await github.rest.issues.createLabel({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  name: label.name,
                  color: label.color,
                  description: label.description
                });
              } catch (error) {
                if (error.status !== 422) {
                  throw error;
                }
              }
            }
```

### Manual Setup
Create each label manually in the GitHub interface:

1. Go to **Issues** → **Labels**
2. Click **New label**
3. Enter the name, color, and description from `.github/labels.yml`

## 🔐 Security Configuration

### Commit Signing
1. Generate a GPG key or use SSH signing
2. Add the key to your GitHub account
3. Configure Git to sign commits:
   ```bash
   git config --global commit.gpgsign true
   git config --global user.signingkey YOUR_KEY_ID
   ```

### Access Control
1. Go to **Settings** → **Collaborators and teams**
2. Add collaborators with appropriate permissions
3. Consider using teams for better organization

## 🤖 Automation

### Status Checks
The following checks should be configured:
- **build**: Ensures code compiles
- **test**: Ensures tests pass
- **lint**: Ensures code style compliance

### Required Reviews
- At least 1 review required for all changes
- Code owners automatically requested
- Stale reviews dismissed on new commits

## 📝 Templates

### Issue Templates
The following templates are available:
- **Bug Report**: For reporting bugs
- **Feature Request**: For suggesting features
- **Question**: For general questions

### Pull Request Template
A comprehensive PR template is available with:
- Description and type of change
- Related issues
- Testing checklist
- Code quality checklist
- Screenshots and notes
- Breaking changes and performance impact

## 🎯 Best Practices

### For Contributors
1. **Use templates**: Always use the provided issue and PR templates
2. **Follow conventions**: Use conventional commit messages
3. **Test thoroughly**: Ensure all tests pass before submitting
4. **Update docs**: Include documentation updates with features
5. **Use labels**: Apply appropriate labels to issues and PRs

### For Maintainers
1. **Review promptly**: Respond to PRs and issues quickly
2. **Enforce standards**: Ensure code quality and documentation
3. **Manage releases**: Create releases with proper tags
4. **Monitor activity**: Keep an eye on issues and discussions

### For Administrators
1. **Configure protection**: Set up branch and tag protection
2. **Manage access**: Control who can push and merge
3. **Monitor security**: Keep dependencies updated
4. **Backup data**: Regular backups of repository data

## 🆘 Troubleshooting

### Common Issues

#### Branch Protection Too Restrictive
- Check if you're a maintainer
- Ensure you have the right permissions
- Verify your commits are signed

#### Labels Not Working
- Check if labels exist in the repository
- Verify the label names match exactly
- Ensure you have permission to add labels

#### Templates Not Showing
- Check if templates are in the correct location
- Verify the file names and structure
- Ensure the repository has issues enabled

### Getting Help
- Check the [GitHub documentation](https://docs.github.com/)
- Open an issue with the `question` label
- Contact the maintainer at georges.heloussato@epitech.eu

## 📞 Support

If you need help with the GitHub configuration:
- **Documentation**: [GitHub Docs](https://docs.github.com/)
- **Issues**: [GitHub Issues](https://github.com/HiGeorges/NestJs-Telescope/issues)
- **Email**: georges.heloussato@epitech.eu
- **Maintainer**: [HiGeorges](https://github.com/HiGeorges)

---

**Note**: This configuration is designed for a professional open-source project. Adjust the settings based on your specific needs and team size. 
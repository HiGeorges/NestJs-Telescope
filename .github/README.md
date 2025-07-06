# GitHub Configuration

This directory contains GitHub-specific configuration files for the NestJS Telescope project.

## Files Overview

### Branch and Tag Protection
- **`branch-protection-rules.yml`** - Defines protection rules for different branch types
- **`tag-protection-rules.yml`** - Defines protection rules for version tags

### Issue and PR Management
- **`CODEOWNERS`** - Defines who is responsible for different parts of the codebase
- **`ISSUE_TEMPLATE/`** - Templates for bug reports, feature requests, and questions
- **`pull_request_template.md`** - Template for pull requests
- **`labels.yml`** - Configuration for GitHub labels

## Branch Protection Rules

### Main Branch (`main`)
- Requires pull request reviews before merging
- Requires status checks to pass (build, test, lint)
- Requires branches to be up to date
- Restricts direct pushes (only maintainers can push directly)
- Requires linear history
- Requires signed commits

### Development Branch (`develop`)
- Similar to main but less restrictive
- Allows maintainers to force push if needed

### Feature Branches (`feature/*`)
- Requires reviews and status checks
- Good for contributor workflows

### Hotfix Branches (`hotfix/*`)
- Similar to feature branches but optimized for urgent fixes

### Release Branches (`release/*`)
- For preparing releases
- Allows maintainers to make final adjustments

## Tag Protection Rules

### Version Tags (`v*`)
- Enforces semantic versioning (e.g., v1.0.0, v1.1.0-alpha.1)
- Requires signed commits for security
- Only allows tags from main branch
- Restricts tag creation to maintainers
- Allows maintainers to force push and delete tags if needed

## Issue Templates

### Bug Report
- Structured template for reporting bugs
- Includes environment information
- Requires reproduction steps
- Includes checklist for completeness

### Feature Request
- Template for suggesting new features
- Includes use cases and implementation ideas
- Requires problem statement and proposed solution

### Question
- Template for general questions
- Includes context and code examples
- Encourages checking documentation first

## Pull Request Template

### Sections Included
- Description and type of change
- Related issues
- Testing checklist
- Code quality checklist
- Screenshots and additional notes
- Breaking changes and performance impact

## Labels

### Categories
- **Bug Labels**: bug, critical, security
- **Feature Labels**: enhancement, feature, good first issue
- **Documentation**: documentation, docs
- **Help**: help wanted, question
- **Status**: wontfix, duplicate, invalid, triage
- **Priority**: high priority, low priority
- **Type**: ui, api, core, performance, refactor
- **Testing**: test, coverage
- **Release**: release, breaking
- **Maintenance**: maintenance, dependencies, ci/cd

## Code Owners

### Responsibilities
- **@HiGeorges** - Global project maintainer
- **Core Package** - NestJS backend functionality
- **UI Package** - React frontend
- **Demo App** - Example application
- **Documentation** - All markdown files
- **Configuration** - Build and config files
- **GitHub Config** - Workflows and templates

## Usage

### For Contributors
1. Use the appropriate issue template when reporting bugs or requesting features
2. Follow the pull request template when submitting changes
3. Ensure your code passes all status checks
4. Request reviews from code owners when needed

### For Maintainers
1. Review and approve pull requests
2. Manage releases and tags
3. Update documentation as needed
4. Monitor and respond to issues

### For Administrators
1. Configure branch and tag protection rules in GitHub settings
2. Set up labels using the `labels.yml` configuration
3. Configure CODEOWNERS in repository settings
4. Set up issue templates in repository settings

## Security

### Commit Signing
- All commits to main branch must be signed
- Release tags must be signed
- Use GPG or SSH keys for signing

### Access Control
- Only maintainers can push directly to main
- Only maintainers can create and manage tags
- Contributors must use pull requests

## Automation

### Status Checks
- **build** - Ensures code compiles
- **test** - Ensures tests pass
- **lint** - Ensures code style compliance

### Required Reviews
- At least one review required for all changes
- Code owners are automatically requested for relevant files
- Stale reviews are dismissed when new commits are pushed

## Best Practices

1. **Always use pull requests** for changes to main branch
2. **Write clear commit messages** following conventional commits
3. **Include tests** for new functionality
4. **Update documentation** when adding features
5. **Use appropriate labels** for issues and PRs
6. **Follow the templates** for issues and PRs
7. **Keep branches up to date** with main
8. **Sign your commits** for security

## Support

If you have questions about the GitHub configuration:
- Check the [Contributing Guide](../../CONTRIBUTING.md)
- Open an issue with the `question` label
- Contact the maintainer at georges.heloussato@epitech.eu 
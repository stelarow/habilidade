# Branch Protection Configuration

## 🛡️ Recommended Branch Protection Rules

### Main Branch Protection

Configure the following settings in **Settings > Branches > Add protection rule**:

**Branch name pattern**: `main`

#### Required Settings

✅ **Require a pull request before merging**
- [x] Dismiss stale PR approvals when new commits are pushed
- [x] Require review from code owners (if CODEOWNERS file exists)
- [x] Required approving reviews: **1** (minimum)
- [x] Require approval of the most recent reviewable push

✅ **Require status checks to pass before merging**
- [x] Require branches to be up to date before merging

**Required status checks** (select after workflows run at least once):
- `ci-main-website / status-check`
- `quality-gates / quality-gates-summary`
- `security-audit / security-report` (if running security checks)

✅ **Require conversation resolution before merging**
- [x] All conversations on code must be resolved before merging

✅ **Require signed commits** (recommended for enhanced security)
- [x] Require signed commits

✅ **Require linear history**
- [x] Require linear history (prevents merge commits)

✅ **Require deployments to succeed before merging** (optional)
- Select relevant deployment environments if configured

#### Additional Security Settings

✅ **Do not allow bypassing the above settings**
- [x] Include administrators (recommended for security)

✅ **Restrict pushes that create files**
- [x] Restrict pushes that create files (prevents large file uploads)

✅ **Lock branch**
- [ ] Lock branch (only if you want to prevent all changes)

### Develop Branch Protection (if using Git Flow)

**Branch name pattern**: `develop`

#### Recommended Settings

✅ **Require a pull request before merging**
- [x] Required approving reviews: **1**
- [x] Dismiss stale PR approvals when new commits are pushed

✅ **Require status checks to pass before merging**
- [x] Require branches to be up to date before merging

**Required status checks**:
- `ci-main-website / status-check`

## 🔒 Security Considerations

### Code Owners File

Create `.github/CODEOWNERS` to define who can approve changes:

```
# Global owners
* @your-username @team-lead

# Main website
/src/ @frontend-team
/public/ @frontend-team
package.json @tech-lead

# Learning platform

# Infrastructure and workflows
/.github/ @devops-team @tech-lead
/docs/ @tech-writer @tech-lead

# Configuration files
*.config.js @tech-lead
*.config.ts @tech-lead
.env.* @tech-lead @devops-team
```

### Required Reviews Matrix

| File Type | Required Reviewers | Rationale |
|-----------|-------------------|-----------|
| Core Application (`src/`) | 1 developer | Code quality assurance |
| Configuration Files | Tech lead | Security and stability |
| Workflows (`.github/`) | DevOps + Tech lead | Critical infrastructure |
| Dependencies (`package.json`) | Tech lead | Security and compatibility |
| Environment Files | Tech lead + DevOps | Security sensitive |

## 🚀 Implementation Steps

### 1. Navigate to Branch Protection

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Branches** in the left sidebar
4. Click **Add protection rule**

### 2. Configure Main Branch

1. Enter `main` as branch name pattern
2. Enable all recommended settings above
3. Add required status checks (after workflows run once)
4. Save protection rule

### 3. Configure Additional Branches (Optional)

Repeat for `develop` or other important branches with appropriate settings.

### 4. Test Protection Rules

1. Create a test pull request
2. Verify all required checks run
3. Confirm merge is blocked until requirements met
4. Test with different scenarios (failing tests, missing reviews, etc.)

## 📋 Status Check Configuration

### After First Workflow Runs

Once your workflows have run at least once, you can add these status checks:

#### Main Website Checks
- `validate`
- `lint-and-format`
- `test`
- `build`
- `security-scan`
- `status-check`

#### Learning Platform Checks
- `validate`
- `type-check`
- `lint-and-format`
- `test`
- `build`
- `security-scan`
- `database-checks`
- `status-check`

#### Quality Gates
- `code-quality-analysis`
- `test-coverage-analysis`
- `performance-analysis`
- `accessibility-analysis`
- `quality-gates-summary`

#### Security Audit (Optional, for high-security environments)
- `dependency-scan`
- `code-security-scan`
- `secrets-scan`
- `license-compliance`
- `security-report`

## ⚡ Quick Setup Commands

If you prefer using GitHub CLI (`gh`):

```bash
# Create main branch protection
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null \
  --field required_linear_history=true \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true
```

## 🔧 Troubleshooting

### Common Issues

**Status checks not appearing**:
- Ensure workflows have run at least once
- Check workflow names match exactly
- Verify job names in YAML files

**Too restrictive settings**:
- Start with basic protection and add restrictions gradually
- Test with team members to ensure workflow isn't disrupted

**Admin bypass needed**:
- Use carefully and document when admin bypass is used
- Consider disabling admin bypass for maximum security

### Monitoring Protection Rules

Regular tasks:
- Review protection rule effectiveness monthly
- Update required status checks as workflows evolve
- Monitor bypass usage (if admin bypass enabled)
- Adjust reviewer requirements based on team size

## 📊 Protection Rule Metrics

Track these metrics to ensure protection rules are effective:

- **Pull request merge time**: Should remain reasonable
- **Failed status checks**: Monitor trends
- **Bypass usage**: Should be minimal and documented
- **Security incident prevention**: Track prevented issues

---

**Note**: These settings provide a good starting point. Adjust based on your team size, security requirements, and development workflow preferences.
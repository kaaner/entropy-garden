# n8n Integration Guide - Entropy Garden

Complete guide for automating GitHub workflows with n8n.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setup n8n](#setup-n8n)
3. [GitHub Integration](#github-integration)
4. [Workflow Templates](#workflow-templates)
5. [Custom Workflows](#custom-workflows)
6. [Troubleshooting](#troubleshooting)

---

## Overview

n8n is an automation platform that connects Entropy Garden's GitHub repository with various services for automated workflows.

**Use Cases:**
- Auto-notify team when issues are created
- Track sprint progress automatically
- Deploy on PR merge
- Generate release notes
- Sync issues to project management tools

---

## Setup n8n

### Option 1: Docker (Recommended)

n8n is already included in docker-compose:

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up -d
```

Access n8n at: **http://localhost:5678**

Default credentials (change in `.env`):
- Username: `admin`
- Password: `changeme`

### Option 2: Standalone Installation

```bash
# Using npm
npm install -g n8n

# Start n8n
n8n start

# Access at http://localhost:5678
```

### First-Time Setup

1. Open http://localhost:5678
2. Create an admin account
3. Configure basic settings
4. You're ready to create workflows!

---

## GitHub Integration

### 1. Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select scopes:
   - ✅ `repo` (full control of private repositories)
   - ✅ `workflow` (update GitHub Action workflows)
   - ✅ `admin:org` (if using organization)
4. Copy the token (you won't see it again!)

### 2. Add GitHub Credentials in n8n

1. In n8n, go to **Credentials** → **New**
2. Search for "GitHub"
3. Choose **GitHub API** or **GitHub OAuth2**
4. Enter your credentials:
   - **Access Token:** Paste your GitHub token
   - **Server:** `https://api.github.com`
5. Save credentials

### 3. Configure Webhook URL

For webhooks to work, n8n needs a public URL:

**Development (using ngrok):**
```bash
# Install ngrok
npm install -g ngrok

# Expose n8n port
ngrok http 5678

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**Production:**
- Use your domain (e.g., `https://n8n.yourdomain.com`)
- Set `N8N_WEBHOOK_URL` in `.env`

### 4. Setup GitHub Webhook

1. Go to your GitHub repo: https://github.com/kaaner/entropy-garden
2. Settings → Webhooks → Add webhook
3. Configure:
   - **Payload URL:** `https://your-n8n-url/webhook/github`
   - **Content type:** `application/json`
   - **Secret:** (optional, for security)
   - **Events:** Choose events to trigger
     - ✅ Issues
     - ✅ Pull requests
     - ✅ Push
     - ✅ Releases
4. Save webhook

---

## Workflow Templates

### Template 1: Issue Created → Discord Notification

**Purpose:** Notify team when new issues are created

**Nodes:**
1. **Webhook Trigger** (GitHub Issue Created)
2. **Filter** (Sprint labels: sprint-0, sprint-1, sprint-2, sprint-3)
3. **Discord** (Send notification)

**Setup Steps:**

1. **Add Webhook Node**
   - Type: `Webhook`
   - HTTP Method: `POST`
   - Path: `github-issue`
   - Authentication: None
   - Copy webhook URL

2. **Add Filter Node** (IF)
   - Condition: `{{ $json.action }}` equals `opened`
   - AND: `{{ $json.issue.labels }}` contains `sprint-`

3. **Add Discord Node**
   - Operation: `Send Message`
   - Channel: `#entropy-garden`
   - Message:
     ```
     🆕 New Issue: {{ $json.issue.title }}
     📋 Sprint: {{ $json.issue.labels[0].name }}
     👤 Author: @{{ $json.issue.user.login }}
     🔗 {{ $json.issue.html_url }}
     ```

4. **Save & Activate Workflow**

**JSON Export:**
```json
{
  "name": "GitHub Issue → Discord",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "github-issue",
        "responseMode": "lastNode"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.action }}",
              "operation": "equals",
              "value2": "opened"
            }
          ]
        }
      },
      "name": "Filter Sprint Issues",
      "type": "n8n-nodes-base.if",
      "position": [450, 300]
    },
    {
      "parameters": {
        "channel": "#entropy-garden",
        "text": "=🆕 New Issue: {{ $json.issue.title }}\n📋 Sprint: {{ $json.issue.labels[0].name }}\n👤 Author: @{{ $json.issue.user.login }}\n🔗 {{ $json.issue.html_url }}"
      },
      "name": "Discord",
      "type": "n8n-nodes-base.discord",
      "position": [650, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "Filter Sprint Issues", "type": "main", "index": 0}]]
    },
    "Filter Sprint Issues": {
      "main": [[{"node": "Discord", "type": "main", "index": 0}]]
    }
  }
}
```

---

### Template 2: PR Merged → Deploy Notification

**Purpose:** Notify when PR is merged and trigger deployment

**Nodes:**
1. **Webhook** (GitHub PR)
2. **Filter** (Merged to main/master)
3. **HTTP Request** (Trigger deployment)
4. **Slack/Discord** (Notify team)

**Setup Steps:**

1. **Webhook Node**
   - Path: `github-pr`
   - Listen for PR events

2. **Filter Node**
   - Condition: `{{ $json.action }}` equals `closed`
   - AND: `{{ $json.pull_request.merged }}` equals `true`
   - AND: `{{ $json.pull_request.base.ref }}` equals `master`

3. **HTTP Request Node** (Optional - trigger deploy)
   - Method: `POST`
   - URL: Your deployment webhook
   - Body: `{ "ref": "master", "sha": "{{ $json.pull_request.merge_commit_sha }}" }`

4. **Slack/Discord Node**
   - Message:
     ```
     🚀 Deployed to Production!
     📦 PR: {{ $json.pull_request.title }}
     👤 Author: @{{ $json.pull_request.user.login }}
     🔗 {{ $json.pull_request.html_url }}
     ```

---

### Template 3: Issue Closed → Update Sprint Progress

**Purpose:** Track sprint completion automatically

**Nodes:**
1. **Webhook** (GitHub Issue Closed)
2. **GitHub** (Get all sprint issues)
3. **Function** (Calculate progress)
4. **Google Sheets/Notion** (Update dashboard)

**Setup Steps:**

1. **Webhook Node**
   - Path: `github-issue-closed`

2. **Filter**
   - Condition: `{{ $json.action }}` equals `closed`
   - AND: Issue has sprint label

3. **GitHub Node**
   - Operation: `List Issues`
   - Filters: `labels: sprint-0, state: all`

4. **Function Node**
   ```javascript
   const allIssues = $input.all();
   const total = allIssues.length;
   const closed = allIssues.filter(i => i.json.state === 'closed').length;
   const progress = Math.round((closed / total) * 100);
   
   return {
     json: {
       sprint: 'Sprint 0',
       total,
       closed,
       open: total - closed,
       progress: `${progress}%`
     }
   };
   ```

5. **Google Sheets/Notion Node**
   - Update sprint dashboard
   - Or send to Slack/Discord

---

### Template 4: Daily Sprint Summary

**Purpose:** Send daily sprint status report

**Nodes:**
1. **Cron** (Schedule daily at 9 AM)
2. **GitHub** (Get open issues by sprint)
3. **Function** (Format report)
4. **Email/Slack/Discord** (Send report)

**Setup Steps:**

1. **Cron Node**
   - Expression: `0 9 * * *` (9 AM daily)
   - Timezone: Europe/Istanbul

2. **GitHub Nodes** (4 nodes, one per sprint)
   - Repository: `kaaner/entropy-garden`
   - Operation: `List Issues`
   - Filters: `labels: sprint-0, state: open`

3. **Function Node**
   ```javascript
   const sprints = ['sprint-0', 'sprint-1', 'sprint-2', 'sprint-3'];
   const report = sprints.map((sprint, index) => {
     const issues = $input.all()[index].json;
     return `📊 ${sprint}: ${issues.length} open issues`;
   }).join('\n');
   
   return {
     json: {
       report: `🌱 Entropy Garden - Daily Sprint Report\n\n${report}`
     }
   };
   ```

4. **Slack/Discord/Email Node**
   - Send formatted report

---

## Custom Workflows

### Advanced: Automated Release Notes

**Nodes:**
1. **Webhook** (Tag pushed)
2. **GitHub** (Get commits since last tag)
3. **GitHub** (Get closed issues/PRs)
4. **Function** (Generate changelog)
5. **GitHub** (Create release with notes)

**Function to Generate Changelog:**
```javascript
const commits = $input.all()[0].json;
const issues = $input.all()[1].json;

const features = [];
const fixes = [];
const other = [];

commits.forEach(commit => {
  const msg = commit.commit.message;
  if (msg.startsWith('feat:')) features.push(msg);
  else if (msg.startsWith('fix:')) fixes.push(msg);
  else other.push(msg);
});

const changelog = `
## 🚀 What's New

${features.map(f => `- ${f}`).join('\n') || 'No new features'}

## 🐛 Bug Fixes

${fixes.map(f => `- ${f}`).join('\n') || 'No bug fixes'}

## 📋 Closed Issues

${issues.map(i => `- ${i.title} (#${i.number})`).join('\n') || 'No issues closed'}

## 🙏 Contributors

${[...new Set(commits.map(c => c.author.login))].map(u => `@${u}`).join(', ')}
`;

return {
  json: {
    tag: $json.ref.replace('refs/tags/', ''),
    changelog
  }
};
```

---

### Advanced: Auto-assign Reviewers

**Trigger:** PR opened
**Logic:**
- If PR touches `packages/` → assign @kaaner
- If PR touches `apps/web/src/components/` → assign frontend reviewer
- If PR touches `apps/web/src/lib/game/` → assign game logic reviewer

**Function Node:**
```javascript
const files = $json.pull_request.changed_files;
const reviewers = [];

if (files.some(f => f.filename.startsWith('packages/'))) {
  reviewers.push('kaaner');
}

if (files.some(f => f.filename.includes('components/'))) {
  reviewers.push('frontend-reviewer');
}

if (files.some(f => f.filename.includes('lib/game/'))) {
  reviewers.push('game-logic-reviewer');
}

return {
  json: {
    reviewers: [...new Set(reviewers)]
  }
};
```

**GitHub Node:**
- Operation: `Add Reviewers to PR`
- PR Number: `{{ $json.pull_request.number }}`
- Reviewers: `{{ $json.reviewers }}`

---

## Workflow Management

### Best Practices

1. **Naming Convention**
   - Use clear names: `GitHub Issue → Discord`
   - Add tags: `#github`, `#automation`

2. **Error Handling**
   - Add "Error Trigger" nodes
   - Send notifications on failures
   - Log errors to monitoring service

3. **Testing**
   - Use "Execute Workflow" to test
   - Check with test payloads
   - Monitor first few runs

4. **Security**
   - Never expose credentials in workflows
   - Use environment variables
   - Validate webhook signatures

### Monitoring Workflows

1. **Check Execution History**
   - Click workflow → Executions
   - Review success/failure rate

2. **Set Up Alerts**
   - Create workflow to monitor other workflows
   - Send alerts if execution fails

3. **Performance**
   - Keep workflows simple
   - Use "Split in Batches" for large datasets
   - Add delays between API calls

---

## Troubleshooting

### Webhook Not Triggering

**Check:**
1. ✅ Webhook URL is correct in GitHub
2. ✅ n8n workflow is activated
3. ✅ Webhook path matches
4. ✅ Firewall allows incoming connections
5. ✅ Check GitHub webhook delivery logs

**Debug:**
```bash
# Check n8n logs
docker-compose logs -f n8n

# Test webhook manually
curl -X POST http://localhost:5678/webhook/github \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Authentication Errors

**GitHub API:**
- Check token hasn't expired
- Verify required scopes
- Regenerate token if needed

**Discord/Slack:**
- Verify bot token
- Check bot has channel permissions
- Re-authorize if needed

### Rate Limiting

**GitHub API Limits:**
- 5000 requests/hour (authenticated)
- 60 requests/hour (unauthenticated)

**Solution:**
- Add delays between requests
- Use conditional execution
- Cache results when possible

### Workflow Not Executing

**Check:**
1. Workflow is activated (toggle switch)
2. Trigger node is configured correctly
3. No errors in previous executions
4. Test with manual execution

---

## Additional Resources

### Official Documentation

- [n8n Documentation](https://docs.n8n.io/)
- [GitHub API](https://docs.github.com/en/rest)
- [Webhook Events](https://docs.github.com/en/webhooks/webhook-events-and-payloads)

### Community Templates

- [n8n Workflow Templates](https://n8n.io/workflows)
- [GitHub Automation Examples](https://n8n.io/integrations/github)

### Support

- [n8n Community Forum](https://community.n8n.io/)
- [n8n GitHub Issues](https://github.com/n8n-io/n8n/issues)
- [Project Issues](https://github.com/kaaner/entropy-garden/issues)

---

## Quick Reference

### Common Webhook Paths

```
/webhook/github-issue          # Issue events
/webhook/github-pr             # PR events
/webhook/github-push           # Push events
/webhook/github-release        # Release events
```

### Useful JSON Paths

```javascript
// Issue
$json.issue.title
$json.issue.number
$json.issue.state
$json.issue.labels[0].name
$json.issue.user.login

// Pull Request
$json.pull_request.title
$json.pull_request.number
$json.pull_request.merged
$json.pull_request.base.ref
$json.pull_request.head.ref

// Push
$json.ref
$json.commits[0].message
$json.repository.name
```

### Environment Variables

```env
# In .env file
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_password
N8N_WEBHOOK_URL=https://your-domain.com/
WEBHOOK_TUNNEL_URL=https://abc123.ngrok.io/
GENERIC_TIMEZONE=Europe/Istanbul
```

---

**Happy Automating! 🚀**

For questions or issues, open a ticket: [GitHub Issues](https://github.com/kaaner/entropy-garden/issues)

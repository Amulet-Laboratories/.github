# Security Policy — Amulet Laboratories

## Reporting a Vulnerability

If you discover a security vulnerability in any repository under the [Amulet-Laboratories](https://github.com/Amulet-Laboratories) organization, please report it responsibly.

**Email:** [hello@amulet.ink](mailto:hello@amulet.ink)

Please include:

- The repository and file(s) affected
- A description of the vulnerability and its potential impact
- Steps to reproduce, if possible
- Any suggested remediation

## Response Timeline

- **Acknowledgment:** Within 48 hours of report
- **Initial assessment:** Within 5 business days
- **Resolution or mitigation plan:** Within 30 days for confirmed vulnerabilities

## Scope

This policy applies to all repositories owned by the `Amulet-Laboratories` GitHub organization, including public and private repositories.

## Disclosure

We follow responsible disclosure practices. Please do not open public issues for security vulnerabilities. Use the email address above for all security-related reports.

Once a vulnerability is confirmed and resolved, we will coordinate disclosure timing with the reporter.

## Project-Specific Security Documentation

Some repositories maintain additional security documentation:

- **library.amulet.ink** — Detailed authentication and authorization security model in [`SECURITY.md`](https://github.com/Amulet-Laboratories/library.amulet.ink/blob/main/SECURITY.md)

## Security Practices

- All secrets stored in environment variables, never committed to version control
- HTTPS enforced on all deployed sites
- Security headers configured on all production deployments (CSP, HSTS, X-Frame-Options)
- Dependencies audited regularly via `pnpm audit`
- GitHub Actions pinned to specific versions

---

Amulet Laboratories © 2026

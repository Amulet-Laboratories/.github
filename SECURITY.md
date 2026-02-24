# Security Policy

## Supported Versions

Security fixes are applied to the current active versions of all Amulet Laboratories products.

| Repo / Product | Supported |
|----------------|-----------|
| All active repos | ✅ Latest release |
| Deprecated/archived repos | ❌ No support |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

To report a vulnerability in any Amulet Laboratories product or repository:

1. **Email**: [security@amulet.ink](mailto:security@amulet.ink)
2. **Subject line**: `[SECURITY] <brief description>`
3. **Include**:
   - Affected repository and version (if known)
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Any suggested remediation (optional)

## Response Timeline

| Stage | Target SLA |
|-------|-----------|
| Acknowledgement | 48 hours |
| Initial assessment | 5 business days |
| Remediation plan | 14 days |
| Fix deployed (critical) | 7 days from confirmed |
| Fix deployed (high) | 30 days from confirmed |
| Fix deployed (medium/low) | Next scheduled release |

## Disclosure Policy

We follow [Responsible Disclosure](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html):

- We will coordinate disclosure with the reporter.
- We aim to have a fix available before public disclosure.
- Credit will be given to the reporter in the changelog unless they request anonymity.
- We do not pursue legal action against good-faith security researchers.

## Scope

In scope:
- All repositories under the [Amulet-Laboratories](https://github.com/Amulet-Laboratories) GitHub organization
- All services deployed under `*.amulet.ink`

Out of scope:
- Theoretical vulnerabilities without a demonstrated impact
- Social engineering
- Physical attacks
- Denial of service (unless a specific, exploitable amplification vector)

## Security Contact

**Primary**: [security@amulet.ink](mailto:security@amulet.ink)

For general questions, see [CONTRIBUTING.md](./CONTRIBUTING.md).

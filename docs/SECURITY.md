# Privacy and security by design

> This is a plan and a set of prototype safeguards. **The prototype is not certified, audited or claimed to be
> secure or compliant.** Compliance would require a formal assessment of the production system.

## Safeguards in the prototype today

| Safeguard | Status |
| --- | --- |
| No real payments: card fields are absent; checkout produces a mock reference | Implemented |
| No identity documents collected; driver form only validates format | Implemented |
| Fake data only: fictional account "Noura Demo", synthetic bookings, `DEMO-` references, `TCK-` tickets | Implemented |
| Demo data stays in the visitor's browser (`localStorage`), with a reset button; nothing is sent to a server | Implemented |
| Security headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, `Strict-Transport-Security` (see `next.config.ts`) | Implemented |
| Not indexed: `X-Robots-Tag: noindex` and `robots.txt` disallow all | Implemented |
| No third-party scripts, trackers, fonts or analytics | Implemented |
| Persistent "not affiliated" disclaimer on every page; tested on every route in both languages | Implemented |
| Content-Security-Policy with nonces | Proposed (needs a server runtime) |
| Admin RBAC and audit log | Prototype-only, client-side, not a security control |

## Production plan

### Saudi Personal Data Protection Law (PDPL)

- Lawful basis and explicit consent captured per purpose (booking, marketing, telematics), with a consent ledger.
- Privacy notice in Arabic and English; data-subject rights (access, correction, deletion, portability) in My account.
- Data minimisation: collect licence and ID data only when required for a contract, via the national identity provider, and store references rather than images where possible.
- Data residency in the Kingdom; transfers outside only under PDPL transfer rules.
- Retention schedule per record type; automated deletion.
- Breach notification process to SDAIA within the required timeframe.
- Records of processing and DPIA for high-risk processing (telematics, corporate fleet tracking).

### Related frameworks to assess

- NCA Essential Cybersecurity Controls (ECC) and Cloud Cybersecurity Controls.
- PCI DSS for payments — keep card data out of scope by using a hosted, tokenising gateway.
- SAMA guidance if financing or instalment products are offered.
- OWASP ASVS level 2 as the application security baseline.

### Controls

- Authentication: national SSO / Nafath for individuals, SSO (SAML/OIDC) for corporate clients, MFA for staff.
- Authorisation: server-side RBAC/ABAC; corporate users scoped to their company.
- Secrets in a managed vault; least-privilege service accounts.
- Encryption in transit (TLS 1.2+) and at rest; field-level encryption for identity numbers.
- Logging and audit trail with tamper-evident storage; PII redaction in logs.
- Secure SDLC: dependency scanning, SAST, code review, staged environments.
- Independent penetration testing — **only by an authorised party, under written agreement with Budget Saudi.**

## What was not done

No security testing of any kind was performed against Budget Saudi systems, in line with the brief.

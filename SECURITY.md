# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in H-Orchestra, please **do not** open a public GitHub issue. Instead, email:

**quiquemartinocana@gmail.com**

Include:

- A description of the vulnerability
- Steps to reproduce
- The affected version (commit SHA or tag)
- Any suggested mitigation

We aim to acknowledge within 72 hours and to publish a fix within 90 days. We will credit you in the release notes if you wish.

## Scope

H-Orchestra runs locally or on a self-hosted machine; it does not phone home or send telemetry. Likely surface areas:

- The mounted repo path traversal (we never write into the mount; it is `:ro` by default)
- Template ZIP upload (we sandbox extraction against path traversal)
- Tracing adapter API keys (loaded from env, never logged)

## Out of scope

- Vulnerabilities in upstream dependencies that do not affect H-Orchestra's runtime behaviour. Please report those upstream.
- Issues that require physical or root access to the host running the container.

## Disclosure

We follow coordinated disclosure: we ask reporters not to publish details until 90 days have elapsed or a fix is released, whichever is sooner.

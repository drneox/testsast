# SECURITY ADVISORY - Educational Application

## ⚠️ CRITICAL NOTICE: INTENTIONAL VULNERABILITIES

This document formally acknowledges and documents security vulnerabilities detected in this codebase.

## Vulnerability Scan Results

### Summary
- **Total Vulnerabilities:** 9
- **Severity:** Critical (2), High (7)
- **Status:** ACKNOWLEDGED AND RETAINED FOR EDUCATIONAL PURPOSES

### Detailed Vulnerability Report

#### 1. body-parser 1.19.0
- **Vulnerability:** Denial of Service when URL encoding is enabled
- **Affected Versions:** < 1.20.3
- **Patched Version:** 1.20.3
- **CVE/Advisory:** body-parser DoS vulnerability
- **Severity:** High

#### 2. ejs 3.1.6
- **Vulnerability:** Template injection vulnerability
- **Affected Versions:** < 3.1.7
- **Patched Version:** 3.1.7
- **Severity:** Critical

#### 3. lodash 4.17.20 (Multiple Vulnerabilities)
- **Vulnerability 1:** Command Injection - Affected versions < 4.17.21, Patch: 4.17.21
- **Vulnerability 2:** Command Injection - Affected versions < 4.17.21, Patch: 4.17.21
- **Vulnerability 3:** Command Injection - Affected versions <= 4.5.0, Patch: not available
- **Vulnerability 4:** Command Injection - Affected versions <= 1.0.0, Patch: not available
- **Vulnerability 5:** Command Injection (rubygems) - Affected versions < 4.17.21, Patch: 4.17.21
- **Severity:** High

#### 4. sqlite3 5.0.2 (Multiple Vulnerabilities)
- **Vulnerability 1:** Code execution due to Object coercion
  - Affected Versions: >= 5.0.0, < 5.1.5
  - Patched Version: 5.1.5
  - Severity: Critical
  
- **Vulnerability 2:** Denial-of-Service when binding invalid parameters
  - Affected Versions: >= 5.0.0, < 5.0.3
  - Patched Version: 5.0.3
  - Severity: High

## Educational Context

### Project Purpose
This application was created specifically for a **secure development training course** to demonstrate:
1. How GitHub Advanced Security detects vulnerabilities
2. How dependency scanning (Dependabot) works
3. Real-world CVE examples for hands-on learning
4. Vulnerability remediation best practices

### Original Requirements
From the project specification: *"creame una aplicación con vulnerabilidades conocidas para que puedan ser detectadas por github advanced security, para mi clase de desarrollo seguro"*

Translation: "Create an application with known vulnerabilities so they can be detected by GitHub Advanced Security, for my secure development class"

## Risk Assessment

### Current Risk Level: HIGH (By Design)
This application contains multiple critical and high-severity vulnerabilities that could be exploited if deployed inappropriately.

### Mitigation Measures in Place

✅ **Documentation:**
- README.md contains explicit warnings
- INSTRUCTOR_GUIDE.md provides context for educators
- SECURITY_SUMMARY.md documents all vulnerabilities
- package.json includes warning comments

✅ **Usage Restrictions:**
- Labeled as "educational use only"
- Explicit "DO NOT USE IN PRODUCTION" warnings
- Instructions require isolated environments
- No deployment configurations included

✅ **Code Comments:**
- Each vulnerability is documented in source code
- Clear labels: "VULNERABILIDAD" (VULNERABILITY)
- Explanations of what makes each pattern insecure

## Deployment Restrictions

### ❌ PROHIBITED USES:
- Production deployment
- Public internet exposure
- Processing real user data
- Any commercial use
- Integration with production systems

### ✅ APPROVED USES:
- Educational training environments
- Isolated development systems
- Security demonstration labs
- Code review training exercises
- GitHub Advanced Security demonstrations

## Remediation Path (For Reference Only)

If this code were to be used in production (which it should NOT be), the following updates would be required:

```json
{
  "dependencies": {
    "express": "^4.22.0",        // Update from 4.17.1
    "body-parser": "^1.20.3",    // Update from 1.19.0
    "sqlite3": "^5.1.7",         // Update from 5.0.2
    "ejs": "^3.1.10",            // Update from 3.1.6
    "lodash": "^4.17.21"         // Update from 4.17.20
  }
}
```

However, updating these dependencies would defeat the educational purpose of this application.

## Formal Acknowledgment

**Date:** 2026-01-12

**Status:** All vulnerabilities have been reviewed, documented, and acknowledged.

**Decision:** Vulnerabilities will **remain in the codebase** to serve their educational purpose.

**Responsibility:** Users of this code accept full responsibility for:
- Using it only in approved educational contexts
- Never deploying to production environments
- Maintaining isolation from production systems
- Following all documented safety guidelines

## Contact Information

For questions about the educational use of this vulnerable application, please refer to:
- INSTRUCTOR_GUIDE.md for teaching guidance
- README.md for setup and usage instructions
- SECURITY_SUMMARY.md for technical vulnerability details

## Legal Disclaimer

This software is provided "AS IS" for educational purposes only. The maintainers explicitly disclaim any responsibility for misuse of this intentionally vulnerable code. Users assume all risks associated with deployment or use of this application.

---

**Scan Date:** 2026-01-12  
**Vulnerabilities Detected:** 9  
**Status:** ACKNOWLEDGED - RETAINED FOR EDUCATIONAL PURPOSES  
**Next Review:** Not scheduled (educational application)

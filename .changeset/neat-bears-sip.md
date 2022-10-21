---
'@liquality/error-parser': minor
'@liquality/wallet-core': minor
---

feat: add chainify error parser
fix: wrap(with errorparser) some calls to chainify  
fix: wrap(with Error Parser) calls to oneinch API using error parser
fix: wrap(with Error Parser) Lifi quote request
fix: extract error messages from error objects into translation files
fix: add more liquality errors types
fix: add standard reusable custom errors
refactor: replace custom errors in wallet-core with Liquality errors
fix: update error reporting to report parsed errors and custom thrown internal errors.
fix: override Error.toString() for liqualityError  
fix: update parseError to return error as is if error is already a liquality error
fix: sanitize import paths and typings
fix: report custom internal errors
docs: add Readme for error parser

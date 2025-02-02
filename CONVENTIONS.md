## Commit style and formatting

50-character subject line
Format: TYPE:[SCOPE:] COMMIT_MSG
      TYPE is one of
              'chg', 'fix', 'new'
      SCOPE is optional and one of
              'dev', 'usr', 'pkg', 'test', 'doc'
      COMMIT_MSG is ... well ... the commit message itself.
      BREAKING CHANGE:
              a commit that has a footer BREAKING CHANGE:,
              or appends a ! after the type/scope,
              introduces a breaking API change
Ref: https://www.conventionalcommits.org/en/v1.0.0/
Ref: https://common-changelog.org/#42-conventional-commits
72-character wrapped longer description.

Examples:
- chg:dev: Adjust rubocop LineLength to 120
- fix:test: Correctly handle nil in test foobar
- new:usr: Add new feature to the user interface
- fix:doc: Correct spelling in the README

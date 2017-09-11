# Contributing guide

No styling is required. Just remember to do this:

- Be sure to update the documentation when needed.
- Remember to add tests and update them if needed.
- Add the correct label to your issue and/or PR (no worries if the label is wrong).
- Use the correct label on your commit.

## Issues

All PRs will need to have an issue and, please, keep them small and objective.

## PRs and Commits

PR's can be requested to be split if necessary and must have the reference
to the issue it will close.

`Features` and `changes` must have their own PRs. The reason for this is to keep
small diffs that can be reviewed really quick.

Label your commit message `chore`, `feature`, `change` and `fix`.

- chore: every change that does not change any functionality.
- fix: just fixes a bug and no changes the the api.
- change: changes a function signature, renames a function...
- feature: new additions.

Examples:

`chore: updated documentation.`
`fix: calculating wrong timediff.`
`change: allow to pass a extra function to caledar generator.`
`feature: implements updateWithKey for objects.`

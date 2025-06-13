###

#@ Run
bun run src/index.ts ./simple-todo-test.zip

#@ Fail
bun run src/index.ts ./failing-test.zip


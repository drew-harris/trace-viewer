###

#@ Run
bun run src/index.ts ./simple-todo-test.zip

#@ Fail
bun run src/index.ts ./failing-test.zip

#@ module
bun run src/index.ts ./module.zip


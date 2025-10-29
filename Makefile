SHELL := /usr/bin/bash
PNPM := pnpm
KILL_SCRIPT := ./scripts/kill-node.sh

.PHONY: install run kill-node kill-node-force

install:
	$(PNPM) install

run:
	$(PNPM) run dev

kill-node:
	$(KILL_SCRIPT)

kill-node-force:
	pkill -9 -f node || true


